import type { DerivedSignal } from "../signals";

/**
 * Intrinsic mutating methods for array signals.
 *
 * These methods mirror JavaScript Array mutating methods but internally create
 * new immutable arrays and trigger effects.
 *
 * @template T - The array type
 *
 * @remarks
 * - All methods create new arrays internally
 * - Effects are triggered synchronously
 * - Methods expose a mutable-style API while maintaining immutability
 */
export type ArraySignalIntrinsicMutatingMethodsObject<T extends any[]> = {
  copyWithin: (...args: Parameters<Array<T[number]>["copyWithin"]>) => void;
  fill: (...args: Parameters<Array<T[number]>["fill"]>) => void;
  pop: (...args: Parameters<Array<T[number]>["pop"]>) => void;
  push: (...args: Parameters<Array<T[number]>["push"]>) => void;
  reverse: (...args: Parameters<Array<T[number]>["reverse"]>) => void;
  shift: (...args: Parameters<Array<T[number]>["shift"]>) => void;
  sort: (...args: Parameters<Array<T[number]>["sort"]>) => void;
  splice: (...args: Parameters<Array<T[number]>["splice"]>) => void;
  unshift: (...args: Parameters<Array<T[number]>["unshift"]>) => void;
};

/**
 * Custom mutating methods for array signals.
 *
 * These are library-specific methods that provide additional functionality
 * beyond JavaScript's intrinsic array methods.
 *
 * @template T - The array type
 *
 * @remarks
 * - `keep()` is the inverse of `filter()` - keeps items matching the predicate
 * - `remove()` deletes items matching the predicate
 */
export type ArraySignalCustomMutatingMethodsObject<T extends any[]> = {
  /** Keeps items where the predicate returns true */
  keep: (...args: Parameters<Array<T[number]>["filter"]>) => void;
  /** Removes items where the predicate returns true */
  remove: (...args: Parameters<Array<T[number]>["filter"]>) => void;
};

/**
 * Combined mutating methods for array signals.
 *
 * Combines intrinsic and custom mutating methods into a single type.
 *
 * @template T - The array type
 */
export type ArraySignalMutatingMethodsObject<T extends any[]> =
  ArraySignalIntrinsicMutatingMethodsObject<T> &
    ArraySignalCustomMutatingMethodsObject<T>;

/**
 * Intrinsic non-mutating methods for array signals.
 *
 * These methods mirror JavaScript Array non-mutating methods but return
 * derived signals instead of plain values.
 *
 * @template T - The array type
 *
 * @remarks
 * - All methods return derived signals
 * - Methods are reactive and update when the source array changes
 * - Works with both source and derived signals
 */
export type ArraySignalIntrinsicNonMutatingMethodsObject<T extends any[]> = {
  at: (
    ...args: Parameters<Array<T[number]>["at"]>
  ) => DerivedSignal<ReturnType<Array<T[number]>["at"]>>;
  concat: (
    ...args: Parameters<Array<T[number]>["concat"]>
  ) => DerivedSignal<ReturnType<Array<T[number]>["concat"]>>;
  every: (
    ...args: Parameters<Array<T[number]>["every"]>
  ) => DerivedSignal<ReturnType<Array<T[number]>["every"]>>;
  filter: (
    ...args: Parameters<Array<T[number]>["filter"]>
  ) => DerivedSignal<ReturnType<Array<T[number]>["filter"]>>;
  find: (
    ...args: Parameters<Array<T[number]>["find"]>
  ) => DerivedSignal<ReturnType<Array<T[number]>["find"]>>;
  findIndex: (
    ...args: Parameters<Array<T[number]>["findIndex"]>
  ) => DerivedSignal<ReturnType<Array<T[number]>["findIndex"]>>;
  findLast: (
    ...args: Parameters<Array<T[number]>["findLast"]>
  ) => DerivedSignal<ReturnType<Array<T[number]>["findLast"]>>;
  findLastIndex: (
    ...args: Parameters<Array<T[number]>["findLastIndex"]>
  ) => DerivedSignal<ReturnType<Array<T[number]>["findLastIndex"]>>;
  length: () => DerivedSignal<number>;
  map: <U>(
    mapFn: (item: T[number], index: number, array: T) => U,
  ) => DerivedSignal<U[]>;
  reduce: <U>(
    reducerFn: (
      previousValue: U,
      currentValue: T[number],
      currentIndex: number,
      array: T,
    ) => U,
    initialValue: U,
  ) => DerivedSignal<U>;
  reduceRight: <U>(
    reducerFn: (
      previousValue: U,
      currentValue: T[number],
      currentIndex: number,
      array: T,
    ) => U,
    initialValue: U,
  ) => DerivedSignal<U>;
  some: (
    ...args: Parameters<Array<T[number]>["some"]>
  ) => DerivedSignal<ReturnType<Array<T[number]>["some"]>>;
  toReversed: (
    ...args: Parameters<Array<T[number]>["toReversed"]>
  ) => DerivedSignal<ReturnType<Array<T[number]>["toReversed"]>>;
  toSorted: (
    ...args: Parameters<Array<T[number]>["toSorted"]>
  ) => DerivedSignal<ReturnType<Array<T[number]>["toSorted"]>>;
  toSpliced: (
    ...args: Parameters<Array<T[number]>["toSpliced"]>
  ) => DerivedSignal<ReturnType<Array<T[number]>["toSpliced"]>>;
};

