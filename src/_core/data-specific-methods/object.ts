import {
  type BaseSignalifiedObject,
  type DerivedSignal,
  derive,
} from "../signals";
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
 * @example
 * ```typescript
 * const user = signal({ name: "John", age: 30 });
 * const methods = getObjectSignalMutatingMethodsObject((mutator) => {
 *   user.value = mutator(user.value);
 * });
 * methods.set({ age: 31 }); // Shallow merge: { name: "John", age: 31 }
 * ```
 *
 * @remarks
 * - `set()` performs a shallow merge with the current value
 * - Works with both source and derived signals
 *
 * @see {@link getObjectSourceSignalMethodsObject} - For combined methods
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
 * @example
 * ```typescript
 * const user = signal({ name: "John", age: 30 });
 * const userSignalWithMethods = getObjectSignalNonMutatingMethodsObject(user);
 * const keysSignal = userSignalWithMethods.keys(); // DerivedSignal<string[]>
 * const nameSignal = userSignalWithMethods.get("name"); // DerivedSignal<string>
 * const allProps = userSignalWithMethods.props(); // Record of derived signals for all properties
 * ```
 *
 * @remarks
 * - Throws if the input is not a plain object after unwrapping
 * - Property accessors are derived signals
 * - `keys()` returns a derived signal of the object's keys
 * - `get()` returns a derived signal for a specific property
 * - `props()` returns an object with derived signals for all properties
 */
export const getObjectSignalNonMutatingMethodsObject = <
  T extends Record<string, any>,
>(
  baseObjectSignalifiedObject: BaseSignalifiedObject<T>,
): ObjectSignalNonMutatingMethodsObject<T> => {
  return {
    keys: () => derive(() => Object.keys(baseObjectSignalifiedObject.value)),
    get: <K extends keyof T>(key: K) =>
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
  };
};

/**
 * Returns an object with methods to update the source signal's value.
 *
 * @template T - The object type
 * @param valueSetter - A function that updates the signal value and triggers effects
 * @returns An object with methods to update the source signal's value
 *
 * @example
 * ```typescript
 * const user = signal({ name: "John", age: 30 });
 * const userSignalMethods = getObjectSourceSignalMethodsObject(
 *   (mutator) => { user.value = mutator(user.value); },
 *   user
 * );
 * userSignalMethods.set({ age: 31 }); // Shallow merge
 * const nameSignal = userSignalMethods.get("name"); // DerivedSignal<string>
 * ```
 *
 * @remarks
 * - `set()` performs a shallow merge with the current value
 * - Works with both source and derived signals
 * - Combines mutating and non-mutating methods
 *
 * @see {@link getObjectSignalMutatingMethodsObject} - For mutating methods only
 * @see {@link getObjectSignalNonMutatingMethodsObject} - For non-mutating methods only
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
