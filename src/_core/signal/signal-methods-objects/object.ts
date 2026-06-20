import { derive, type DerivedSignal } from "../../derive";
import {
  BaseSignal,
  ObjectSignalMutatingMethodsObject,
  ObjectSignalNonMutatingMethodsObject,
  ObjectSourceSignalMethodsObject,
} from "../types";

/**
 * Creates non-mutating object methods that work with any signal (source or derived).
 *
 * @template T - The object type
 * @param signal - Any signal with a .value property (source or derived)
 * @returns Non-mutating object methods that return derived signals
 *
 * @remarks
 * - All methods return new derived signals
 * - Works with both source and derived signals
 * - No mutating methods
 */
export const getObjectSignalNonMutatingMethodsObject = <T extends object>(
  baseObjectSignal: BaseSignal<T>,
): ObjectSignalNonMutatingMethodsObject<T> => {
  return {
    get: <K extends keyof T>(key: K) =>
      derive(() => baseObjectSignal.value[key]),
    get withLiveProps() {
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

/**
 * Creates object mutation methods for object signals.
 *
 * @template T - The object type
 * @param valueSetter - Updates the signal value and triggers effects
 * @returns Object signal with methods for mutating the signal
 *
 * @remarks
 * - Performs a shallow merge with the current object value
 * - The current object is not mutated directly
 * - No non-mutating methods (use getObjectSignalNonMutatingMethodsObject for that)
 */
export const getObjectSignalMutatingMethodsObject = <T extends object>(
  valueSetter: (method: (oldValue: T) => T) => void,
): ObjectSignalMutatingMethodsObject<T> => {
  return {
    set: (partiallyNewObjectValue: Partial<T>) =>
      valueSetter((oldValue: T) => ({
        ...oldValue,
        ...partiallyNewObjectValue,
      })),
  };
};

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
export const getObjectSourceSignalMethodsObject = <T extends object>(
  valueSetter: (method: (oldValue: T) => T) => void,
  baseObjectSignal: BaseSignal<T>,
): ObjectSourceSignalMethodsObject<T> => ({
  ...getObjectSignalMutatingMethodsObject(valueSetter),
  ...getObjectSignalNonMutatingMethodsObject(baseObjectSignal),
});
