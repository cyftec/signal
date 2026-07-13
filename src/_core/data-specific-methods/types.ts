import type { DerivedSignal, MaybeSignal, MaybeSignalValues } from "../signals";

export type IsObjectLiteral<T> = T extends object
  ? T extends readonly any[]
    ? false
    : T extends (...args: any[]) => any
      ? false
      : true
  : false;

export type IsArray<T> = T extends readonly unknown[] ? true : false;

export type IsExactly<T, U> =
  (<G>() => G extends T ? 1 : 2) extends <G>() => G extends U ? 1 : 2
    ? (<G>() => G extends U ? 1 : 2) extends <G>() => G extends T ? 1 : 2
      ? true
      : never
    : never;

export type IsUnionAndHasOtherTypeThan<T, U> = [true] extends [IsExactly<T, U>]
  ? never
  : Extract<T, U> extends never
    ? never
    : Exclude<T, U> extends never
      ? never
      : true;

export type Primitive = string | number | bigint | boolean | null | undefined;

export type HasPrimitive<T> =
  Extract<T, Primitive> extends never ? never : true;

/**
 * Logical Methods Structure
 *
 * or.
 * length.
 * is.
 * when.
 *
 * hasAtLeastOne.primitive.or.alternative
 * hasAtLeastOne.primitive.is.exitence
 * hasAtLeastOne.primitive.is?number.greaterOrSmaller
 * hasAtLeastOne.primitive.is?stringOrArray.length.exitence
 * hasAtLeastOne.primitive.is?stringOrArray.length.greaterOrSmaller
 * hasAtLeastOne.primitive.when.exitence
 * hasAtLeastOne.primitive.when?number.greaterOrSmaller
 * hasAtLeastOne.primitive.when?stringOrArray.length.exitence
 * hasAtLeastOne.primitive.when?stringOrArray.length.greaterOrSmaller
 */

export type LogicalTernaryMethod = <U, V>(
  truthyOption: MaybeSignal<U>,
  falsyOption: MaybeSignal<V>,
) => DerivedSignal<U | V>;

export type LogicalThen = { then: LogicalTernaryMethod };

export type LogicalCheckReturnType = DerivedSignal<boolean> | LogicalThen;

export type LogicalPrimitiveMethods<
  T extends Primitive,
  R extends LogicalCheckReturnType,
> = {
  truthy: () => R;
  falsy: () => R;
  equalTo: (compareValue: MaybeSignal<T>) => R;
  notEqualTo: (compareValue: MaybeSignal<T>) => R;
};

export type LogicalNumberOnlyMethods<R extends LogicalCheckReturnType> = {
  greaterThan: (compareValue: MaybeSignal<number>) => R;
  greaterThanOrEqualTo: (compareValue: MaybeSignal<number>) => R;
  smallerThan: (compareValue: MaybeSignal<number>) => R;
  smallerThanOrEqualTo: (compareValue: MaybeSignal<number>) => R;
};

// Nullable properties for any type
export type LogicalOrMethods<T extends Primitive> = {
  or: <U>(
    alternativeValue: MaybeSignal<U>,
  ) => DerivedSignal<NonNullable<T> | U>;
};

export type LogicalChecker<
  T extends Primitive,
  R extends LogicalCheckReturnType,
> = LogicalPrimitiveMethods<T, R> &
  (T extends number ? LogicalNumberOnlyMethods<R> : {});

export type LogicalLengthMethods<R extends LogicalCheckReturnType> = {
  length: LogicalChecker<number, R>;
};

export type LogicalIsWhenMethods<T extends Primitive | any[]> = {
  is: ([T] extends [Primitive]
    ? LogicalChecker<T, DerivedSignal<boolean>>
    : {}) &
    ([string] extends [T]
      ? LogicalLengthMethods<DerivedSignal<boolean>>
      : [any[]] extends [T]
        ? LogicalLengthMethods<DerivedSignal<boolean>>
        : {});
  when: ([T] extends [Primitive] ? LogicalChecker<T, LogicalThen> : {}) &
    ([string] extends [T]
      ? LogicalLengthMethods<LogicalThen>
      : [any[]] extends [T]
        ? LogicalLengthMethods<LogicalThen>
        : {});
};

