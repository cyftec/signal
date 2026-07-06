import { m } from "@cyftec/maya";
import { HtmlPage } from "../@components";

export default HtmlPage({
  title: "API Docs",
  children: m.Div({
    class: "app-shell",
    children: [
      m.Aside({
        class: "sidebar",
        "data-collapsed": "true",
        children: [
          m.Div({
            class: "brand",
            children: [
              m.Div({ class: "brand-kicker", children: "Cyftec Signal" }),
              m.Div({ class: "brand-title", children: "API Docs" }),
            ],
          }),
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
          m.Nav({ id: "nav", children: "" }),
        ],
      }),
      m.Main({
        class: "main",
        children: m.Article({
          class: "doc",
          children: [
            m.Header({
              class: "card deep mb2",
              children: [
                m.Div({ class: "eyebrow", children: "Reference" }),
                m.H1("API Docs"),
                m.P(
                  "Complete reference generated from the source tree and validated markdown.",
                ),
                m.Div({
                  class: "stats",
                  children: m.For({
                    subject: ["core", "api"],
                    map: (item) =>
                      m.Div({
                        children: [
                          m.Strong({ children: "Loading..." }),
                          m.Span({ children: `${item} symbols` }),
                        ],
                      }),
                  }),
                }),
              ],
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
