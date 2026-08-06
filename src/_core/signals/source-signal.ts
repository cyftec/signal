import { isPlainObject } from "@cyftec/immut";
import {
  GenericMethods,
  getArrayMutatingAndNonMutatingMethods,
  getBooleanSignalMethods,
  getGenericMethods,
  getNumberSignalMethods,
  getObjectMutatingAndNonMutatingMethods,
  getStringSignalMethods,
  MutatingAndNonMutatingMethods,
} from "../data-specific-methods";
import { baseSourceSignal, BaseSourceSignal } from "./base-signal";

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
  MutatingAndNonMutatingMethods<T> &
  GenericMethods<T>;

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
  const baseSignal: BaseSourceSignal<T> = baseSourceSignal(initialValue);

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
        baseSignal,
        getArrayMutatingAndNonMutatingMethods(
          (mutatorMethod) =>
            baseSignal.mutate(mutatorMethod as unknown as (oldValue: T) => T),
          baseSignal as BaseSourceSignal<any[]>,
        ),
      )
    : isPlainObject(nonNullableInitial)
      ? Object.assign(
          baseSignal,
          getObjectMutatingAndNonMutatingMethods(
            (mutatorMethod) =>
              baseSignal.mutate(mutatorMethod as unknown as (oldValue: T) => T),
            baseSignal as BaseSourceSignal<Record<string, any>>,
          ),
        )
      : typeof nonNullableInitial === "string"
        ? Object.assign(
            baseSignal,
            getStringSignalMethods(baseSignal as BaseSourceSignal<string>),
          )
        : typeof nonNullableInitial === "number"
          ? Object.assign(
              baseSignal,
              getNumberSignalMethods(baseSignal as BaseSourceSignal<number>),
            )
          : typeof nonNullableInitial === "boolean"
            ? Object.assign(
                baseSignal,
                getBooleanSignalMethods(
                  (mutatorMethod) =>
                    baseSignal.mutate(
                      mutatorMethod as unknown as (oldValue: T) => T,
                    ),
                  baseSignal as BaseSourceSignal<boolean>,
                ),
              )
            : Object.assign(baseSignal);
  Object.assign(result, getGenericMethods(baseSignal));

  return result as SourceSignal<T>;
};
