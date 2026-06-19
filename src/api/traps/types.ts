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
 * Signal Traps
 *
 * A trap captures a signal or plain value of any type and returns an object
 * with common transforms for that particular JavaScript data type.
 *
 * For example, a number trap receives a plain or signal value of number and
 * returns an object with number instance getters and methods as derived signals.
 */

/**
 * Generic trap with basic operations available for all types.
 *
 * @template T - The type of value
 */
export type GenericTrap<T> = {
  /** Converts the value to a string signal (returns undefined if value is null/undefined) */
  get string(): DerivedSignal<T extends null | undefined ? undefined : string>;
  /** Returns the value if truthy, otherwise the fallback value */
  or: <OV>(orValue: MaybeSignalValue<OV>) => DerivedSignal<NonNullable<T> | OV>;
};

/**
 * Number trap with numeric operations and formatting methods.
 *
 * @template T - The number type (extends number)
 */
export type NumberSignalTrap = GenericTrap<number> & {
  /** Confines the number to a range [start, end] */
  toConfined: (
    start: MaybeSignalValue<number>,
    end: MaybeSignalValue<number>
  ) => DerivedSignal<number>;
  /** Converts to exponential notation string */
  toExponential: SignalifiedFunction<number["toExponential"]>;
  /** Converts to locale-specific string */
  toLocaleString: (
    locales?: MaybeSignalValue<string | string[] | undefined>,
    options?: Intl.NumberFormatOptions
  ) => DerivedSignal<string>;
  /** Converts to fixed-point notation string */
  toFixed: SignalifiedFunction<number["toFixed"]>;
  /** Converts to precision notation string */
  toPrecision: SignalifiedFunction<number["toPrecision"]>;
};

/**
 * String trap with string manipulation methods.
 *
 * Includes all standard string methods as derived signal methods, plus
 * custom case conversion getters.
 *
 * @template T - The string type (extends string)
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
  /** String length as a derived signal */
  get length(): DerivedSignal<number>;
  /** Lowercase version of the string */
  get lowercase(): DerivedSignal<string>;
  /** First letter capitalized, rest lowercase */
  get Sentencecase(): DerivedSignal<string>;
  /** Each word's first letter capitalized */
  get TitleCase(): DerivedSignal<string>;
  /** Uppercase version of the string */
  get UPPERCASE(): DerivedSignal<string>;
  /** Compares strings according to locale */
  localeCompare: (
    that: MaybeSignalValue<string>,
    locales?: MaybeSignalValue<string | string[] | undefined>,
    options?: Intl.CollatorOptions
  ) => DerivedSignal<number>;
  /** Normalizes to the specified Unicode form */
  normalize: (
    form: MaybeSignalValue<"NFC" | "NFD" | "NFKC" | "NFKD">
  ) => DerivedSignal<string>;
  /** Replaces the first match of searchValue with replaceValue */
  replace: (
    searchValue: MaybeSignalValue<string> | RegExp,
    replaceValue: MaybeSignalValue<string>
  ) => DerivedSignal<string>;
  /** Replaces all matches of searchValue with replaceValue */
  replaceAll: (
    searchValue: MaybeSignalValue<string> | RegExp,
    replaceValue: MaybeSignalValue<string>
  ) => DerivedSignal<string>;
  /** Searches for a match and returns the index */
  search: (regexp: RegExp) => DerivedSignal<number>;
  /** Splits the string into an array */
  split: (
    separator: MaybeSignalValue<string> | RegExp,
    limit?: MaybeSignalValue<number | undefined>
  ) => DerivedSignal<string[]>;
  /** Converts to locale-specific lowercase */
  toLocaleLowerCase: (
    locales?: MaybeSignalValue<string | string[] | undefined>
  ) => DerivedSignal<string>;
  /** Converts to locale-specific uppercase */
  toLocaleUpperCase: (
    locales?: MaybeSignalValue<string | string[] | undefined>
  ) => DerivedSignal<string>;
};

