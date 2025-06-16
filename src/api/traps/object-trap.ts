import { isPlainObject } from "@cyftech/immutjs";
import {
  derive,
  type DerivedSignal,
  type MaybeSignalValue,
  value,
} from "../../_core";
import { genericTrap } from "./generic-trap";
import type { RecordSignalTrap } from "./types";

/**
 * A method to get all of the properties of a signalled object as derived signals.
 * Any change in object signal results in an update in their property signals.
 * @param input an object in MaybeSignalValue format (either 'object',
 * Signal<'object'> or NonSignal<'object'>)
 * @returns all of its properties as derived signals
 * @see MaybeSignalValue
 */

export const objectTrap = <T extends Record<string, unknown>>(
  input: MaybeSignalValue<T>
): RecordSignalTrap<T> => {
  if (!isPlainObject(value(input))) {
    throw new Error(
      "Thee argument should be a plain object or a signal of plain object"
    );
  }

  return {
    ...genericTrap(input),
    prop: <K extends keyof T>(key: K) => derive(() => value(input)[key]),
    get props() {
      const signalledPropsObj = Object.keys(value(input)).reduce((map, k) => {
        const key = k as keyof T;
        map[key] = this.prop(key);
        return map;
      }, {} as { [key in keyof T]: DerivedSignal<T[key]> });

      return signalledPropsObj;
    },
    get keys() {
      return derive(() => Object.keys(value(input)));
    },
  };
};
