import type {
  DerivedSignal,
  MaybeSignalValue,
  MaybeSignalValues,
} from "../../_core";

/**
 * A function type that accepts signalified arguments and returns a derived signal.
 *
 * This is used to convert JavaScript instance methods into derived signal methods.
 *
 * @template F - The function type to convert
 *
 * @see {@link DerivedSignal} - For the derived signal type
 */
export type SignalifiedFunction<F extends (...args: any[]) => any> = (
  ...args: MaybeSignalValues<Parameters<F>>
) => DerivedSignal<ReturnType<F>>;

/**
 * Signal traps.
 *
 * A trap captures a signal or plain value and returns type-specific derived
 * signal accessors for the underlying JavaScript value.
 */

/**
 * Generic trap with basic operations available for all types.
 *
 * @template T - The type of value
 */
export type GenericTrap<T> = {
  /** Converts the value to a string signal. */
  get string(): DerivedSignal<string>;
  /** Returns the value if truthy, otherwise the fallback value. */
  or: <OV>(orValue: MaybeSignalValue<OV>) => DerivedSignal<NonNullable<T> | OV>;
};

/**
 * Number trap with numeric operations and formatting methods.
 *
 * @template T - The number type
 */
export type NumberSignalTrap = GenericTrap<number> & {
  /** Confines the number to a range. */
  toConfined: (
    start: MaybeSignalValue<number>,
    end: MaybeSignalValue<number>
  ) => DerivedSignal<number>;
  /** Converts to exponential notation string. */
  toExponential: SignalifiedFunction<number["toExponential"]>;
  /** Converts to locale-specific string. */
  toLocaleString: (
    locales?: MaybeSignalValue<string | string[] | undefined>,
    options?: Intl.NumberFormatOptions
  ) => DerivedSignal<string>;
  /** Converts to fixed-point notation string. */
  toFixed: SignalifiedFunction<number["toFixed"]>;
  /** Converts to precision notation string. */
  toPrecision: SignalifiedFunction<number["toPrecision"]>;
};

/**
 * String trap with string manipulation methods.
 *
 * Includes standard string methods as derived signal methods plus custom
 * case conversion getters.
 *
 * @template T - The string type
 */
export type StringSignalTrap = GenericTrap<string> & {
  at: SignalifiedFunction<string["at"]>;
  charAt: SignalifiedFunction<string["charAt"]>;
  charCodeAt: SignalifiedFunction<string["charCodeAt"]>;
  codePointAt: SignalifiedFunction<string["codePointAt"]>;
  concat: SignalifiedFunction<string["concat"]>;
  endsWith: SignalifiedFunction<string["endsWith"]>;
  includes: SignalifiedFunction<string["includes"]>;
  indexOf: SignalifiedFunction<string["indexOf"]>;
  lastIndexOf: SignalifiedFunction<string["lastIndexOf"]>;
  padEnd: SignalifiedFunction<string["padEnd"]>;
  padStart: SignalifiedFunction<string["padStart"]>;
  repeat: SignalifiedFunction<string["repeat"]>;
  slice: SignalifiedFunction<string["slice"]>;
  startsWith: SignalifiedFunction<string["startsWith"]>;
  substring: SignalifiedFunction<string["substring"]>;
  trim: SignalifiedFunction<string["trim"]>;
  trimEnd: SignalifiedFunction<string["trimEnd"]>;
  trimStart: SignalifiedFunction<string["trimStart"]>;
  /** String length as a derived signal. */
  get length(): DerivedSignal<number>;
  /** Lowercase version of the string. */
  get lowercase(): DerivedSignal<string>;
  /** First letter capitalized, rest lowercase. */
  get Sentencecase(): DerivedSignal<string>;
  /** Each word's first letter capitalized. */
  get TitleCase(): DerivedSignal<string>;
  /** Uppercase version of the string. */
  get UPPERCASE(): DerivedSignal<string>;
  /** Compares strings according to locale. */
  localeCompare: (
    that: MaybeSignalValue<string>,
    locales?: MaybeSignalValue<string | string[] | undefined>,
    options?: Intl.CollatorOptions
  ) => DerivedSignal<number>;
  /** Normalizes to the specified Unicode form. */
  normalize: (
    form: MaybeSignalValue<"NFC" | "NFD" | "NFKC" | "NFKD">
  ) => DerivedSignal<string>;
  /** Replaces the first match of `searchValue` with `replaceValue`. */
  replace: (
    searchValue: MaybeSignalValue<string> | RegExp,
    replaceValue: MaybeSignalValue<string>
  ) => DerivedSignal<string>;
  /** Replaces all matches of `searchValue` with `replaceValue`. */
  replaceAll: (
    searchValue: MaybeSignalValue<string> | RegExp,
    replaceValue: MaybeSignalValue<string>
  ) => DerivedSignal<string>;
  /** Searches for a match and returns the index. */
  search: (regexp: RegExp) => DerivedSignal<number>;
  /** Splits the string into an array. */
  split: (
    separator: MaybeSignalValue<string> | RegExp,
    limit?: MaybeSignalValue<number | undefined>
  ) => DerivedSignal<string[]>;
  /** Converts to locale-specific lowercase. */
  toLocaleLowerCase: (
    locales?: MaybeSignalValue<string | string[] | undefined>
  ) => DerivedSignal<string>;
  /** Converts to locale-specific uppercase. */
  toLocaleUpperCase: (
    locales?: MaybeSignalValue<string | string[] | undefined>
  ) => DerivedSignal<string>;
};  

/**
 * Union type for all trap types, determined by the value type.
 *
 * @template T - The type of value to trap
 *
 * @remarks
 * - Number values → NumberSignalTrap
 * - String values → StringSignalTrap
 * - Array values → ArraySignalTrap
 * - Plain objects → RecordSignalTrap
 * - Other types → GenericTrap
 */
export type SignalTrap<T> = T extends number
  ? NumberSignalTrap
  : T extends string
  ? StringSignalTrap
  : GenericTrap<T>;