/**
 * Array trap with array transformation methods.
 *
 * Includes standard array methods as derived signal methods, plus
 * custom getters and partition method.
 *
 * @template T - The array element type
 *
 * @remarks
 * - Mutating array methods (push, pop, etc.) are not included since derived signals are immutable
 * - The `partition()` method splits the array into two signals based on a predicate
 */
export type ArraySignalTrap<T> = GenericTrap<T> & {
  at: SignalifiedFunction<Array<T>["at"]>;
  concat: (items: MaybeSignalValue<T[]>) => DerivedSignal<T[]>;
  copyWithin: SignalifiedFunction<Array<T>["copyWithin"]>;
  fill: SignalifiedFunction<Array<T>["fill"]>;
  includes: SignalifiedFunction<Array<T>["includes"]>;
  indexOf: SignalifiedFunction<Array<T>["indexOf"]>;
  join: SignalifiedFunction<Array<T>["join"]>;
  lastIndexOf: SignalifiedFunction<Array<T>["lastIndexOf"]>;
  slice: SignalifiedFunction<Array<T>["slice"]>;
  with: SignalifiedFunction<Array<T>["with"]>;
  every: (
    itemSatifiesCondition: (item: T, index: number, array: T[]) => boolean
  ) => DerivedSignal<boolean>;
  filter: (
    where: (item: T, index: number, array: T[]) => boolean
  ) => DerivedSignal<T[]>;
  find: (
    where: (item: T, index: number, array: T[]) => boolean
  ) => DerivedSignal<T | undefined>;
  findIndex: (
    where: (item: T, index: number, array: T[]) => boolean
  ) => DerivedSignal<number>;
  findLast: (
    where: (item: T, index: number, array: T[]) => boolean
  ) => DerivedSignal<T | undefined>;
  findLastIndex: (
    where: (item: T, index: number, array: T[]) => boolean
  ) => DerivedSignal<number>;
  /** Last item of the array */
  get lastItem(): DerivedSignal<T | undefined>;
  /** Array length */
  get length(): DerivedSignal<number>;
  map: <U>(
    mapFn: (item: T, index: number, array: T[]) => U
  ) => DerivedSignal<U[]>;
  /** Splits array into [passing, failing] based on predicate */
  partition: (
    where: (item: T, index: number, array: T[]) => boolean
  ) => readonly [DerivedSignal<T[]>, DerivedSignal<T[]>];
  reduce: <U>(
    reducerFn: (
      previousValue: U,
      currentValue: T,
      currentIndex: number,
      array: T[]
    ) => U,
    initialValue: U
  ) => DerivedSignal<U>;
  reduceRight: <U>(
    reducerFn: (
      previousValue: U,
      currentValue: T,
      currentIndex: number,
      array: T[]
    ) => U,
    initialValue: U
  ) => DerivedSignal<U>;
  /** Reversed copy of the array */
  get reversed(): DerivedSignal<T[]>;
  some: (
    itemSatifiesCondition: (item: T, index: number, array: T[]) => boolean
  ) => DerivedSignal<boolean>;
  toSorted: (
    compareFn?: ((a: T, b: T) => number) | undefined
  ) => DerivedSignal<T[]>;
  toSpliced: (
    start: MaybeSignalValue<number>,
    deleteCount: MaybeSignalValue<number>,
    ...items: T[]
  ) => DerivedSignal<T[]>;
};

/**
 * Record trap for plain objects with property access methods.
 *
 * @template T - The object type (extends Record<string, unknown>)
 *
 * @remarks
 * - Throws if the value is not a plain object
 */
export type RecordSignalTrap<T extends Record<string, unknown>> =
  GenericTrap<T> & {
    /** Returns a derived signal for a specific property */
    prop: <K extends keyof T>(key: K) => DerivedSignal<T[K]>;
    /** Returns an object with all properties as derived signals */
    get props(): { [key in keyof T]: DerivedSignal<T[key]> };
    /** Returns the object's keys as a derived signal */
    get keys(): DerivedSignal<string[]>;
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
  : T extends (infer I)[]
  ? ArraySignalTrap<I>
  : T extends Record<string, unknown>
  ? RecordSignalTrap<T>
  : GenericTrap<T>;
