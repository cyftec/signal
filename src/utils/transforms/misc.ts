import type { MaybeSignalObject, MaybeSignalValue } from "../../types.ts";
import { valueIsMaybeSignalObject } from "../type-checkers.ts";

/**
 * A shorthand method to get value of a maybe-signal data.
 * @param value a value which is not sure if plain or signal or non-signal object
 * @see MaybeSignalValue
 * @see MaybeSignalObject
 * @returns the plain value
 */
export const val = <T>(value: MaybeSignalValue<T>): T =>
  valueIsMaybeSignalObject(value)
    ? (value as MaybeSignalObject<T>).value
    : (value as T);
