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
import { BaseNonSignal } from "./types";

/**
 * A runtime type wrapper for plain values.
 *
 * NonSignal objects are used for runtime type discrimination in complex
 * type scenarios where TypeScript's compile-time types are insufficient.
 * They enable distinguishing between plain values and signalified objects
 * at runtime.
 *
 * @template T - The type of value wrapped
 *
 * @remarks
 * - Used with `MaybeSignal` types to resolve ambiguity at runtime
 * - Has a `type: "non-signal"` property for runtime type checking
 * - The `value` property holds the wrapped plain value
 * - Array non-signals get non-mutating array methods (map, filter, etc.)
 * - String non-signals get non-mutating string methods (toLowerCase, toUpperCase, etc.)
 * - Number non-signals get non-mutating number methods (toFixed, toPrecision, etc.)
 * - Boolean non-signals get non-mutating boolean methods (not, toString)
 *
 * @see {@link Signal} - For signal objects
 * @see {@link MaybeSignal} - For union types that include signals
 * @see {@link getNonSignalObject} - For creating NonSignal objects
 */
export type NonSignal<T> = BaseNonSignal<T> &
  NonMutatingMethodsObject<T> &
  LogicalMethods<T>;

/**
 * Wraps a plain value in a NonSignal object for runtime type discrimination.
 *
 * This function is useful when you need to explicitly mark a value as a
 * non-signal for runtime type checking in complex type scenarios.
 *
 * @template T - The type of value to wrap
 * @param input - Any JavaScript value to wrap
 * @returns A NonSignal object with the wrapped value
 *
 * @example
 * ```typescript
 * const nonSig = getNonSignalObject(42);
 * console.log(nonSig.type); // "non-signal"
 * console.log(nonSig.value); // 42
 * ```
 *
 * @remarks
 * - Used for runtime type checking in complex type scenarios
 * - Enables distinguishing between plain values and signalified objects
 * - The wrapped value can be any JavaScript type
 *
 * @see {@link NonSignal} - The NonSignal type
 * @see {@link valueIsNonSignalObject} - For checking if a value is a NonSignal
 */
export const getNonSignalObject = <T>(input: T): NonSignal<T> => {
  const baseNonSignal: BaseNonSignal<T> = {
    type: "non-signal",
    value: input,
  };

  // Add non-mutating methods for array, string, number, and boolean derived signals
  if (Array.isArray(input)) {
    return Object.assign(
      baseNonSignal,
      getArraySignalNonMutatingMethodsObject(
        baseNonSignal as BaseNonSignal<any[]>,
      ),
    ) as any;
  }

  if (isPlainObject(input)) {
    return Object.assign(
      baseNonSignal,
      getObjectSignalNonMutatingMethodsObject(
        baseNonSignal as BaseNonSignal<Record<string, any>>,
      ),
    ) as any;
  }

  if (typeof input === "string") {
    return Object.assign(
      baseNonSignal,
      getStringSignalMethodsObject(baseNonSignal as BaseNonSignal<string>),
    ) as any;
  }

  if (typeof input === "number") {
    return Object.assign(
      baseNonSignal,
      getNumberSignalMethodsObject(baseNonSignal as BaseNonSignal<number>),
    ) as any;
  }

  Object.assign(baseNonSignal, getLogicalMethods(baseNonSignal));
  return Object.assign(baseNonSignal) as any;
};
