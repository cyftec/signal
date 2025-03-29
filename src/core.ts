import { immut, newVal } from "@cyftech/immutjs";
import type { DerivedSignal, SourceSignal } from "./types.ts";

/**
 * A function which should contain one or many signals along with
 * their values in its definition. It is executed every time the value
 * of any of the signals (which is used inside function's definition) is changed.
 *
 * 1. Correct usage: one or many signals with their values,
 * ```
 * const subscriberFn = () => {
 *   console.log(someSignal.value);
 *   someGlobalVar = anotherNumberSignal.value + 42;
 * }
 * ```
 * For above code the subscriber function will be executed every time when
 * any of ```someSignal``` or ```anotherNumberSignal``` is changed.
 *
 * 2. Incorrect usage: ```'.value'``` is not used inside subscriber function,
 * ```
 * let someSignal: Signal<any>;
 * const subscriberFn = () => {
 *   someSignal = anotherSignal;
 * }
 * ```
 * Above code will only execute the first time and never later.
 */
export type SignalSubscriberMethod = () => void;
export type SignalSubscriber = SignalSubscriberMethod | null;

let subscriber: SignalSubscriber = null;

/**
 * A function which converts plain javascript data into a signal.
 *
 * A signal is a basic data unit that can automatically alert functions or
 * computations when the data it holds changes.
 *
 * The automatic alert of the changed value occurs with the help of an effect method
 * @see effect
 * for details about how it enables a signal to propagate changes
 *
 * @param value any javascript data type which need to be changed into a signal
 * @returns a signalified version of plain javascript data
 */
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

/**
 * A function which registers the subscriber function to the signal.
 * The subsciber funtion gets registered to the signal only when the
 * given signal is used along with its getter ```.value``` inside the
 * subscriber function.
 *
 * @param fn a signal subscriber function
 */
export const effect = (fn: SignalSubscriberMethod): void => {
  subscriber = fn;
  fn();
  subscriber = null;
};

/**
 * A function that should be passed to 'derive' method for getting a derived value signal
 *
 * It should (ideally) contain one or many signals along with their values. It processes
 * those signal values and returns the value desired to be used as value of the derived signal
 * @param oldValue the previous return value of this method
 * @return any value desired to be used as value of derived signal
 * @see derive
 *
 *
 * Examples:
 * 1. Correct usage: one or many signals with their values,
 * ```
 * const numberDeriver = () => {
 *   console.log(someSignal.value);
 *   return anotherNumberSignal.value + 42;
 * }
 * ```
 * For above code the numberDeriver function will be executed every time when
 * any of ```someSignal``` or ```anotherNumberSignal``` is changed.
 *
 * 2. Incorrect usage: ```'.value'``` is not used inside deriver function,
 * ```
 * let someSignal: Signal<any>;
 * const numberDeriver = () => {
 *   someSignal = anotherSignal;
 *   return 42;
 * }
 * ```
 * Above code will only execute the first time and never later.
 */
export type DerivedValueGetterWithSignals<T> = (oldValue: T | undefined) => T;

/**
 * A method which return a read-only signal derived from one or many
 * source signals
 *
 * @param valueGetterFn A deriver method which processes one or many signal values
 * and returns the value desired to be used as value of the derived signal
 * @see DerivedValueGetterWithSignals
 * @returns a read-only signal which is returned from valueGetterFn param
 */
export const derive = <T>(
  valueGetterFn: DerivedValueGetterWithSignals<T>
): DerivedSignal<T> => {
  let oldValue: T | undefined;
  const derivedSource = signal<T>(oldValue as T);
  effect(() => {
    oldValue = valueGetterFn(oldValue);
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
