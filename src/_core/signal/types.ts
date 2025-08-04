export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

/**
 * A function which should contain one or many signals along with
 * their values in its definition. It is executed every time the value
 * of any of the signals (which is used inside function's definition) is changed.
 */
export type SignalsEffect = {
  (): void;
  canDisposeNow: boolean;
  dispose(): void;
};

export type BaseArraySignal<T extends any[]> = {
  copyWithin: (...args: Parameters<Array<T[number]>["copyWithin"]>) => void;
  fill: (...args: Parameters<Array<T[number]>["fill"]>) => void;
  pop: (...args: Parameters<Array<T[number]>["pop"]>) => void;
  push: (...args: Parameters<Array<T[number]>["push"]>) => void;
  remove: (...args: Parameters<Array<T[number]>["filter"]>) => void;
  reverse: (...args: Parameters<Array<T[number]>["reverse"]>) => void;
  shift: (...args: Parameters<Array<T[number]>["shift"]>) => void;
  sort: (...args: Parameters<Array<T[number]>["sort"]>) => void;
  splice: (...args: Parameters<Array<T[number]>["splice"]>) => void;
  unshift: (...args: Parameters<Array<T[number]>["unshift"]>) => void;
};

export type BaseObjectSignal<T extends object> = {
  set: (partiallyNewObjectValue: Partial<T>) => void;
};

export type BaseSourceSignal<T> = {
  type: "source-signal";
  value: T;
};

export type ArraySourceSignal<T extends any[]> = Prettify<
  BaseSourceSignal<T> & BaseArraySignal<T>
>;

export type ObjectSourceSignal<T extends object> = Prettify<
  BaseSourceSignal<T> & BaseObjectSignal<T>
>;

/**
 * It executes the subscriber functions when a new ```value``` is set.
 *
 * It can be used to derive a read-only version of the signal.
 * @see DerivedSignal
 */
export type SourceSignal<T> = T extends any[]
  ? ArraySourceSignal<T>
  : T extends object
  ? ObjectSourceSignal<T>
  : BaseSourceSignal<T>;
