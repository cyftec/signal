import type { DerivedSignal } from "./derive";
import type { NonSignal } from "./non-signal";
import type { SourceSignal } from "./signal";

/** Either a source or a derived signal of type T*/
export type Signal<T> = SourceSignal<T> | DerivedSignal<T>;
/** Either a source signal or a plain value of type T*/
export type MaybeSourceSignal<T> = T | SourceSignal<T>;
/** Either a derived signal or a plain value of type T*/
export type MaybeDerivedSignal<T> = T | DerivedSignal<T>;
/** Either of a source signal, a derived signal or a plain value of type T*/
export type MaybeSignal<T> = T | Signal<T>;
/**
 * Object only form of MaybeSignal
 */
export type MaybeSignalObject<T> = NonSignal<T> | Signal<T>;
/**
 * MaybeSignal along with NonSignal object
 */
export type MaybeSignalValue<T> = NonSignal<T> | MaybeSignal<T>;
export type MaybeSignalValues<T extends any[]> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? T[K]
    : MaybeSignalValue<T[K]>;
};
export type PlainValues<T extends MaybeSignalValues<any[]>> = {
  [K in keyof T]: T[K] extends MaybeSignalValue<infer V> ? V : never;
};
