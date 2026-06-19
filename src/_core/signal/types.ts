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
 * Array mutation methods for array signals.
 *
 * These methods provide mutating-style APIs that internally create new
 * immutable arrays and trigger effects.
 *
 * @template T - The array type
 *
 * @remarks
 * - The `remove()` method is a custom method (inverse of filter)
 * - All methods trigger effects synchronously
 * - Methods create new arrays internally but feel mutable
 */
export type BaseArraySignal<T extends any[]> = {
  copyWithin: (...args: Parameters<Array<T[number]>["copyWithin"]>) => void;
  fill: (...args: Parameters<Array<T[number]>["fill"]>) => void;
  pop: (...args: Parameters<Array<T[number]>["pop"]>) => void;
  push: (...args: Parameters<Array<T[number]>["push"]>) => void;
  /** Removes items where the predicate returns true (inverse of filter) */
  remove: (...args: Parameters<Array<T[number]>["filter"]>) => void;
  reverse: (...args: Parameters<Array<T[number]>["reverse"]>) => void;
  shift: (...args: Parameters<Array<T[number]>["shift"]>) => void;
  sort: (...args: Parameters<Array<T[number]>["sort"]>) => void;
  splice: (...args: Parameters<Array<T[number]>["splice"]>) => void;
  unshift: (...args: Parameters<Array<T[number]>["unshift"]>) => void;
};

/**
 * Object mutation methods for object signals.
 *
 * @template T - The object type
 *
 * @remarks
 * - The `set()` method performs a shallow merge with the current value
 */
export type BaseObjectSignal<T extends object> = {
  /** Performs a shallow merge with the current value */
  set: (partiallyNewObjectValue: Partial<T>) => void;
};

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
 * Source signal for arrays with mutation methods.
 *
 * @template T - The array type
 *
 * @see {@link BaseArraySignal} - For array mutation methods
 */
export type ArraySourceSignal<T extends any[]> = BaseSourceSignal<T> &
  BaseArraySignal<T>;

/**
 * Source signal for plain objects with partial update method.
 *
 * @template T - The object type
 *
 * @see {@link BaseObjectSignal} - For object mutation methods
 */
export type ObjectSourceSignal<T extends object> = BaseSourceSignal<T> &
  BaseObjectSignal<T>;

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
