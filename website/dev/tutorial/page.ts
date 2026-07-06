import { m } from "@cyftec/maya";
import { HtmlPage } from "../@components";
import { CodeBlock } from "../@components/CodeBlock";

export default HtmlPage({
  title: "Tutorial",
  children: m.Main({
    class: "main",
    children: m.Article({
      class: "doc",
      children: [
        m.Header({
          class: "card deep mb2",
          children: [
            m.Div({ class: "eyebrow", children: "Tutorial" }),
            m.H1({ children: "Tutorial" }),
            m.P({
              children: "Learn the library step by step.",
            }),
          ],
        }),
        m.Section({
          children: [
            m.H2({ children: "1. Import" }),
            m.Pre({
              children: CodeBlock({
                blocks: [
                  ["kw", "import"],
                  ["str", " { signal, derive, effect } "],
                  ["kw", "from"],
                  ["str", ' "@cyftec/signal";'],
                ],
              }),
            }),
            m.P({ children: "Expected result:" }),
            m.Ul({
              children: [
                m.Li({ children: "the library imports cleanly" }),
                m.Li({
                  children: "the three primitives are available immediately",
                }),
              ],
            }),
          ],
        }),
        m.Section({
          children: [
            m.H2({ children: "2. Create State" }),
            m.Pre({
              children: CodeBlock({
                blocks: [
                  ["kw", "const "],
                  ["str", "count = "],
                  ["fn", "signal"],
                  ["str", "(0);\nconsole."],
                  ["fn", "log"],
                  ["str", "(count.value); // 0\ncount.value = 1;\nconsole."],
                  ["fn", "log"],
                  ["str", "(count.value); // 1"],
                ],
              }),
            }),
            m.P({ children: "What changed:" }),
            m.Ul({
              children: [
                m.Li({ children: "`signal()` stores mutable state" }),
                m.Li({
                  children: "`.value` reads and writes the current value",
                }),
              ],
            }),
          ],
        }),
        m.Section({
          children: [
            m.H2({ children: "3. Read From State" }),
            m.Pre({
              children: CodeBlock({
                blocks: [
                  ["kw", "const"],
                  ["str", " name = "],
                  ["fn", "signal"],
                  ["str", '("Ada");\nconsole.'],
                  ["fn", "log"],
                  ["str", "(`Hello, ${name.value}`); // Hello, Ada"],
                ],
              }),
            }),
            m.P({ children: "Expected result:" }),
            m.Ul({
              children: [
                m.Li({
                  children: "output reads the current signal value directly",
                }),
              ],
            }),
          ],
        }),
        m.Section({
          children: [
            m.H2({ children: "4. Derive State" }),
            m.Pre({
              children: CodeBlock({
                blocks: [
                  ["kw", "const"],
                  ["str", " count = "],
                  ["fn", "signal"],
                  ["str", "(2);\n"],
                  ["kw", "const"],
                  ["str", " doubled = "],
                  ["fn", "derive"],
                  ["str", "(() => count.value * 2);\nconsole."],
                  ["fn", "log"],
                  ["str", "(doubled.value); // 4"],
                ],
              }),
            }),
            m.P({ children: "What changed:" }),
            m.Ul({
              children: [
                m.Li({
                  children: "`derive()` computes new state from existing state",
                }),
                m.Li({
                  children: "the result stays in sync automatically",
                }),
              ],
            }),
          ],
        }),
        m.Section({
          children: [
            m.H2({ children: "5. React To Changes" }),
            m.Pre({
              children: CodeBlock({
                blocks: [
                  ["kw", "const"],
                  ["str", " count = "],
                  ["fn", "signal"],
                  ["str", "(0);\n\n"],
                  ["fn", "effect"],
                  ["str", "(() => {\n  console."],
                  ["fn", "log"],
                  ["str", "(count.value); // 0\n});\n\ncount.value = 1; // 1"],
                ],
              }),
            }),
            m.P({ children: "Expected result:" }),
            m.Ul({
              children: [
                m.Li({
                  children: "the effect runs once immediately",
                }),
                m.Li({ children: "it runs again after the update" }),
              ],
            }),
          ],
        }),
        m.Section({
          children: [
            m.H2({ children: "6. Combine Signals" }),
            m.Pre({
              children: CodeBlock({
                blocks: [
                  ["kw", "const"],
                  ["str", " first = "],
                  ["fn", "signal"],
                  ["str", '("Ada");\n'],
                  ["kw", "const"],
                  ["str", " last = "],
                  ["fn", "signal"],
                  ["str", '("Lovelace");\n'],
                  ["kw", "const"],
                  ["str", " fullName = "],
                  ["fn", "derive"],
                  ["str", "(() => `${first.value} ${last.value}`);\n\n"],
                  ["fn", "effect"],
                  ["str", "(() => {\n  console."],
                  ["fn", "log"],
                  ["str", "(fullName.value); // Ada Lovelace\n});"],
                ],
              }),
            }),
          ],
        }),
        m.Section({
          children: [
            m.H2({ children: "7. Pattern to Prefer" }),
            m.Ul({
              children: [
                m.Li({
                  children: "Use `signal()` for mutable source data",
                }),
                m.Li({
                  children: "Use `derive()` for computed values",
                }),
                m.Li({
                  children:
                    "Use `effect()` for logging, DOM updates, and integration points",
                }),
              ],
            }),
          ],
        }),
        m.Section({
          children: [
            m.H2({ children: "8. Mental Model" }),
            m.Div({
              class: "card diagram-block",
              children: m.Div({
                class: "diagram-svg",
                children: [
                  m.Div({
                    class: "card shallow diagram-node",
                    children: m.Span({ children: "source signal" }),
                  }),
                  m.Div({ class: "diagram-arrow", children: "→" }),
                  m.Div({
                    class: "card shallow diagram-node",
                    children: m.Span({ children: "derive()" }),
                  }),
                  m.Div({ class: "diagram-arrow", children: "→" }),
                  m.Div({
                    class: "card shallow diagram-node",
                    children: m.Span({ children: "effect()" }),
                  }),
                ],
              }),
            }),
            m.P({
              children:
                "Use this when you want the shortest path from state to UI.",
            }),
          ],
        }),
        m.Section({
          children: [
            m.H2({ children: "9. Equality Short-Circuit" }),
            m.Pre({
              children: CodeBlock({
                blocks: [
                  ["kw", "const"],
                  ["str", " count = "],
                  ["fn", "signal"],
                  ["str", "(1);\n\n"],
                  ["kw", "effect"],
                  ["str", "(() => {\n  console."],
                  ["fn", "log"],
                  [
                    "str",
                    "(count.value); // 1\n});\n\ncount.value = 1; // no log",
                  ],
                ],
              }),
            }),
            m.P({ children: "Expected result:" }),
            m.Ul({
              children: [
                m.Li({
                  children: "the effect does not re-run for the same value",
                }),
              ],
            }),
          ],
        }),
        m.Section({
          children: [
            m.H2({ children: "10. Dispose When Done" }),
            m.Pre({
              children: CodeBlock({
                blocks: [
                  ["kw", "const"],
                  ["str", " count = "],
                  ["fn", "signal"],
                  ["str", "(0);\n"],
                  ["kw", "const"],
                  ["str", " logger = "],
                  ["fn", "effect"],
                  ["str", "(() => {\n  console."],
                  ["fn", "log"],
                  ["str", "(count.value); // 0\n});\n\nlogger."],
                  ["fn", "dispose"],
                  ["str", "();\ncount.value = 1; // no log"],
                ],
              }),
            }),
            m.P({ children: "Expected result:" }),
            m.Ul({
              children: [
                m.Li({
                  children:
                    "the disposed effect does not run again after the next update cycle",
                }),
              ],
            }),
          ],
        }),
        m.Section({
          children: [
            m.H2({ children: "11. Arrays And Objects" }),
            m.Pre({
              children: CodeBlock({
                blocks: [
                  ["kw", "const"],
                  ["str", " items = "],
                  ["fn", "signal"],
                  ["str", "([1, 2, 3]);\nitems."],
                  ["fn", "push"],
                  ["str", "(4);\n\n"],
                  ["kw", "const"],
                  ["str", " user = "],
                  ["fn", "signal"],
                  ["str", '({ name: "Ada", age: 36 });\nuser.'],
                  ["fn", "set"],
                  ["str", "({ age: 37 });"],
                ],
              }),
            }),
            m.P({ children: "Expected result:" }),
            m.Ul({
              children: [
                m.Li({
                  children: "array helpers update the array signal",
                }),
                m.Li({
                  children: "object `set()` performs a shallow merge",
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  }),
});
