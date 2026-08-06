import type {
  DeadSignal,
  DerivedSignal,
  MaybeSignal,
  MaybeSignalValues,
} from "../signals";

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
 * Comparison Methods Structure
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
 * hasAtLeastOne.primitive.if.exitence
 * hasAtLeastOne.primitive.if?number.greaterOrSmaller
 * hasAtLeastOne.primitive.if?stringOrArray.length.exitence
 * hasAtLeastOne.primitive.if?stringOrArray.length.greaterOrSmaller
 */

export type InputSignalType = "live" | "non-live";
export type GenericMethodReturnType = "ternary" | "deriver";
export type DeriverReturnType<
  InputSignal extends InputSignalType,
  T,
> = {
  live: DerivedSignal<T>;
  "non-live": DeadSignal<T>;
}[InputSignal];

// Nullable properties for any type
export type LogicalOrAlternative<
  InputSignal extends InputSignalType,
  P extends Primitive,
> = {
  or: <U>(
    alternativeValue: MaybeSignal<U>,
  ) => DeriverReturnType<InputSignal, NonNullable<P> | U>;
};

export type TernaryThen<InputSignal extends InputSignalType> = {
  then: <U, V>(
    truthyOption: MaybeSignal<U>,
    falsyOption: MaybeSignal<V>,
  ) => DeriverReturnType<InputSignal, U | V>;
};

export type ComparisonReturnType<
  InputSignal extends InputSignalType,
  GenericMethodReturn extends GenericMethodReturnType,
> = ["ternary"] extends [GenericMethodReturn]
  ? TernaryThen<InputSignal>
  : DeriverReturnType<InputSignal, boolean>;

export type ExistenceComparison<
  InputSignal extends InputSignalType,
  GenericMethodReturn extends GenericMethodReturnType,
  P extends Primitive,
  R extends ComparisonReturnType<InputSignal, GenericMethodReturn>,
> = {
  truthy: () => R;
  falsy: () => R;
  equalTo: (compareValue: MaybeSignal<P>) => R;
  notEqualTo: (compareValue: MaybeSignal<P>) => R;
};

export type MeasureComparison<
  InputSignal extends InputSignalType,
  GenericMethodReturn extends GenericMethodReturnType,
  R extends ComparisonReturnType<InputSignal, GenericMethodReturn>,
> = {
  greaterThan: (compareValue: MaybeSignal<number>) => R;
  greaterThanOrEqualTo: (compareValue: MaybeSignal<number>) => R;
  smallerThan: (compareValue: MaybeSignal<number>) => R;
  smallerThanOrEqualTo: (compareValue: MaybeSignal<number>) => R;
};

export type Comparison<
  InputSignal extends InputSignalType,
  GenericMethodReturn extends GenericMethodReturnType,
  P extends Primitive,
> = ExistenceComparison<
  InputSignal,
  GenericMethodReturn,
  P,
  ComparisonReturnType<InputSignal, GenericMethodReturn>
> &
  (P extends number
    ? MeasureComparison<
        InputSignal,
        GenericMethodReturn,
        ComparisonReturnType<InputSignal, GenericMethodReturn>
      >
    : {});

export type LengthComparison<
  InputSignal extends InputSignalType,
  GenericMethodReturn extends GenericMethodReturnType,
> = {
  length: Comparison<InputSignal, GenericMethodReturn, number>;
};

export type IsAndIfComparison<
  InputSignal extends InputSignalType,
  T extends Primitive | any[],
> = {
  is: ([T] extends [Primitive] ? Comparison<InputSignal, "deriver", T> : {}) &
    ([string] extends [T]
      ? LengthComparison<InputSignal, "deriver">
      : [any[]] extends [T]
        ? LengthComparison<InputSignal, "deriver">
        : {});
  if: ([T] extends [Primitive] ? Comparison<InputSignal, "ternary", T> : {}) &
    ([string] extends [T]
      ? LengthComparison<InputSignal, "ternary">
      : [any[]] extends [T]
        ? LengthComparison<InputSignal, "ternary">
        : {});
};

export type GenericMethods<InputSignal extends InputSignalType, T> = [
  true,
] extends [IsExactly<T, Record<string, any>>]
  ? {}
  : [true] extends [HasPrimitive<T>]
    ? LogicalOrAlternative<InputSignal, Extract<T, Primitive>> &
        IsAndIfComparison<InputSignal, Extract<T, Primitive>>
    : IsAndIfComparison<InputSignal, any[]>;

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
export type ArrayMutatingMethods<T extends any[]> = {
  concat: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["concat"]>>
  ) => void;
  copyWithin: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["copyWithin"]>>
  ) => void;
  fill: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["fill"]>>
  ) => void;
  filter: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["filter"]>>
  ) => void;
  pop: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["pop"]>>
  ) => void;
  push: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["push"]>>
  ) => void;
  shift: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["shift"]>>
  ) => void;
  toReversed: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["reverse"]>>
  ) => void;
  toSorted: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["sort"]>>
  ) => void;
  toSpliced: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["splice"]>>
  ) => void;
  unshift: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["unshift"]>>
  ) => void;
};

