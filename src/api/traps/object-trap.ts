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
export const objectTrap = <T extends Record<string, unknown>>(
  input: MaybeSignalValue<T>,
): RecordSignalTrap<T> => {
  if (!isPlainObject(value(input))) {
    throw new Error(
      `The argument should be a plain object or a signal of plain object`,
    );
  }

  return {
    ...genericTrap(input),
    prop: <K extends keyof T>(key: K) => derive(() => value(input)[key]),
    get props() {
      const signalledPropsObj = Object.keys(value(input)).reduce(
        (map, k) => {
          const key = k as keyof T;
          map[key] = this.prop(key);
          return map;
        },
        {} as { [key in keyof T]: DerivedSignal<T[key]> },
      );

      return signalledPropsObj;
    },
    get keys() {
      return derive(() => Object.keys(value(input)));
    },
  };
};
