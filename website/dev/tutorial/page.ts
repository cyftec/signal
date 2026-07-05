import { m } from "@cyftec/maya";
import { HtmlPage } from "../@components";

export default HtmlPage({
  title: "Tutorial",
  children: m.Main({
    class: "main",
    children: m.Article({
      class: "doc",
      children: [
        m.Header({
          class: "hero",
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
            m.H2({ children: "1. Install" }),
            m.Pre({
              children: m.Code({
                children: `import { signal, derive, effect } from "@cyftech/signal";`,
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
              children: m.Code({
                children: `const count = signal(0);
console.log(count.value); // 0
count.value = 1;
console.log(count.value); // 1`,
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
              children: m.Code({
                children: `const name = signal("Ada");
console.log(\`Hello, \${name.value}\`);`,
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
              children: m.Code({
                children: `const count = signal(2);
const doubled = derive(() => count.value * 2);
console.log(doubled.value); // 4`,
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
              children: m.Code({
                children: `const count = signal(0);
effect(() => {
  console.log("count:", count.value);
});
count.value = 1;`,
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
              children: m.Code({
                children: `const first = signal("Ada");
const last = signal("Lovelace");
const fullName = derive(() => \`\${first.value} \${last.value}\`);
effect(() => {
  console.log(fullName.value);
});`,
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
              class: "diagram-block",
              children: m.Div({
                class: "diagram-svg",
                children: [
                  m.Div({
                    class: "diagram-node",
                    children: m.Span({ children: "source signal" }),
                  }),
                  m.Div({ class: "diagram-arrow", children: "→" }),
                  m.Div({
                    class: "diagram-node",
                    children: m.Span({ children: "derive()" }),
                  }),
                  m.Div({ class: "diagram-arrow", children: "→" }),
                  m.Div({
                    class: "diagram-node",
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
              children: m.Code({
                children: `const count = signal(1);
effect(() => {
  console.log(count.value);
});
count.value = 1;`,
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
              children: m.Code({
                children: `const count = signal(0);
const logger = effect(() => {
  console.log(count.value);
});

logger.dispose();
count.value = 1;`,
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
              children: m.Code({
                children: `const items = signal([1, 2, 3]);
items.push(4);

const user = signal({ name: "Ada", age: 36 });
user.set({ age: 37 });`,
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