/**
 * Intrinsic non-mutating methods for array signals.
 *
 * These methods mirror JavaScript Array non-mutating methods but return
 * derived signals instead of plain values.
 *
 * @template T - The array type
 *
 * @remarks
 * - Live bases return reactive derived signals
 * - Dead bases return dead-signal snapshots
 */
export type ArrayIntrinsicNonMutatingMethods<
  InputSignal extends InputSignalType,
  T extends any[],
> = {
  at: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["at"]>>
  ) => DeriverReturnType<InputSignal, ReturnType<Array<T[number]>["at"]>>;
  concat: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["concat"]>>
  ) => DeriverReturnType<InputSignal, ReturnType<Array<T[number]>["concat"]>>;
  every: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["every"]>>
  ) => DeriverReturnType<InputSignal, ReturnType<Array<T[number]>["every"]>>;
  filter: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["filter"]>>
  ) => DeriverReturnType<InputSignal, ReturnType<Array<T[number]>["filter"]>>;
  find: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["find"]>>
  ) => DeriverReturnType<InputSignal, ReturnType<Array<T[number]>["find"]>>;
  findIndex: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["findIndex"]>>
  ) => DeriverReturnType<
    InputSignal,
    ReturnType<Array<T[number]>["findIndex"]>
  >;
  findLast: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["findLast"]>>
  ) => DeriverReturnType<InputSignal, ReturnType<Array<T[number]>["findLast"]>>;
  findLastIndex: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["findLastIndex"]>>
  ) => DeriverReturnType<
    InputSignal,
    ReturnType<Array<T[number]>["findLastIndex"]>
  >;
  length: () => DeriverReturnType<InputSignal, number>;
  map: <U>(
    mapFn: (item: T[number], index: number, array: T) => U,
  ) => DeriverReturnType<InputSignal, U[]>;
  reduce: <U>(
    reducerFn: (
      previousValue: U,
      currentValue: T[number],
      currentIndex: number,
      array: T,
    ) => U,
    initialValue: MaybeSignal<U>,
  ) => DeriverReturnType<InputSignal, U>;
  reduceRight: <U>(
    reducerFn: (
      previousValue: U,
      currentValue: T[number],
      currentIndex: number,
      array: T,
    ) => U,
    initialValue: MaybeSignal<U>,
  ) => DeriverReturnType<InputSignal, U>;
  some: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["some"]>>
  ) => DeriverReturnType<InputSignal, ReturnType<Array<T[number]>["some"]>>;
  toReversed: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["toReversed"]>>
  ) => DeriverReturnType<
    InputSignal,
    ReturnType<Array<T[number]>["toReversed"]>
  >;
  toSorted: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["toSorted"]>>
  ) => DeriverReturnType<
    InputSignal,
    ReturnType<Array<T[number]>["toSorted"]>
  >;
  toSpliced: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["toSpliced"]>>
  ) => DeriverReturnType<
    InputSignal,
    ReturnType<Array<T[number]>["toSpliced"]>
  >;
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
 * - `lastItem` returns the matching signal kind for the last array element
 * - `partition` splits an array into two signals matching the base kind
 */
export type ArrayCustomNonMutatingMethods<
  InputSignal extends InputSignalType,
  T extends any[],
> = {
  /** Last item of the array. */
  lastItem: () => DeriverReturnType<InputSignal, T[number] | undefined>;
  /** Custom method that splits the array into `[passing, failing]` based on a predicate. */
  partition: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["filter"]>>
  ) => readonly [
    DeriverReturnType<InputSignal, T>,
    DeriverReturnType<InputSignal, T>,
  ];
};

/**
 * Combined non-mutating methods for array signals.
 *
 * Combines intrinsic, custom, and logical non-mutating methods into a single type.
 *
 * @template T - The array type
 */
export type ArrayNonMutatingMethods<
  InputSignal extends InputSignalType,
  T extends any[],
> = ArrayIntrinsicNonMutatingMethods<InputSignal, T> &
  ArrayCustomNonMutatingMethods<InputSignal, T>;

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
export type ArrayMutatingAndNonMutatingMethods<
  InputSignal extends InputSignalType,
  T extends any[],
