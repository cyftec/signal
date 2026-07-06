import { m } from "@cyftec/maya";
import { HtmlPage } from "../@components";

export default HtmlPage({
  title: "Architecture",
  children: m.Main({
    class: "main",
    children: m.Article({
      class: "doc",
      children: [
        m.Header({
          class: "card deep mb2",
          children: [
            m.Div({ class: "eyebrow", children: "Architecture" }),
            m.H1({ children: "Architecture" }),
            m.P({
              children: "Understand the internal architecture visually.",
            }),
          ],
        }),
        m.Section({
          children: [
            m.H2({ children: "1. Core Runtime" }),
            m.Div({
              class: "card diagram-block",
              children: m.Div({
                class: "diagram-svg",
                children: [
                  m.Div({
                    class: "card shallow diagram-node",
                    children: m.Span({ children: "signal(input)" }),
                  }),
                  m.Div({ class: "diagram-arrow", children: "→" }),
                  m.Div({
                    class: "card shallow diagram-node",
                    children: m.Span({ children: "immutable value storage" }),
                  }),
                  m.Div({ class: "diagram-arrow", children: "→" }),
                  m.Div({
                    class: "card shallow diagram-node",
                    children: m.Span({ children: "value getter" }),
                  }),
                  m.Div({ class: "diagram-arrow", children: "→" }),
                  m.Div({
                    class: "card shallow diagram-node",
                    children: m.Span({ children: "register current effect" }),
                  }),
                  m.Div({ class: "diagram-arrow", children: "→" }),
                  m.Div({
                    class: "card shallow diagram-node",
                    children: m.Span({ children: "value setter / mutation" }),
                  }),
                  m.Div({ class: "diagram-arrow", children: "→" }),
                  m.Div({
                    class: "card shallow diagram-node",
                    children: m.Span({
                      children: "run dependent effects synchronously",
                    }),
                  }),
                ],
              }),
            }),
            m.P({
              children: "The core runtime is small on purpose:",
            }),
            m.Ul({
              children: [
                m.Li({ children: "`signal()` creates mutable source state" }),
                m.Li({
                  children:
                    "reading `.value` adds the current effect to the signal",
                }),
                m.Li({
                  children:
                    "writing `.value` or mutating arrays/objects triggers dependent effects immediately",
                }),
              ],
            }),
          ],
        }),
        m.Section({
          children: [
            m.H2({ children: "2. Dependency Tracking" }),
            m.Div({
              class: "card diagram-block",
              children: m.Div({
                class: "diagram-svg",
                children: [
                  m.Div({
                    class: "card shallow diagram-node",
                    children: m.Span({ children: "effect(fn)" }),
                  }),
                  m.Div({ class: "diagram-arrow", children: "→" }),
                  m.Div({
                    class: "card shallow diagram-node",
                    children: m.Span({ children: "_currentSignalEffect" }),
                  }),
                  m.Div({ class: "diagram-arrow", children: "→" }),
                  m.Div({
                    class: "card shallow diagram-node",
                    children: m.Span({ children: "signal.value getter" }),
                  }),
                  m.Div({ class: "diagram-arrow", children: "→" }),
                  m.Div({
                    class: "card shallow diagram-node",
                    children: m.Span({ children: "signal._effects" }),
                  }),
                ],
              }),
            }),
            m.P({
              children: "Tracking is global and temporary:",
            }),
            m.Ul({
              children: [
                m.Li({
                  children:
                    "`effect()` sets a module-level current effect before executing the callback",
                }),
                m.Li({
                  children:
                    "each signal getter registers that effect in the signal's local `_effects` set",
                }),
                m.Li({
                  children:
                    "when execution ends, the current effect is cleared",
                }),
              ],
            }),
          ],
        }),
        m.Section({
          children: [
            m.H2({ children: "3. Derived Signal Model" }),
            m.Div({
              class: "card diagram-block",
              children: m.Div({
                class: "diagram-svg",
                children: [
                  m.Div({
                    class: "card shallow diagram-node",
                    children: m.Span({ children: "derive(fn)" }),
                  }),
                  m.Div({ class: "diagram-arrow", children: "→" }),
                  m.Div({
                    class: "card shallow diagram-node",
                    children: m.Span({
                      children: "internal derived source signal",
                    }),
                  }),
                  m.Div({ class: "diagram-arrow", children: "→" }),
                  m.Div({
                    class: "card shallow diagram-node",
                    children: m.Span({ children: "internal updater effect" }),
                  }),
                  m.Div({ class: "diagram-arrow", children: "→" }),
                  m.Div({
                    class: "card shallow diagram-node",
                    children: m.Span({ children: "computed value" }),
                  }),
                  m.Div({ class: "diagram-arrow", children: "→" }),
                  m.Div({
                    class: "card shallow diagram-node",
                    children: m.Span({
                      children: "internal derived source signal",
                    }),
                  }),
                ],
              }),
            }),
            m.P({
              children: "Derived signals are not a separate storage engine:",
            }),
            m.Ul({
              children: [
                m.Li({
                  children:
                    "they are implemented using an internal source signal",
                }),
                m.Li({ children: "an internal effect recomputes the value" }),
                m.Li({
                  children:
                    "the public derived signal exposes read-only `.value`, `prevValue`, and `dispose()`",
                }),
              ],
            }),
          ],
        }),
        m.Section({
          children: [
            m.H2({ children: "4. Disposal" }),
            m.Div({
              class: "card diagram-block",
              children: m.Div({
                class: "diagram-svg",
                children: [
                  m.Div({
                    class: "card shallow diagram-node",
                    children: m.Span({ children: "dispose() called" }),
                  }),
                  m.Div({ class: "diagram-arrow", children: "→" }),
                  m.Div({
                    class: "card shallow diagram-node",
                    children: m.Span({ children: "canDisposeNow = true" }),
                  }),
                  m.Div({ class: "diagram-arrow", children: "→" }),
                  m.Div({
                    class: "card shallow diagram-node",
                    children: m.Span({
                      children: "cleanup on next signal update",
                    }),
                  }),
                  m.Div({ class: "diagram-arrow", children: "→" }),
                  m.Div({
                    class: "card shallow diagram-node",
                    children: m.Span({
                      children: "removed from signal._effects",
                    }),
                  }),
                ],
              }),
            }),
            m.P({
              children: "Disposal is intentionally lazy:",
            }),
            m.Ul({
              children: [
                m.Li({ children: "calling `dispose()` marks the effect" }),
                m.Li({
                  children: "the effect is removed on the next update cycle",
                }),
                m.Li({
                  children:
                    "this keeps disposal simple and synchronous with the rest of the runtime",
                }),
              ],
            }),
          ],
        }),
        m.Section({
          children: [
            m.H2({ children: "5. Data Flow" }),
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
                    children: m.Span({ children: "derived signal" }),
                  }),
                  m.Div({ class: "diagram-arrow", children: "→" }),
                  m.Div({
                    class: "card shallow diagram-node",
                    children: m.Span({ children: "effect" }),
                  }),
                  m.Div({ class: "diagram-arrow", children: "→" }),
                  m.Div({
                    class: "card shallow diagram-node",
                    children: m.Span({ children: "side effects" }),
                  }),
                ],
              }),
            }),
            m.P({
              children: "The actual data flow is:",
            }),
            m.Ul({
              children: [
                m.Li({ children: "a source signal stores state" }),
                m.Li({
                  children:
                    "derived signals read source signals and recompute immediately",
                }),
                m.Li({
                  children: "effects observe signals by reading `.value`",
                }),
                m.Li({
                  children:
                    "updates propagate synchronously through the dependency set",
                }),
              ],
            }),
          ],
        }),
        m.Section({
          children: [
            m.H2({ children: "6. Internal State" }),
            m.Ul({
              children: [
                m.Li({
                  children: "Source signals store `_value` and `_effects`",
                }),
                m.Li({
                  children: "The Effects store `canDisposeNow` and `dispose()`",
                }),
                m.Li({
                  children:
                    "Derived signals store an internal source signal plus an updater effect",
                }),
                m.Li({
                  children:
                    "Array and object signals add shape-specific helpers on top of the same source signal core",
                }),
              ],
            }),
          ],
        }),
        m.Section({
          children: [
            m.H2({ children: "7. Why This Design" }),
            m.Ul({
              children: [
                m.Li({
                  children: "It keeps the runtime small and explicit",
                }),
                m.Li({
                  children: "It avoids hidden batching or deferred execution",
                }),
                m.Li({
                  children:
                    "It matches the repository's semantics and behavioral tests exactly",
                }),
                m.Li({
                  children:
                    "It makes the signal graph easy to reason about because every dependency comes from an actual getter read",
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  }),
});
