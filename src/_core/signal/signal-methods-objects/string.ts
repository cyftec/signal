import { derive } from "../../derive";
import {
  BaseSignal,
  StringSignalCustomNonMutatingMethodsObject,
  StringSignalIntrinsicNonMutatingMethodsObject,
  StringSignalNonMutatingMethodsObject,
} from "../types";

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
export const getStringSignalIntrinsicNonMutatingMethodsObject = (
  baseStringSignal: BaseSignal<string>,
): StringSignalIntrinsicNonMutatingMethodsObject => {
  return {
    at: (...args: Parameters<String["at"]>) =>
      derive(() => baseStringSignal.value.at(...args)),
    charAt: (...args: Parameters<String["charAt"]>) =>
      derive(() => baseStringSignal.value.charAt(...args)),
    charCodeAt: (...args: Parameters<String["charCodeAt"]>) =>
      derive(() => baseStringSignal.value.charCodeAt(...args)),
    codePointAt: (...args: Parameters<String["codePointAt"]>) =>
      derive(() => baseStringSignal.value.codePointAt(...args)),
    concat: (...args: Parameters<String["concat"]>) =>
      derive(() => baseStringSignal.value.concat(...args)),
    endsWith: (...args: Parameters<String["endsWith"]>) =>
      derive(() => baseStringSignal.value.endsWith(...args)),
    includes: (...args: Parameters<String["includes"]>) =>
      derive(() => baseStringSignal.value.includes(...args)),
    indexOf: (...args: Parameters<String["indexOf"]>) =>
      derive(() => baseStringSignal.value.indexOf(...args)),
    lastIndexOf: (...args: Parameters<String["lastIndexOf"]>) =>
      derive(() => baseStringSignal.value.lastIndexOf(...args)),
    padEnd: (...args: Parameters<String["padEnd"]>) =>
      derive(() => baseStringSignal.value.padEnd(...args)),
    padStart: (...args: Parameters<String["padStart"]>) =>
      derive(() => baseStringSignal.value.padStart(...args)),
    repeat: (...args: Parameters<String["repeat"]>) =>
      derive(() => baseStringSignal.value.repeat(...args)),
    slice: (...args: Parameters<String["slice"]>) =>
      derive(() => baseStringSignal.value.slice(...args)),
    startsWith: (...args: Parameters<String["startsWith"]>) =>
      derive(() => baseStringSignal.value.startsWith(...args)),
    substring: (...args: Parameters<String["substring"]>) =>
      derive(() => baseStringSignal.value.substring(...args)),
    trim: (...args: Parameters<String["trim"]>) =>
      derive(() => baseStringSignal.value.trim(...args)),
    trimEnd: (...args: Parameters<String["trimEnd"]>) =>
      derive(() => baseStringSignal.value.trimEnd(...args)),
    trimStart: (...args: Parameters<String["trimStart"]>) =>
      derive(() => baseStringSignal.value.trimStart(...args)),
    length: () => derive(() => baseStringSignal.value.length),
    localeCompare: (
      that: string,
      locales?: string | string[] | undefined,
      options?: Intl.CollatorOptions,
    ) =>
      derive(() =>
        baseStringSignal.value.localeCompare(that, locales, options),
      ),
    normalize: (form: "NFC" | "NFD" | "NFKC" | "NFKD") =>
      derive(() => baseStringSignal.value.normalize(form)),
    replace: (searchValue: string | RegExp, replaceValue: string) =>
      derive(() => baseStringSignal.value.replace(searchValue, replaceValue)),
    replaceAll: (searchValue: string | RegExp, replaceValue: string) =>
      derive(() =>
        baseStringSignal.value.replaceAll(searchValue, replaceValue),
      ),
    search: (regexp: RegExp) =>
      derive(() => baseStringSignal.value.search(regexp)),
    split: (separator: string | RegExp, limit?: number | undefined) =>
      derive(() => baseStringSignal.value.split(separator, limit)),
    toLocaleLowerCase: (locales?: string | string[] | undefined) =>
      derive(() => baseStringSignal.value.toLocaleLowerCase(locales)),
    toLocaleUpperCase: (locales?: string | string[] | undefined) =>
      derive(() => baseStringSignal.value.toLocaleUpperCase(locales)),
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
export const getStringSignalCustomNonMutatingMethodsObject = (
  baseStringSignal: BaseSignal<string>,
): StringSignalCustomNonMutatingMethodsObject => {
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
 * Combines intrinsic and custom non-mutating methods into a single object.
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
export const getStringSignalMethodsObject = (
  baseStringSignal: BaseSignal<string>,
): StringSignalNonMutatingMethodsObject => ({
  ...getStringSignalIntrinsicNonMutatingMethodsObject(baseStringSignal),
  ...getStringSignalCustomNonMutatingMethodsObject(baseStringSignal),
});
