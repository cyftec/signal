import { immut, newVal } from "@cyf__/immutjs";
import type {
  DerivedSignal,
  MaybeSignal,
  SignalSubscriber,
  SourceSignal,
} from "./types.ts";

let subscriber: SignalSubscriber = null;

export const signal = <T>(value: T): SourceSignal<T> => {
  let _value = immut(value);
  const subscriptions = new Set<SignalSubscriber>();

  return {
    type: "source-signal",
    get value() {
      if (subscriber) subscriptions.add(subscriber);
      return newVal(_value);
    },
    set value(newValue: T) {
      if (newValue === _value) return;
      _value = immut(newValue);
      subscriptions.forEach((callback) => callback && callback());
    },
  };
};

export const effect = (fn: () => void): void => {
  subscriber = fn;
  fn();
  subscriber = null;
};

/**
 * A method which return a read-only signal derived from one or many
 * source signals
 *
 * @param signalsValueDeriver A deriver method which processes one or many
 * signal values and returns the desired value to be used as derived signal
 * @returns a read-only signal which is returned from signalsValueDeriver param
 */
export const derived = <T>(
  /**
   * @param oldValue the previous return value of this method
   * @returns new derived value
   */
  signalsValueDeriver: (oldValue: T | undefined) => T
): DerivedSignal<T> => {
  let oldValue: T | undefined;
  const derivedSource = signal<T>(oldValue as T);
  effect(() => {
    oldValue = signalsValueDeriver(oldValue);
    derivedSource.value = oldValue;
  });

  const derivedSignal: DerivedSignal<T> = {
    type: "derived-signal",
    get prevValue() {
      return oldValue;
    },
    get value() {
      return derivedSource.value;
    },
  };

  return derivedSignal;
};

export const valueIsSourceSignal = (value: MaybeSignal<any>): boolean =>
  !!(value?.type === "source-signal");

export const valueIsDerivedSignal = (value: MaybeSignal<any>): boolean =>
  !!(value?.type === "derived-signal");

export const valueIsSignal = (value: MaybeSignal<any>): boolean =>
  ["source-signal", "derived-signal"].includes(value?.type);
