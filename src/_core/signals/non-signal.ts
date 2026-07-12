import { isPlainObject } from "@cyftec/immut";
import {
  ArraySignalNonMutatingMethodsObject,
  getArraySignalNonMutatingMethodsObject,
  getNumberSignalMethodsObject,
  getObjectSignalNonMutatingMethodsObject,
  getStringSignalMethodsObject,
  NullableLogicalMethods,
  NumberSignalNonMutatingMethodsObject,
  ObjectSignalNonMutatingMethodsObject,
  StringSignalNonMutatingMethodsObject,
} from "../data-specific-methods";
import { BaseNonSignal } from "./types";

/**
 * A read-only derived signal computed from other signals.
 *
 * Derived signals automatically recompute their value whenever any of their
 * tracked dependencies change. Dependencies are established by accessing
 * `.value` on signals during the initial computation.
 *
 * @template T - The type of value the derived signal holds
 *
 * @remarks
 * - The value getter function receives the previous computed value (undefined on first run)
 * - Dependencies are only tracked for signals whose `.value` is accessed during execution
 * - If a signal is accessed conditionally and the condition is false on first run, it won't be tracked
 * - Calling `dispose()` stops the derived signal from tracking dependencies
 * - After disposal, the value remains accessible but won't update
 * - Array derived signals get non-mutating array methods (map, filter, etc.)
 * - String derived signals get non-mutating string methods (toLowerCase, toUpperCase, etc.)
 * - Number derived signals get non-mutating number methods (toFixed, toPrecision, etc.)
 * - Boolean derived signals get non-mutating boolean methods (not, toString)
 *
 * @see {@link signal} - For creating mutable source signals
 * @see {@link effect} - For registering functions to run when signal values change
 */
export type NonSignal<T> = BaseNonSignal<T> &
  ([null] extends [T]
    ? NullableLogicalMethods<T>
    : [undefined] extends [T]
      ? NullableLogicalMethods<T>
      : T extends any[]
        ? ArraySignalNonMutatingMethodsObject<T>
        : T extends Record<string, any>
          ? ObjectSignalNonMutatingMethodsObject<T>
          : T extends string
            ? StringSignalNonMutatingMethodsObject
            : T extends number
              ? NumberSignalNonMutatingMethodsObject
              : {});

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

  return Object.assign(baseNonSignal) as any;
};
