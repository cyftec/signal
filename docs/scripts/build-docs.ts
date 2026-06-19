#!/usr/bin/env bun
import * as fs from "fs";
import * as path from "path";
import {
  escapeHtml,
  generatedDir,
  readText,
  symbolSlug,
  toSlug,
  type ApiMeta,
  writeText,
} from "./shared";

type NavEntry = {
  key: string;
  name: string;
  label: string;
  href: string;
  category: string;
  summary: string;
};

const docsRoot = path.join(process.cwd(), "docs");
const meta = JSON.parse(readText(path.join(generatedDir, "_meta.json"))) as ApiMeta;

function relPath(from: string, to: string) {
  const fromDir = path.posix.dirname(from);
  return path.posix.relative(fromDir, to) || ".";
}

function cleanOutput() {
  for (const name of ["api-docs", "assets", "index.html", "tutorial", "architecture"]) {
    fs.rmSync(path.join(docsRoot, name), { recursive: true, force: true });
  }
}

function parseMarkdown(md: string) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const title = lines.find((line) => /^#\s+/.test(line))?.replace(/^#\s+/, "").trim() ?? "API";
  const bodyLines = lines.slice(lines.findIndex((line) => /^#\s+/.test(line)) + 1);
  return { title, bodyLines };
}

function normalizeLinkTarget(target: string) {
  const clean = target.trim();
  const bare = clean.split(/\s+-\s+/)[0].split(/[.#\s]/)[0];
  if (!bare) return "#";
  const key = Object.entries(meta.symbols).find(([, symbol]) => symbol.name === bare);
  if (!key) return `#${toSlug(bare)}`;
  const [, symbol] = key;
  return `/api-docs/${symbol.category}/${symbolSlug(symbol.category, symbol.name, symbol.kind)}/`;
}

function renderInline(text: string) {
  const escaped = escapeHtml(text);
  return escaped
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label, href) => {
      const url = String(href).startsWith("./") ? String(href).replace(/\.md$/, "/") : String(href);
      return `<a href="${escapeHtml(url)}">${label}</a>`;
    })
    .replace(/\{@link\s+([^}]+)\}/g, (_m, target) => {
      const href = normalizeLinkTarget(String(target));
      const label = String(target).trim().replace(/\s+-\s+.*/, "");
      return `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`;
    })
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function tokenizeCode(code: string, lang: string) {
  const source = code;
  if (!lang || !["typescript", "ts", "javascript", "js"].includes(lang)) return escapeHtml(source);
  const pattern =
    /\/\/.*?$|\/\*[\s\S]*?\*\/|`(?:\\.|[^`])*`|"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\b(?:export|const|let|var|type|interface|function|return|new|if|else|for|while|await|async|true|false|null|undefined)\b|\b\d+(?:\.\d+)?\b|\b[A-Za-z_$][A-Za-z0-9_$]*(?=\()/gm;
  let last = 0;
  let out = "";
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(source))) {
    out += escapeHtml(source.slice(last, match.index));
    const token = match[0];
    if (/^\/\//.test(token) || /^\/\*/.test(token)) {
      out += `<span class="tok cm">${escapeHtml(token)}</span>`;
    } else if (/^["'`]/.test(token)) {
      out += `<span class="tok str">${escapeHtml(token)}</span>`;
    } else if (/^\d/.test(token)) {
      out += `<span class="tok num">${escapeHtml(token)}</span>`;
    } else if (/^(export|const|let|var|type|interface|function|return|new|if|else|for|while|await|async|true|false|null|undefined)$/.test(token)) {
      out += `<span class="tok kw">${escapeHtml(token)}</span>`;
    } else {
      out += `<span class="tok fn">${escapeHtml(token)}</span>`;
    }
    last = pattern.lastIndex;
  }
  out += escapeHtml(source.slice(last));
  return out;
}

