import { newVal } from "@cyftec/immut";
import { component, m, MHtmlElement } from "@cyftec/maya";
import { derive, effect, receive, signal } from "@cyftec/maya/signal";
import { CodeEntitiesMeta } from "../../../../models";
import { EntitiesList } from "./EntitiesList";
import { getIsMobileSignal } from "../../../../controller";

export type EntitiesNavigatorProps = {
  meta: CodeEntitiesMeta;
  selectedEntityName: string;
  onEntitySelect: (codeEntityName: string) => void;
};

export const EntitiesNavigator = component<EntitiesNavigatorProps>(
  ({ meta, selectedEntityName, onEntitySelect }) => {
    let searchBox: MHtmlElement<HTMLInputElement>;
    const isMobile = signal(false);
    const searchInput = signal("");
    const newExpandedState = derive<boolean>((prevState) => {
      const mobileView = isMobile.value;
      const searching = !!searchInput.value;
      return searching ? true : mobileView ? false : !prevState;
    });

    effect(() => console.log(isMobile.value ? "mobile" : "desktop"));
    effect(() => console.log("EXPANDED: ", newExpandedState.value));

    const filteredEntitiesMeta = derive(() => {
      const searchedText = searchInput.value;
      const filteredMeta = newVal(meta.value);
      filteredMeta.const.core = meta.value.const.core.filter((en) =>
        en.name.toLowerCase().includes(searchedText.toLowerCase()),
      );
      filteredMeta.const.api = meta.value.const.api.filter((en) =>
        en.name.toLowerCase().includes(searchedText.toLowerCase()),
      );
      filteredMeta.type.core = meta.value.type.core.filter((en) =>
        en.name.toLowerCase().includes(searchedText.toLowerCase()),
      );
      filteredMeta.type.api = meta.value.type.api.filter((en) =>
        en.name.toLowerCase().includes(searchedText.toLowerCase()),
      );

      return filteredMeta;
    });

    const onSearchInput = (e: Event) => {
      searchInput.value = (e.target as HTMLInputElement).value || "";
    };

    const onEntityTap = (codeEntityName: string) => {
      onEntitySelect(codeEntityName);
      if (searchBox) searchBox.value = "";
      searchInput.value = "_";
      searchInput.value = "";
    };

    const onMount = () => {
      receive(isMobile, getIsMobileSignal());
    };

    return m.Nav({
      onmount: onMount,
      children: [
        m.Label({
          class: "search",
          children: [
            m.Span({ children: "Search" }),
            m.Input({
              id: "search",
              type: "search",
              placeholder: "Filter code entities",
              onmount: (el: any) => (searchBox = el),
              oninput: onSearchInput,
            }),
          ],
        }),
        EntitiesList({
          expanded: newExpandedState,
          selectedEntityName: selectedEntityName,
          onEntitySelect: onEntityTap,
          filteredEntitiesMeta: filteredEntitiesMeta,
        }),
      ],
    });
  },
);
