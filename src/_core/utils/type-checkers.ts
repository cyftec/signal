import type { MaybeSignal } from "../types";
import { value } from "./value-getter";

/**
 * Checks if any given value is source signal or not.
 * @see SourceSignal for details
 * @param input can be any javascript value
 * @returns true if the value is a source signal or false if otherwise
 */
export const valueIsSourceSignal = (input: MaybeSignal<any>): boolean =>
  !!(input?.type === "source-signal");

/**
 * Checks if any given value is derived signal or not.
 * @see DerivedSignal for details
 * @param input can be any javascript value
 * @returns true if the value is a derived signal or false if otherwise
 */
export const valueIsDerivedSignal = (input: MaybeSignal<any>): boolean =>
  !!(input?.type === "derived-signal");

/**
 * Checks if any given value is a signal or not.
 *
 * For details,
 * @see SourceSignal
 * @see DerivedSignal
 * @param input can be any javascript value
 * @returns true if the value is any of a source or derived signal or false if otherwise
 */
export const valueIsSignal = (input: MaybeSignal<any>): boolean =>
  ["source-signal", "derived-signal"].includes(input?.type);

/**
 * Checks if any given value is a signal or not.
 *
 * References,
 * @see NonSignal
 * @param input can be any javascript value
 * @param shouldMatchAnyOfTypes runtime type values i.e. "string", "function", etc.
 * @returns true or false based on whether the input value is non-signal and type matches
 * to one of the provided 'shouldMatchAnyOfTypes' input. If 'shouldMatchAnyOfTypes'
 * is not provided, method only checks if input value is a non-signal or not.
 *
 */
export const valueIsNonSignal = (
  input: any,
  shouldMatchAnyOfTypes?: string[]
): boolean =>
  input?.type === "non-signal" &&
  (!shouldMatchAnyOfTypes ||
    !shouldMatchAnyOfTypes.length ||
    shouldMatchAnyOfTypes.some((type) => typeof input?.value === type));

/**
 * Checks if any given value is one of a signal object or a non-signal object or not.
 * Mostly used for values which need to be MaybeSignalObject in the object format satisfying
 * either a Signal or a NonSignal type
 *
 * References,
 * @see Signal
 * @see NonSignal
 * @see MaybeSignalObject
 * @param input can be any javascript value
 * @returns true if input value is one of Signal or NonSignal object.
 *
 */
export const valueIsMaybeSignalObject = (input: any): boolean =>
  valueIsSignal(input) || valueIsNonSignal(input);

/**
 * Checks is the value is non-signal of type string or not
 *
 * References,
 * @see NonSignal
 * @see valueIsNonSignal
 * @param input can be any javascript value
 * @returns true if value is non-signal of type string, otherwise false.
 */
export const valueIsNonSignalString = (input: any): boolean =>
  valueIsNonSignal(input, ["string"]);

/**
 * Checks is the value is non-signal of type string array or not
 *
 * References,
 * @see NonSignal
 * @param input can be any javascript value
 * @returns true if value is non-signal of type string array, otherwise false.
 */
export const valueIsNonSignalStringArray = (input: any): boolean =>
  input?.type === "non-signal" &&
  Array.isArray(input?.value) &&
  (input?.value as any[]).every((item) => typeof item === "string");

/**
 * Checks is the value is MaybeSignalValue of string or array or not
 *
 * References,
 * @see MaybeSignalValue
 * @param input can be any javascript value
 * @returns true if value is MaybeSignalValue or string or array, otherwise false.
 */
export const valueIsMaybeSignalValueOfStringOrArray = (input: any): boolean =>
  typeof value(input) === "string" || Array.isArray(value(input));
