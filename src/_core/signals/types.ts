import { getBaseSignal } from "./base-signal";
import type { DeadSignal } from "./dead-signal";
import type { DerivedSignal } from "./derived-signal";
import type { SourceSignal } from "./source-signal";

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type BaseSignal<T> = ReturnType<typeof getBaseSignal<T>>;

export type BaseSourceSignal<T> = Prettify<
  BaseSignal<T> & { type: "source-signal" }
>;

export type BaseDerivedSignal<T> = Prettify<
  Omit<BaseSignal<T>, "type" | "value" | "mutate"> & {
    readonly type: "derived-signal";
    readonly value: T;
  }
>;

export type BaseDeadSignal<T> = Prettify<
  Omit<BaseDerivedSignal<T>, "type"> & {
    readonly type: "dead-signal";
  }
>;

/**
 * Base signal type union for both source and derived signals.
 *
 * @template T - The type of value the signal holds
 *
 * @remarks
 * - Source signals have mutable values via the setter
 * - Derived signals have read-only values computed from dependencies
 */
export type BaseLiveSignal<T> = BaseSourceSignal<T> | BaseDerivedSignal<T>;

/**
 * A union type representing either a source or derived signal.
 *
 * @template T - The type of value the signal holds
 *
 * @see {@link SourceSignal} - For mutable source signals
 * @see {@link DerivedSignal} - For read-only derived signals
 */
export type LiveSignal<T> = SourceSignal<T> | DerivedSignal<T>;

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
 * A union type representing either a dead-signal object or a plain value.
 *
 * @template T - The type of value
 *
 * @see {@link DeadSignal} - For dead-signal objects
 */
export type MaybeDeadSignal<T> = T | DeadSignal<T>;

/**
 * A union type representing a signal (live-signal or dead-signal).
 *
 * @template T - The type of value
 *
 * @see {@link LiveSignal} - For signal types
 * @see {@link DeadSignal} - For dead-signal type
 */
export type Signal<T> = LiveSignal<T> | DeadSignal<T>;

/**
 * A union type representing a signal, dead-signal, or plain value.
 *
 * This is the most permissive type for values that may or may not be signal.
 *
 * @template T - The type of value
 *
 * @see {@link Signal} - For signals
 */
export type MaybeSignal<T> = T | LiveSignal<T> | DeadSignal<T>;

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
      : S extends DeadSignal<infer NS | null | undefined>
        ? DeadSignal<NS>
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
 * If the input is a signal, returns the wrapped value.
 * Otherwise, returns the input as-is.
 *
 * @template I - The MaybeSignal type
 *
 * @see {@link MaybeSignal} - For the MaybeSignal type
 * @see {@link Signal} - For signals
 */
export type PlainValue<I extends MaybeSignal<unknown>> =
  I extends Signal<infer T> ? T : I;

/**
 * Extracts plain values from a `MaybeSignalValues` tuple.
 *
 * This is the inverse of MaybeSignalValues, converting signals
 * back to their plain types.
 *
 * @template T - The MaybeSignalValues tuple to extract from
 *
 * @see {@link MaybeSignalValues} - For the MaybeSignalValues type
 */
export type PlainValues<T extends MaybeSignalValues<any[]>> = {
  [K in keyof T]: T[K] extends MaybeSignal<infer V> ? V : never;
};
