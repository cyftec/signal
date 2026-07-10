import type { DerivedSignal } from "./derived-signal";
import type { NonSignal } from "./non-signal";
import { SourceSignal } from "./source-signal";

/**
 * A union type representing either a source or derived signal.
 *
 * @template T - The type of value the signal holds
 *
 * @see {@link SourceSignal} - For mutable source signals
 * @see {@link DerivedSignal} - For read-only derived signals
 */
export type Signal<T> = SourceSignal<T> | DerivedSignal<T>;

/**
 * A union type representing either a non-signal object or a plain value.
 *
 * @template T - The type of value
 *
 * @see {@link NonSignal} - For non-signal objects
 */
export type MaybeNonSignal<T> = T | NonSignal<T>;

/**
 * A union type representing a source signal or a plain value.
 *
 * @template T - The type of value
 *
 * @see {@link SourceSignal} - For source signal type
 */
export type MaybeSourceSignal<T> = T | SourceSignal<T>;

/**
 * A union type representing a derived signal or a plain value.
 *
 * @template T - The type of value
 *
 * @see {@link DerivedSignal} - For derived signal type
 */
export type MaybeDerivedSignal<T> = T | DerivedSignal<T>;

/**
 * A union type representing a signalified object (signal or non-signal).
 *
 * @template T - The type of value
 *
 * @see {@link Signal} - For signal types
 * @see {@link NonSignal} - For non-signal type
 */
export type SignalifiedObject<T> = NonSignal<T> | Signal<T>;

/**
 * A union type representing a signal, non-signal, or plain value.
 *
 * This is the most permissive type for values that may or may not be signalified.
 *
 * @template T - The type of value
 *
 * @see {@link SignalifiedObject} - For signalified objects
 */
export type MaybeSignal<T> = T | NonSignal<T> | Signal<T>;

/**
 * A utility type that removes `null` and `undefined` from signal realm types.
 *
 * This is similar to TypeScript's `NonNullable` but handles signal types specifically.
 *
 * @template S - The type to make non-null
 */
export type NonNullSignalValue<S> = S extends null | undefined
  ? never
  : S extends SourceSignal<infer SS | null | undefined>
    ? SourceSignal<SS>
    : S extends DerivedSignal<infer DS | null | undefined>
      ? DerivedSignal<DS>
      : S extends NonSignal<infer NS | null | undefined>
        ? NonSignal<NS>
        : S;

/**
 * Converts a tuple type to a tuple of `MaybeSignal` types.
 *
 * Functions are left as-is, while other values are converted to MaybeSignal.
 *
 * @template T - The tuple type to convert
 *
 * @see {@link MaybeSignal} - For the MaybeSignal type
 */
export type MaybeSignalValues<T extends any[]> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? T[K]
    : MaybeSignal<T[K]>;
};

/**
 * Extracts a plain value from a `MaybeSignal`.
 *
 * If the input is a signalified object, returns the wrapped value.
 * Otherwise, returns the input as-is.
 *
 * @template I - The MaybeSignal type
 *
 * @see {@link MaybeSignal} - For the MaybeSignal type
 * @see {@link SignalifiedObject} - For signalified objects
 */
export type PlainValue<I extends MaybeSignal<unknown>> =
  I extends SignalifiedObject<infer T> ? T : I;

/**
 * Extracts plain values from a `MaybeSignalValues` tuple.
 *
 * This is the inverse of MaybeSignalValues, converting signalified values
 * back to their plain types.
 *
 * @template T - The MaybeSignalValues tuple to extract from
 *
 * @see {@link MaybeSignalValues} - For the MaybeSignalValues type
 */
export type PlainValues<T extends MaybeSignalValues<any[]>> = {
  [K in keyof T]: T[K] extends MaybeSignal<infer V> ? V : never;
};

/**
 * A runtime type wrapper for plain values.
 *
 * NonSignal objects are used for runtime type discrimination in complex
 * type scenarios where TypeScript's compile-time types are insufficient.
 * They enable distinguishing between plain values and signalified objects
 * at runtime.
 *
 * @template T - The type of value wrapped
 *
 * @remarks
 * - Used with `MaybeSignal` types to resolve ambiguity at runtime
 * - Has a `type: "non-signal"` property for runtime type checking
 * - The `value` property holds the wrapped plain value
 *
 * @see {@link Signal} - For signal objects
 * @see {@link MaybeSignal} - For union types that include signals
 * @see {@link getNonSignalObject} - For creating NonSignal objects
 */
export type BaseNonSignal<T> = {
  /** Runtime type discriminator for non-signal objects */
  type: "non-signal";
  /** The wrapped plain value */
  get value(): T;
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
 * Base signalifed object type union for source signal, derived signal or non-signal object.
 *
 * @template T - The type of value the signalified object holds
 *
 * @remarks
 * - Source signals have mutable values via the setter
 * - Derived signals have read-only values computed from dependencies
 */
export type BaseSignalifiedObject<T> = BaseSignal<T> | BaseNonSignal<T>;
