import { immut, newVal } from "@cyftech/immutjs";
import {
  getArraySourceSignalMethodsObject,
  getBooleanSignalMethodsObject,
  getNumberSignalMethodsObject,
  getObjectSourceSignalMethodsObject,
  getStringSignalMethodsObject,
} from "./signal-methods-objects";
import { BaseSourceSignal, SignalsEffect, SourceSignal } from "./types";

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
 * Creates a mutable source signal from any JavaScript value.
 *
 * A signal is a reactive data unit that automatically notifies dependent
 * computations when its value changes. Signals use a global variable-based
 * dependency tracking system to establish relationships with effects.
 *
 * @template T - The type of value the signal holds
 * @param input - Any JavaScript value to convert to a signal
 * @returns A source signal with a `value` getter/setter. Arrays include
 * mutation methods and plain objects include `set()`.
 *
 * @example
 * ```typescript
 * // Primitive values
 * const count = signal(0);
 * count.value = 1;
 * console.log(count.value); // 1
 *
 * // Object values with partial updates
 * const user = signal({ name: "John", age: 30 });
 * user.set({ age: 31 }); // Shallow merge
 * console.log(user.value); // { name: "John", age: 31 }
 *
 * // Array values with mutation methods
 * const items = signal([1, 2, 3]);
 * items.push(4);
 * items.remove((item) => item % 2 === 0); // Custom method
 * ```
 *
 * @remarks
 * - Setting the same value does not trigger effects
 * - Effects are triggered synchronously and immediately upon value change
 * - Signal values are stored immutably via `@cyftech/immutjs`
 * - Object `set()` performs a shallow merge
 * - Array mutation methods create new arrays internally
 *
 * @see {@link effect} - For registering functions to run when signal values change
 * @see {@link derive} - For creating read-only derived signals
 */
export const signal = <T>(input: T): SourceSignal<T> => {
  let _value = immut(input);
  const _effects = new Set<SignalsEffect>();

  /**
   * Runs all registered effects when the signal's value changes.
   *
   * This function iterates through all effects and:
   * 1. Skips effects marked for disposal (canDisposeNow = true)
   * 2. Removes disposed effects from the set (lazy cleanup)
   * 3. Executes remaining effects
   *
   * The lazy cleanup approach ensures that effects are removed on the next
   * signal update after being disposed, rather than immediately.
   */
  const runEffects = () => {
    _effects.forEach((effect) => {
      if (effect.canDisposeNow) {
        _effects.delete(effect);
        return;
      }
      effect();
    });
  };

  /**
   * Updates the signal's value and triggers all dependent effects.
   *
   * This function is used internally by the signal's setter and by
   * type-specific mutation methods (for arrays and objects).
   *
   * @param newValue The new value to set
   */
  const setValueAndRunEffects = (newValue: T): void => {
    _value = newValue;
    runEffects();
  };

  const baseSourceSignal: BaseSourceSignal<T> = {
    type: "source-signal",
    get value() {
      // Automatic dependency tracking: if an effect is currently executing,
      // register this effect as a dependency of this signal
      if (_currentSignalEffect) _effects.add(_currentSignalEffect);
      // Return a fresh copy of the immutable value
      return newVal(_value);
    },
    set value(newValue: T) {
      // Skip if value hasn't changed (prevents unnecessary effect runs)
      // TODO: if using 'areValuesEqual' from immutjs would be expensive for large data, consider a more efficient equality check or always trigger effects
      if (newValue === _value) return;
      // Store new value immutably and trigger effects
      setValueAndRunEffects(immut(newValue));
    },
  };

  /**
   * Type-specific signal creation:
   * - Arrays get array mutation methods and non-mutating derived signal methods
   * - Plain objects get the `set()` method for partial updates and non-mutating derived signal methods
   * - Strings get non-mutating derived signal methods
   * - Numbers get non-mutating derived signal methods
   * - Booleans get non-mutating derived signal methods
   * - Other primitives get only the base signal interface
   *
   * The type-specific methods use setValueAndRunEffects to ensure
   * immutability and effect triggering.
   */
  const result: SourceSignal<T> = (
    Array.isArray(input)
      ? Object.assign(
          baseSourceSignal,
          getArraySourceSignalMethodsObject(
            (mutatorMethod) =>
              setValueAndRunEffects(mutatorMethod(_value as unknown[]) as T),
            baseSourceSignal as BaseSourceSignal<any[]>,
          ),
        )
      : typeof input === "object" && input !== null
        ? Object.assign(
            baseSourceSignal,
            getObjectSourceSignalMethodsObject((mutatorMethod) =>
              setValueAndRunEffects(mutatorMethod(_value as object) as T),
            ),
          )
        : typeof input === "string"
          ? Object.assign(
              baseSourceSignal,
              getStringSignalMethodsObject(
                baseSourceSignal as BaseSourceSignal<string>,
              ),
            )
          : typeof input === "number"
            ? Object.assign(
                baseSourceSignal,
                getNumberSignalMethodsObject(
                  baseSourceSignal as BaseSourceSignal<number>,
                ),
              )
            : typeof input === "boolean"
              ? Object.assign(
                  baseSourceSignal,
                  getBooleanSignalMethodsObject(
                    (mutatorMethod) =>
                      setValueAndRunEffects(
                        mutatorMethod(_value as boolean) as T,
                      ),
                    baseSourceSignal as BaseSourceSignal<boolean>,
                  ),
                )
              : baseSourceSignal
  ) as SourceSignal<T>;

  return result;
};
