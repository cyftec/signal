import { effect } from "./effect.js";
import { signal } from "./signal.js";

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
  /**
   * The DerivedSignal are derived using the @see effect method.
   *
   * There are scenarios when a derived signal is not required any more.
   * But even in this case, their deriver (effect) method runs every time any of
   * the dependent signals change. To unregister those effects from all the
   * dependent signals, this method simply changes the disposable status of those
   * methods. The dependent signals, upon finding if the effect method is
   * disposable, unregisters them and never run them again.
   */
  dispose: () => void;
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
  const derivedSourceUpdator = effect(() => {
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
    dispose() {
      derivedSourceUpdator.dispose();
    },
  };

  return derivedSignal;
};
