import { BaseObjectSignal } from "./types";

/**
 * Creates object mutation methods for object signals.
 *
 * @template T - The object type
 * @param valueSetter - Updates the signal value and triggers effects
 * @returns Object mutation methods for the signal value
 *
 * @remarks
 * - Performs a shallow merge with the current object value
 * - The current object is not mutated directly
 */
export const getObjectSignalBaseObject = <T extends object>(
  valueSetter: (method: (oldValue: T) => T) => void
): BaseObjectSignal<T> => {
  return {
    set: (partiallyNewObjectValue: Partial<T>) =>
      valueSetter((oldValue: T) => ({
        ...oldValue,
        ...partiallyNewObjectValue,
      })),
  };
};
