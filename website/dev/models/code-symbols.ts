export type TSDocTag = {
  name: string;
  description: string;
};

export type TSDoc = {
  title: string;
  summary: string;
  remarks: string[];
  examples: string[];
  params: TSDocTag[];
  returns: string[];
  see: string[];
  template: TSDocTag[];
  deprecated: string[];
};

export type ExportSymbol = {
  name: string;
  kind: "const" | "type";
  filePath: string;
  sourcePath: string;
  isExported: boolean;
  exportKind: "named" | "default" | "reexport";
  category: "core" | "api";
  subcategory?: string;
  signature?: string;
  type?: string;
  parameters?: Array<{ name: string; type: string; optional: boolean }>;
  typeParameters?: string[];
  tsdoc: TSDoc;
};

export type ApiMeta = {
  type: {
    core: {
      description: string;
      symbols: ExportSymbol[];
    };
    api: {
      description: string;
      symbols: ExportSymbol[];
    };
  };
  const: {
    core: {
      description: string;
      symbols: ExportSymbol[];
    };
    api: {
      description: string;
      symbols: ExportSymbol[];
    };
  };
};
