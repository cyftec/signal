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
  kind: "const" | "type";
  filePath: string;
  sourcePath: string;
  isExported: boolean;
  exportKind: "named" | "default" | "reexport";
  category: "core" | "api";
  subcategory?: string;
  signature?: string;
  type?: string;
  parameters?: Array<{ name: string; type: string; optional: boolean }>;
  typeParameters?: string[];
  tsdoc: TSDoc;
};

export type ApiMeta = {
  type: {
    core: {
      description: string;
      symbols: ExportSymbol[];
    };
    api: {
      description: string;
      symbols: ExportSymbol[];
    };
  };
  const: {
    core: {
      description: string;
      symbols: ExportSymbol[];
    };
    api: {
      description: string;
      symbols: ExportSymbol[];
    };
  };
};

export const repoRoot = path.join(process.cwd(), "..");
export const srcDir = path.join(repoRoot, "signal/src");
export const outputDir = path.join(process.cwd(), "./website/dev/assets");

export function readText(filePath: string) {
  return fs.readFileSync(filePath, "utf8");
}

export function writeText(filePath: string, content: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

export function stripIndent(input: string) {
  const lines = input.replace(/\t/g, "  ").split(/\r?\n/);
  const indents = lines
    .filter((line) => line.trim().length > 0)
    .map((line) => line.match(/^\s*/)?.[0].length ?? 0);
  const min = indents.length ? Math.min(...indents) : 0;
  return lines
    .map((line) => line.slice(min))
    .join("\n")
    .trim();
}

export function relSource(filePath: string) {
  return path.relative(repoRoot, filePath).split(path.sep).join("/");
}

export function categoryForFile(filePath: string) {
  const rel = path.relative(srcDir, filePath).split(path.sep).join("/");
  return rel.startsWith("_core/") ? "core" : "api";
}
