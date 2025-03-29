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

/**
 * It is the object format, similar to Signal, of plain value of type T.
 *
 * Using MaybeSignal adds a level of ambiguity to the incoming variable. During
 * compile time TypeScript is smart enough to differentiate between type T
 * and Signal<T> for a given MaybeSignal<T>. But at runtime it becomes more cumbersome.
 *
 * @see Signal
 * @see MaybeSignal
 *
 */
export type NonSignal<T> = {
  type: "non-signal";
  get value(): T;
};

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

/**
 * Handy (derived-signal) properties and methods for most commonly used scenarios
 */
export type ComputedSignalsObject<T> = {
  or: (orValue: NonNullable<T>) => DerivedSignal<NonNullable<T>>;
  orIfNullish: (orValue: NonNullable<T>) => DerivedSignal<NonNullable<T>>;
  oneOf: <Tr, Fl>(
    ifTruthy: MaybeSignalValue<Tr>,
    ifFalsy: MaybeSignalValue<Fl>
  ) => DerivedSignal<Tr | Fl>;
  get string(): DerivedSignal<string>;
  get bool(): DerivedSignal<boolean>;
  get bools(): DerivedSignal<readonly [boolean, boolean]>;
};
