import type { MaybeSignal } from "../_core/signals/types";
import { value } from "./value-getter";

/**
 * Checks whether a value is a source signal.
 *
 * @param input - Any value to check
 * @returns `true` if the value has `type: "mutable-signal"`, `false` otherwise
 *
 * @remarks
 * - Returns false for derived signals, dead-signals, and plain values
 * - Returns false for `null` and `undefined`
 *
 * @see {@link MutableSignal} - For source signal type
 * @see {@link valueIsDerivedSignal} - For checking derived signals
 * @see {@link valueIsLiveSignal} - For checking any signal type
 */
export const valueIsMutableSignal = (input: MaybeSignal<any>): boolean =>
  !!(input?.type === "mutable-signal");

/**
 * Checks whether a value is a derived signal.
 *
 * @param input - Any value to check
 * @returns `true` if the value has `type: "derived-signal"`, `false` otherwise
 *
 * @remarks
 * - Returns false for source signals, dead-signals, and plain values
 * - Returns false for `null` and `undefined`
 *
 * @see {@link DerivedSignal} - For derived signal type
 * @see {@link valueIsMutableSignal} - For checking source signals
 * @see {@link valueIsLiveSignal} - For checking any signal type
 */
export const valueIsDerivedSignal = (input: MaybeSignal<any>): boolean =>
  !!(input?.type === "derived-signal");

/**
 * Checks whether a value is any signal (source or derived).
 *
 * @param input - Any value to check
 * @returns `true` if the value is a source or derived signal, `false` otherwise
 *
 * @remarks
 * - Returns true for both source and derived signals
 * - Returns false for dead-signals and plain values
 * - Returns false for `null` and `undefined`
 *
 * @see {@link MutableSignal} - For source signal type
 * @see {@link DerivedSignal} - For derived signal type
 * @see {@link LiveSignal} - For the signal union type
 */
export const valueIsLiveSignal = (input: MaybeSignal<any>): boolean =>
  ["mutable-signal", "derived-signal"].includes(input?.type);

/**
 * Checks whether a value is a dead-signal object, optionally matching specific types.
 *
 * @param input - Any value to check
 * @param shouldMatchAnyOfTypes - Optional array of primitive type names to match
 * (for example, `["string", "number"]`)
 * @returns `true` if the value has `type: "dead-signal"` and (if types provided)
 * the value matches one of the types
 *
 * @example
 * ```typescript
 * const deadSig = new DeadSignal(() => 42);
 * valueIsDeadSignal(deadSig); // true
 * valueIsDeadSignal(deadSig, ["number"]); // true
 * valueIsDeadSignal(deadSig, ["string"]); // false
 * ```
 *
 * @remarks
 * - Empty types array is treated as no type restriction
 * - Returns false for `null` and `undefined`
 *
 * @see {@link DeadSignal} - For dead-signal type
 */
export const valueIsDeadSignal = (
  input: any,
  shouldMatchAnyOfTypes?: string[],
): boolean =>
  input?.type === "dead-signal" &&
  (!shouldMatchAnyOfTypes ||
    !shouldMatchAnyOfTypes.length ||
    shouldMatchAnyOfTypes.some((type) => typeof input?.value === type));

/**
 * Checks whether a value is a dead-signal of type string.
 *
 * @param input - Any value to check
 * @returns `true` if the value is a dead-signal with a string value, `false` otherwise
 *
 * @remarks
 * - Returns false for plain strings (not wrapped in dead-signal)
 *
 * @see {@link DeadSignal} - For dead-signal type
 * @see {@link valueIsDeadSignal} - For the general dead-signal checker
 */
export const valueIsDeadSignalString = (input: any): boolean =>
  valueIsDeadSignal(input, ["string"]);

/**
 * Checks whether a value is a dead-signal of type string array.
 *
 * @param input - Any value to check
 * @returns `true` if the value is a dead-signal with a string array value, `false` otherwise
 *
 * @remarks
 * - Checks that all array elements are strings
 * - Returns false for empty arrays
 * - Returns false for arrays with non-string elements
 *
 * @see {@link DeadSignal} - For dead-signal type
 * @see {@link valueIsDeadSignal} - For the general dead-signal checker
 */
export const valueIsDeadSignalStringArray = (input: any): boolean =>
  input?.type === "dead-signal" &&
  Array.isArray(input?.value) &&
  (input?.value as any[]).every((item) => typeof item === "string");

/**
 * Checks whether a value is a signal or dead-signal object.
 *
 * @param input - Any value to check
 * @returns `true` if the value is a signal or dead-signal object, `false` otherwise
 *
 * @remarks
 * - Returns true for source signals, derived signals, and dead-signal objects
 * - Returns false for plain values
 * - Returns false for `null` and `undefined`
 *
 * @see {@link LiveSignal} - For signal types
 * @see {@link DeadSignal} - For dead-signal type
 * @see {@link Signal} - For the signalified object union type
 */
export const valueIsSignal = (input: any): boolean =>
  valueIsLiveSignal(input) || valueIsDeadSignal(input);

/**
 * Checks whether a value, after unwrapping, is a string or array.
 *
 * @param input - Any value to check
 * @returns `true` if the unwrapped value is a string or array, `false` otherwise
 *
 * @remarks
 * - Unwraps signals and dead-signals to get the plain value
 * - Returns true if the plain value is a string or array
 * - Returns false for other types
 * - Returns false for `null` and `undefined`
 *
 * @see {@link MaybeSignal} - For the input type
 * @see {@link value} - For unwrapping signalified objects
 */
export const valueIsMaybeSignalValueOfStringOrArray = (input: any): boolean =>
  typeof value(input) === "string" || Array.isArray(value(input));
