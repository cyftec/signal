import type { SignalifiedObject, MaybeSignalValue } from "../types.js";
import { valueIsSignalifiedObject } from "./type-checkers.js";

/**
 * A shorthand method to get value of a maybe-signal data.
 * @param input a value which is not sure if plain or signal or non-signal object
 * @see MaybeSignalValue
 * @see SignalifiedObject
 * @returns the plain value
 */
export const value = <T>(input: MaybeSignalValue<T>): T =>
  valueIsSignalifiedObject(input)
    ? (input as SignalifiedObject<T>).value
    : (input as T);