/**
 * Custom non-mutating methods for array signals.
 *
 * These are library-specific methods that provide additional functionality
 * beyond JavaScript's intrinsic array methods.
 *
 * @template T - The array type
 *
 * @remarks
 * - `lastItem` returns a derived signal for the last array element
 * - `partition` splits an array into two derived signals based on a predicate
 */
export type ArraySignalCustomNonMutatingMethodsObject<T extends any[]> = {
  /** Last item of the array. */
  lastItem: () => DerivedSignal<T[number] | undefined>;
  /** Custom method that splits the array into `[passing, failing]` based on a predicate. */
  partition: (
    ...args: Parameters<Array<T[number]>["filter"]>
  ) => readonly [DerivedSignal<T>, DerivedSignal<T>];
};

/**
 * Combined non-mutating methods for array signals.
 *
 * Combines intrinsic and custom non-mutating methods into a single type.
 *
 * @template T - The array type
 */
export type ArraySignalNonMutatingMethodsObject<T extends any[]> =
  ArraySignalIntrinsicNonMutatingMethodsObject<T> &
    ArraySignalCustomNonMutatingMethodsObject<T>;

/**
 * Combined methods for array source signals.
 *
 * Combines mutating and non-mutating methods for array source signals.
 *
 * @template T - The array type
 *
 * @remarks
 * - Mutating methods trigger effects synchronously
 * - Non-mutating methods return derived signals
 * - Methods create new arrays internally but feel mutable
 */
export type ArraySourceSignalMethodsObject<T extends any[]> =
  ArraySignalMutatingMethodsObject<T> & ArraySignalNonMutatingMethodsObject<T>;

/**
 * Mutating methods for object signals.
 *
 * @template T - The object type
 *
 * @remarks
 * - `set()` performs a shallow merge with the current value
 * - Triggers effects synchronously
 */
export type ObjectSourceSignalMutatingMethodsObject<
  T extends Record<string, any>,
> = {
  /** Performs a shallow merge with the current value */
  set: (partiallyNewObjectValue: Partial<T>) => void;
};

/**
 * Non-mutating methods for object signals.
 *
 */
export type ObjectSignalNonMutatingMethodsObject<
  T extends Record<string, any>,
> = {
  /** Returns a derived signal for a specific property. */
  prop: <K extends keyof T>(key: K) => DerivedSignal<T[K]>;
  /** Returns an object with all properties as derived signals. */
  props: () => { [key in keyof T]: DerivedSignal<T[key]> };
  /** Returns the object's keys as a derived signal. */
  keys: () => DerivedSignal<string[]>;
};

