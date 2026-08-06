import { getPlainMethodParams, value } from "../../utils";
import { type BaseSignal, derive, MaybeSignalValues } from "../signals";
import {
  StringCustomNonMutatingMethods,
  StringIntrinsicNonMutatingMethods,
  StringMutatingAndNonMutatingMethods,
  StringMutatingMethods,
  StringNonMutatingMethods,
  StringReplaceParameters,
  StringSplitParameters,
} from "./types";

const _deepTrim = (value: string) => value.trim().replace(/\s+/g, " ");

export const getStringSignalMutatingMethods = (
  baseStringSignal: BaseSignal<string>,
): StringMutatingMethods => {
  return {
    concat: function (
      ...args: MaybeSignalValues<Parameters<String["concat"]>>
    ): void {
      baseStringSignal.mutateWith((oldValue) =>
        oldValue.concat(...getPlainMethodParams(...args)),
      );
    },
    deepTrim: function (): void {
      baseStringSignal.mutateWith((oldValue) => _deepTrim(oldValue));
    },
    padEnd: function (
      ...args: MaybeSignalValues<Parameters<String["padEnd"]>>
    ): void {
      baseStringSignal.mutateWith((oldValue) =>
        oldValue.padEnd(...getPlainMethodParams(...args)),
      );
    },
    padStart: function (
      ...args: MaybeSignalValues<Parameters<String["padStart"]>>
    ): void {
      baseStringSignal.mutateWith((oldValue) =>
        oldValue.padStart(...getPlainMethodParams(...args)),
      );
    },
    repeat: function (
      ...args: MaybeSignalValues<Parameters<String["repeat"]>>
    ): void {
      baseStringSignal.mutateWith((oldValue) =>
        oldValue.repeat(...getPlainMethodParams(...args)),
      );
    },
    replace: function (
      ...args: MaybeSignalValues<StringReplaceParameters>
    ): void {
      baseStringSignal.mutateWith((oldValue) => {
        const [searchValue, replaceValue] = getPlainMethodParams(...args);
        return oldValue.replace(searchValue as any, replaceValue as any);
      });
    },
    replaceAll: function (
      ...args: MaybeSignalValues<StringReplaceParameters>
    ): void {
      baseStringSignal.mutateWith((oldValue) => {
        const [searchValue, replaceValue] = getPlainMethodParams(...args);
        return oldValue.replaceAll(searchValue as any, replaceValue as any);
      });
    },
    slice: function (
      ...args: MaybeSignalValues<Parameters<String["slice"]>>
    ): void {
      baseStringSignal.mutateWith((oldValue) =>
        oldValue.slice(...getPlainMethodParams(...args)),
      );
    },
    substring: function (
      ...args: MaybeSignalValues<Parameters<String["substring"]>>
    ): void {
      baseStringSignal.mutateWith((oldValue) =>
        oldValue.substring(...getPlainMethodParams(...args)),
      );
    },
    trim: function (
      ...args: MaybeSignalValues<Parameters<String["trim"]>>
    ): void {
      baseStringSignal.mutateWith((oldValue) =>
        oldValue.trim(...getPlainMethodParams(...args)),
      );
    },
    trimEnd: function (
      ...args: MaybeSignalValues<Parameters<String["trimEnd"]>>
    ): void {
      baseStringSignal.mutateWith((oldValue) =>
        oldValue.trimEnd(...getPlainMethodParams(...args)),
      );
    },
    trimStart: function (
      ...args: MaybeSignalValues<Parameters<String["trimStart"]>>
    ): void {
      baseStringSignal.mutateWith((oldValue) =>
        oldValue.trimStart(...getPlainMethodParams(...args)),
      );
    },
    toLocaleLowerCase: function (
      ...args: MaybeSignalValues<Parameters<String["toLocaleLowerCase"]>>
    ): void {
      baseStringSignal.mutateWith((oldValue) =>
        oldValue.toLocaleLowerCase(...getPlainMethodParams(...args)),
      );
    },
    toLocaleUpperCase: function (
      ...args: MaybeSignalValues<Parameters<String["toLocaleUpperCase"]>>
    ): void {
      baseStringSignal.mutateWith((oldValue) =>
        oldValue.toLocaleUpperCase(...getPlainMethodParams(...args)),
      );
    },
    toLowerCase: function (
      ...args: MaybeSignalValues<Parameters<String["toLowerCase"]>>
    ): void {
      baseStringSignal.mutateWith((oldValue) =>
        oldValue.toLowerCase(...getPlainMethodParams(...args)),
      );
    },
    toUpperCase: function (
      ...args: MaybeSignalValues<Parameters<String["toUpperCase"]>>
    ): void {
      baseStringSignal.mutateWith((oldValue) =>
        oldValue.toUpperCase(...getPlainMethodParams(...args)),
      );
    },
  };
};

