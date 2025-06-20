import type { DerivedSignal } from "./derive";
import type { NonSignal } from "./non-signal";
import type { SourceSignal } from "./signal";

/** Either a source or a derived signal of type T*/
export type Signal<T> = SourceSignal<T> | DerivedSignal<T>;
/** Either a non-signal object or a plain value of type T*/
export type MaybeNonSignal<T> = T | NonSignal<T>;
/** Either of a source signal, a derived signal or a plain value of type T*/
export type MaybeSignal<T> = T | Signal<T>;
/** Either a source signal or a plain value of type T*/
export type MaybeSourceSignal<T> = T | SourceSignal<T>;
/** Either a derived signal or a plain value of type T*/
export type MaybeDerivedSignal<T> = T | DerivedSignal<T>;
/** Object only form of MaybeSignal */
export type MaybeSignalObject<T> = NonSignal<T> | Signal<T>;
/** MaybeSignal along with NonSignal object */
export type MaybeSignalValue<T> = T | NonSignal<T> | Signal<T>;

/** Converts an object with respective prop values into MaybeSignalValue(s)*/
export type MaybeSignalValues<T extends any[]> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? T[K]
    : MaybeSignalValue<T[K]>;
};
/** Extracts plain object by converting respective MaybeSignalValue prop
 * values into PlainValue(s)
 */
export type PlainValues<T extends MaybeSignalValues<any[]>> = {
  [K in keyof T]: T[K] extends MaybeSignalValue<infer V> ? V : never;
};
/** Extracts a plain value from a MaybeSignalValue*/
export type PlainValue<I extends MaybeSignalValue<unknown>> =
  I extends MaybeSignalObject<infer T> ? T : I;
