import { m, component } from "@cyftec/maya";
import { signal, tmpl } from "@cyftec/maya/signal";

type TabsType = {
  tabs: string[];
  selected: number;
  onSelect: (index: number) => void;
};

export const Tabs = component<TabsType>(({ tabs, selected, onSelect }) => {
  return m.Div({
    class: "tabs",
    children: m.For({
      subject: tabs,
      map: (tab, index) =>
        m.Button({
          type: "button",
          class: tmpl`tab ${() => (selected.value === index ? "active-tab" : "inactive-tab")}`,
          onclick: () => {
            console.log(`Tab clicked: ${tab} (index: ${index})`);
            onSelect(index);
          },
          children: tab,
        }),
    }),
  });
});
