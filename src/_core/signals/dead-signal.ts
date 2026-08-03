import { isPlainObject } from "@cyftec/immut";
import {
  getArraySignalNonMutatingMethodsObject,
  getLogicalMethods,
  getNumberSignalMethodsObject,
  getObjectSignalNonMutatingMethodsObject,
  getStringSignalMethodsObject,
  LogicalMethods,
  NonMutatingMethodsObject,
} from "../data-specific-methods";
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
 * @see {@link deadSIgnal} - For creating DeadSignal objects
 */
export type DeadSignal<T> = BaseDeadSignal<T> &
  NonMutatingMethodsObject<T> &
  LogicalMethods<T>;

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
 * const nonSig = deadSIgnal(42);
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
export const deadSIgnal = <T>(input: T): DeadSignal<T> => {
  const baseDeadSignal: BaseDeadSignal<T> = {
    type: "dead-signal",
    value: input,
  };

  // Add non-mutating methods for array, string, number, and boolean derived signals
  if (Array.isArray(input)) {
    return Object.assign(
      baseDeadSignal,
      getArraySignalNonMutatingMethodsObject(
        baseDeadSignal as BaseDeadSignal<any[]>,
      ),
    ) as any;
  }

  if (isPlainObject(input)) {
    return Object.assign(
      baseDeadSignal,
      getObjectSignalNonMutatingMethodsObject(
        baseDeadSignal as BaseDeadSignal<Record<string, any>>,
      ),
    ) as any;
  }

  if (typeof input === "string") {
    return Object.assign(
      baseDeadSignal,
      getStringSignalMethodsObject(baseDeadSignal as BaseDeadSignal<string>),
    ) as any;
  }

  if (typeof input === "number") {
    return Object.assign(
      baseDeadSignal,
      getNumberSignalMethodsObject(baseDeadSignal as BaseDeadSignal<number>),
    ) as any;
  }

  Object.assign(baseDeadSignal, getLogicalMethods(baseDeadSignal));
  return Object.assign(baseDeadSignal) as any;
};
