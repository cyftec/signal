import { m } from "@cyftec/maya";

type LayoutProps = {
  children: any;
};

export const Layout = ({ children }: LayoutProps) =>
  m.Div({
    class: "app-shell",
    children: [
      m.Aside({
        class: "sidebar",
        children: [
          m.Div({
            class: "brand",
            children: [
              m.Div({ class: "brand-kicker", children: "Cyftech Signal" }),
              m.Div({ class: "brand-title", children: "API Docs" }),
            ],
          }),
          m.Button({
            type: "button",
            class: "nav-toggle",
            // @ts-ignore
            "aria-expanded": "false",
            "aria-controls": "nav",
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
          m.Div({
            id: "searchStatus",
            class: "search-status",
            // @ts-ignore
            "aria-live": "polite",
          }),
          m.Nav({ id: "nav", children: "" }),
        ],
      }),
      m.Main({
        class: "main",
        children: m.Article({ class: "doc", children }),
      }),
    ],
  });
