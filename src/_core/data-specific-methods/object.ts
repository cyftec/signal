import { valueIsLiveSignal } from "../../utils";
import {
  type BaseSignal,
  deadSignal,
  derive,
} from "../signals";
import {
  DeriverReturnType,
  InputSignalType,
  ObjectNonMutatingMethods,
  ObjectMutatingAndNonMutatingMethods,
  ObjectMutatingMethods,
} from "./types";

const getObjectMethodDeriver = <InputSignal extends InputSignalType>(
  baseObjectSignal: BaseSignal<any>,
) => {
  const inputIsLiveSignal = valueIsLiveSignal(baseObjectSignal as any);

  return <T>(deriver: () => T): DeriverReturnType<InputSignal, T> =>
    (inputIsLiveSignal
      ? derive(deriver)
      : deadSignal(deriver())) as DeriverReturnType<InputSignal, T>;
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
 * const methods = getObjectMutatingMethods((mutator) => {
 *   user.value = mutator(user.value);
 * });
 * methods.set({ age: 31 }); // Shallow merge: { name: "John", age: 31 }
 * ```
 *
 * @remarks
 * - `set()` performs a shallow merge with the current value
 * - Works with both source and derived signals
 *
 * @see {@link getObjectMutatingAndNonMutatingMethods} - For combined methods
 */
export const getObjectMutatingMethods = <T extends Record<string, any>>(
  baseObjectSignal: BaseSignal<T>,
): ObjectMutatingMethods<T> => ({
  set: (partiallyNewObjectValue: Partial<T>) =>
    baseObjectSignal.mutateWith((oldValue: T) => ({
      ...oldValue,
      ...partiallyNewObjectValue,
    })),
});

/**
 * Creates the object trap for a signal.
 *
 * @template T - The object type
 * @param input - A signal
 * @returns A record trap exposing derived property accessors
 *
 * @example
 * ```typescript
 * const user = signal({ name: "John", age: 30 });
 * const userSignalWithMethods = getObjectNonMutatingMethods(user);
 * const keysSignal = userSignalWithMethods.keys(); // DerivedSignal<string[]>
 * const nameSignal = userSignalWithMethods.get("name"); // DerivedSignal<string>
 * const allProps = userSignalWithMethods.props(); // Record of derived signals for all properties
 * ```
 *
 * @remarks
 * - Throws if the input is not a plain object after unwrapping
 * - Property accessors are derived signals
 * - Live bases return reactive derived projections
 * - Dead bases return dead-signal projection snapshots
 */
export const getObjectNonMutatingMethods = <
  InputSignal extends InputSignalType,
  T extends Record<string, any>,
>(
  baseObjectSignal: BaseSignal<T>,
): ObjectNonMutatingMethods<InputSignal, T> => {
  const deriveFromBase = getObjectMethodDeriver<InputSignal>(baseObjectSignal);

  return {
    keys: () => deriveFromBase(() => Object.keys(baseObjectSignal.value)),
    get: <K extends keyof T>(key: K) =>
      deriveFromBase(() => baseObjectSignal.value[key]),
    props: () => {
      const signalledPropsObj = {} as {
        [key in keyof T]: DeriverReturnType<InputSignal, T[key]>;
      };

      (Object.keys(baseObjectSignal.value) as (keyof T)[]).forEach((key) => {
        signalledPropsObj[key] = deriveFromBase(
          () => baseObjectSignal.value[key],
        );
      });

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
 * const userSignalMethods = getObjectMutatingAndNonMutatingMethods(
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
 * @see {@link getObjectMutatingMethods} - For mutating methods only
 * @see {@link getObjectNonMutatingMethods} - For non-mutating methods only
 */
export const getObjectMutatingAndNonMutatingMethods = <
  InputSignal extends InputSignalType,
  T extends Record<string, any>,
>(
  baseObjectSignal: BaseSignal<T>,
): ObjectMutatingAndNonMutatingMethods<InputSignal, T> => ({
  mutate: { ...getObjectMutatingMethods(baseObjectSignal) },
  ...getObjectNonMutatingMethods<InputSignal, T>(baseObjectSignal),
});
