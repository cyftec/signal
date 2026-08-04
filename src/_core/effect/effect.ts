import { EffectHook } from "./hook";
import { BaseSignal } from "../signals/base-signal";

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
export type Effect = {
  get isDisposed(): boolean;
  get dependentSignals(): Set<BaseSignal<any>>;
  run(): void;
  registerStimulusSignal(signal: BaseSignal<any>): void;
  registerDependentSignal(signal: BaseSignal<any>): void;
  removeAllSignals(): void;
  dispose(): void;
};

/**
 * Registers a function to run whenever its accessed signals change.
 *
 * The function runs immediately when `effect()` is called, and re-runs
 * synchronously whenever any tracked signal's value changes. Dependencies
 * are established by accessing `.value` on signals during execution.
 *
 * @remarks
 * - The function runs immediately when `effect()` is called
 * - Dependencies are only tracked for signals whose `.value` is accessed during execution
 * - If a signal is accessed conditionally and the condition is false on first run, it won't be tracked
 * - Effects run synchronously when dependencies change
 * - Disposal is lazy - effects are removed on the next signal update, not immediately
 *
 * @param signalsCatcherFn - A function that should access `.value` on signals to establish
 * dependencies. Contains side effects (logging, DOM updates, etc.).
 *
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
 * @see {@link signal} - For creating signals
 * @see {@link derive} - For creating derived signals
 * @see {@link dispose} - For disposing multiple effects or derived signals
 */
export const effect = (signalsCatcherFn: () => void): Effect => {
  let _isDisposed = false;
  const _stimulusSignals = new Set<BaseSignal<any>>();
  const _dependentSignals = new Set<BaseSignal<any>>();

  const signalsCatcherEffect: Effect = {
    get isDisposed(): boolean {
      return _isDisposed;
    },

    get dependentSignals() {
      return _dependentSignals;
    },

    run(): void {
      if (_isDisposed) return;
      signalsCatcherFn();
    },

    registerStimulusSignal(signal: BaseSignal<any>): void {
      if (_isDisposed)
        throw `Register source signal failed. This receiver is already destroyed.`;
      _stimulusSignals.add(signal);
    },

    registerDependentSignal(signal: BaseSignal<any>): void {
      if (_isDisposed)
        throw `Register dependent signal failed. This receiver is already destroyed.`;
      _dependentSignals.add(signal);
    },

    removeAllSignals(): void {
      _stimulusSignals.forEach((signal) => {
        signal.removeEffect(this);
      });
      _stimulusSignals.clear();
      _dependentSignals.clear();
    },

    dispose(): void {
      if (_isDisposed) throw `This receiver is already destroyed.`;
      this.removeAllSignals();
      _isDisposed = true;
    },
  };

  EffectHook.setCurrentEffect(signalsCatcherEffect);
  signalsCatcherEffect.run();
  EffectHook.setCurrentEffect(null);

  return signalsCatcherEffect;
};