export type ObjectSourceSignalMethodsObject<T extends Record<string, any>> =
  ObjectSourceSignalMutatingMethodsObject<T> &
    ObjectSignalNonMutatingMethodsObject<T>;

/**
 * Intrinsic non-mutating methods for string signals.
 *
 * These methods mirror JavaScript String non-mutating methods but return
 * derived signals instead of plain values.
 *
 * @remarks
 * - All methods return derived signals
 * - Methods are reactive and update when the source string changes
 * - Works with both source and derived signals
 */
export type StringSignalIntrinsicNonMutatingMethodsObject = {
  at: (
    ...args: Parameters<String["at"]>
  ) => DerivedSignal<ReturnType<String["at"]>>;
  charAt: (
    ...args: Parameters<String["charAt"]>
  ) => DerivedSignal<ReturnType<String["charAt"]>>;
  charCodeAt: (
    ...args: Parameters<String["charCodeAt"]>
  ) => DerivedSignal<ReturnType<String["charCodeAt"]>>;
  codePointAt: (
    ...args: Parameters<String["codePointAt"]>
  ) => DerivedSignal<ReturnType<String["codePointAt"]>>;
  concat: (
    ...args: Parameters<String["concat"]>
  ) => DerivedSignal<ReturnType<String["concat"]>>;
  endsWith: (
    ...args: Parameters<String["endsWith"]>
  ) => DerivedSignal<ReturnType<String["endsWith"]>>;
  includes: (
    ...args: Parameters<String["includes"]>
  ) => DerivedSignal<ReturnType<String["includes"]>>;
  indexOf: (
    ...args: Parameters<String["indexOf"]>
  ) => DerivedSignal<ReturnType<String["indexOf"]>>;
  lastIndexOf: (
    ...args: Parameters<String["lastIndexOf"]>
  ) => DerivedSignal<ReturnType<String["lastIndexOf"]>>;
  padEnd: (
    ...args: Parameters<String["padEnd"]>
  ) => DerivedSignal<ReturnType<String["padEnd"]>>;
  padStart: (
    ...args: Parameters<String["padStart"]>
  ) => DerivedSignal<ReturnType<String["padStart"]>>;
  repeat: (
    ...args: Parameters<String["repeat"]>
  ) => DerivedSignal<ReturnType<String["repeat"]>>;
  slice: (
    ...args: Parameters<String["slice"]>
  ) => DerivedSignal<ReturnType<String["slice"]>>;
  startsWith: (
    ...args: Parameters<String["startsWith"]>
  ) => DerivedSignal<ReturnType<String["startsWith"]>>;
  substring: (
    ...args: Parameters<String["substring"]>
  ) => DerivedSignal<ReturnType<String["substring"]>>;
  trim: (
    ...args: Parameters<String["trim"]>
  ) => DerivedSignal<ReturnType<String["trim"]>>;
  trimEnd: (
    ...args: Parameters<String["trimEnd"]>
  ) => DerivedSignal<ReturnType<String["trimEnd"]>>;
  trimStart: (
    ...args: Parameters<String["trimStart"]>
  ) => DerivedSignal<ReturnType<String["trimStart"]>>;
  length: () => DerivedSignal<number>;
  localeCompare: (
    that: string,
    locales?: string | string[] | undefined,
    options?: Intl.CollatorOptions,
  ) => DerivedSignal<ReturnType<String["localeCompare"]>>;
  normalize: (
    form: "NFC" | "NFD" | "NFKC" | "NFKD",
  ) => DerivedSignal<ReturnType<String["normalize"]>>;
  replace: (
    searchValue: string | RegExp,
    replaceValue: string,
  ) => DerivedSignal<ReturnType<String["replace"]>>;
  replaceAll: (
    searchValue: string | RegExp,
    replaceValue: string,
  ) => DerivedSignal<ReturnType<String["replaceAll"]>>;
  search: (regexp: RegExp) => DerivedSignal<ReturnType<String["search"]>>;
  split: (
    separator: string | RegExp,
    limit?: number | undefined,
  ) => DerivedSignal<ReturnType<String["split"]>>;
  toLocaleLowerCase: (
    locales?: string | string[] | undefined,
  ) => DerivedSignal<ReturnType<String["toLocaleLowerCase"]>>;
  toLocaleUpperCase: (
    locales?: string | string[] | undefined,
  ) => DerivedSignal<ReturnType<String["toLocaleUpperCase"]>>;
};

