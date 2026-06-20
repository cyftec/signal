import { derive, type DerivedSignal } from "../derive";
import { BaseObjectSignal, BaseSourceSignal } from "./types";

/**
 * Creates object mutation methods for object signals.
 *
 * @template T - The object type
 * @param valueSetter - Updates the signal value and triggers effects
 * @param baseObjectSignal - The original base object signal object for accessing .value in derived methods
 * @returns Object signal with methods for either mutating the signal or getting derived signals
 *
 * @remarks
 * - Performs a shallow merge with the current object value
 * - The current object is not mutated directly
 * - Non-mutating methods return derived signals
 */
export const getObjectSignalBaseObject = <T extends object>(
  valueSetter: (method: (oldValue: T) => T) => void,
  baseObjectSignal: BaseSourceSignal<T>,
): BaseObjectSignal<T> => {
  return {
    // Mutating method
    set: (partiallyNewObjectValue: Partial<T>) =>
      valueSetter((oldValue: T) => ({
        ...oldValue,
        ...partiallyNewObjectValue,
      })),

    // Non-mutating methods returning derived signals
    get: <K extends keyof T>(key: K) =>
      derive(() => baseObjectSignal.value[key]),
    get props() {
      const value = baseObjectSignal.value;
      const signalledPropsObj = {} as {
        [key in keyof T]: DerivedSignal<T[key]>;
      };
      for (const key of Object.keys(value) as Array<keyof T>) {
        signalledPropsObj[key] = derive(() => baseObjectSignal.value[key]);
      }
      return signalledPropsObj;
    },
    get keys() {
      return derive(() => Object.keys(baseObjectSignal.value));
    },
  };
};
