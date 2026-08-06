import { getPlainMethodParams, value, valueIsLiveSignal } from "../../utils";
import {
  type BaseSignal,
  deadSignal,
  derive,
  MaybeSignalValues,
} from "../signals";
import {
  DeriverReturnType,
  InputSignalType,
  StringCustomNonMutatingMethods,
  StringIntrinsicNonMutatingMethods,
  StringMutatingAndNonMutatingMethods,
  StringMutatingMethods,
  StringNonMutatingMethods,
  StringReplaceParameters,
  StringSplitParameters,
} from "./types";

const _deepTrim = (value: string) => value.trim().replace(/\s+/g, " ");

const getStringMethodDeriver = <InputSignal extends InputSignalType>(
  baseStringSignal: BaseSignal<string>,
) => {
  const inputIsLiveSignal = valueIsLiveSignal(baseStringSignal as any);

  return <T>(deriver: () => T): DeriverReturnType<InputSignal, T> =>
    (inputIsLiveSignal
      ? derive(deriver)
      : deadSignal(deriver())) as DeriverReturnType<InputSignal, T>;
};

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
 * - Live bases return reactive derived signals
 * - Dead bases return dead-signal snapshots
 * - Methods are lazy - derived signals are only created when accessed
 */
export const getStringIntrinsicNonMutatingMethods = <
  InputSignal extends InputSignalType,
