import { Child, component, m } from "@cyftec/maya";
import { signal } from "@cyftec/maya/signal";

type CodeblockProps = {
  noCopy?: boolean;
  blocks: [type: "kw" | "fn" | "str", code: string][];
  blockz?: { code: string; type: "kw" | "fn" | "str" }[];
};

export const CodeBlock = component<CodeblockProps>(
  ({ noCopy, blocks, blockz }) => {
    const buttonLabel = signal("Copy");
    let codeBlock: HTMLElement;

    const copyCode = async () => {
      if (!codeBlock) return;
      await navigator.clipboard.writeText(codeBlock.textContent);
      buttonLabel.value = "Copied";
      setTimeout(() => (buttonLabel.value = "Copy"), 1200);
    };

    return m.Div({
      class: "card code-block",
      children: [
        m.If({
          subject: noCopy,
          isFalsy: () =>
            m.Button({
              type: "button",
              class: "copy-button",
              children: buttonLabel,
              onclick: copyCode,
            }),
        }),
        m.Pre({
          children: m.Code({
            onmount: (el: HTMLElement) => {
              codeBlock = el;
            },
            "data-lang": "ts",
            children: m.For({
              subject: blocks,
              map: ([type, code]) =>
                m.Switch({
                  subject: type,
                  cases: {
                    kw: () => m.Span({ class: "tok kw", children: code }),
                    fn: () => m.Span({ class: "tok fn", children: code }),
                    str: () => m.Span({ class: "tok str", children: code }),
                  },
                }),
            }),
          }),
        }),
      ],
    });
  },
);
