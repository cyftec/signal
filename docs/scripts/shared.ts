import * as fs from "fs";
import * as path from "path";

export type TSDocTag = {
  name: string;
  description: string;
};

export type TSDoc = {
  summary: string;
  remarks: string[];
  examples: string[];
  params: TSDocTag[];
  returns: string[];
  see: string[];
  template: TSDocTag[];
  deprecated: string[];
};

export type ExportSymbol = {
  name: string;
  kind: "const" | "type" | "interface" | "function";
  filePath: string;
  sourcePath: string;
  isExported: boolean;
  exportKind: "named" | "default" | "reexport";
  category: string;
  subcategory?: string;
  signature?: string;
  type?: string;
  parameters?: Array<{ name: string; type: string; optional: boolean }>;
  typeParameters?: string[];
  tsdoc: TSDoc;
};

export type ApiMeta = {
  generatedAt: string;
  symbols: Record<string, ExportSymbol>;
  categories: Record<string, { description: string; symbols: string[] }>;
};

export const repoRoot = process.cwd();
export const srcDir = path.join(repoRoot, "src");
export const docsDir = path.join(repoRoot, "docs");
export const generatedDir = path.join(docsDir, "generated-api");

export function readText(filePath: string) {
  return fs.readFileSync(filePath, "utf8");
}

export function writeText(filePath: string, content: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

export function toSlug(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function symbolSlug(category: string, name: string, kind?: string) {
  return `${toSlug(category)}-${toSlug(name)}${kind ? `-${toSlug(kind)}` : ""}`;
}

export function stripIndent(input: string) {
  const lines = input.replace(/\t/g, "  ").split(/\r?\n/);
  const indents = lines
    .filter((line) => line.trim().length > 0)
    .map((line) => line.match(/^\s*/)?.[0].length ?? 0);
  const min = indents.length ? Math.min(...indents) : 0;
  return lines.map((line) => line.slice(min)).join("\n").trim();
}

export function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function relSource(filePath: string) {
  return path.relative(repoRoot, filePath).split(path.sep).join("/");
}

export function categoryForFile(filePath: string) {
  const rel = path.relative(srcDir, filePath).split(path.sep).join("/");
  return rel.startsWith("_core/") ? "core" : "api";
}