function renderMarkdown(md: string) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let i = 0;
  let paragraph: string[] = [];
  let list: string[] = [];
  let blockquote: string[] = [];
  let codeLang = "";
  let code: string[] = [];
  let inCode = false;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    out.push(`<p>${renderInline(paragraph.join(" ").trim())}</p>`);
    paragraph = [];
  };
  const flushList = () => {
    if (!list.length) return;
    out.push(`<ul>${list.map((item) => `<li>${renderInline(item)}</li>`).join("")}</ul>`);
    list = [];
  };
  const flushQuote = () => {
    if (!blockquote.length) return;
    out.push(`<blockquote>${blockquote.map((x) => renderInline(x)).join("<br/>")}</blockquote>`);
    blockquote = [];
  };
  const flushCode = () => {
    if (codeLang === "mermaid") {
      out.push(renderMermaidDiagram(code.join("\n")));
    } else {
      out.push(`<div class="code-block"><button type="button" class="copy-button">Copy</button><pre><code data-lang="${escapeHtml(codeLang)}">${tokenizeCode(code.join("\n"), codeLang)}</code></pre></div>`);
    }
    code = [];
  };

  while (i < lines.length) {
    const line = lines[i];
    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading && !inCode) {
      flushParagraph();
      flushList();
      flushQuote();
      const level = heading[1].length;
      const text = heading[2].trim();
      out.push(`<h${level} id="${toSlug(text)}">${renderInline(text)}</h${level}>`);
      i++;
      continue;
    }
    if (line.startsWith("```")) {
      if (!inCode) {
        flushParagraph();
        flushList();
        flushQuote();
        inCode = true;
        codeLang = line.slice(3).trim();
      } else {
        inCode = false;
        flushCode();
      }
      i++;
      continue;
    }
    if (inCode) {
      code.push(line);
      i++;
      continue;
    }
    if (/^- /.test(line)) {
      flushParagraph();
      flushQuote();
      list.push(line.replace(/^- /, ""));
      i++;
      continue;
    }
    if (/^> ?/.test(line)) {
      flushParagraph();
      flushList();
      blockquote.push(line.replace(/^> ?/, ""));
      i++;
      continue;
    }
    if (!line.trim()) {
      flushParagraph();
      flushList();
      flushQuote();
      i++;
      continue;
    }
    paragraph.push(line.trim());
    i++;
  }
  flushParagraph();
  flushList();
  flushQuote();
  return out.join("\n");
}

function renderMermaidDiagram(source: string) {
  const block = (title: string, items: string[]) =>
    `<div class="diagram-block"><div class="diagram-title">${escapeHtml(title)}</div><div class="diagram-svg">${items.map((item, index) => `${index ? '<div class="diagram-arrow">→</div>' : ""}<div class="diagram-node"><span>${escapeHtml(item)}</span></div>`).join("")}</div></div>`;
  if (source.includes("signal(input)")) {
    return block("Core Runtime", ["signal(input)", "immutable value storage", "value getter", "register current effect", "value setter / mutation", "run dependent effects synchronously"]);
  }
  if (source.includes("effect(fn)") || source.includes("_currentSignalEffect")) {
    return block("Dependency Tracking", ["effect(fn)", "_currentSignalEffect", "signal.value getter", "signal._effects"]);
  }
  if (source.includes("derive(fn)") || source.includes("internal derived source signal")) {
    return block("Derived Signal Model", ["derive(fn)", "internal derived source signal", "internal updater effect", "computed value"]);
  }
  if (source.includes("dispose() called")) {
    return block("Disposal", ["dispose() called", "canDisposeNow = true", "cleanup on next signal update", "removed from signal._effects"]);
  }
  if (source.includes("set value") || source.includes("source signal")) {
    return block("Data Flow", ["source signal", "derived signal", "effect", "side effects"]);
  }
  return `<div class="diagram-block"><pre><code>${escapeHtml(source)}</code></pre></div>`;
}

