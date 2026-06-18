import { immut, newVal } from "@cyftech/immutjs";
import { getArraySignalBaseObject } from "./array-signal";
import { getObjectSignalBaseObject } from "./object-signal";
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
 * @param effect The effect to set as current, or null to clear
 */
export const setCurrentEffect = (effect: SignalsEffect | null) =>
  (_currentSignalEffect = effect);

/**
 * A function which converts plain javascript data into a signal.
 *
 * A signal is a basic data unit that can automatically alert functions or
 * computations when the data it holds changes.
 *
 * The automatic alert of the changed value occurs with the help of an effect
 * method. See the 'effect' method implementation in this project for details
 * about how it enables a signal to propagate changes
 *
 * @param input any javascript data type which need to be changed into a signal
 * @returns a signalified version of plain javascript data
 */
export const signal = <T>(input: T): SourceSignal<T> => {
  // Store the value immutably using @cyftech/immutjs
  let _value = immut(input);
  // Set of effects that depend on this signal
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

  const baseObject: BaseSourceSignal<T> = {
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
   * - Arrays get array mutation methods (push, pop, etc.)
   * - Plain objects get the set method for partial updates
   * - Primitives get only the base signal interface
   *
   * The type-specific methods use setValueAndRunEffects to ensure
   * immutability and effect triggering.
   */
  return (
    Array.isArray(input)
      ? Object.assign(
          baseObject,
          getArraySignalBaseObject((method) =>
            setValueAndRunEffects(method(_value as unknown[]) as T),
          ),
        )
      : typeof input === "object" && input !== null
        ? Object.assign(
            baseObject,
            getObjectSignalBaseObject((method) =>
              setValueAndRunEffects(method(_value as unknown[]) as T),
            ),
          )
        : baseObject
  ) as SourceSignal<typeof input>;
};
