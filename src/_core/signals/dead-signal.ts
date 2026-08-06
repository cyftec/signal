import {
  GenericMethods,
  getGenericMethods,
  NonMutatingMethods,
} from "../data-specific-methods";
import { getNonMutatingDataMethods } from "../data-specific-methods/data-methods";
import { getBaseSignal } from "./base-signal";
import { BaseDeadSignal } from "./types";

/**
 * A runtime type wrapper for plain values.
 *
 * DeadSignal objects are used for runtime type discrimination in complex
 * type scenarios where TypeScript's compile-time types are insufficient.
 * They enable distinguishing between plain values and signals
 * at runtime.
 *
 * @template T - The type of value wrapped
 *
 * @remarks
 * - Used with `MaybeSignal` types to resolve ambiguity at runtime
 * - Has a `type: "dead-signal"` property for runtime type checking
 * - The `value` property holds the wrapped plain value
 * - Array dead-signals get non-mutating array methods (map, filter, etc.)
 * - String dead-signals get non-mutating string methods (toLowerCase, toUpperCase, etc.)
 * - Number dead-signals get non-mutating number methods (toFixed, toPrecision, etc.)
 * - Boolean dead-signals get non-mutating boolean methods (not, toString)
 *
 * @see {@link LiveSignal} - For signal objects
 * @see {@link MaybeSignal} - For union types that include signals
 * @see {@link deadSignal} - For creating DeadSignal objects
 */
export type DeadSignal<T> = BaseDeadSignal<T> &
  NonMutatingMethods<T> &
  GenericMethods<T>;

/**
 * Wraps a plain value in a DeadSignal object for runtime type discrimination.
 *
 * This function is useful when you need to explicitly mark a value as a
 * dead-signal for runtime type checking in complex type scenarios.
 *
 * @template T - The type of value to wrap
 * @param input - Any JavaScript value to wrap
 * @returns A DeadSignal object with the wrapped value
 *
 * @example
 * ```typescript
 * const nonSig = deadSignal(42);
 * console.log(nonSig.type); // "dead-signal"
 * console.log(nonSig.value); // 42
 * ```
 *
 * @remarks
 * - Used for runtime type checking in complex type scenarios
 * - Enables distinguishing between plain values and signals
 * - The wrapped value can be any JavaScript type
 *
 * @see {@link DeadSignal} - The DeadSignal type
 * @see {@link valueIsDeadSignal} - For checking if a value is a DeadSignal
 */
export const deadSignal = <T>(
  input: T,
  nonNullableInitialValue?: NonNullable<T extends Record<string, any> ? {} : T>,
): DeadSignal<T> => {
  const baseSignal = getBaseSignal<T>(input);
  const valueDescriptor = Object.getOwnPropertyDescriptor(baseSignal, "value")!;

  Object.defineProperty(baseSignal, "value", {
    configurable: valueDescriptor.configurable,
    enumerable: valueDescriptor.enumerable,
    get: valueDescriptor.get!,
    set() {},
  });

  const deadSignal = Object.assign(baseSignal, {
    type: "dead-signal",
    mutate: undefined,
    dispose() {},
  }) as BaseDeadSignal<T>;

  Object.assign(deadSignal, getGenericMethods(deadSignal as any));
  Object.assign(
    deadSignal,
    getNonMutatingDataMethods(deadSignal as any, nonNullableInitialValue),
  );
  return deadSignal as any;
};