>(
  baseStringSignal: BaseSignal<string>,
): StringIntrinsicNonMutatingMethods<InputSignal> => {
  const deriveFromBase =
    getStringMethodDeriver<InputSignal>(baseStringSignal);

  return {
    at: (...args: MaybeSignalValues<Parameters<String["at"]>>) =>
      deriveFromBase(() =>
        baseStringSignal.value.at(...getPlainMethodParams(...args)),
      ),
    charAt: (...args: MaybeSignalValues<Parameters<String["charAt"]>>) =>
      deriveFromBase(() =>
        baseStringSignal.value.charAt(...getPlainMethodParams(...args)),
      ),
    charCodeAt: (
      ...args: MaybeSignalValues<Parameters<String["charCodeAt"]>>
    ) =>
      deriveFromBase(() =>
        baseStringSignal.value.charCodeAt(...getPlainMethodParams(...args)),
      ),
    codePointAt: (
      ...args: MaybeSignalValues<Parameters<String["codePointAt"]>>
    ) =>
      deriveFromBase(() =>
        baseStringSignal.value.codePointAt(...getPlainMethodParams(...args)),
      ),
    concat: (...args: MaybeSignalValues<Parameters<String["concat"]>>) =>
      deriveFromBase(() =>
        baseStringSignal.value.concat(...getPlainMethodParams(...args)),
      ) as any,
    endsWith: (...args: MaybeSignalValues<Parameters<String["endsWith"]>>) =>
      deriveFromBase(() =>
        baseStringSignal.value.endsWith(...getPlainMethodParams(...args)),
      ),
    includes: (...args: MaybeSignalValues<Parameters<String["includes"]>>) =>
      deriveFromBase(() =>
        baseStringSignal.value.includes(...getPlainMethodParams(...args)),
      ),
    indexOf: (...args: MaybeSignalValues<Parameters<String["indexOf"]>>) =>
      deriveFromBase(() =>
        baseStringSignal.value.indexOf(...getPlainMethodParams(...args)),
      ),
    lastIndexOf: (
      ...args: MaybeSignalValues<Parameters<String["lastIndexOf"]>>
    ) =>
      deriveFromBase(() =>
        baseStringSignal.value.lastIndexOf(...getPlainMethodParams(...args)),
      ),
    padEnd: (...args: MaybeSignalValues<Parameters<String["padEnd"]>>) =>
      deriveFromBase(() =>
        baseStringSignal.value.padEnd(...getPlainMethodParams(...args)),
      ),
    padStart: (...args: MaybeSignalValues<Parameters<String["padStart"]>>) =>
      deriveFromBase(() =>
        baseStringSignal.value.padStart(...getPlainMethodParams(...args)),
      ),
    repeat: (...args: MaybeSignalValues<Parameters<String["repeat"]>>) =>
      deriveFromBase(() =>
        baseStringSignal.value.repeat(...getPlainMethodParams(...args)),
      ) as any,
    slice: (...args: MaybeSignalValues<Parameters<String["slice"]>>) =>
      deriveFromBase(() =>
        baseStringSignal.value.slice(...getPlainMethodParams(...args)),
      ),
    startsWith: (
      ...args: MaybeSignalValues<Parameters<String["startsWith"]>>
    ) =>
      deriveFromBase(() =>
        baseStringSignal.value.startsWith(...getPlainMethodParams(...args)),
      ),
    substring: (...args: MaybeSignalValues<Parameters<String["substring"]>>) =>
      deriveFromBase(() =>
        baseStringSignal.value.substring(...getPlainMethodParams(...args)),
      ),
    trim: (...args: MaybeSignalValues<Parameters<String["trim"]>>) =>
      deriveFromBase(() =>
        baseStringSignal.value.trim(...getPlainMethodParams(...args)),
      ),
    trimEnd: (...args: MaybeSignalValues<Parameters<String["trimEnd"]>>) =>
      deriveFromBase(() =>
        baseStringSignal.value.trimEnd(...getPlainMethodParams(...args)),
      ),
    trimStart: (...args: MaybeSignalValues<Parameters<String["trimStart"]>>) =>
      deriveFromBase(() =>
        baseStringSignal.value.trimStart(...getPlainMethodParams(...args)),
      ),
    length: () => deriveFromBase(() => baseStringSignal.value.length),
    localeCompare: (
      ...args: MaybeSignalValues<Parameters<String["localeCompare"]>>
    ) =>
      deriveFromBase(() =>
        baseStringSignal.value.localeCompare(...getPlainMethodParams(...args)),
      ),
    normalize: (...args: MaybeSignalValues<Parameters<String["normalize"]>>) =>
      deriveFromBase(() =>
        baseStringSignal.value.normalize(
          value(...getPlainMethodParams(...args)),
        ),
      ),
    replace: (...args: MaybeSignalValues<StringReplaceParameters>) =>
      deriveFromBase(() => {
        const [searchValue, replaceValue] = getPlainMethodParams(...args);
        return baseStringSignal.value.replace(
          searchValue as any,
          replaceValue as any,
        );
      }),
    replaceAll: (...args: MaybeSignalValues<StringReplaceParameters>) =>
      deriveFromBase(() => {
        const [searchValue, replaceValue] = getPlainMethodParams(...args);
        return baseStringSignal.value.replaceAll(
          searchValue as any,
          replaceValue as any,
        );
      }),
    search: (...args: MaybeSignalValues<Parameters<String["search"]>>) =>
      deriveFromBase(() =>
        baseStringSignal.value.search(...getPlainMethodParams(...args)),
      ),
    split: (...args: MaybeSignalValues<StringSplitParameters>) =>
      deriveFromBase(() => {
        const [separator, limit] = getPlainMethodParams(...args);
        return baseStringSignal.value.split(separator as any, limit);
      }),
    toLocaleLowerCase: (
      ...args: MaybeSignalValues<Parameters<String["toLocaleLowerCase"]>>
    ) =>
      deriveFromBase(() =>
        baseStringSignal.value.toLocaleLowerCase(
          ...getPlainMethodParams(...args),
        ),
      ),
    toLocaleUpperCase: (
      ...args: MaybeSignalValues<Parameters<String["toLocaleUpperCase"]>>
    ) =>
      deriveFromBase(() =>
        baseStringSignal.value.toLocaleUpperCase(
          ...getPlainMethodParams(...args),
        ),
      ),
    toLowerCase: (
      ...args: MaybeSignalValues<Parameters<String["toLowerCase"]>>
    ) => {
      return deriveFromBase(() =>
        baseStringSignal.value.toLowerCase(...getPlainMethodParams(...args)),
      );
    },
    toUpperCase: (
      ...args: MaybeSignalValues<Parameters<String["toUpperCase"]>>
    ) => {
      return deriveFromBase(() =>
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
export const getStringCustomNonMutatingMethods = <
  InputSignal extends InputSignalType,
>(
  baseStringSignal: BaseSignal<string>,
): StringCustomNonMutatingMethods<InputSignal> => {
  const deriveFromBase =
    getStringMethodDeriver<InputSignal>(baseStringSignal);

  return {
    deepTrim: () => {
      return deriveFromBase(() => _deepTrim(baseStringSignal.value));
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
 * - Live bases return reactive derived signals
 * - Dead bases return dead-signal snapshots
 * - Methods are lazy - derived signals are only created when accessed
 */
export const getStringSignalNonMutatingMethods = <
  InputSignal extends InputSignalType,
>(
  baseStringSignal: BaseSignal<string>,
): StringNonMutatingMethods<InputSignal> => ({
  ...getStringIntrinsicNonMutatingMethods<InputSignal>(baseStringSignal),
  ...getStringCustomNonMutatingMethods<InputSignal>(baseStringSignal),
});
export const getStringSignalMethods = <InputSignal extends InputSignalType>(
  baseStringSignal: BaseSignal<string>,
): StringMutatingAndNonMutatingMethods<InputSignal> => ({
  mutate: { ...getStringSignalMutatingMethods(baseStringSignal) },
  ...getStringSignalNonMutatingMethods<InputSignal>(baseStringSignal),
});
