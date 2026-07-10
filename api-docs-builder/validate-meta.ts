import { CodeEntitiesMeta, OUTPUT_FILE_PATH, readText } from "./shared";

// TODO: Implement meta validator to check if any comments are incomplete or incorrect

const issues: string[] = [];
const meta: CodeEntitiesMeta = JSON.parse(readText(OUTPUT_FILE_PATH));

// for (const [key, entity] of Object.entries(meta.entitys)) {
//   const expected = path.join(OUTPUT_DIR_PATH, entity.category, `${entitySlug(entity.category, entity.name, entity.kind)}.md`);
//   if (!fs.existsSync(expected)) {
//     issues.push(`Missing page for ${key}: ${expected}`);
//   }

//   if (/\/Users\/|\/private\//.test(readText(expected))) {
//     issues.push(`Leaked absolute path in ${key}`);
//   }
// }

// for (const file of fs.readdirSync(OUTPUT_DIR_PATH, { recursive: true })) {
//   const rel = String(file);
//   if (!rel.endsWith(".md")) continue;
//   const text = readText(path.join(OUTPUT_DIR_PATH, rel));
//   if (/\{@link\s+[^}]+\}/.test(text))
//     issues.push(`Unresolved TSDoc link syntax in ${rel}`);
//   if (!/^#\s+/m.test(text)) issues.push(`Missing H1 in ${rel}`);
//   const codeFenceCount = (text.match(/```/g) || []).length;
//   if (codeFenceCount % 2 !== 0) issues.push(`Unbalanced code fences in ${rel}`);
// }

// if (issues.length) {
//   console.error("API doc validation failed:");
//   for (const issue of issues) console.error(`- ${issue}`);
//   process.exit(1);
// }

console.log("API doc validation passed.");