/**
 * Custom non-mutating methods for string signals.
 *
 * These are library-specific methods that provide additional functionality
 * beyond JavaScript's intrinsic string methods.
 *
 * @remarks
 * - `lowercase` returns a derived signal for the lowercase version
 * - `Sentencecase` returns a derived signal with first letter capitalized
 * - `TitleCase` returns a derived signal with each word capitalized
 * - `UPPERCASE` returns a derived signal for the uppercase version
 */
export type StringSignalCustomNonMutatingMethodsObject = {
  /** Lowercase version of the string. */
  lowercase: () => DerivedSignal<string>;
  /** First letter capitalized, rest lowercase. */
  Sentencecase: () => DerivedSignal<string>;
  /** Each word capitalized. */
  TitleCase: () => DerivedSignal<string>;
  /** Uppercase version of the string. */
  UPPERCASE: () => DerivedSignal<string>;
};

/**
 * Combined non-mutating methods for string signals.
 *
 * Combines intrinsic and custom non-mutating methods into a single type.
 */
export type StringSignalNonMutatingMethodsObject =
  StringSignalIntrinsicNonMutatingMethodsObject &
    StringSignalCustomNonMutatingMethodsObject;

/**
 * Intrinsic non-mutating methods for number signals.
 *
 * These methods mirror JavaScript Number non-mutating methods but return
 * derived signals instead of plain values.
 *
 * @remarks
 * - All methods return derived signals
 * - Methods are reactive and update when the source number changes
 * - Works with both source and derived signals
 */
export type NumberSignalIntrinsicNonMutatingMethodsObject = {
  toExponential: (
    ...args: Parameters<number["toExponential"]>
  ) => DerivedSignal<ReturnType<number["toExponential"]>>;
  toFixed: (
    ...args: Parameters<number["toFixed"]>
  ) => DerivedSignal<ReturnType<number["toFixed"]>>;
  toPrecision: (
    ...args: Parameters<number["toPrecision"]>
  ) => DerivedSignal<ReturnType<number["toPrecision"]>>;
  toLocaleString: (
    locales?: string | string[] | undefined,
    options?: Intl.NumberFormatOptions,
  ) => DerivedSignal<ReturnType<number["toLocaleString"]>>;
};

/**
 * Custom non-mutating methods for number signals.
 *
 * These are library-specific methods that provide additional functionality
 * beyond JavaScript's intrinsic number methods.
 *
 * @remarks
 * - `toConfined` confines the number within a range
 */
export type NumberSignalCustomNonMutatingMethodsObject = {
  /** Confines the number within a range [start, end]. */
  toConfined: (start: number, end: number) => DerivedSignal<number>;
};

/**
 * Combined non-mutating methods for number signals.
 *
 * Combines intrinsic and custom non-mutating methods into a single type.
 */
export type NumberSignalNonMutatingMethodsObject =
  NumberSignalIntrinsicNonMutatingMethodsObject &
    NumberSignalCustomNonMutatingMethodsObject;

/**
 * Mutating methods for boolean signals.
 *
 * @remarks
 * - `toggle()` flips the boolean value
 * - Triggers effects synchronously
 */
export type BooleanSignalMutatingMethodsObject = {
  toggle: () => void;
};

/**
 * Custom non-mutating methods for boolean signals.
 *
 * These are library-specific methods that provide additional functionality
 * for boolean values.
 *
 * @remarks
 * - `negated` returns the negated boolean value
 */
export type BooleanSignalNonMutatingMethodsObject = {
  /** Negated boolean value. */
  negated: () => DerivedSignal<boolean>;
};

export type BooleanSourceSignalMethodsObject =
  BooleanSignalMutatingMethodsObject & BooleanSignalNonMutatingMethodsObject;
