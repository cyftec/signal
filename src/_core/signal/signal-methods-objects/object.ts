import { derive, type DerivedSignal } from "../../derive";
import {
  BaseSignal,
  ObjectSignalMutatingMethodsObject,
  ObjectSignalNonMutatingMethodsObject,
  ObjectSourceSignalMethodsObject,
} from "../types";

/**
 * Creates non-mutating methods for object signals.
 *
 * These methods return derived signals for accessing object properties.
 *
 * @template T - The object type
 * @param baseObjectSignal - The base object signal to access values from
 * @returns Non-mutating methods for object signals
 *
 * @remarks
 * - All methods return derived signals
 * - Methods are reactive and update when the source object changes
 * - Works with both source and derived signals
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
 * Creates mutating methods for object signals.
 *
 * @template T - The object type
 * @param valueSetter - Updates the signal value and triggers effects
 * @returns Mutating methods for object signals
 *
 * @remarks
 * - `set()` performs a shallow merge with the current value
 * - Triggers effects synchronously
 * - The current object is not mutated directly
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
 * Creates combined methods for object source signals.
 *
 * Combines mutating and non-mutating methods for object source signals.
 *
 * @template T - The object type
 * @param valueSetter - Updates the signal value and triggers effects
 * @param baseObjectSignal - The base object signal to access values from
 * @returns Combined methods for object source signals
 *
 * @remarks
 * - `set()` performs a shallow merge with the current value
 * - Non-mutating methods return derived signals
 * - Methods are reactive and update when the source object changes
 */
export const getObjectSourceSignalMethodsObject = <T extends object>(
  valueSetter: (method: (oldValue: T) => T) => void,
  baseObjectSignal: BaseSignal<T>,
): ObjectSourceSignalMethodsObject<T> => ({
  ...getObjectSignalMutatingMethodsObject(valueSetter),
  ...getObjectSignalNonMutatingMethodsObject(baseObjectSignal),
});
