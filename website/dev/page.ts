import { m } from "@cyftec/maya";
import { HtmlPage } from "./@components/index.js";

export default HtmlPage({
  children: m.Main({
    class: "landing",
    children: [
      m.Section({
        class: "showcase",
        children: [
          m.Div({
            class: "showcase-copy",
            children: [
              m.Div({ class: "eyebrow", children: "Cyftech Signal" }),
              m.H1({
                children: "Signals you can read in the code and see in the UI.",
              }),
              m.P({
                children:
                  "A source signal owns the state. An effect observes that state. When the value changes, the UI follows synchronously.",
              }),
              m.Div({
                class: "showcase-code",
                children: m.Pre({
                  children: m.Code({
                    children: `import { signal, effect } from "@cyftech/signal";

type LightState = "red" | "amber" | "green";

const light = signal<LightState>("red");
const order: LightState[] = ["red", "amber", "green"];

effect(() => {
  trafficLight.dataset.state = light.value;
});

setInterval(() => {
  const current = order.indexOf(light.value);
  light.value = order[(current + 1) % order.length];
}, 1200);`,
                  }),
                }),
              }),
            ],
          }),
          m.Div({
            class: "showcase-demo",
            children: m.Div({
              class: "traffic-scene",
              children: [
                m.Div({
                  class: "traffic-controller",
                  children: [
                    m.Span({ children: "signal value" }),
                    m.Strong({
                      class: "state-word",
                    }),
                  ],
                }),
                m.Div({
                  class: "traffic-light",
                  children: [
                    m.Div({ class: "lamp lamp-red" }),
                    m.Div({ class: "lamp lamp-amber" }),
                    m.Div({ class: "lamp lamp-green" }),
                  ],
                }),
                m.Div({
                  class: "traffic-timeline",
                  children: [
                    m.Span({ children: "red" }),
                    m.Span({ children: "amber" }),
                    m.Span({ children: "green" }),
                  ],
                }),
              ],
            }),
          }),
        ],
      }),
      m.Section({
        class: "landing-grid",
        children: [
          m.A({
            class: "landing-card",
            href: "/api-docs/",
            children: [
              m.Span({ children: "api-docs" }),
              m.Small({
                children:
                  "Generated API reference driven by TSDoc and validated markdown.",
              }),
            ],
          }),
          m.A({
            class: "landing-card",
            href: "/tutorial/",
            children: [
              m.Span({ children: "tutorial" }),
              m.Small({
                children:
                  "Learning-first guide with examples, outcomes, and progressive steps.",
              }),
            ],
          }),
          m.A({
            class: "landing-card",
            href: "/architecture/",
            children: [
              m.Span({ children: "architecture" }),
              m.Small({
                children:
                  "Contributor-focused diagrams and implementation notes.",
              }),
            ],
          }),
        ],
      }),
    ],
  }),
});
