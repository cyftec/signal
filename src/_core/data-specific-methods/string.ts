import { getPlainMethodParams, value } from "../../utils";
import {
  type BaseSignal,
  derive,
  MaybeSignal,
  MaybeSignalValues,
} from "../signals";
import {
  StringCustomNonMutatingMethods,
  StringIntrinsicNonMutatingMethods,
  StringNonMutatingMethods,
} from "./types";

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
      that: MaybeSignal<string>,
      locales?: MaybeSignal<string | string[] | undefined>,
      options?: MaybeSignal<Intl.CollatorOptions>,
    ) =>
      derive(() =>
        baseStringSignal.value.localeCompare(
          value(that),
          value(locales),
          value(options),
        ),
      ),
    normalize: (form: MaybeSignal<"NFC" | "NFD" | "NFKC" | "NFKD">) =>
      derive(() => baseStringSignal.value.normalize(value(form))),
    replace: (
      searchValue: MaybeSignal<string | RegExp>,
      replaceValue: MaybeSignal<string>,
    ) =>
      derive(() =>
        baseStringSignal.value.replace(value(searchValue), value(replaceValue)),
      ),
    replaceAll: (
      searchValue: MaybeSignal<string | RegExp>,
      replaceValue: MaybeSignal<string>,
    ) =>
      derive(() =>
        baseStringSignal.value.replaceAll(
          value(searchValue),
          value(replaceValue),
        ),
      ),
    search: (regexp: MaybeSignal<RegExp>) =>
      derive(() => baseStringSignal.value.search(value(regexp))),
    split: (
      separator: MaybeSignal<string | RegExp>,
      limit?: MaybeSignal<number | undefined>,
    ) =>
      derive(() =>
        baseStringSignal.value.split(value(separator), value(limit)),
      ),
    toLocaleLowerCase: (locales?: MaybeSignal<string | string[] | undefined>) =>
      derive(() => baseStringSignal.value.toLocaleLowerCase(value(locales))),
    toLocaleUpperCase: (locales?: MaybeSignal<string | string[] | undefined>) =>
      derive(() => baseStringSignal.value.toLocaleUpperCase(value(locales))),
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
    lowercase: () => {
      return derive(() => baseStringSignal.value.toLowerCase());
    },
    Sentencecase: () => {
      return derive(() => {
        const str = baseStringSignal.value;
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
      });
    },
    TitleCase: () => {
      return derive(() =>
        baseStringSignal.value
          .toLowerCase()
          .replace(/\b\w/g, (c) => c.toUpperCase()),
      );
    },
    UPPERCASE: () => {
      return derive(() => baseStringSignal.value.toUpperCase());
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
export const getStringSignalMethods = (
  baseStringSignal: BaseSignal<string>,
): StringNonMutatingMethods => ({
  ...getStringIntrinsicNonMutatingMethods(baseStringSignal),
  ...getStringCustomNonMutatingMethods(baseStringSignal),
});