export type LogicalMethods<T> = [true] extends [
  IsExactly<T, Record<string, any>>,
]
  ? {}
  : [true] extends [HasPrimitive<T>]
    ? LogicalOrMethods<Extract<T, Primitive>> &
        LogicalIsWhenMethods<Extract<T, Primitive>>
    : LogicalIsWhenMethods<any[]>;

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
  copyWithin: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["copyWithin"]>>
  ) => void;
  fill: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["fill"]>>
  ) => void;
  pop: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["pop"]>>
  ) => void;
  push: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["push"]>>
  ) => void;
  reverse: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["reverse"]>>
  ) => void;
  shift: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["shift"]>>
  ) => void;
  sort: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["sort"]>>
  ) => void;
  splice: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["splice"]>>
  ) => void;
  unshift: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["unshift"]>>
  ) => void;
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
  keep: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["filter"]>>
  ) => void;
  /** Removes items where the predicate returns true */
  remove: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["filter"]>>
  ) => void;
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
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["at"]>>
  ) => DerivedSignal<ReturnType<Array<T[number]>["at"]>>;
  concat: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["concat"]>>
  ) => DerivedSignal<ReturnType<Array<T[number]>["concat"]>>;
  every: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["every"]>>
  ) => DerivedSignal<ReturnType<Array<T[number]>["every"]>>;
  filter: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["filter"]>>
  ) => DerivedSignal<ReturnType<Array<T[number]>["filter"]>>;
  find: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["find"]>>
  ) => DerivedSignal<ReturnType<Array<T[number]>["find"]>>;
  findIndex: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["findIndex"]>>
  ) => DerivedSignal<ReturnType<Array<T[number]>["findIndex"]>>;
  findLast: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["findLast"]>>
  ) => DerivedSignal<ReturnType<Array<T[number]>["findLast"]>>;
  findLastIndex: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["findLastIndex"]>>
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
    initialValue: MaybeSignal<U>,
  ) => DerivedSignal<U>;
  reduceRight: <U>(
    reducerFn: (
      previousValue: U,
      currentValue: T[number],
      currentIndex: number,
      array: T,
    ) => U,
    initialValue: MaybeSignal<U>,
  ) => DerivedSignal<U>;
  some: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["some"]>>
  ) => DerivedSignal<ReturnType<Array<T[number]>["some"]>>;
  toReversed: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["toReversed"]>>
  ) => DerivedSignal<ReturnType<Array<T[number]>["toReversed"]>>;
  toSorted: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["toSorted"]>>
  ) => DerivedSignal<ReturnType<Array<T[number]>["toSorted"]>>;
  toSpliced: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["toSpliced"]>>
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
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["filter"]>>
  ) => readonly [DerivedSignal<T>, DerivedSignal<T>];
};

