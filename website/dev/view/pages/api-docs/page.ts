import { m } from "@cyftec/maya";
import { derive, signal, tmpl } from "@cyftec/maya/signal";
import { updateSearchParamWithoutReload } from "../../../controller";
import { ApiMeta, ExportSymbol } from "../../../models";
import { HtmlPage, Tabs } from "../../components";
import { SymbolDetails, SymbolsOverview } from "./@components";

const selectedSymbolName = signal("");
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
const selectedSymbol = derive(() => {
  console.log(selectedSymbolName.value);
  let sym: ExportSymbol = {
    name: "",
    kind: "const",
    filePath: "",
    sourcePath: "",
    isExported: false,
    exportKind: "default",
    category: "core",
    tsdoc: {
      title: "",
      summary: "",
      remarks: [],
      examples: [],
      params: [],
      returns: [],
      see: [],
      template: [],
      deprecated: [],
    },
  };
  sym =
    filteredSymbols.value.find(
      (fs) => selectedSymbolName.value && selectedSymbolName.value === fs.name,
    ) || sym;

  return sym;
}, {});
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

const onTabChange = (index: number) => {
  selectedTabIndex.value = index;
  updateSearchParamWithoutReload({ tabIndex: `${index}` });
};

const onSymbolSelect = (symbolName: string) => {
  updateSearchParamWithoutReload({ name: symbolName });
  selectedSymbolName.value = symbolName;
};

const loadApiDocs = async () => {
  const response = await fetch("/assets/_meta.json");
  if (!response.ok) throw new Error("Failed to load _meta.json");
  const metaJson = await response.json();
  console.log("Loaded API Docs meta:", metaJson);
  meta.value = metaJson;
};

const onPageMount = () => {
  loadApiDocs();
  const params = Object.fromEntries(
    new URLSearchParams(window.location.search),
  );
  if (params.name) selectedSymbolName.value = params.name;

  // console.log(params);
  if (params.tabIndex !== undefined) selectedTabIndex.value = +params.tabIndex;
  else
    updateSearchParamWithoutReload({ tabIndex: `${selectedTabIndex.value}` });
};

export default HtmlPage({
  title: "API Docs",
  children: m.Div({
    onmount: onPageMount,
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
                onSelect: onTabChange,
              }),
              m.Section({
                class: "nav-group",
                children: m.For({
                  subject: filteredSymbols,
                  map: ({ name, category, tsdoc }) =>
                    m.A({
                      class: tmpl`nav-link ${() => (selectedSymbolName.value === name ? "active" : "")}`,
                      onclick: () => onSymbolSelect(name),
                      children: [
                        m.Small({ children: category.toUpperCase() }),
                        m.Span({ children: name }),
                        m.Small({ children: tsdoc.title }),
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
        children: m.If({
          subject: selectedSymbol.prop("name"),
          isTruthy: () =>
            SymbolDetails({ symbol: selectedSymbol, onSymbolSelect }),
          isFalsy: () => SymbolsOverview({ symbolsDetails }),
        }),
      }),
    ],
  }),
});
