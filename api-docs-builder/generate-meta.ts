#!/usr/bin/env bun
import * as fs from "fs";
import * as path from "path";
import {
  categoryForFile,
  outputDir,
  readText,
  relSource,
  stripIndent,
  type ApiMeta,
  type ExportSymbol,
  type TSDoc,
  writeText,
  srcDir,
} from "./shared";

type ExportEntry = {
  name: string;
  kind: ExportSymbol["kind"];
  filePath: string;
  isExported: boolean;
  exportKind: ExportSymbol["exportKind"];
  category: ExportSymbol["category"];
  signature?: string;
  type?: string;
  parameters?: Array<{ name: string; type: string; optional: boolean }>;
  typeParameters?: string[];
  tsdoc: TSDoc;
};

const exportMap = new Map<string, ExportEntry>();

function defaultTSDoc(): TSDoc {
  return {
    summary: "",
    remarks: [],
    examples: [],
    params: [],
    returns: [],
    see: [],
    template: [],
    deprecated: [],
  };
}

function cleanTagText(text: string) {
  return stripIndent(text).trim();
}

function parseTSDoc(comment: string): TSDoc {
  const doc = defaultTSDoc();
  const lines = comment
    .replace(/^\/\*\*+/, "")
    .replace(/\*\/\s*$/, "")
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*\*\s?/, ""));

  const blocks: Array<{ tag: string | null; lines: string[] }> = [];
  let current: { tag: string | null; lines: string[] } = {
    tag: null,
    lines: [],
  };
  for (const line of lines) {
    const tagMatch = line.match(
      /^@(remarks|example|param|returns|see|template|deprecated)\b\s*(.*)$/,
    );
    if (tagMatch) {
      if (current.lines.length || current.tag !== null) blocks.push(current);
      current = { tag: tagMatch[1], lines: [tagMatch[2] ?? ""] };
    } else {
      current.lines.push(line);
    }
  }
  if (current.lines.length || current.tag !== null) blocks.push(current);

  const summaryLines: string[] = [];
  for (const block of blocks) {
    if (block.tag === null) summaryLines.push(...block.lines);
    else break;
  }
  doc.summary = cleanTagText(summaryLines.join("\n"));

  for (const block of blocks) {
    if (!block.tag) continue;
    const body = cleanTagText(block.lines.join("\n"));
    if (block.tag === "remarks") doc.remarks.push(body);
    if (block.tag === "example") doc.examples.push(body);
    if (block.tag === "returns") doc.returns.push(body);
    if (block.tag === "see") doc.see.push(body);
    if (block.tag === "deprecated") doc.deprecated.push(body);
    if (block.tag === "template") {
      const [name, ...rest] = body.split(/\s+-\s+/);
      doc.template.push({
        name: name.trim(),
        description: rest.join(" - ").trim() || body,
      });
    }
    if (block.tag === "param") {
      const [name, ...rest] = body.split(/\s+-\s+/);
      doc.params.push({
        name: name.trim(),
        description: rest.join(" - ").trim() || body,
      });
    }
  }
  return doc;
}

function extractLeadingComment(content: string, index: number) {
  const before = content.slice(0, index);
  const start = before.lastIndexOf("/**");
  const end = before.lastIndexOf("*/");
  if (start === -1 || end === -1 || end < start) return "";
  return before.slice(start, end + 2);
}

function extractSignature(content: string, startIndex: number) {
  const source = content.slice(startIndex);
  let depthParen = 0;
  let depthBracket = 0;
  let depthBrace = 0;
  let inString: string | null = null;
  let escape = false;
  let sawBodyStart = false;

  for (let i = 0; i < source.length; i++) {
    const ch = source[i];

    if (inString) {
      if (escape) {
        escape = false;
        continue;
      }
      if (ch === "\\") {
        escape = true;
        continue;
      }
      if (ch === inString) inString = null;
      continue;
    }

    if (ch === "'" || ch === '"' || ch === "`") {
      inString = ch;
      continue;
    }

    if (ch === "(") depthParen++;
    else if (ch === ")") depthParen = Math.max(0, depthParen - 1);
    else if (ch === "[") depthBracket++;
    else if (ch === "]") depthBracket = Math.max(0, depthBracket - 1);
    else if (ch === "{") {
      if (depthParen === 0 && depthBracket === 0) sawBodyStart = true;
      depthBrace++;
    } else if (ch === "}") {
      depthBrace = Math.max(0, depthBrace - 1);
      if (
        sawBodyStart &&
        depthBrace === 0 &&
        depthParen === 0 &&
        depthBracket === 0
      ) {
        const tail = source.slice(0, i + 1);
        const semicolon = source.slice(i + 1).match(/^\s*;/);
        return (semicolon ? tail + semicolon[0] : tail).trimEnd();
      }
    } else if (
      ch === ";" &&
      depthParen === 0 &&
      depthBracket === 0 &&
      depthBrace === 0 &&
      !sawBodyStart
    ) {
      return source.slice(0, i + 1).trimEnd();
    }
  }

  return source.trimEnd();
}

function record(entry: ExportEntry) {
  const key = `${categoryForFile(entry.filePath)}:${entry.name}`;
  exportMap.set(key, entry);
}

function parseFile(filePath: string) {
  const content = readText(filePath);
  const exportRegex =
    /export\s+(const|type|interface|function)\s+([A-Za-z0-9_]+)([\s\S]*?)(?=\n\s*export\s+(?:const|type|interface|function)|\n\s*export\s+\{|$)/g;
  let match: RegExpExecArray | null;
  while ((match = exportRegex.exec(content))) {
    const declaration = match[1];
    const name = match[2];
    if (!declaration || !name) continue;
    const comment = extractLeadingComment(content, match.index);
    const tsdoc = comment ? parseTSDoc(comment) : defaultTSDoc();
    const category = categoryForFile(filePath);
    const signature = extractSignature(content, match.index);
    record({
      name,
      kind: declaration as ExportSymbol["kind"],
      filePath,
      isExported: true,
      exportKind: "named",
      category,
      signature,
      type: undefined,
      parameters: [],
      typeParameters: [],
      tsdoc,
    });
  }
}

function walk(dir: string) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith(".ts")) parseFile(full);
  }
}

function main() {
  walk(srcDir);

  const meta: ApiMeta = {
    type: {
      core: { description: "Core Types", symbols: [] },
      api: { description: "API Types", symbols: [] },
    },
    const: {
      core: { description: "Core Constants", symbols: [] },
      api: { description: "API Constants", symbols: [] },
    },
  };

  for (const [key, entry] of exportMap.entries()) {
    const symbol: ExportSymbol = {
      ...entry,
      sourcePath: relSource(entry.filePath),
    };
    meta[symbol.kind][symbol.category].symbols.push(symbol);
  }

  const symbolsCount = Array.from(exportMap.values()).length;

  writeText(
    path.join(outputDir, "_meta.json"),
    JSON.stringify(meta, null, 2) + "\n",
  );
  console.log(`Generated _meta.json with ${symbolsCount} symbols.`);
}

main();
