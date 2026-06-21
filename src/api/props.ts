import { derive, DerivedSignal, MaybeSignalValue, value } from "../_core";

/**
 * Methods to get derived signals of object properties.
 *
 * @template T - The object type
 *
 * @remarks
 * - All methods return derived signals
 * - Methods are reactive and update when the source object changes
 * - Works with both source and derived signals
 */
export type ObjectSignalProps<T extends object> = {
  /** Returns a derived signal for a specific property. */
  get: <K extends keyof T>(key: K) => DerivedSignal<T[K]>;
  /** Returns an object with all properties as derived signals. */
  allAlive(): { [key in keyof T]: DerivedSignal<T[key]> };
  /** Returns the object's keys as a derived signal. */
  keys(): DerivedSignal<string[]>;
};

/**
 * Creates combined methods for object source signals.
 *
 * Combines mutating and non-mutating methods for object source signals.
 *
 * @template T - The object type
 * @param valueSetter - Updates the signal value and triggers effects
 * @param objectSignal - The base object signal to access values from
 * @returns Combined methods for object source signals
 *
 * @remarks
 * - `set()` performs a shallow merge with the current value
 * - Non-mutating methods return derived signals
 * - Methods are reactive and update when the source object changes
 */
export const props = <T extends object>(
  objectSignal: MaybeSignalValue<T>,
): ObjectSignalProps<T> => ({
  get: <K extends keyof T>(key: K) =>
    derive(() => (value(objectSignal) as T)[key]),
  allAlive: () => {
    const signalValue = value(objectSignal);
    const signalledPropsObj = {} as {
      [key in keyof T]: DerivedSignal<T[key]>;
    };
    for (const key of Object.keys(signalValue) as Array<keyof T>) {
      signalledPropsObj[key] = derive(() => (value(objectSignal) as T)[key]);
    }
    return signalledPropsObj;
  },
  keys: () => {
    return derive(() => Object.keys(value(objectSignal)));
  },
});
