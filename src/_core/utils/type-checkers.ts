import type { MaybeSignal } from "../types";
import { value } from "./value-getter";

/**
 * Checks if a value is a source signal.
 *
 * @param input - Any value to check
 * @returns `true` if the value has `type: "source-signal"`, `false` otherwise
 *
 * @remarks
 * - Returns false for derived signals, non-signals, and plain values
 * - Returns false for `null` and `undefined`
 *
 * @see {@link SourceSignal} - For source signal type
 * @see {@link valueIsDerivedSignal} - For checking derived signals
 * @see {@link valueIsSignal} - For checking any signal type
 */
export const valueIsSourceSignal = (input: MaybeSignal<any>): boolean =>
  !!(input?.type === "source-signal");

/**
 * Checks if a value is a derived signal.
 *
 * @param input - Any value to check
 * @returns `true` if the value has `type: "derived-signal"`, `false` otherwise
 *
 * @remarks
 * - Returns false for source signals, non-signals, and plain values
 * - Returns false for `null` and `undefined`
 *
 * @see {@link DerivedSignal} - For derived signal type
 * @see {@link valueIsSourceSignal} - For checking source signals
 * @see {@link valueIsSignal} - For checking any signal type
 */
export const valueIsDerivedSignal = (input: MaybeSignal<any>): boolean =>
  !!(input?.type === "derived-signal");

/**
 * Checks if a value is any signal (source or derived).
 *
 * @param input - Any value to check
 * @returns `true` if the value is a source or derived signal, `false` otherwise
 *
 * @remarks
 * - Returns true for both source and derived signals
 * - Returns false for non-signals and plain values
 * - Returns false for `null` and `undefined`
 *
 * @see {@link SourceSignal} - For source signal type
 * @see {@link DerivedSignal} - For derived signal type
 * @see {@link Signal} - For the signal union type
 */
export const valueIsSignal = (input: MaybeSignal<any>): boolean =>
  ["source-signal", "derived-signal"].includes(input?.type);

/**
 * Checks if a value is a non-signal object, optionally matching specific types.
 *
 * @param input - Any value to check
 * @param shouldMatchAnyOfTypes - Optional array of type names to match
 * (e.g., ["string", "number"])
 * @returns `true` if the value has `type: "non-signal"` and (if types provided)
 * the value matches one of the types
 *
 * @example
 * ```typescript
 * const nonSig = getNonSignalObject(42);
 * valueIsNonSignalObject(nonSig); // true
 * valueIsNonSignalObject(nonSig, ["number"]); // true
 * valueIsNonSignalObject(nonSig, ["string"]); // false
 * ```
 *
 * @remarks
 * - Empty types array is treated as no type restriction
 * - Returns false for `null` and `undefined`
 *
 * @see {@link NonSignal} - For non-signal type
 * @see {@link getNonSignalObject} - For creating non-signal objects
 */
export const valueIsNonSignalObject = (
  input: any,
  shouldMatchAnyOfTypes?: string[],
): boolean =>
  input?.type === "non-signal" &&
  (!shouldMatchAnyOfTypes ||
    !shouldMatchAnyOfTypes.length ||
    shouldMatchAnyOfTypes.some((type) => typeof input?.value === type));

/**
 * Checks if a value is a signal or non-signal object.
 *
 * @param input - Any value to check
 * @returns `true` if the value is a signal or non-signal object, `false` otherwise
 *
 * @remarks
 * - Returns true for source signals, derived signals, and non-signal objects
 * - Returns false for plain values
 * - Returns false for `null` and `undefined`
 *
 * @see {@link Signal} - For signal types
 * @see {@link NonSignal} - For non-signal type
 * @see {@link SignalifiedObject} - For the signalified object union type
 */
export const valueIsSignalifiedObject = (input: any): boolean =>
  valueIsSignal(input) || valueIsNonSignalObject(input);

/**
 * Checks if a value is a non-signal of type string.
 *
 * @param input - Any value to check
 * @returns `true` if the value is a non-signal with a string value, `false` otherwise
 *
 * @remarks
 * - Returns false for plain strings (not wrapped in non-signal)
 *
 * @see {@link NonSignal} - For non-signal type
 * @see {@link valueIsNonSignalObject} - For the general non-signal checker
 */
export const valueIsNonSignalString = (input: any): boolean =>
  valueIsNonSignalObject(input, ["string"]);

/**
 * Checks if a value is a non-signal of type string array.
 *
 * @param input - Any value to check
 * @returns `true` if the value is a non-signal with a string array value, `false` otherwise
 *
 * @remarks
 * - Checks that all array elements are strings
 * - Returns false for empty arrays
 * - Returns false for arrays with non-string elements
 *
 * @see {@link NonSignal} - For non-signal type
 * @see {@link valueIsNonSignalObject} - For the general non-signal checker
 */
export const valueIsNonSignalStringArray = (input: any): boolean =>
  input?.type === "non-signal" &&
  Array.isArray(input?.value) &&
  (input?.value as any[]).every((item) => typeof item === "string");

/**
 * Checks if a value (after unwrapping) is a string or array.
 *
 * @param input - Any value to check
 * @returns `true` if the unwrapped value is a string or array, `false` otherwise
 *
 * @remarks
 * - Unwraps signals and non-signals to get the plain value
 * - Returns true if the plain value is a string or array
 * - Returns false for other types
 * - Returns false for `null` and `undefined`
 *
 * @see {@link MaybeSignalValue} - For the input type
 * @see {@link value} - For unwrapping signalified objects
 */
export const valueIsMaybeSignalValueOfStringOrArray = (input: any): boolean =>
  typeof value(input) === "string" || Array.isArray(value(input));
