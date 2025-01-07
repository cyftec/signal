import { MaybeSignal, MaybeSignalObject } from "../types";

/**
 * Checks if any given value is source signal or not.
 * @see SourceSignal for details
 * @param value can be any javascript value
 * @returns true if the value is a source signal or false if otherwise
 */
export const valueIsSourceSignal = (value: MaybeSignal<any>): boolean =>
  !!(value?.type === "source-signal");

/**
 * Checks if any given value is derived signal or not.
 * @see DerivedSignal for details
 * @param value can be any javascript value
 * @returns true if the value is a derived signal or false if otherwise
 */
export const valueIsDerivedSignal = (value: MaybeSignal<any>): boolean =>
  !!(value?.type === "derived-signal");

/**
 * Checks if any given value is a signal or not.
 *
 * For details,
 * @see SourceSignal
 * @see DerivedSignal
 * @param value can be any javascript value
 * @returns true if the value is any of a source or derived signal or false if otherwise
 */
export const valueIsSignal = (value: MaybeSignal<any>): boolean =>
  ["source-signal", "derived-signal"].includes(value?.type);

/**
 * Checks if any given value is a signal or not.
 *
 * References,
 * @see NonSignal
 * @param value can be any javascript value
 * @param shouldMatchAnyOfTypes runtime type values i.e. "string", "function", etc.
 * @returns true or false based on whether the value is non-signal and type matches
 * to one of the provided 'shouldMatchAnyOfTypes' input. If 'shouldMatchAnyOfTypes'
 * is not provided, method only checks if input value is a non-signal or not.
 *
 */
export const valueIsNonSignal = (
  value: any,
  shouldMatchAnyOfTypes?: string[]
): boolean =>
  value?.type === "non-signal" &&
  (!shouldMatchAnyOfTypes ||
    !shouldMatchAnyOfTypes.length ||
    shouldMatchAnyOfTypes.some((type) => typeof value?.value === type));

/**
 * Checks if any given value is one of a signal object or a non-signal object or not.
 * Mostly used for values which need to be MaybeSignalObject in the object format satisfying
 * either a Signal or a NonSignal type
 *
 * References,
 * @see Signal
 * @see NonSignal
 * @see MaybeSignalObject
 * @param value can be any javascript value
 * @returns true if input value is one of Signal or NonSignal object.
 *
 */
export const valueIsMaybeSignalObject = (value: any): boolean =>
  valueIsSignal(value) || valueIsNonSignal(value);

/**
 * Checks is the value is non-signal of type string or not
 *
 * References,
 * @see NonSignal
 * @see valueIsNonSignal
 * @param value can be any javascript value
 * @returns true if value is non-signal of type string, otherwise false.
 */
export const valueIsNonSignalString = (value: any): boolean =>
  valueIsNonSignal(value, ["string"]);

/**
 * Checks is the value is non-signal of type string array or not
 *
 * References,
 * @see NonSignal
 * @param value can be any javascript value
 * @returns true if value is non-signal of type string array, otherwise false.
 */
export const valueIsNonSignalStringArray = (value: any): boolean =>
  value?.type === "non-signal" &&
  Array.isArray(value?.value) &&
  (value?.value as any[]).every((item) => typeof item === "string");
