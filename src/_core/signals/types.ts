import { DeadSignal } from "./dead-signal";
import { DerivedSignal } from "./derived-signal";
import { MutableSignal } from "./mutable-signal";

export type Primitive = string | number | bigint | boolean | null | undefined;

export type SignalType = "mutable-signal" | "derived-signal" | "dead-signal";

/**
 * A union type representing either a source or derived signal.
 *
 * @template T - The type of value the signal holds
 *
 * @see {@link MutableSignal} - For mutable source signals
 * @see {@link DerivedSignal} - For read-only derived signals
 */
export type LiveSignal<T> = MutableSignal<T> | DerivedSignal<T>;

/**
 * A union type representing a signalified object (signal or dead-signal).
 *
 * @template T - The type of value
 *
 * @see {@link LiveSignal} - For signal types
 * @see {@link DeadSignal} - For dead-signal type
 */
export type Signal<T> = LiveSignal<T> | DeadSignal<T>;

/**
 * A union type representing a source signal or a plain value.
 *
 * @template T - The type of value
 *
 * @see {@link MutableSignal} - For source signal type
 */
export type MaybeMutableSignal<T> = T | MutableSignal<T>;

/**
 * A union type representing a derived signal or a plain value.
 *
 * @template T - The type of value
 *
 * @see {@link DerivedSignal} - For derived signal type
 */
export type MaybeDerivedSignal<T> = T | DerivedSignal<T>;

/**
 * A union type representing either a dead-signal object or a plain value.
 *
 * @template T - The type of value
 *
 * @see {@link DeadSignal} - For dead-signal objects
 */
export type MaybeDeadSignal<T> = T | DeadSignal<T>;

/**
 * A union type representing a signal, dead-signal, or plain value.
 *
 * This is the most permissive type for values that may or may not be signalified.
 *
 * @template T - The type of value
 *
 * @see {@link Signal} - For signalified objects
 */
export type MaybeSignal<T> = T | Signal<T>;

/**
 * A utility type that removes `null` and `undefined` from signal realm types.
 *
 * This is similar to TypeScript's `NonNullable` but handles signal types specifically.
 *
 * @template S - The type to make non-null
 */
export type NonNullSignalValue<S> = S extends null | undefined
  ? never
  : S extends MutableSignal<infer MTS | null | undefined>
    ? MutableSignal<MTS>
    : S extends DerivedSignal<infer DRS | null | undefined>
      ? DerivedSignal<DRS>
      : S extends DeadSignal<infer DDS | null | undefined>
        ? DeadSignal<DDS>
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
export type MaybeSignalsArray<T extends any[]> = {
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
 * @see {@link Signal} - For signalified objects
 */
export type PlainValue<I extends MaybeSignal<unknown>> =
  I extends Signal<infer T> ? T : I;

/**
 * Extracts plain values from a `MaybeSignalsArray` tuple.
 *
 * This is the inverse of MaybeSignalsArray, converting signalified values
 * back to their plain types.
 *
 * @template T - The MaybeSignalsArray tuple to extract from
 *
 * @see {@link MaybeSignalsArray} - For the MaybeSignalsArray type
 */
export type PlainValuesArray<T extends MaybeSignalsArray<any[]>> = {
  [K in keyof T]: T[K] extends MaybeSignal<infer V> ? V : never;
};
