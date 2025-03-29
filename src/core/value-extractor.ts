import { MaybeSignalObject, MaybeSignalValue } from "../types.ts";
import { valueIsMaybeSignalObject } from "./type-checkers.ts";

/**
 * A shorthand method to get value of a maybe-signal data.
 * @param input a value which is not sure if plain or signal or non-signal object
 * @see MaybeSignalValue
 * @see MaybeSignalObject
 * @returns the plain value
 */
export const value = <T>(input: MaybeSignalValue<T>): T =>
  valueIsMaybeSignalObject(input)
    ? (input as MaybeSignalObject<T>).value
    : (input as T);
