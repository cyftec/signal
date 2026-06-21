import { ObjectSourceSignalMethodsObject } from "../types";

/**
 * Returns an object with methods to update the source signal's value.
 *
 * @template T - The object type
 * @param valueSetter - A function that updates the signal value and triggers effects
 * @returns An object with methods to update the source signal's value
 *
 * @remarks
 * - `set()` performs a shallow merge with the current value
 * - Works with both source and derived signals
 */
export const getObjectSourceSignalMethodsObject = <T extends object>(
  valueSetter: (mutatorMethod: (oldValue: T) => T) => void,
): ObjectSourceSignalMethodsObject<T> => ({
  set: (partiallyNewObjectValue: Partial<T>) =>
    valueSetter((oldValue: T) => ({
      ...oldValue,
      ...partiallyNewObjectValue,
    })),
});
