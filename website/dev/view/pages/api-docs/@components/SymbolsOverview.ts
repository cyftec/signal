import { component, m } from "@cyftec/maya";
import { HeaderCard } from "./HeaderCard";

type SymbolsOverviewProps = {
  symbolsDetails: {
    type: string;
    label: string;
  }[];
};

export const SymbolsOverview = component<SymbolsOverviewProps>(
  ({ symbolsDetails }) => {
    return m.Article({
      class: "doc",
      children: [
        HeaderCard({
          eyebrow: "Reference",
          title: "API Docs",
          description:
            "Complete reference generated from the source tree and validated markdown.",
          children: m.If({
            subject: symbolsDetails,
            isTruthy: () =>
              m.Div({
                class: "stats",
                children: m.For({
                  subject: symbolsDetails,
                  map: (symbol) =>
                    m.Div({
                      children: [
                        m.Strong({ children: symbol.label }),
                        m.Span({ children: `${symbol.type} symbols` }),
                      ],
                    }),
                }),
              }),
          }),
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
    });
  },
);
