import { type BaseSignalifiedObject, derive } from "../signals";
import {
  StringSignalCustomNonMutatingMethodsObject,
  StringSignalIntrinsicNonMutatingMethodsObject,
  StringSignalNonMutatingMethodsObject,
} from "./types";

/**
 * Creates intrinsic non-mutating methods for string signals.
 *
 * These methods mirror JavaScript String non-mutating methods but return
 * derived signals instead of plain values.
 *
 * @param baseStringSignalifiedObject - The base string signal to access values from
 * @returns Intrinsic non-mutating methods for string signals
 *
 * @remarks
 * - All methods return derived signals
 * - Methods are reactive and update when the source string changes
 * - Works with both source and derived signals
 * - Methods are lazy - derived signals are only created when accessed
 */
export const getStringSignalIntrinsicNonMutatingMethodsObject = (
  baseStringSignalifiedObject: BaseSignalifiedObject<string>,
): StringSignalIntrinsicNonMutatingMethodsObject => {
  return {
    at: (...args: Parameters<String["at"]>) =>
      derive(() => baseStringSignalifiedObject.value.at(...args)),
    charAt: (...args: Parameters<String["charAt"]>) =>
      derive(() => baseStringSignalifiedObject.value.charAt(...args)),
    charCodeAt: (...args: Parameters<String["charCodeAt"]>) =>
      derive(() => baseStringSignalifiedObject.value.charCodeAt(...args)),
    codePointAt: (...args: Parameters<String["codePointAt"]>) =>
      derive(() => baseStringSignalifiedObject.value.codePointAt(...args)),
    concat: (...args: Parameters<String["concat"]>) =>
      derive(() => baseStringSignalifiedObject.value.concat(...args)),
    endsWith: (...args: Parameters<String["endsWith"]>) =>
      derive(() => baseStringSignalifiedObject.value.endsWith(...args)),
    includes: (...args: Parameters<String["includes"]>) =>
      derive(() => baseStringSignalifiedObject.value.includes(...args)),
    indexOf: (...args: Parameters<String["indexOf"]>) =>
      derive(() => baseStringSignalifiedObject.value.indexOf(...args)),
    lastIndexOf: (...args: Parameters<String["lastIndexOf"]>) =>
      derive(() => baseStringSignalifiedObject.value.lastIndexOf(...args)),
    padEnd: (...args: Parameters<String["padEnd"]>) =>
      derive(() => baseStringSignalifiedObject.value.padEnd(...args)),
    padStart: (...args: Parameters<String["padStart"]>) =>
      derive(() => baseStringSignalifiedObject.value.padStart(...args)),
    repeat: (...args: Parameters<String["repeat"]>) =>
      derive(() => baseStringSignalifiedObject.value.repeat(...args)),
    slice: (...args: Parameters<String["slice"]>) =>
      derive(() => baseStringSignalifiedObject.value.slice(...args)),
    startsWith: (...args: Parameters<String["startsWith"]>) =>
      derive(() => baseStringSignalifiedObject.value.startsWith(...args)),
    substring: (...args: Parameters<String["substring"]>) =>
      derive(() => baseStringSignalifiedObject.value.substring(...args)),
    trim: (...args: Parameters<String["trim"]>) =>
      derive(() => baseStringSignalifiedObject.value.trim(...args)),
    trimEnd: (...args: Parameters<String["trimEnd"]>) =>
      derive(() => baseStringSignalifiedObject.value.trimEnd(...args)),
    trimStart: (...args: Parameters<String["trimStart"]>) =>
      derive(() => baseStringSignalifiedObject.value.trimStart(...args)),
    length: () => derive(() => baseStringSignalifiedObject.value.length),
    localeCompare: (
      that: string,
      locales?: string | string[] | undefined,
      options?: Intl.CollatorOptions,
    ) =>
      derive(() =>
        baseStringSignalifiedObject.value.localeCompare(that, locales, options),
      ),
    normalize: (form: "NFC" | "NFD" | "NFKC" | "NFKD") =>
      derive(() => baseStringSignalifiedObject.value.normalize(form)),
    replace: (searchValue: string | RegExp, replaceValue: string) =>
      derive(() =>
        baseStringSignalifiedObject.value.replace(searchValue, replaceValue),
      ),
    replaceAll: (searchValue: string | RegExp, replaceValue: string) =>
      derive(() =>
        baseStringSignalifiedObject.value.replaceAll(searchValue, replaceValue),
      ),
    search: (regexp: RegExp) =>
      derive(() => baseStringSignalifiedObject.value.search(regexp)),
    split: (separator: string | RegExp, limit?: number | undefined) =>
      derive(() => baseStringSignalifiedObject.value.split(separator, limit)),
    toLocaleLowerCase: (locales?: string | string[] | undefined) =>
      derive(() =>
        baseStringSignalifiedObject.value.toLocaleLowerCase(locales),
      ),
    toLocaleUpperCase: (locales?: string | string[] | undefined) =>
      derive(() =>
        baseStringSignalifiedObject.value.toLocaleUpperCase(locales),
      ),
  };
};

/**
 * Creates custom non-mutating methods for string signals.
 *
 * These are library-specific methods that provide additional functionality
 * beyond JavaScript's intrinsic string methods.
 *
 * @param baseStringSignalifiedObject - The base string signal to access values from
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
  baseStringSignalifiedObject: BaseSignalifiedObject<string>,
): StringSignalCustomNonMutatingMethodsObject => {
  return {
    lowercase: () => {
      return derive(() => baseStringSignalifiedObject.value.toLowerCase());
    },
    Sentencecase: () => {
      return derive(() => {
        const str = baseStringSignalifiedObject.value;
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
      });
    },
    TitleCase: () => {
      return derive(() =>
        baseStringSignalifiedObject.value
          .toLowerCase()
          .replace(/\b\w/g, (c) => c.toUpperCase()),
      );
    },
    UPPERCASE: () => {
      return derive(() => baseStringSignalifiedObject.value.toUpperCase());
    },
  };
};

/**
 * Creates combined non-mutating methods for string signals.
 *
 * Combines intrinsic and custom non-mutating methods into a single object.
 *
 * @param baseStringSignalifiedObject - The base string signal to access values from
 * @returns Combined non-mutating methods for string signals
 *
 * @remarks
 * - All methods return derived signals
 * - Works with both source and derived signals
 * - Methods are reactive and update when the source string changes
 * - Methods are lazy - derived signals are only created when accessed
 */
export const getStringSignalMethodsObject = (
  baseStringSignalifiedObject: BaseSignalifiedObject<string>,
): StringSignalNonMutatingMethodsObject => ({
  ...getStringSignalIntrinsicNonMutatingMethodsObject(
    baseStringSignalifiedObject,
  ),
  ...getStringSignalCustomNonMutatingMethodsObject(baseStringSignalifiedObject),
});
