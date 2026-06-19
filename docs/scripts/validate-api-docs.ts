#!/usr/bin/env bun
import * as fs from "fs";
import * as path from "path";
import { generatedDir, readText, symbolSlug, type ApiMeta } from "./shared";

const issues: string[] = [];
const meta: ApiMeta = JSON.parse(readText(path.join(generatedDir, "_meta.json")));

for (const [key, symbol] of Object.entries(meta.symbols)) {
  const expected = path.join(generatedDir, symbol.category, `${symbolSlug(symbol.category, symbol.name, symbol.kind)}.md`);
  if (!fs.existsSync(expected)) {
    issues.push(`Missing page for ${key}: ${expected}`);
  }

  if (/\/Users\/|\/private\//.test(readText(expected))) {
    issues.push(`Leaked absolute path in ${key}`);
  }
}

for (const file of fs.readdirSync(generatedDir, { recursive: true })) {
  const rel = String(file);
  if (!rel.endsWith(".md")) continue;
  const text = readText(path.join(generatedDir, rel));
  if (/\{@link\s+[^}]+\}/.test(text)) issues.push(`Unresolved TSDoc link syntax in ${rel}`);
  if (!/^#\s+/m.test(text)) issues.push(`Missing H1 in ${rel}`);
  const codeFenceCount = (text.match(/```/g) || []).length;
  if (codeFenceCount % 2 !== 0) issues.push(`Unbalanced code fences in ${rel}`);
}

if (issues.length) {
  console.error("API doc validation failed:");
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log("API doc validation passed.");