/**
 * Creates intrinsic non-mutating methods for string signals.
 *
 * These methods mirror JavaScript String non-mutating methods but return
 * derived signals instead of plain values.
 *
 * @param baseStringSignal - The base string signal to access values from
 * @returns Intrinsic non-mutating methods for string signals
 *
 * @remarks
 * - All methods return derived signals
 * - Methods are reactive and update when the source string changes
 * - Works with both source and derived signals
 * - Methods are lazy - derived signals are only created when accessed
 */
export const getStringIntrinsicNonMutatingMethods = (
  baseStringSignal: BaseSignal<string>,
): StringIntrinsicNonMutatingMethods => {
  return {
    at: (...args: MaybeSignalValues<Parameters<String["at"]>>) =>
      derive(() => baseStringSignal.value.at(...getPlainMethodParams(...args))),
    charAt: (...args: MaybeSignalValues<Parameters<String["charAt"]>>) =>
      derive(() =>
        baseStringSignal.value.charAt(...getPlainMethodParams(...args)),
      ),
    charCodeAt: (
      ...args: MaybeSignalValues<Parameters<String["charCodeAt"]>>
    ) =>
      derive(() =>
        baseStringSignal.value.charCodeAt(...getPlainMethodParams(...args)),
      ),
    codePointAt: (
      ...args: MaybeSignalValues<Parameters<String["codePointAt"]>>
    ) =>
      derive(() =>
        baseStringSignal.value.codePointAt(...getPlainMethodParams(...args)),
      ),
    concat: (...args: MaybeSignalValues<Parameters<String["concat"]>>) =>
      derive(() =>
        baseStringSignal.value.concat(...getPlainMethodParams(...args)),
      ) as any,
    endsWith: (...args: MaybeSignalValues<Parameters<String["endsWith"]>>) =>
      derive(() =>
        baseStringSignal.value.endsWith(...getPlainMethodParams(...args)),
      ),
    includes: (...args: MaybeSignalValues<Parameters<String["includes"]>>) =>
      derive(() =>
        baseStringSignal.value.includes(...getPlainMethodParams(...args)),
      ),
    indexOf: (...args: MaybeSignalValues<Parameters<String["indexOf"]>>) =>
      derive(() =>
        baseStringSignal.value.indexOf(...getPlainMethodParams(...args)),
      ),
    lastIndexOf: (
      ...args: MaybeSignalValues<Parameters<String["lastIndexOf"]>>
    ) =>
      derive(() =>
        baseStringSignal.value.lastIndexOf(...getPlainMethodParams(...args)),
      ),
    padEnd: (...args: MaybeSignalValues<Parameters<String["padEnd"]>>) =>
      derive(() =>
        baseStringSignal.value.padEnd(...getPlainMethodParams(...args)),
      ),
    padStart: (...args: MaybeSignalValues<Parameters<String["padStart"]>>) =>
      derive(() =>
        baseStringSignal.value.padStart(...getPlainMethodParams(...args)),
      ),
    repeat: (...args: MaybeSignalValues<Parameters<String["repeat"]>>) =>
      derive(() =>
        baseStringSignal.value.repeat(...getPlainMethodParams(...args)),
      ) as any,
    slice: (...args: MaybeSignalValues<Parameters<String["slice"]>>) =>
      derive(() =>
        baseStringSignal.value.slice(...getPlainMethodParams(...args)),
      ),
    startsWith: (
      ...args: MaybeSignalValues<Parameters<String["startsWith"]>>
    ) =>
      derive(() =>
        baseStringSignal.value.startsWith(...getPlainMethodParams(...args)),
      ),
    substring: (...args: MaybeSignalValues<Parameters<String["substring"]>>) =>
      derive(() =>
        baseStringSignal.value.substring(...getPlainMethodParams(...args)),
      ),
    trim: (...args: MaybeSignalValues<Parameters<String["trim"]>>) =>
      derive(() =>
        baseStringSignal.value.trim(...getPlainMethodParams(...args)),
      ),
    trimEnd: (...args: MaybeSignalValues<Parameters<String["trimEnd"]>>) =>
      derive(() =>
        baseStringSignal.value.trimEnd(...getPlainMethodParams(...args)),
      ),
    trimStart: (...args: MaybeSignalValues<Parameters<String["trimStart"]>>) =>
      derive(() =>
        baseStringSignal.value.trimStart(...getPlainMethodParams(...args)),
      ),
    length: () => derive(() => baseStringSignal.value.length),
    localeCompare: (
      ...args: MaybeSignalValues<Parameters<String["localeCompare"]>>
    ) =>
      derive(() =>
        baseStringSignal.value.localeCompare(...getPlainMethodParams(...args)),
      ),
    normalize: (...args: MaybeSignalValues<Parameters<String["normalize"]>>) =>
      derive(() =>
        baseStringSignal.value.normalize(
          value(...getPlainMethodParams(...args)),
        ),
      ),
    replace: (...args: MaybeSignalValues<StringReplaceParameters>) =>
      derive(() => {
        const [searchValue, replaceValue] = getPlainMethodParams(...args);
        return baseStringSignal.value.replace(
          searchValue as any,
          replaceValue as any,
        );
      }),
    replaceAll: (...args: MaybeSignalValues<StringReplaceParameters>) =>
      derive(() => {
        const [searchValue, replaceValue] = getPlainMethodParams(...args);
        return baseStringSignal.value.replaceAll(
          searchValue as any,
          replaceValue as any,
        );
      }),
    search: (...args: MaybeSignalValues<Parameters<String["search"]>>) =>
      derive(() =>
        baseStringSignal.value.search(...getPlainMethodParams(...args)),
      ),
    split: (...args: MaybeSignalValues<StringSplitParameters>) =>
      derive(() => {
        const [separator, limit] = getPlainMethodParams(...args);
        return baseStringSignal.value.split(separator as any, limit);
      }),
    toLocaleLowerCase: (
      ...args: MaybeSignalValues<Parameters<String["toLocaleLowerCase"]>>
    ) =>
      derive(() =>
        baseStringSignal.value.toLocaleLowerCase(
          ...getPlainMethodParams(...args),
        ),
      ),
    toLocaleUpperCase: (
      ...args: MaybeSignalValues<Parameters<String["toLocaleUpperCase"]>>
    ) =>
      derive(() =>
        baseStringSignal.value.toLocaleUpperCase(
          ...getPlainMethodParams(...args),
        ),
      ),
    toLowerCase: (
      ...args: MaybeSignalValues<Parameters<String["toLowerCase"]>>
    ) => {
      return derive(() =>
        baseStringSignal.value.toLowerCase(...getPlainMethodParams(...args)),
      );
    },
    toUpperCase: (
      ...args: MaybeSignalValues<Parameters<String["toUpperCase"]>>
    ) => {
      return derive(() =>
        baseStringSignal.value.toUpperCase(...getPlainMethodParams(...args)),
      );
    },
  };
};

