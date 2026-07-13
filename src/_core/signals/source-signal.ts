import { immut, isPlainObject, newVal } from "@cyftec/immut";
import {
  getArraySourceSignalMethodsObject,
  getBooleanSignalMethodsObject,
  getLogicalMethods,
  getNumberSignalMethodsObject,
  getObjectSourceSignalMethodsObject,
  getStringSignalMethodsObject,
  LogicalMethods,
  MutatingAndNonMutatingMethodsObject,
} from "../data-specific-methods";
import { getCurrentEffect, SignalsEffect } from "../effect";
import { BaseSourceSignal } from "./types";

/**
 * A mutable source signal created from plain JavaScript data.
 *
 * Source signals can notify dependent computations when their value changes.
 * The specific type (array, object, string, number, or boolean) determines which
 * additional methods are available.
 *
 * @template T - The type of value the signal holds
 *
 * @remarks
 * - For arrays: includes array mutation methods (push, pop, splice, etc.)
 * - For plain objects: includes `set()` method for partial updates
 * - For strings: includes string methods (toLowerCase, toUpperCase, etc.)
 * - For numbers: includes number methods (toFixed, toPrecision, etc.)
 * - For booleans: includes boolean methods (not, toString)
 * - For other primitives: only the base signal interface
 *
 * @see {@link signal} - For creating source signals
 * @see {@link DerivedSignal} - For read-only derived signals
 */
export type SourceSignal<T> = BaseSourceSignal<T> &
  MutatingAndNonMutatingMethodsObject<T> &
  LogicalMethods<T>;

/**
 * Creates a mutable source signal from any JavaScript value.
 *
 * A signal is a reactive data unit that automatically notifies dependent
 * computations when its value changes. Signals use a global variable-based
 * dependency tracking system to establish relationships with effects.
 *
 * @template T - The type of value the signal holds
 * @param initialValue - Any JavaScript value to convert to a signal
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
 * - Signal values are stored immutably via `@cyftec/immut`
 * - Object `set()` performs a shallow merge
 * - Array mutation methods create new arrays internally
 *
 * @see {@link effect} - For registering functions to run when signal values change
 * @see {@link derive} - For creating read-only derived signals
 */
export const signal = <T>(
  initialValue: T,
  nonNullableInitialValue?: NonNullable<T extends Record<string, any> ? {} : T>,
): SourceSignal<T> => {
  let _value = immut(initialValue);
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
      const currentRegisteredEffect = getCurrentEffect();
      if (currentRegisteredEffect) _effects.add(currentRegisteredEffect);
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
  const nonNullableInitial =
    nonNullableInitialValue === undefined
      ? initialValue
      : nonNullableInitialValue;
  const result: SourceSignal<T> = Array.isArray(nonNullableInitial)
    ? Object.assign(
        baseSourceSignal,
        getArraySourceSignalMethodsObject(
          (mutatorMethod) =>
            setValueAndRunEffects(mutatorMethod(_value as unknown[]) as T),
          baseSourceSignal as BaseSourceSignal<any[]>,
        ),
      )
    : isPlainObject(nonNullableInitial)
      ? Object.assign(
          baseSourceSignal,
          getObjectSourceSignalMethodsObject(
            (mutatorMethod) =>
              setValueAndRunEffects(
                mutatorMethod(_value as Record<string, any>) as T,
              ),
            baseSourceSignal as BaseSourceSignal<Record<string, any>>,
          ),
        )
      : typeof nonNullableInitial === "string"
        ? Object.assign(
            baseSourceSignal,
            getStringSignalMethodsObject(
              baseSourceSignal as BaseSourceSignal<string>,
            ),
          )
        : typeof nonNullableInitial === "number"
          ? Object.assign(
              baseSourceSignal,
              getNumberSignalMethodsObject(
                baseSourceSignal as BaseSourceSignal<number>,
              ),
            )
          : typeof nonNullableInitial === "boolean"
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
            : Object.assign(baseSourceSignal);
  Object.assign(result, getLogicalMethods(baseSourceSignal));

  return result as SourceSignal<T>;
};