function navEntries(): NavEntry[] {
  return Object.entries(meta.symbols)
    .map(([key, symbol]) => ({
      key,
      name: symbol.name,
      label: symbol.name,
      href: `/api-docs/${symbol.category}/${symbolSlug(symbol.category, symbol.name, symbol.kind)}/`,
      category: symbol.category,
      summary: symbol.tsdoc.summary.split("\n")[0] ?? "",
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function pageShell(opts: { title: string; body: string; activeHref: string; nav: NavEntry[]; pagePath: string; shell?: "api" | "content" }) {
  const counts = opts.nav.reduce<Record<string, number>>((acc, item) => {
    const k = `${item.category}:${item.name}`;
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {});
  const grouped = Object.groupBy(opts.nav, (item) => item.category);
  const navHtml = opts.shell === "api"
    ? Object.entries(grouped)
        .map(([category, items]) => {
          return `<section class="nav-group"><h2>${category}</h2>${items
            .map(
              (item) =>
                `<a class="nav-link${item.href === opts.activeHref ? " active" : ""}" href="${escapeHtml(relPath(opts.pagePath, item.href).replace(/([^/])$/, "$1/"))}"><span>${escapeHtml(counts[`${item.category}:${item.name}`] > 1 ? `${item.label} (${item.category})` : item.label)}</span><small>${escapeHtml(item.summary)}</small></a>`,
            )
            .join("")}</section>`;
        })
        .join("")
    : "";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(opts.title)} | API Docs</title>
  <link rel="stylesheet" href="${escapeHtml(relPath(opts.pagePath, "/assets/docs.css"))}" />
</head>
<body>
  <div class="app-shell${opts.shell === "content" ? " content-layout" : ""}">
    <aside class="sidebar${opts.shell === "content" ? " content-shell" : ""}"${opts.shell === "api" ? ' data-collapsed="true"' : ""}>
      <div class="brand">
        <div class="brand-kicker">Cyftech Signal</div>
        <div class="brand-title">API Docs</div>
      </div>
      ${opts.shell === "api" ? `<button type="button" class="nav-toggle" aria-expanded="false" aria-controls="nav">Browse symbols</button>
      <label class="search">
        <span>Search</span>
        <input id="search" type="search" placeholder="Filter symbols, headings, text" />
      </label>
      <div id="searchStatus" class="search-status" aria-live="polite"></div>
      <nav id="nav">${navHtml}</nav>` : `<div class="content-nav"><a href="../">Home</a><a href="../api-docs/">API Docs</a><a href="../tutorial/">Tutorial</a><a href="../architecture/">Architecture</a></div>`}
    </aside>
    <main class="main">
      ${opts.shell === "content" ? `<nav class="content-top-nav"><a href="../">Home</a><a href="../api-docs/">API Docs</a><a href="../tutorial/">Tutorial</a><a href="../architecture/">Architecture</a></nav>` : ""}
      <article class="doc">
        ${opts.body}
      </article>
    </main>
  </div>
  ${opts.shell === "api" ? `<script src="${escapeHtml(relPath(opts.pagePath, "/assets/docs.js"))}"></script>` : ""}
</body>
</html>`;
}

function renderApiPage(symbol: ApiMeta["symbols"][string]) {
  const md = readText(path.join(generatedDir, symbol.category, `${symbolSlug(symbol.category, symbol.name, symbol.kind)}.md`));
  const { title, bodyLines } = parseMarkdown(md);
  const body = renderMarkdown(bodyLines.join("\n"));
  const summary = symbol.tsdoc.summary.split("\n")[0] ?? "";
  const header = `<header class="hero"><div class="eyebrow">${escapeHtml(symbol.category)} / ${escapeHtml(symbol.kind)}</div><h1>${escapeHtml(title)}</h1><p>${escapeHtml(summary)}</p><div class="meta">Source: <code>${escapeHtml(symbol.sourcePath)}</code></div></header>`;
  const pagePath = `/api-docs/${symbol.category}/${symbolSlug(symbol.category, symbol.name, symbol.kind)}/index.html`;
  return pageShell({ title, body: `${header}${body}`, activeHref: `/api-docs/${symbol.category}/${symbolSlug(symbol.category, symbol.name, symbol.kind)}/`, nav: navEntries(), pagePath, shell: "api" });
}

function renderApiIndex() {
  const core = meta.categories.core.symbols.length;
  const api = meta.categories.api.symbols.length;
  return pageShell({
    title: "API Docs",
    activeHref: "/api-docs/",
    nav: navEntries(),
    pagePath: "/api-docs/index.html",
    shell: "api",
    body: `
      <header class="hero">
        <div class="eyebrow">Reference</div>
        <h1>API Docs</h1>
        <p>Complete reference generated from the source tree and validated markdown.</p>
        <div class="stats"><div><strong>${core}</strong><span>core symbols</span></div><div><strong>${api}</strong><span>api symbols</span></div></div>
      </header>
      <section class="panel">
        <h2>Start here</h2>
        <p>Select a symbol from the navigation. Search filters both the nav and page content.</p>
      </section>
    `,
  });
}

function renderLanding() {
  const cards = [
    { href: "./api-docs/", title: "api-docs", desc: "Generated API reference driven by TSDoc and validated markdown." },
    { href: "./tutorial/", title: "tutorial", desc: "Learning-first guide with examples, outcomes, and progressive steps." },
    { href: "./architecture/", title: "architecture", desc: "Contributor-focused diagrams and implementation notes." },
  ];
  const code = `import { signal, effect } from "@cyftech/signal";

type LightState = "red" | "amber" | "green";

const light = signal<LightState>("red");
const order: LightState[] = ["red", "amber", "green"];

effect(() => {
  trafficLight.dataset.state = light.value;
});

setInterval(() => {
  const current = order.indexOf(light.value);
  light.value = order[(current + 1) % order.length];
}, 1200);`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Cyftech Signal Docs</title>
  <link rel="stylesheet" href="./assets/docs.css" />
</head>
<body>
  <main class="landing">
    <nav class="landing-nav">
      <a href="./api-docs/">API Docs</a>
      <a href="./tutorial/">Tutorial</a>
      <a href="./architecture/">Architecture</a>
    </nav>
    <section class="showcase">
      <div class="showcase-copy">
        <div class="eyebrow">Cyftech Signal</div>
        <h1>Signals you can read in the code and see in the UI.</h1>
        <p>A source signal owns the state. An effect observes that state. When the value changes, the UI follows synchronously.</p>
        <div class="showcase-code"><pre><code>${tokenizeCode(code, "ts")}</code></pre></div>
      </div>
      <div class="showcase-demo" aria-label="Animated traffic light driven by a signal state">
        <div class="traffic-scene">
          <div class="traffic-controller">
            <span>signal value</span>
            <strong class="state-word" aria-label="animated light state"></strong>
          </div>
          <div class="traffic-light" aria-hidden="true">
            <div class="lamp lamp-red"></div>
            <div class="lamp lamp-amber"></div>
            <div class="lamp lamp-green"></div>
          </div>
          <div class="traffic-timeline">
            <span>red</span>
            <span>amber</span>
            <span>green</span>
          </div>
        </div>
      </div>
    </section>
    <section class="landing-grid">
      ${cards.map((card) => `<a class="landing-card" href="${card.href}"><span>${card.title}</span><small>${card.desc}</small></a>`).join("")}
    </section>
  </main>
</body>
</html>`;
}

function renderMarkdownPage(title: string, md: string) {
  const { bodyLines } = parseMarkdown(md);
  return pageShell({
    title,
    activeHref: `/${title.toLowerCase()}/`,
    nav: [],
    pagePath: `/${title.toLowerCase()}/index.html`,
    shell: "content",
    body: `<header class="hero"><div class="eyebrow">${escapeHtml(title)}</div><h1>${escapeHtml(title)}</h1><p>${escapeHtml(title === "Tutorial" ? "Learn the library step by step." : "Understand the internal architecture visually.")}</p></header>${renderMarkdown(bodyLines.join("\n"))}`,
  });
}

function writeStaticFiles() {
  const css = `
:root{--bg:#fff;--fg:#666;--muted:#666;--accent:#ee4440;--line:#666;--soft:#f5f5f5}
*{box-sizing:border-box}html,body{margin:0;max-width:100%;overflow-x:hidden;background:var(--bg);color:var(--fg);font:16px/1.6 ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
a{color:inherit}code,pre{font:13px/1.55 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace}
.app-shell{display:grid;grid-template-columns:minmax(260px,320px) minmax(0,1fr);min-height:100vh}
.sidebar{position:sticky;top:0;height:100vh;overflow:auto;padding:24px 18px;border-right:1px solid var(--line);background:linear-gradient(180deg,#fff 0%,#fafafa 100%)}
.brand{padding-bottom:18px;border-bottom:1px solid var(--line);margin-bottom:18px}.brand-kicker{font-size:12px;text-transform:uppercase;color:var(--muted)}.brand-title{font-size:24px;font-weight:800;line-height:1.05;color:#666}
.nav-toggle{display:none;width:100%;margin:0 0 14px;padding:12px 14px;border:1px solid var(--line);border-radius:14px;background:#fff;color:var(--fg);font-weight:700}
.search{display:block;margin:0 0 18px}.search span{display:block;font-size:12px;text-transform:uppercase;color:var(--muted);margin-bottom:8px}.search input{width:100%;padding:12px 14px;border:1px solid var(--line);background:#fff;color:var(--fg);border-radius:8px}
.search-status{min-height:18px;margin:0 0 12px;font-size:12px;color:var(--muted)}
.nav-group{margin:0 0 18px}.nav-group h2{margin:0 0 10px;font-size:11px;text-transform:uppercase;color:var(--muted)}
.nav-link{display:block;padding:10px 12px;border:1px solid transparent;border-radius:8px;text-decoration:none;margin:0 0 8px;background:#fff}
.nav-link:hover,.nav-link.active{border-color:var(--line);box-shadow:3px 3px 0 0 var(--line)}
.nav-link span{display:block;font-weight:700}.nav-link small{display:block;color:var(--muted);font-size:12px}
.main{padding:28px;min-width:0}
.doc{max-width:880px;margin:0 auto}
.hero{padding:28px 28px 22px;border:1px solid var(--line);border-radius:8px;background:linear-gradient(135deg,#fff 0%,#fbfbfb 100%);box-shadow:8px 8px 0 0 var(--line);margin-bottom:24px}
.eyebrow{font-size:12px;text-transform:uppercase;color:var(--muted);margin-bottom:12px}
.hero h1{margin:0 0 12px;font-size:56px;line-height:1;color:#666;overflow-wrap:anywhere}
.hero p{margin:0 0 16px;max-width:60ch;font-size:18px;color:#666}
.stats{display:flex;gap:14px;flex-wrap:wrap}.stats div{padding:12px 14px;border:1px solid var(--line);border-radius:8px;background:#fff}.stats strong{display:block;font-size:24px;line-height:1;color:#666}.stats span{display:block;color:var(--muted);font-size:12px;text-transform:uppercase}
.panel{padding:20px 22px;border:1px solid var(--line);border-radius:8px;background:#fff;margin-bottom:22px}
.panel h2,.doc h2{margin:0 0 12px;font-size:22px;line-height:1.15}
.doc h3{margin:20px 0 10px;font-size:18px}
.doc p,.doc ul,.doc blockquote,.doc .code-block{margin:0 0 16px}
.doc p{max-width:70ch}
.doc ul{padding-left:20px}.doc li{margin:0 0 6px}
.doc blockquote{padding:16px 18px;border-left:3px solid var(--accent);background:#fff;border-radius:0 16px 16px 0}
.code-block{position:relative;border:1px solid var(--line);border-radius:8px;overflow:hidden;background:#fff;box-shadow:6px 6px 0 0 var(--line)}
.code-block pre{margin:0;padding:20px;overflow:auto;background:#fff;max-width:100%}
.copy-button{position:absolute;top:10px;right:10px;border:1px solid var(--line);background:#fff;color:var(--fg);border-radius:8px;padding:8px 12px;cursor:pointer}
.copy-button:hover,.copy-button:focus{background:var(--accent);color:#fff}
.tok{display:inline}.tok.kw{color:var(--accent);font-weight:700}.tok.fn{color:#666;font-weight:700}.tok.str{color:#666}.tok.cm{color:#666;font-style:italic}.tok.num{color:#666}
.doc a{color:inherit;text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:3px}.doc a:hover{color:var(--accent)}
.meta{color:var(--muted);font-size:14px}
.signature{background:#fff}
.section-anchor{scroll-margin-top:24px}
.diagram-block pre{background:linear-gradient(180deg,#fff 0%,#fafafa 100%)}
.diagram-block code{font-size:14px;line-height:1.6;color:#666}
.landing{max-width:1180px;margin:0 auto;padding:24px 24px 64px}
.landing-nav{display:flex;justify-content:flex-end;gap:18px;margin:0 0 28px}
.landing-nav a{color:#666;text-decoration:none;font-weight:700}
.landing-nav a:hover{color:var(--accent)}
.showcase{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(300px,.95fr);gap:28px;align-items:stretch;min-height:560px}
.showcase-copy{display:flex;flex-direction:column;justify-content:center}
.showcase-copy h1{margin:0 0 18px;font-size:64px;line-height:1;color:#666;max-width:11ch;overflow-wrap:anywhere}
.showcase-copy p{margin:0 0 24px;max-width:58ch;font-size:18px;color:#666}
.showcase-code{border:1px solid var(--line);box-shadow:6px 6px 0 0 var(--line);background:#fff;overflow:auto;max-width:100%}
.showcase-code pre{margin:0;padding:20px;background:#fff}
.showcase-code code{font-size:13px;color:#666}
.showcase-demo{display:flex;align-items:center;justify-content:center;border:1px solid var(--line);box-shadow:8px 8px 0 0 var(--line);background:#fff;min-height:520px}
.traffic-scene{width:min(360px,88%);display:grid;gap:22px;justify-items:center}
.traffic-controller{width:100%;display:flex;justify-content:space-between;align-items:center;border:1px solid var(--line);padding:12px 14px;background:#fff}
.traffic-controller span{font-size:12px;text-transform:uppercase;color:#666}
.traffic-controller strong{color:var(--accent);font-size:22px;line-height:1}
.state-word{font-size:0}
.state-word::after{content:"";animation:stateWord 3.6s steps(1,end) infinite}
.state-word::after{font-size:22px}
.traffic-light{width:156px;padding:18px;border:1px solid var(--line);display:grid;gap:14px;background:#fff;box-shadow:6px 6px 0 0 var(--line)}
.lamp{width:100%;aspect-ratio:1;border:1px solid var(--line);border-radius:999px;background:#fff;position:relative}
.lamp::after{content:"";position:absolute;inset:18%;border-radius:inherit;background:#666;opacity:.22}
.lamp-red::after{animation:lampRed 3.6s steps(1,end) infinite}
.lamp-amber::after{animation:lampAmber 3.6s steps(1,end) infinite}
.lamp-green::after{animation:lampGreen 3.6s steps(1,end) infinite}
.traffic-timeline{width:100%;display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.traffic-timeline span{border:1px solid var(--line);padding:8px 10px;text-align:center;font-size:12px;text-transform:uppercase;color:#666;background:#fff}
.traffic-timeline span:nth-child(1){animation:timelineRed 3.6s steps(1,end) infinite}
.traffic-timeline span:nth-child(2){animation:timelineAmber 3.6s steps(1,end) infinite}
.traffic-timeline span:nth-child(3){animation:timelineGreen 3.6s steps(1,end) infinite}
.landing-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-top:34px}
.landing-card{display:block;padding:22px;border:1px solid var(--line);border-radius:8px;text-decoration:none;background:#fff;box-shadow:6px 6px 0 0 var(--line)}
.landing-card span{display:block;font-size:14px;text-transform:uppercase;color:var(--accent);margin-bottom:10px}
.landing-card small{display:block;color:var(--muted);font-size:16px;line-height:1.55}
@keyframes lampRed{0%,33%{background:var(--accent);opacity:1}33.1%,100%{background:#666;opacity:.22}}
@keyframes lampAmber{0%,33%{background:#666;opacity:.22}33.1%,66%{background:var(--accent);opacity:1}66.1%,100%{background:#666;opacity:.22}}
@keyframes lampGreen{0%,66%{background:#666;opacity:.22}66.1%,100%{background:var(--accent);opacity:1}}
@keyframes timelineRed{0%,33%{color:#fff;background:var(--accent)}33.1%,100%{color:#666;background:#fff}}
@keyframes timelineAmber{0%,33%{color:#666;background:#fff}33.1%,66%{color:#fff;background:var(--accent)}66.1%,100%{color:#666;background:#fff}}
@keyframes timelineGreen{0%,66%{color:#666;background:#fff}66.1%,100%{color:#fff;background:var(--accent)}}
@keyframes stateWord{0%,33%{content:"red"}33.1%,66%{content:"amber"}66.1%,100%{content:"green"}}
.content-layout{display:block}
.content-shell{width:100%;max-width:980px;margin:0 auto;padding:16px 0 0;border-right:0;background:transparent;position:static;height:auto;overflow:visible}
.content-layout .sidebar{display:none}
.content-layout .main{padding:24px 0}
.content-nav{display:flex;gap:12px;flex-wrap:wrap}
.content-nav a{color:var(--accent);text-decoration:none;font-weight:700}
.content-top-nav{display:flex;gap:14px;flex-wrap:wrap;max-width:880px;margin:0 auto 18px;padding:0 4px}
.content-top-nav a{color:var(--accent);text-decoration:none;font-weight:700}
.diagram-block{border:1px solid var(--line);border-radius:8px;box-shadow:6px 6px 0 0 var(--line);padding:18px;background:#fff;margin:0 0 16px;overflow:hidden}
.diagram-svg{display:flex;flex-wrap:wrap;align-items:center;gap:12px;min-height:84px}
.diagram-node{padding:12px 14px;border:1px solid var(--line);border-radius:16px;background:#fff;color:#666;box-shadow:4px 4px 0 0 var(--line)}
.diagram-node span{display:block;font-weight:700}
.diagram-arrow{color:var(--accent);font-size:24px;font-weight:700}
.doc h1,.doc h2,.doc h3,.doc h4{color:#666}
.doc h2{position:relative;padding-top:4px}
.doc h2::after{content:"";display:block;width:56px;height:3px;background:var(--accent);margin-top:10px}
.doc .callout{padding:18px 20px;border:1px solid var(--line);border-radius:8px;background:#fff;box-shadow:6px 6px 0 0 var(--line)}
@media (max-width: 980px){
  .app-shell{grid-template-columns:1fr}
  .sidebar{position:relative;height:auto;border-right:0;border-bottom:1px solid var(--line);padding:16px}
  .nav-toggle{display:block}
  .sidebar[data-collapsed="true"] #nav,
  .sidebar[data-collapsed="true"] .search,
  .sidebar[data-collapsed="true"] .search-status{display:none}
  .main{padding:16px}
  .doc{max-width:none}
  .hero{box-shadow:5px 5px 0 0 var(--line);padding:20px 18px 16px}
  .hero h1{font-size:40px;line-height:1.02}
  .panel{padding:16px 18px}
  .showcase{grid-template-columns:1fr;min-height:0}
  .showcase-copy h1{font-size:42px;line-height:1.04;max-width:none}
  .showcase-demo{min-height:320px}
  .landing-nav{justify-content:flex-start;flex-wrap:wrap}
  .landing-grid{grid-template-columns:1fr}
  .landing{padding:20px 16px 48px}
}
@media (max-width: 640px){
  html,body{font-size:15px}
  .landing{padding:14px 12px 36px}
  .landing-nav{gap:10px;margin-bottom:18px}
  .landing-nav a{font-size:14px}
  .showcase{gap:18px}
  .showcase-copy h1{font-size:34px}
  .showcase-copy p{font-size:16px;margin-bottom:18px}
  .showcase-code pre{padding:14px}
  .showcase-code code{font-size:12px;line-height:1.5}
  .showcase-demo{min-height:270px;box-shadow:5px 5px 0 0 var(--line)}
  .traffic-scene{width:min(290px,92%);gap:14px}
  .traffic-controller{padding:10px 12px}
  .traffic-controller span{font-size:10px}
  .state-word::after{font-size:18px}
  .traffic-light{width:116px;padding:12px;gap:10px;box-shadow:5px 5px 0 0 var(--line)}
  .traffic-timeline{gap:6px}
  .traffic-timeline span{padding:7px 4px;font-size:10px}
  .landing-grid{gap:12px;margin-top:22px}
  .landing-card{padding:16px;box-shadow:4px 4px 0 0 var(--line)}
  .main{padding:12px}
  .content-layout .main{padding:12px}
  .content-top-nav{padding:0;margin-bottom:12px}
  .sidebar{padding:12px}
  .brand-title{font-size:20px}
  .hero{padding:16px 14px;box-shadow:4px 4px 0 0 var(--line)}
  .hero h1{font-size:32px}
  .hero p{font-size:16px}
  .doc p,.doc ul,.doc blockquote,.doc .code-block{margin-bottom:14px}
  .doc ul{padding-left:18px}
  .code-block{box-shadow:4px 4px 0 0 var(--line)}
  .code-block pre{padding:14px}
  .copy-button{position:static;margin:10px 0 0 10px;padding:6px 10px}
  .diagram-block{padding:12px;box-shadow:4px 4px 0 0 var(--line)}
  .diagram-svg{display:grid;grid-template-columns:1fr;min-height:0}
  .diagram-arrow{font-size:18px;transform:rotate(90deg);justify-self:center}
  .diagram-node{width:100%;box-shadow:3px 3px 0 0 var(--line)}
}
`;
  const js = `
const search = document.getElementById('search');
const nav = document.getElementById('nav');
const doc = document.querySelector('.doc');
const copyButtons = document.querySelectorAll('.copy-button');
const toggle = document.querySelector('.nav-toggle');
const searchStatus = document.getElementById('searchStatus');

copyButtons.forEach((btn) => {
  btn.addEventListener('click', async () => {
    const code = btn.parentElement.querySelector('code');
    await navigator.clipboard.writeText(code.textContent);
    const old = btn.textContent;
    btn.textContent = 'Copied';
    setTimeout(() => btn.textContent = old, 1200);
  });
});

toggle?.addEventListener('click', () => {
  const sidebar = document.querySelector('.sidebar');
  const collapsed = sidebar?.getAttribute('data-collapsed') === 'true';
  sidebar?.setAttribute('data-collapsed', collapsed ? 'false' : 'true');
  toggle.setAttribute('aria-expanded', String(collapsed));
  toggle.textContent = collapsed ? 'Hide symbols' : 'Browse symbols';
});

search?.addEventListener('input', () => {
  const q = search.value.trim().toLowerCase();
  let visible = 0;
  let firstVisible = null;
  document.querySelectorAll('.nav-link').forEach((link) => {
    const text = link.textContent.toLowerCase();
    const match = q ? text.includes(q) : true;
    link.hidden = !match;
    link.style.display = match ? '' : 'none';
    if (match) {
      visible++;
      if (!firstVisible) firstVisible = link;
    }
  });
  document.querySelectorAll('.nav-group').forEach((group) => {
    const hasVisible = !!group.querySelector('.nav-link:not([hidden])');
    group.hidden = q ? !hasVisible : false;
    group.style.display = q && !hasVisible ? 'none' : '';
  });
  if (searchStatus) {
    searchStatus.textContent = q ? (visible + ' symbol' + (visible === 1 ? '' : 's') + \" match '\" + search.value.trim() + \"'\") : '';
  }
  if (firstVisible instanceof HTMLElement) firstVisible.scrollIntoView({ block: 'nearest' });
  doc?.querySelectorAll('section,article,header,p,li,blockquote,.code-block,h1,h2,h3,h4,h5,h6').forEach((el) => {
    el.hidden = false;
  });
});
`;
  writeText(path.join(docsRoot, "assets/docs.css"), css);
  writeText(path.join(docsRoot, "assets/docs.js"), js);
}

function main() {
  cleanOutput();
  writeStaticFiles();
  writeText(path.join(docsRoot, "index.html"), renderLanding());
  writeText(path.join(docsRoot, "api-docs/index.html"), renderApiIndex());
  writeText(path.join(docsRoot, "tutorial/index.html"), renderMarkdownPage("Tutorial", readText(path.join(docsRoot, "content/tutorial.md"))));
  writeText(path.join(docsRoot, "architecture/index.html"), renderMarkdownPage("Architecture", readText(path.join(docsRoot, "content/architecture.md"))));
  for (const symbol of Object.values(meta.symbols)) {
    const out = path.join(docsRoot, "api-docs", symbol.category, symbolSlug(symbol.category, symbol.name, symbol.kind), "index.html");
    writeText(out, renderApiPage(symbol));
  }
  console.log("Built documentation site.");
}

main();