/**
 * Combined non-mutating methods for array signals.
 *
 * Combines intrinsic, custom, and logical non-mutating methods into a single type.
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
    ...args: MaybeSignalValues<Parameters<String["at"]>>
  ) => DerivedSignal<ReturnType<String["at"]>>;
  charAt: (
    ...args: MaybeSignalValues<Parameters<String["charAt"]>>
  ) => DerivedSignal<ReturnType<String["charAt"]>>;
  charCodeAt: (
    ...args: MaybeSignalValues<Parameters<String["charCodeAt"]>>
  ) => DerivedSignal<ReturnType<String["charCodeAt"]>>;
  codePointAt: (
    ...args: MaybeSignalValues<Parameters<String["codePointAt"]>>
  ) => DerivedSignal<ReturnType<String["codePointAt"]>>;
  concat: (
    ...args: MaybeSignalValues<Parameters<String["concat"]>>
  ) => DerivedSignal<ReturnType<String["concat"]>>;
  endsWith: (
    ...args: MaybeSignalValues<Parameters<String["endsWith"]>>
  ) => DerivedSignal<ReturnType<String["endsWith"]>>;
  includes: (
    ...args: MaybeSignalValues<Parameters<String["includes"]>>
  ) => DerivedSignal<ReturnType<String["includes"]>>;
  indexOf: (
    ...args: MaybeSignalValues<Parameters<String["indexOf"]>>
  ) => DerivedSignal<ReturnType<String["indexOf"]>>;
  lastIndexOf: (
    ...args: MaybeSignalValues<Parameters<String["lastIndexOf"]>>
  ) => DerivedSignal<ReturnType<String["lastIndexOf"]>>;
  padEnd: (
    ...args: MaybeSignalValues<Parameters<String["padEnd"]>>
  ) => DerivedSignal<ReturnType<String["padEnd"]>>;
  padStart: (
    ...args: MaybeSignalValues<Parameters<String["padStart"]>>
  ) => DerivedSignal<ReturnType<String["padStart"]>>;
  repeat: (
    ...args: MaybeSignalValues<Parameters<String["repeat"]>>
  ) => DerivedSignal<ReturnType<String["repeat"]>>;
  slice: (
    ...args: MaybeSignalValues<Parameters<String["slice"]>>
  ) => DerivedSignal<ReturnType<String["slice"]>>;
  startsWith: (
    ...args: MaybeSignalValues<Parameters<String["startsWith"]>>
  ) => DerivedSignal<ReturnType<String["startsWith"]>>;
  substring: (
    ...args: MaybeSignalValues<Parameters<String["substring"]>>
  ) => DerivedSignal<ReturnType<String["substring"]>>;
  trim: (
    ...args: MaybeSignalValues<Parameters<String["trim"]>>
  ) => DerivedSignal<ReturnType<String["trim"]>>;
  trimEnd: (
    ...args: MaybeSignalValues<Parameters<String["trimEnd"]>>
  ) => DerivedSignal<ReturnType<String["trimEnd"]>>;
  trimStart: (
    ...args: MaybeSignalValues<Parameters<String["trimStart"]>>
  ) => DerivedSignal<ReturnType<String["trimStart"]>>;
  length: () => DerivedSignal<number>;
  localeCompare: (
    that: MaybeSignal<string>,
    locales?: MaybeSignal<string | string[] | undefined>,
    options?: MaybeSignal<Intl.CollatorOptions>,
  ) => DerivedSignal<ReturnType<String["localeCompare"]>>;
  normalize: (
    form: MaybeSignal<"NFC" | "NFD" | "NFKC" | "NFKD">,
  ) => DerivedSignal<ReturnType<String["normalize"]>>;
  replace: (
    searchValue: MaybeSignal<string | RegExp>,
    replaceValue: MaybeSignal<string>,
  ) => DerivedSignal<ReturnType<String["replace"]>>;
  replaceAll: (
    searchValue: MaybeSignal<string | RegExp>,
    replaceValue: MaybeSignal<string>,
  ) => DerivedSignal<ReturnType<String["replaceAll"]>>;
  search: (
    regexp: MaybeSignal<RegExp>,
  ) => DerivedSignal<ReturnType<String["search"]>>;
  split: (
    separator: MaybeSignal<string | RegExp>,
    limit?: MaybeSignal<number | undefined>,
  ) => DerivedSignal<ReturnType<String["split"]>>;
  toLocaleLowerCase: (
    locales?: MaybeSignal<string | string[] | undefined>,
  ) => DerivedSignal<ReturnType<String["toLocaleLowerCase"]>>;
  toLocaleUpperCase: (
    locales?: MaybeSignal<string | string[] | undefined>,
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
 * Combines intrinsic, custom, and logical non-mutating methods into a single type.
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
    ...args: MaybeSignalValues<Parameters<number["toExponential"]>>
  ) => DerivedSignal<ReturnType<number["toExponential"]>>;
  toFixed: (
    ...args: MaybeSignalValues<Parameters<number["toFixed"]>>
  ) => DerivedSignal<ReturnType<number["toFixed"]>>;
  toPrecision: (
    ...args: MaybeSignalValues<Parameters<number["toPrecision"]>>
  ) => DerivedSignal<ReturnType<number["toPrecision"]>>;
  toLocaleString: (
    locales?: MaybeSignal<string | string[] | undefined>,
    options?: MaybeSignal<Intl.NumberFormatOptions>,
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
  toConfined: (
    start: MaybeSignal<number>,
    end: MaybeSignal<number>,
  ) => DerivedSignal<number>;
};

/**
 * Combined non-mutating methods for number signals.
 *
 * Combines intrinsic, custom, and logical non-mutating methods into a single type.
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

export type BooleanSourceSignalMethodsObject =
  BooleanSignalMutatingMethodsObject;

export type NonMutatingMethodsObject<T> = [true] extends [IsArray<T>]
  ? ArraySignalNonMutatingMethodsObject<Extract<T, any[]>>
  : [true] extends [IsObjectLiteral<T>]
    ? ObjectSignalNonMutatingMethodsObject<Extract<T, Record<string, any>>>
    : [true] extends [IsExactly<T, string>]
      ? StringSignalNonMutatingMethodsObject
      : [true] extends [IsExactly<T, number>]
        ? NumberSignalNonMutatingMethodsObject
        : {};

export type MutatingAndNonMutatingMethodsObject<T> = [true] extends [IsArray<T>]
  ? ArraySourceSignalMethodsObject<Extract<T, any[]>>
  : [true] extends [IsObjectLiteral<T>]
    ? ObjectSourceSignalMethodsObject<Extract<T, Record<string, any>>>
    : [true] extends [IsExactly<T, string>]
      ? StringSignalNonMutatingMethodsObject
      : [true] extends [IsExactly<T, number>]
        ? NumberSignalNonMutatingMethodsObject
        : [true] extends [IsExactly<T, boolean>]
          ? BooleanSourceSignalMethodsObject
          : {};
