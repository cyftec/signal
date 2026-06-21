import type { DerivedSignal } from "../derive";

/**
 * Base source signal type with value getter/setter.
 *
 * @template T - The type of value the signal holds
 */
export type BaseSourceSignal<T> = {
  /** Runtime type discriminator for source signals */
  type: "source-signal";
  /** Getter/setter for the signal's value */
  value: T;
};

/**
 * Base derived signal type with read-only value access.
 *
 * Derived signals are computed from other signals and automatically update
 * when their dependencies change.
 *
 * @template T - The type of value the signal holds
 *
 * @remarks
 * - Value is read-only (computed from dependencies)
 * - The `prevValue` getter provides access to the previous computed value
 * - Calling `dispose()` stops the signal from tracking its dependencies
 */
export type BaseDerivedSignal<T> = {
  /** Runtime type discriminator for derived signals */
  type: "derived-signal";
  /** The previous computed value (undefined on first computation) */
  get prevValue(): T | undefined;
  /** The current computed value */
  get value(): T;
  /**
   * Stops the derived signal from tracking its dependencies.
   *
   * After calling dispose(), the derived signal's value remains accessible
   * but will no longer update when its dependencies change.
   */
  dispose: () => void;
};

/**
 * Base signal type union for both source and derived signals.
 *
 * @template T - The type of value the signal holds
 *
 * @remarks
 * - Source signals have mutable values via the setter
 * - Derived signals have read-only values computed from dependencies
 */
export type BaseSignal<T> = BaseSourceSignal<T> | BaseDerivedSignal<T>;

/**
 * A function that can be registered to run when signal values change.
 *
 * Effects are created by the `effect()` function and track dependencies
 * by accessing `.value` on signals during execution.
 *
 * @remarks
 * - The effect function runs immediately when created
 * - It re-runs whenever any tracked signal's value changes
 * - The `canDisposeNow` flag marks the effect for disposal
 * - Calling `dispose()` sets `canDisposeNow` to true
 *
 * @see {@link effect} - For creating effects
 */
export type SignalsEffect = {
  /** The effect function body */
  (): void;
  /** Flag indicating whether the effect is marked for disposal */
  canDisposeNow: boolean;
  /** Marks the effect for disposal */
  dispose(): void;
};

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
 * Source signal for arrays with mutation and non-mutating methods.
 *
 * Array source signals include both mutating methods (push, pop, splice, etc.)
 * and non-mutating methods (map, filter, etc.) that return derived signals.
 *
 * @template T - The array type
 *
 * @see {@link ArraySourceSignalMethodsObject} - For array methods
 */
export type ArraySourceSignal<T extends any[]> = BaseSourceSignal<T> &
  ArraySourceSignalMethodsObject<T>;

/**
 * Mutating methods for object signals.
 *
 * @template T - The object type
 *
 * @remarks
 * - `set()` performs a shallow merge with the current value
 * - Triggers effects synchronously
 */
export type ObjectSourceSignalMethodsObject<T extends object> = {
  /** Performs a shallow merge with the current value */
  set: (partiallyNewObjectValue: Partial<T>) => void;
};

/**
 * Source signal for plain objects with partial update method.
 *
 * Object source signals include the `set()` method for partial updates and
 * non-mutating methods for accessing properties as derived signals.
 *
 * @template T - The object type
 *
 * @see {@link ObjectSourceSignalMethodsObject} - For object methods
 */
export type ObjectSourceSignal<T extends object> = BaseSourceSignal<T> &
  ObjectSourceSignalMethodsObject<T>;

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
 * Source signal for strings with non-mutating methods.
 *
 * String source signals include non-mutating methods that return derived signals.
 *
 * @see {@link StringSignalNonMutatingMethodsObject} - For string methods
 */
export type StringSourceSignal = BaseSourceSignal<string> &
  StringSignalNonMutatingMethodsObject;

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
 * Source signal for numbers with non-mutating methods.
 *
 * Number source signals include non-mutating methods that return derived signals.
 *
 * @see {@link NumberSignalNonMutatingMethodsObject} - For number methods
 */
export type NumberSourceSignal = BaseSourceSignal<number> &
  NumberSignalNonMutatingMethodsObject;

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

export type BooleanSignalMethodsObject = BooleanSignalMutatingMethodsObject &
  BooleanSignalNonMutatingMethodsObject;

/**
 * Source signal for booleans with non-mutating methods.
 *
 * Boolean source signals include non-mutating methods that return derived signals.
 *
 * @see {@link BooleanSignalNonMutatingMethodsObject} - For boolean methods
 */
export type BooleanSourceSignal = BaseSourceSignal<boolean> &
  BooleanSignalMethodsObject;

/**
 * A mutable source signal created from plain JavaScript data.
 *
 * Source signals can notify dependent computations when their value changes.
 * The specific type (array, object, string, number, or boolean) determines which
 * additional methods are available.
 *
 * @template T - The type of value the signal holds
 *
 * @remarks
 * - For arrays: includes array mutation methods (push, pop, splice, etc.)
 * - For plain objects: includes `set()` method for partial updates
 * - For strings: includes string methods (toLowerCase, toUpperCase, etc.)
 * - For numbers: includes number methods (toFixed, toPrecision, etc.)
 * - For booleans: includes boolean methods (not, toString)
 * - For other primitives: only the base signal interface
 *
 * @see {@link signal} - For creating source signals
 * @see {@link DerivedSignal} - For read-only derived signals
 */
export type SourceSignal<T> = T extends any[]
  ? ArraySourceSignal<T>
  : T extends object
    ? ObjectSourceSignal<T>
    : T extends string
      ? StringSourceSignal
      : T extends number
        ? NumberSourceSignal
        : T extends boolean
          ? BooleanSourceSignal
          : BaseSourceSignal<T>;
