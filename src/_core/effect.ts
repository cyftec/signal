import { setCurrentEffect, type SignalsEffect } from "./signal";

/**
 * Registers a function to run whenever its accessed signals change.
 *
 * The function runs immediately when `effect()` is called, and re-runs
 * synchronously whenever any tracked signal's value changes. Dependencies
 * are established by accessing `.value` on signals during execution.
 *
 * @param fn - A function that should access `.value` on signals to establish
 * dependencies. Contains side effects (logging, DOM updates, etc.).
 * @returns The input function augmented with `canDisposeNow` and `dispose()`
 * methods for cleanup
 *
 * @example
 * ```typescript
 * const count = signal(0);
 *
 * // Simple effect
 * effect(() => {
 *   console.log("Count is:", count.value);
 * });
 *
 * // Multiple signal tracking
 * const name = signal("John");
 * const age = signal(30);
 * effect(() => {
 *   console.log(`${name.value} is ${age.value} years old`);
 * });
 *
 * // Disposal
 * const eff = effect(() => {
 *   console.log(count.value);
 * });
 * eff.dispose();
 * count.value = 5; // Effect won't run
 * ```
 *
 * @remarks
 * - The function runs immediately when `effect()` is called
 * - Dependencies are only tracked for signals whose `.value` is accessed during execution
 * - If a signal is accessed conditionally and the condition is false on first run, it won't be tracked
 * - Effects run synchronously when dependencies change
 * - Disposal is lazy - effects are removed on the next signal update, not immediately
 *
 * @see {@link signal} - For creating signals
 * @see {@link derive} - For creating derived signals
 * @see {@link dispose} - For disposing multiple effects or derived signals
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
