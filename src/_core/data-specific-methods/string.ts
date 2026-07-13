import { getDesignalifiedMethodParams, value } from "../../utils";
import {
  type BaseSignalifiedObject,
  derive,
  MaybeSignal,
  MaybeSignalValues,
} from "../signals";
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
    at: (...args: MaybeSignalValues<Parameters<String["at"]>>) =>
      derive(() =>
        baseStringSignalifiedObject.value.at(
          ...getDesignalifiedMethodParams(...args),
        ),
      ),
    charAt: (...args: MaybeSignalValues<Parameters<String["charAt"]>>) =>
      derive(() =>
        baseStringSignalifiedObject.value.charAt(
          ...getDesignalifiedMethodParams(...args),
        ),
      ),
    charCodeAt: (
      ...args: MaybeSignalValues<Parameters<String["charCodeAt"]>>
    ) =>
      derive(() =>
        baseStringSignalifiedObject.value.charCodeAt(
          ...getDesignalifiedMethodParams(...args),
        ),
      ),
    codePointAt: (
      ...args: MaybeSignalValues<Parameters<String["codePointAt"]>>
    ) =>
      derive(() =>
        baseStringSignalifiedObject.value.codePointAt(
          ...getDesignalifiedMethodParams(...args),
        ),
      ),
    concat: (...args: MaybeSignalValues<Parameters<String["concat"]>>) =>
      derive(() =>
        baseStringSignalifiedObject.value.concat(
          ...getDesignalifiedMethodParams(...args),
        ),
      ) as any,
    endsWith: (...args: MaybeSignalValues<Parameters<String["endsWith"]>>) =>
      derive(() =>
        baseStringSignalifiedObject.value.endsWith(
          ...getDesignalifiedMethodParams(...args),
        ),
      ),
    includes: (...args: MaybeSignalValues<Parameters<String["includes"]>>) =>
      derive(() =>
        baseStringSignalifiedObject.value.includes(
          ...getDesignalifiedMethodParams(...args),
        ),
      ),
    indexOf: (...args: MaybeSignalValues<Parameters<String["indexOf"]>>) =>
      derive(() =>
        baseStringSignalifiedObject.value.indexOf(
          ...getDesignalifiedMethodParams(...args),
        ),
      ),
    lastIndexOf: (
      ...args: MaybeSignalValues<Parameters<String["lastIndexOf"]>>
    ) =>
      derive(() =>
        baseStringSignalifiedObject.value.lastIndexOf(
          ...getDesignalifiedMethodParams(...args),
        ),
      ),
    padEnd: (...args: MaybeSignalValues<Parameters<String["padEnd"]>>) =>
      derive(() =>
        baseStringSignalifiedObject.value.padEnd(
          ...getDesignalifiedMethodParams(...args),
        ),
      ),
    padStart: (...args: MaybeSignalValues<Parameters<String["padStart"]>>) =>
      derive(() =>
        baseStringSignalifiedObject.value.padStart(
          ...getDesignalifiedMethodParams(...args),
        ),
      ),
    repeat: (...args: MaybeSignalValues<Parameters<String["repeat"]>>) =>
      derive(() =>
        baseStringSignalifiedObject.value.repeat(
          ...getDesignalifiedMethodParams(...args),
        ),
      ) as any,
    slice: (...args: MaybeSignalValues<Parameters<String["slice"]>>) =>
      derive(() =>
        baseStringSignalifiedObject.value.slice(
          ...getDesignalifiedMethodParams(...args),
        ),
      ),
    startsWith: (
      ...args: MaybeSignalValues<Parameters<String["startsWith"]>>
    ) =>
      derive(() =>
        baseStringSignalifiedObject.value.startsWith(
          ...getDesignalifiedMethodParams(...args),
        ),
      ),
    substring: (...args: MaybeSignalValues<Parameters<String["substring"]>>) =>
      derive(() =>
        baseStringSignalifiedObject.value.substring(
          ...getDesignalifiedMethodParams(...args),
        ),
      ),
    trim: (...args: MaybeSignalValues<Parameters<String["trim"]>>) =>
      derive(() =>
        baseStringSignalifiedObject.value.trim(
          ...getDesignalifiedMethodParams(...args),
        ),
      ),
    trimEnd: (...args: MaybeSignalValues<Parameters<String["trimEnd"]>>) =>
      derive(() =>
        baseStringSignalifiedObject.value.trimEnd(
          ...getDesignalifiedMethodParams(...args),
        ),
      ),
    trimStart: (...args: MaybeSignalValues<Parameters<String["trimStart"]>>) =>
      derive(() =>
        baseStringSignalifiedObject.value.trimStart(
          ...getDesignalifiedMethodParams(...args),
        ),
      ),
    length: () => derive(() => baseStringSignalifiedObject.value.length),
    localeCompare: (
      that: MaybeSignal<string>,
      locales?: MaybeSignal<string | string[] | undefined>,
      options?: MaybeSignal<Intl.CollatorOptions | undefined>,
    ) =>
      derive(() =>
        baseStringSignalifiedObject.value.localeCompare(
          value(that),
          value(locales),
          value(options),
        ),
      ),
    normalize: (form: MaybeSignal<"NFC" | "NFD" | "NFKC" | "NFKD">) =>
      derive(() => baseStringSignalifiedObject.value.normalize(value(form))),
    replace: (
      searchValue: MaybeSignal<string | RegExp>,
      replaceValue: MaybeSignal<string>,
    ) =>
      derive(() =>
        baseStringSignalifiedObject.value.replace(
          value(searchValue),
          value(replaceValue),
        ),
      ),
    replaceAll: (
      searchValue: MaybeSignal<string | RegExp>,
      replaceValue: MaybeSignal<string>,
    ) =>
      derive(() =>
        baseStringSignalifiedObject.value.replaceAll(
          value(searchValue),
          value(replaceValue),
        ),
      ),
    search: (regexp: MaybeSignal<RegExp>) =>
      derive(() => baseStringSignalifiedObject.value.search(value(regexp))),
    split: (
      separator: MaybeSignal<string | RegExp>,
      limit?: MaybeSignal<number | undefined>,
    ) =>
      derive(() =>
        baseStringSignalifiedObject.value.split(value(separator), value(limit)),
      ),
    toLocaleLowerCase: (locales?: MaybeSignal<string | string[] | undefined>) =>
      derive(() =>
        baseStringSignalifiedObject.value.toLocaleLowerCase(value(locales)),
      ),
    toLocaleUpperCase: (locales?: MaybeSignal<string | string[] | undefined>) =>
      derive(() =>
        baseStringSignalifiedObject.value.toLocaleUpperCase(value(locales)),
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
 * Combines intrinsic, custom, and logical non-mutating methods into a single object.
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
