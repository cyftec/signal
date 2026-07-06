import { m } from "@cyftec/maya";
import { derive, signal } from "@cyftec/maya/signal";
import { HtmlPage, Tabs } from "../@components";
import { HeaderCard } from "./@components";
import { ApiMeta } from "./@models";

const symbolKindTabs = ["const", "all", "type"];
const selectedTabIndex = signal(0);
const selectedSymbolKinds = derive(() => {
  return selectedTabIndex.value === 0
    ? ["const"]
    : selectedTabIndex.value === 1
      ? ["const", "type"]
      : ["type"];
});
const meta = signal<ApiMeta | undefined>(undefined);
const filteredSymbols = derive(() => {
  const kinds = selectedSymbolKinds.value;
  if (!meta.value) return [];
  const symbols: ApiMeta["type"]["core"]["symbols"] = [];
  for (const kind of kinds) {
    symbols.push(
      ...(meta.value?.type.core.symbols.filter((s) => s.kind === kind) || []),
      ...(meta.value?.type.api.symbols.filter((s) => s.kind === kind) || []),
      ...(meta.value?.const.core.symbols.filter((s) => s.kind === kind) || []),
      ...(meta.value?.const.api.symbols.filter((s) => s.kind === kind) || []),
    );
  }
  return symbols;
});
const symbolsDetails = derive(() => {
  const coreCount =
    (meta.value?.const.core.symbols.length || 0) +
    (meta.value?.type.core.symbols.length || 0);
  const apiCount =
    (meta.value?.const.api.symbols.length || 0) +
    (meta.value?.type.api.symbols.length || 0);

  return [
    { type: "core", label: `${coreCount}` },
    { type: "api", label: `${apiCount}` },
  ];
});

const loadApiDocs = async () => {
  const response = await fetch("/assets/_meta.json");
  if (!response.ok) throw new Error("Failed to load _meta.json");
  const metaJson = await response.json();
  console.log("Loaded API Docs meta:", metaJson);
  meta.value = metaJson;
};

export default HtmlPage({
  title: "API Docs",
  children: m.Div({
    onmount: loadApiDocs,
    class: "app-shell",
    children: [
      m.Aside({
        class: "sidebar",
        "data-collapsed": "true",
        children: [
          m.Div({ class: "brand-title", children: "API Docs" }),
          m.Button({
            type: "button",
            class: "nav-toggle",
            children: "Browse symbols",
          }),
          m.Label({
            class: "search",
            children: [
              m.Span({ children: "Search" }),
              m.Input({
                id: "search",
                type: "search",
                placeholder: "Filter symbols, headings, text",
              }),
            ],
          }),
          m.Div({ id: "searchStatus", class: "search-status" }),
          m.Nav({
            id: "nav",
            children: [
              Tabs({
                tabs: symbolKindTabs,
                selected: selectedTabIndex,
                onSelect: (index) => (selectedTabIndex.value = index),
              }),
              m.Section({
                class: "nav-group",
                children: m.For({
                  subject: filteredSymbols,
                  map: (symbol) =>
                    m.A({
                      class: "nav-link",
                      href: `?kind=${symbol.kind}&category=${symbol.category}&symbol=${symbol.name}`,
                      children: [
                        m.Small({ children: symbol.category.toUpperCase() }),
                        m.Span({ children: symbol.name }),
                        m.Small({ children: symbol.tsdoc.summary }),
                      ],
                    }),
                }),
              }),
            ],
          }),
        ],
      }),
      m.Main({
        class: "main",
        children: m.Article({
          class: "doc",
          children: [
            HeaderCard({
              eyebrow: "Reference",
              title: "API Docs",
              description:
                "Complete reference generated from the source tree and validated markdown.",
              children: m.If({
                subject: symbolsDetails,
                isTruthy: () =>
                  m.Div({
                    class: "stats",
                    children: m.For({
                      subject: symbolsDetails,
                      map: (symbol) =>
                        m.Div({
                          children: [
                            m.Strong({ children: symbol.label }),
                            m.Span({ children: `${symbol.type} symbols` }),
                          ],
                        }),
                    }),
                  }),
              }),
            }),
            m.Section({
              class: "panel",
              children: [
                m.H2("Start here"),
                m.P(
                  "Select a symbol from the navigation. Search filters both the nav and page content.",
                ),
              ],
            }),
          ],
        }),
      }),
    ],
  }),
});