> = {
  mutate: ArrayMutatingMethods<T>;
} & ArrayNonMutatingMethods<InputSignal, T>;

/**
 * Mutating methods for object signals.
 *
 * @template T - The object type
 *
 * @remarks
 * - `set()` performs a shallow merge with the current value
 * - Triggers effects synchronously
 */
export type ObjectMutatingMethods<T extends Record<string, any>> = {
  /** Performs a shallow merge with the current value */
  set: (partiallyNewObjectValue: Partial<T>) => void;
};

/**
 * Non-mutating methods for object signals.
 *
 */
export type ObjectNonMutatingMethods<
  InputSignal extends InputSignalType,
  T extends Record<string, any>,
> = {
  /** Returns the object's keys in a signal matching the base kind. */
  keys: () => DeriverReturnType<InputSignal, string[]>;
  /** Returns a signal matching the base kind for a specific property. */
  get: <K extends keyof T>(
    key: K,
  ) => DeriverReturnType<InputSignal, T[K]>;
  /** Returns an object whose property signals match the base kind. */
  props: () => {
    [key in keyof T]: DeriverReturnType<InputSignal, T[key]>;
  };
};

export type ObjectMutatingAndNonMutatingMethods<
  InputSignal extends InputSignalType,
  T extends Record<string, any>,
> = { mutate: ObjectMutatingMethods<T> } &
  ObjectNonMutatingMethods<InputSignal, T>;

export type StringReplaceSearchValue =
  | string
  | {
      [Symbol.replace](
        string: string,
        replaceValue: string | ((substring: string, ...args: any[]) => string),
      ): string;
    };

export type StringReplaceValue =
  | string
  | ((substring: string, ...args: any[]) => string);

export type StringReplaceParameters = [
  searchValue: StringReplaceSearchValue,
  replaceValue: StringReplaceValue,
];

export type StringSplitSeparator =
  | string
  | {
      [Symbol.split](string: string, limit?: number): string[];
    };

export type StringSplitParameters = [
  separator?: StringSplitSeparator,
  limit?: number,
];

export type StringMutatingMethods = {
  concat: (...args: MaybeSignalValues<Parameters<String["concat"]>>) => void;
  deepTrim: () => void;
  padEnd: (...args: MaybeSignalValues<Parameters<String["padEnd"]>>) => void;
  padStart: (
    ...args: MaybeSignalValues<Parameters<String["padStart"]>>
  ) => void;
  repeat: (...args: MaybeSignalValues<Parameters<String["repeat"]>>) => void;
  replace: (...args: MaybeSignalValues<StringReplaceParameters>) => void;
  replaceAll: (...args: MaybeSignalValues<StringReplaceParameters>) => void;
  slice: (...args: MaybeSignalValues<Parameters<String["slice"]>>) => void;
  substring: (
    ...args: MaybeSignalValues<Parameters<String["substring"]>>
  ) => void;
  trim: (...args: MaybeSignalValues<Parameters<String["trim"]>>) => void;
  trimEnd: (...args: MaybeSignalValues<Parameters<String["trimEnd"]>>) => void;
  trimStart: (
    ...args: MaybeSignalValues<Parameters<String["trimStart"]>>
  ) => void;
  toLocaleLowerCase: (
    ...args: MaybeSignalValues<Parameters<String["toLocaleLowerCase"]>>
  ) => void;
  toLocaleUpperCase: (
    ...args: MaybeSignalValues<Parameters<String["toLocaleUpperCase"]>>
  ) => void;
  toLowerCase: (
    ...args: MaybeSignalValues<Parameters<String["toLowerCase"]>>
  ) => void;
  toUpperCase: (
    ...args: MaybeSignalValues<Parameters<String["toUpperCase"]>>
  ) => void;
};

/**
 * Intrinsic non-mutating methods for string signals.
 *
 * These methods mirror JavaScript String non-mutating methods but return
 * derived signals instead of plain values.
 *
 * @remarks
 * - Live bases return reactive derived signals
 * - Dead bases return dead-signal snapshots
 */
export type StringIntrinsicNonMutatingMethods<
  InputSignal extends InputSignalType,