/**
 * Creates custom non-mutating methods for string signals.
 *
 * These are library-specific methods that provide additional functionality
 * beyond JavaScript's intrinsic string methods.
 *
 * @param baseStringSignal - The base string signal to access values from
 * @returns Custom non-mutating methods for string signals
 *
 * @remarks
 * - `lowercase` returns a derived signal for the lowercase version
 * - `Sentencecase` returns a derived signal with first letter capitalized
 * - `TitleCase` returns a derived signal with each word capitalized
 * - `UPPERCASE` returns a derived signal for the uppercase version
 * - Methods are lazy - derived signals are only created when accessed
 */
export const getStringCustomNonMutatingMethods = (
  baseStringSignal: BaseSignal<string>,
): StringCustomNonMutatingMethods => {
  return {
    deepTrim: () => {
      return derive(() => _deepTrim(baseStringSignal.value));
    },
  };
};

/**
 * Creates combined non-mutating methods for string signals.
 *
 * Combines intrinsic, custom, and logical non-mutating methods into a single object.
 *
 * @param baseStringSignal - The base string signal to access values from
 * @returns Combined non-mutating methods for string signals
 *
 * @remarks
 * - All methods return derived signals
 * - Works with both source and derived signals
 * - Methods are reactive and update when the source string changes
 * - Methods are lazy - derived signals are only created when accessed
 */
export const getStringSignalNonMutatingMethods = (
  baseStringSignal: BaseSignal<string>,
): StringNonMutatingMethods => ({
  ...getStringIntrinsicNonMutatingMethods(baseStringSignal),
  ...getStringCustomNonMutatingMethods(baseStringSignal),
});
export const getStringSignalMethods = (
  baseStringSignal: BaseSignal<string>,
): StringMutatingAndNonMutatingMethods => ({
  mutate: { ...getStringSignalMutatingMethods(baseStringSignal) },
  ...getStringSignalNonMutatingMethods(baseStringSignal),
});
