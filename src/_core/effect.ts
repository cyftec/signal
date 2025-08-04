import { setCurrentEffect, type SignalsEffect } from "./signal";

/**
 * A function which takes a function as argument and this argument
 * input function should (ideally) contain one or many signals
 * whose values are called with '<some_signal>.value'.
 *
 * When an 'effect' is run, its argument input function gets registered
 * to all the signals whose values are called inside that function
 *
 * @param fn a signal currentEffect function
 * @returns the same input function but modified into a SignalsEffect type,
 * for using it to dispose the effect when necessary
 *
 * 1. Correct usage: one or many signals values are called/used,
 * ```
 * effect(() => {
 *   console.log(someSignal.value);
 *   someGlobalVar = anotherNumberSignal.value + 42;
 * })
 * ```
 * For above code the effect function will be executed every time when
 * any of `someSignal`'s or `anotherNumberSignal`'s value is changed.
 *
 * 2. Incorrect usage: ```'.value'``` is not used inside effect function,
 * ```
 * let someSignal: Signal<any>;
 * effect(() => {
 *   someSignal = anotherSignal;
 * })
 * ```
 * Above code will only execute only once and never again.
 *
 * 3. A noteworthy case when effect function runs only once,
 * ```
 * effect(() => {
 *   if(false) return;
 *   console.log(someSignal.value);
 * })
 * ```
 * In above code, since the `someSignal.value` is never called due to
 * prior if statement return. This effect is not registered to `someSignal`
 * signal. And hence will never run after first time.
 */
export const effect = (fn: () => void): SignalsEffect => {
  const signalsEffect = fn as SignalsEffect;
  signalsEffect.canDisposeNow = false;
  signalsEffect.dispose = () => {
    signalsEffect.canDisposeNow = true;
  };

  setCurrentEffect(signalsEffect);
  fn();
  setCurrentEffect(null);

  return signalsEffect;
};
