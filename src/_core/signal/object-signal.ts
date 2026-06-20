import { derive, type DerivedSignal } from "../derive";
import { BaseObjectSignal, BaseSourceSignal, BaseDerivedObjectSignal } from "./types";

/**
 * Creates non-mutating methods for derived object signals.
 *
 * @template T - The object type
 * @param derivedSignal - The derived signal to extend with object methods
 * @returns Derived signal with object methods
 *
 * @remarks
 * - All methods return new derived signals
 * - No mutating methods (derived signals are read-only)
 */
export const getDerivedObjectSignalBaseObject = <T extends object>(
  derivedSignal: DerivedSignal<T>
): BaseDerivedObjectSignal<T> => {
  return {
    // Non-mutating methods returning derived signals
    get: <K extends keyof T>(key: K) => derive(() => derivedSignal.value[key]),
    get withLiveProps() {
      const value = derivedSignal.value;
      const signalledPropsObj = {} as {
        [key in keyof T]: DerivedSignal<T[key]>;
      };
      for (const key of Object.keys(value) as Array<keyof T>) {
        signalledPropsObj[key] = derive(() => derivedSignal.value[key]);
      }
      return signalledPropsObj;
    },
    get keys() {
      return derive(() => Object.keys(derivedSignal.value));
    },
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
