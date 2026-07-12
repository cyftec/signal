import {
  type BaseSignalifiedObject,
  type DerivedSignal,
  derive,
} from "../signals";
import {
  getNullableLogicalNonMutatingMethodsObject,
  getObjectLogicalMethods,
} from "./generic";
import {
  ObjectSignalNonMutatingMethodsObject,
  ObjectSourceSignalMethodsObject,
  ObjectSourceSignalMutatingMethodsObject,
} from "./types";

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
export const getObjectSignalMutatingMethodsObject = <
  T extends Record<string, any>,
>(
  valueSetter: (mutatorMethod: (oldValue: T) => T) => void,
): ObjectSourceSignalMutatingMethodsObject<T> => ({
  set: (partiallyNewObjectValue: Partial<T>) =>
    valueSetter((oldValue: T) => ({
      ...oldValue,
      ...partiallyNewObjectValue,
    })),
});

/**
 * Creates the object trap for signalified plain objects.
 *
 * @template T - The object type
 * @param input - A signalified plain object
 * @returns A record trap exposing derived property accessors
 *
 * @remarks
 * - Throws if the input is not a plain object after unwrapping
 * - Property accessors are derived signals
 */
export const getObjectSignalNonMutatingMethodsObject = <
  T extends Record<string, any>,
>(
  baseObjectSignalifiedObject: BaseSignalifiedObject<T>,
): ObjectSignalNonMutatingMethodsObject<T> => {
  return {
    prop: <K extends keyof T>(key: K) =>
      derive(() => baseObjectSignalifiedObject.value[key]),
    props: () => {
      const signalledPropsObj = {} as {
        [key in keyof T]: DerivedSignal<T[key]>;
      };

      (Object.keys(baseObjectSignalifiedObject.value) as (keyof T)[]).forEach(
        (key) => {
          signalledPropsObj[key] = derive(
            () => baseObjectSignalifiedObject.value[key],
          );
        },
      );

      return signalledPropsObj;
    },
    keys: () => derive(() => Object.keys(baseObjectSignalifiedObject.value)),
    ...getObjectLogicalMethods(),
    ...getNullableLogicalNonMutatingMethodsObject(baseObjectSignalifiedObject),
  };
};

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
export const getObjectSourceSignalMethodsObject = <
  T extends Record<string, any>,
>(
  valueSetter: (mutatorMethod: (oldValue: T) => T) => void,
  baseObjectSignalifiedObject: BaseSignalifiedObject<T>,
): ObjectSourceSignalMethodsObject<T> => ({
  ...getObjectSignalMutatingMethodsObject(valueSetter),
  ...getObjectSignalNonMutatingMethodsObject(baseObjectSignalifiedObject),
});
