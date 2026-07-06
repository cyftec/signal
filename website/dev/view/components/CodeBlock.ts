import { component, m, MHtmlElement } from "@cyftec/maya";
import { signal } from "@cyftec/maya/signal";
import { CodeToken } from "../../models";

type CodeblockProps = {
  noCopy?: boolean;
  tokens: CodeToken[];
};

export const CodeBlock = component<CodeblockProps>(({ noCopy, tokens }) => {
  const buttonLabel = signal("Copy");
  let codeBlock: MHtmlElement | null = null;

  const copyCode = async () => {
    if (!codeBlock) return;
    await (navigator as any).clipboard.writeText(codeBlock.textContent ?? "");
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
          onmount: (el: MHtmlElement) => (codeBlock = el),
          "data-lang": "ts",
          children: m.For({
            subject: tokens,
            map: ([type, code]) =>
              m.Span({ class: `tok ${type}`, children: code }),
          }),
        }),
      }),
    ],
  });
});
