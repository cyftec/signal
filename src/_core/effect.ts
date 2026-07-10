/**
 * Global variable that tracks the currently executing effect.
 *
 * This is used for automatic dependency tracking: when a signal's value is accessed
 * during effect execution, the signal registers this effect as a dependency.
 * The effect function sets this variable before running the user's function,
 * and clears it after.
 *
 * @see effect function in effect.ts
 */
let _currentSignalEffect: SignalsEffect | null = null;

/**
 * Gets the currently executing effect.
 *
 * Called by the source signal function to extract current registered effect.
 *
 * @returns currently registred effect, or null if cleared
 */
export const getCurrentEffect = (): SignalsEffect | null =>
  _currentSignalEffect;

/**
 * Sets the currently executing effect.
 *
 * Called by the effect function before running the user's function to enable
 * automatic dependency tracking. After the effect completes, this is set to null.
 *
 * @param effect - The effect to set as current, or `null` to clear tracking
 */
export const setCurrentEffect = (effect: SignalsEffect | null) =>
  (_currentSignalEffect = effect);

/**
 * A function that can be registered to run when signal values change.
 *
 * Effects are created by the `effect()` function and track dependencies
 * by accessing `.value` on signals during execution.
 *
 * @remarks
 * - The effect function runs immediately when created
 * - It re-runs whenever any tracked signal's value changes
 * - The `canDisposeNow` flag marks the effect for disposal
 * - Calling `dispose()` sets `canDisposeNow` to true
 *
 * @see {@link effect} - For creating effects
 */
export type SignalsEffect = {
  /** The effect function body */
  (): void;
  /** Flag indicating whether the effect is marked for disposal */
  canDisposeNow: boolean;
  /** Marks the effect for disposal */
  dispose(): void;
};

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
