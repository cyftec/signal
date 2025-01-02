/**
 * It executes the subscriber functions when a new ```value``` is set.
 *
 * It can be used to derive a read-only version of the signal.
 * @see DerivedSignal
 */
export type SourceSignal<T> = {
  type: "source-signal";
  value: T;
};

/**
 * It is the read-only version of a source signal.
 *
 * A derived signal can be derived from both a source and/or an another
 * derived signal. The subscribers of a derived signal are triggered only when the value of a
 * root source signal (from where it is derived), changes.
 *
 * @see SourceSignal
 */
export type DerivedSignal<T> = {
  type: "derived-signal";
  get prevValue(): T | undefined;
  get value(): T;
};

/** Either a source or a derived signal of type T*/
export type Signal<T> = SourceSignal<T> | DerivedSignal<T>;
/** Either a source signal or a plain value of type T*/
export type MaybeSourceSignal<T> = T | SourceSignal<T>;
/** Either a derived signal or a plain value of type T*/
export type MaybeDerivedSignal<T> = T | DerivedSignal<T>;
/** Either of a source signal, a derived signal or a plain value of type T*/
export type MaybeSignal<T> = MaybeSourceSignal<T> | MaybeDerivedSignal<T>;