> = {
  at: (
    ...args: MaybeSignalValues<Parameters<String["at"]>>
  ) => DeriverReturnType<InputSignal, ReturnType<String["at"]>>;
  charAt: (
    ...args: MaybeSignalValues<Parameters<String["charAt"]>>
  ) => DeriverReturnType<InputSignal, ReturnType<String["charAt"]>>;
  charCodeAt: (
    ...args: MaybeSignalValues<Parameters<String["charCodeAt"]>>
  ) => DeriverReturnType<InputSignal, ReturnType<String["charCodeAt"]>>;
  codePointAt: (
    ...args: MaybeSignalValues<Parameters<String["codePointAt"]>>
  ) => DeriverReturnType<InputSignal, ReturnType<String["codePointAt"]>>;
  concat: (
    ...args: MaybeSignalValues<Parameters<String["concat"]>>
  ) => DeriverReturnType<InputSignal, ReturnType<String["concat"]>>;
  endsWith: (
    ...args: MaybeSignalValues<Parameters<String["endsWith"]>>
  ) => DeriverReturnType<InputSignal, ReturnType<String["endsWith"]>>;
  includes: (
    ...args: MaybeSignalValues<Parameters<String["includes"]>>
  ) => DeriverReturnType<InputSignal, ReturnType<String["includes"]>>;
  indexOf: (
    ...args: MaybeSignalValues<Parameters<String["indexOf"]>>
  ) => DeriverReturnType<InputSignal, ReturnType<String["indexOf"]>>;
  lastIndexOf: (
    ...args: MaybeSignalValues<Parameters<String["lastIndexOf"]>>
  ) => DeriverReturnType<InputSignal, ReturnType<String["lastIndexOf"]>>;
  padEnd: (
    ...args: MaybeSignalValues<Parameters<String["padEnd"]>>
  ) => DeriverReturnType<InputSignal, ReturnType<String["padEnd"]>>;
  padStart: (
    ...args: MaybeSignalValues<Parameters<String["padStart"]>>
  ) => DeriverReturnType<InputSignal, ReturnType<String["padStart"]>>;
  repeat: (
    ...args: MaybeSignalValues<Parameters<String["repeat"]>>
  ) => DeriverReturnType<InputSignal, ReturnType<String["repeat"]>>;
  slice: (
    ...args: MaybeSignalValues<Parameters<String["slice"]>>
  ) => DeriverReturnType<InputSignal, ReturnType<String["slice"]>>;
  startsWith: (
    ...args: MaybeSignalValues<Parameters<String["startsWith"]>>
  ) => DeriverReturnType<InputSignal, ReturnType<String["startsWith"]>>;
  substring: (
    ...args: MaybeSignalValues<Parameters<String["substring"]>>
  ) => DeriverReturnType<InputSignal, ReturnType<String["substring"]>>;
  trim: (
    ...args: MaybeSignalValues<Parameters<String["trim"]>>
  ) => DeriverReturnType<InputSignal, ReturnType<String["trim"]>>;
  trimEnd: (
    ...args: MaybeSignalValues<Parameters<String["trimEnd"]>>
  ) => DeriverReturnType<InputSignal, ReturnType<String["trimEnd"]>>;
  trimStart: (
    ...args: MaybeSignalValues<Parameters<String["trimStart"]>>
  ) => DeriverReturnType<InputSignal, ReturnType<String["trimStart"]>>;
  length: () => DeriverReturnType<InputSignal, number>;
  localeCompare: (
    ...args: MaybeSignalValues<Parameters<String["localeCompare"]>>
  ) => DeriverReturnType<InputSignal, ReturnType<String["localeCompare"]>>;
  normalize: (
    ...args: MaybeSignalValues<Parameters<String["normalize"]>>
  ) => DeriverReturnType<InputSignal, ReturnType<String["normalize"]>>;
  replace: (
    ...args: MaybeSignalValues<StringReplaceParameters>
  ) => DeriverReturnType<InputSignal, string>;
  replaceAll: (
    ...args: MaybeSignalValues<StringReplaceParameters>
  ) => DeriverReturnType<InputSignal, string>;
  search: (
    ...args: MaybeSignalValues<Parameters<String["search"]>>
  ) => DeriverReturnType<InputSignal, ReturnType<String["search"]>>;
  split: (
    ...args: MaybeSignalValues<StringSplitParameters>
  ) => DeriverReturnType<InputSignal, string[]>;
  toLocaleLowerCase: (
    ...args: MaybeSignalValues<Parameters<String["toLocaleLowerCase"]>>
  ) => DeriverReturnType<InputSignal, ReturnType<String["toLocaleLowerCase"]>>;
  toLocaleUpperCase: (
    ...args: MaybeSignalValues<Parameters<String["toLocaleUpperCase"]>>
  ) => DeriverReturnType<InputSignal, ReturnType<String["toLocaleUpperCase"]>>;
  toLowerCase: (
    ...args: MaybeSignalValues<Parameters<String["toLowerCase"]>>
  ) => DeriverReturnType<InputSignal, ReturnType<String["toLowerCase"]>>;
  toUpperCase: (
    ...args: MaybeSignalValues<Parameters<String["toUpperCase"]>>
  ) => DeriverReturnType<InputSignal, ReturnType<String["toUpperCase"]>>;
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
export type StringCustomNonMutatingMethods<
  InputSignal extends InputSignalType,
> = {
  deepTrim: () => DeriverReturnType<InputSignal, string>;
};

/**
 * Combined non-mutating methods for string signals.
 *
 * Combines intrinsic, custom, and logical non-mutating methods into a single type.
 */
export type StringNonMutatingMethods<InputSignal extends InputSignalType> =
  StringIntrinsicNonMutatingMethods<InputSignal> &
    StringCustomNonMutatingMethods<InputSignal>;

export type StringMutatingAndNonMutatingMethods<
  InputSignal extends InputSignalType,
> = {
  mutate: StringMutatingMethods;
} & StringNonMutatingMethods<InputSignal>;

/**
 * Intrinsic non-mutating methods for number signals.
 *
 * These methods mirror JavaScript Number non-mutating methods but return
 * derived signals instead of plain values.
 *
 * @remarks
 * - Live bases return reactive derived signals
 * - Dead bases return dead-signal snapshots
 */
export type NumberIntrinsicNonMutatingMethods<
  InputSignal extends InputSignalType,
> = {
  toExponential: (
    ...args: MaybeSignalValues<Parameters<number["toExponential"]>>
  ) => DeriverReturnType<InputSignal, ReturnType<number["toExponential"]>>;
  toFixed: (
    ...args: MaybeSignalValues<Parameters<number["toFixed"]>>
  ) => DeriverReturnType<InputSignal, ReturnType<number["toFixed"]>>;
  toPrecision: (
    ...args: MaybeSignalValues<Parameters<number["toPrecision"]>>
  ) => DeriverReturnType<InputSignal, ReturnType<number["toPrecision"]>>;
  toLocaleString: (
    locales?: MaybeSignal<string | string[] | undefined>,
    options?: MaybeSignal<Intl.NumberFormatOptions | undefined>,
  ) => DeriverReturnType<InputSignal, ReturnType<number["toLocaleString"]>>;
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
export type NumberCustomNonMutatingMethods<
  InputSignal extends InputSignalType,
> = {
  /** Confines the number within a range [start, end]. */
  toConfined: (
    start: MaybeSignal<number>,
    end: MaybeSignal<number>,
  ) => DeriverReturnType<InputSignal, number>;
};

/**
 * Combined non-mutating methods for number signals.
 *
 * Combines intrinsic, custom, and logical non-mutating methods into a single type.
 */
export type NumberNonMutatingMethods<InputSignal extends InputSignalType> =
  NumberIntrinsicNonMutatingMethods<InputSignal> &
    NumberCustomNonMutatingMethods<InputSignal>;

/**
 * Mutating methods for boolean signals.
 *
 * @remarks
 * - `toggle()` flips the boolean value
 * - Triggers effects synchronously
 */
export type BooleanMutatingMethods = {
  toggle: () => void;
};

export type BooleanMutatingAndNonMutatingMethods = {
  mutate: BooleanMutatingMethods;
};

export type NonMutatingMethods<
  InputSignal extends InputSignalType,
  T,
> = [true] extends [IsArray<T>]
  ? ArrayNonMutatingMethods<InputSignal, Extract<T, any[]>>
  : [true] extends [IsObjectLiteral<T>]
    ? ObjectNonMutatingMethods<InputSignal, Extract<T, Record<string, any>>>
    : [true] extends [IsExactly<T, string>]
      ? StringNonMutatingMethods<InputSignal>
      : [true] extends [IsExactly<T, number>]
        ? NumberNonMutatingMethods<InputSignal>
        : {};

export type MutatingAndNonMutatingMethods<
  InputSignal extends InputSignalType,
  T,
> = [true] extends [IsArray<T>]
  ? ArrayMutatingAndNonMutatingMethods<InputSignal, Extract<T, any[]>>
  : [true] extends [IsObjectLiteral<T>]
    ? ObjectMutatingAndNonMutatingMethods<
        InputSignal,
        Extract<T, Record<string, any>>
      >
    : [true] extends [IsExactly<T, string>]
      ? StringMutatingAndNonMutatingMethods<InputSignal>
      : [true] extends [IsExactly<T, number>]
        ? NumberNonMutatingMethods<InputSignal>
        : [true] extends [IsExactly<T, boolean>]
          ? BooleanMutatingAndNonMutatingMethods
          : {};
