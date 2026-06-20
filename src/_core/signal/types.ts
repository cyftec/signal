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


export type ArraySignalIntrinsicMutatingMethodsObject<T extends any[]> = {
  // Mutating methods
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

export type ArraySignalCustomMutatingMethodsObject<T extends any[]> = { 
  /** Keeps items where the predicate returns true */
  keep: (...args: Parameters<Array<T[number]>["filter"]>) => void;
  /** Removes items where the predicate returns true*/
  remove: (...args: Parameters<Array<T[number]>["filter"]>) => void;
};


export type ArraySignalMutatingMethodsObject<T extends any[]> = ArraySignalIntrinsicMutatingMethodsObject<T> & ArraySignalCustomMutatingMethodsObject<T>;


/**
 * Non-mutating methods for derived array signals.
 *
 * Derived signals are read-only, so they only get non-mutating methods
 * that return new derived signals.
 *
 * @template T - The array type
 *
 * @remarks
 * - All methods return derived signals
 * - No mutating methods (derived signals are read-only)
 */
export type ArraySignalIntrinsicNonMutatingMethodsObject<T extends any[]> = {
  at: (...args: Parameters<Array<T[number]>["at"]>) => DerivedSignal<ReturnType<Array<T[number]>["at"]>>;
  concat: (...args: Parameters<Array<T[number]>["concat"]>) => DerivedSignal<ReturnType<Array<T[number]>["concat"]>>;
  every: (...args: Parameters<Array<T[number]>["every"]>) => DerivedSignal<ReturnType<Array<T[number]>["every"]>>;
  filter: (...args: Parameters<Array<T[number]>["filter"]>) => DerivedSignal<ReturnType<Array<T[number]>["filter"]>>;
  find: (...args: Parameters<Array<T[number]>["find"]>) => DerivedSignal<ReturnType<Array<T[number]>["find"]>>;
  findIndex: (...args: Parameters<Array<T[number]>["findIndex"]>) => DerivedSignal<ReturnType<Array<T[number]>["findIndex"]>>;
  findLast: (...args: Parameters<Array<T[number]>["findLast"]>) => DerivedSignal<ReturnType<Array<T[number]>["findLast"]>>;
  findLastIndex: (...args: Parameters<Array<T[number]>["findLastIndex"]>) => DerivedSignal<ReturnType<Array<T[number]>["findLastIndex"]>>;
  get length(): DerivedSignal<number>;
  map:  <U>(mapFn: (item: T[number], index: number, array: T) => U) => DerivedSignal<U[]>;
  reduce: <U>(reducerFn: ( previousValue: U, currentValue: T[number], currentIndex: number, array: T) => U, initialValue: U) => DerivedSignal<U>;
  reduceRight: <U>(reducerFn: ( previousValue: U, currentValue: T[number], currentIndex: number, array: T) => U, initialValue: U) => DerivedSignal<U>;
  some:  (...args: Parameters<Array<T[number]>["some"]>) => DerivedSignal<ReturnType<Array<T[number]>["some"]>>;
  toReversed: (...args: Parameters<Array<T[number]>["toReversed"]>) => DerivedSignal<ReturnType<Array<T[number]>["toReversed"]>>;
  toSorted: (...args: Parameters<Array<T[number]>["toSorted"]>) => DerivedSignal<ReturnType<Array<T[number]>["toSorted"]>>;
  toSpliced: (...args: Parameters<Array<T[number]>["toSpliced"]>) => DerivedSignal<ReturnType<Array<T[number]>["toSpliced"]>>;
};

export type ArraySignalCustomNonMutatingMethodsObject<T extends any[]> = {
  /** Last item of the array. */
  get lastItem(): DerivedSignal<T[number] | undefined>;
  /** Custom method that splits the array into `[passing, failing]` based on a predicate. */
  partition: (...args: Parameters<Array<T[number]>["filter"]>) => readonly [DerivedSignal<T>, DerivedSignal<T>];
};

export type ArraySignalNonMutatingMethodsObject<T extends any[]> =  ArraySignalIntrinsicNonMutatingMethodsObject<T> & ArraySignalCustomNonMutatingMethodsObject<T>;


/**
 * Array mutation and non-mutating methods for array signals.
 *
 * These methods provide both mutating-style APIs that internally create new
 * immutable arrays and trigger effects, and non-mutating methods that return
 * derived signals.
 *
 * @template T - The array type
 *
 * @remarks
 * - The `remove()` method is a custom method (inverse of filter)
 * - Mutating methods trigger effects synchronously
 * - Non-mutating methods return derived signals
 * - Methods create new arrays internally but feel mutable
 */
export type ArraySourceSignalMethodsObject<T extends any[]> = ArraySignalMutatingMethodsObject<T> & ArraySignalNonMutatingMethodsObject<T>;

/**
 * Source signal for arrays with mutation methods.
 *
 * @template T - The array type
 *
 * @see {@link ArraySourceSignalMethodsObject} - For array mutation methods
 */
export type ArraySourceSignal<T extends any[]> = BaseSourceSignal<T> &
  ArraySourceSignalMethodsObject<T>;

export type ObjectSignalMutatingMethodsObject<T extends object> = {
  /** Performs a shallow merge with the current value */
  set: (partiallyNewObjectValue: Partial<T>) => void;
};

/**
 * Non-mutating methods for derived object signals.
 *
 * Derived signals are read-only, so they only get non-mutating methods
 * that return new derived signals.
 *
 * @template T - The object type
 *
 * @remarks
 * - All methods return derived signals
 * - No mutating methods (derived signals are read-only)
 */
export type ObjectSignalNonMutatingMethodsObject<T extends object> = {
  /** Returns a derived signal for a specific property. */
  get: <K extends keyof T>(key: K) => DerivedSignal<T[K]>;
  /** Returns an object with all properties as derived signals. */
  get withLiveProps(): { [key in keyof T]: DerivedSignal<T[key]> };
  /** Returns the object's keys as a derived signal. */
  get keys(): DerivedSignal<string[]>;
};

/**
 * Object mutation and non-mutating methods for object signals.
 *
 * @template T - The object type
 *
 * @remarks
 * - The `set()` method performs a shallow merge with the current value
 * - Non-mutating methods return derived signals
 */
export type ObjectSourceSignalMethodsObject<T extends object> = ObjectSignalMutatingMethodsObject<T> & ObjectSignalNonMutatingMethodsObject<T>;

/**
 * Source signal for plain objects with partial update method.
 *
 * @template T - The object type
 *
 * @see {@link ObjectSourceSignalMethodsObject} - For object mutation methods
 */
export type ObjectSourceSignal<T extends object> = BaseSourceSignal<T> &
  ObjectSourceSignalMethodsObject<T>;

/**
 * A mutable source signal created from plain JavaScript data.
 *
 * Source signals can notify dependent computations when their value changes.
 * The specific type (array, object, or primitive) determines which additional
 * methods are available.
 *
 * @template T - The type of value the signal holds
 *
 * @remarks
 * - For arrays: includes array mutation methods (push, pop, splice, etc.)
 * - For plain objects: includes `set()` method for partial updates
 * - For primitives: only the base signal interface
 *
 * @see {@link signal} - For creating source signals
 * @see {@link DerivedSignal} - For read-only derived signals
 */
export type SourceSignal<T> = T extends any[]
  ? ArraySourceSignal<T>
  : T extends object
  ? ObjectSourceSignal<T>
  : BaseSourceSignal<T>;
