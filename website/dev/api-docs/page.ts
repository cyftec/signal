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
              m.Div({ class: "brand-kicker", children: "Cyftech Signal" }),
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
              class: "hero",
              children: [
                m.Div({ class: "eyebrow", children: "Reference" }),
                m.H1({ children: "API Docs" }),
                m.P({
                  children:
                    "Complete reference generated from the source tree and validated markdown.",
                }),
                m.Div({
                  class: "stats",
                  children: [
                    m.Div({
                      children: [
                        m.Strong({ children: "Loading..." }),
                        m.Span({ children: "core symbols" }),
                      ],
                    }),
                    m.Div({
                      children: [
                        m.Strong({ children: "Loading..." }),
                        m.Span({ children: "api symbols" }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            m.Section({
              class: "panel",
              children: [
                m.H2({ children: "Start here" }),
                m.P({
                  children:
                    "Select a symbol from the navigation. Search filters both the nav and page content.",
                }),
              ],
            }),
          ],
        }),
      }),
    ],
  }),
});
