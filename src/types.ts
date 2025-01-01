export type SourceSignal<T> = {
  type: "source-signal";
  value: T;
};

export type DerivedSignal<T> = {
  type: "derived-signal";
  get prevValue(): T | undefined;
  get value(): T;
};

export type DerivedNonSignal<T> = {
  type: "non-signal";
  get value(): T;
};

export type Signal<T> = SourceSignal<T> | DerivedSignal<T>;
export type MaybeSourceSignal<T> = T | SourceSignal<T>;
export type MaybeDerivedSignal<T> = T | DerivedSignal<T>;
export type MaybeSignal<T> = MaybeSourceSignal<T> | MaybeDerivedSignal<T>;
export type MaybeSignalObject<T> = DerivedNonSignal<T> | Signal<T>;

export type Signalify<T = Record<string | number | symbol, never>> = {
  [K in keyof T]: T[K] extends Signal<unknown> ? T[K] : Signal<T[K]>;
};

export type DeSignalify<T = Record<string | number | symbol, never>> = {
  [K in keyof T]: T[K] extends Signal<infer R> ? R : T[K];
};

export type SignalSubscriber = (() => void) | null;
