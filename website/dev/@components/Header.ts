import { m } from "@cyftec/maya";

export const Header = () =>
  m.Nav({
    class: "header",
    children: [
      m.A({
        class: "header-brand",
        href: "/",
        children: [
          m.Img({
            src: "/assets/images/signal-logo.svg",
            alt: "Cyftec Signal Logo",
          }),
          m.Span({ children: "Signal" }),
        ],
      }),
      m.Div({
        class: "header-links",
        children: [
          m.A({ href: "/api-docs/", children: "API Docs" }),
          m.A({ href: "/tutorial/", children: "Tutorial" }),
          m.A({ href: "/architecture/", children: "Architecture" }),
        ],
      }),
    ],
  });
