import { isPlainObject } from "@cyftech/immutjs";
import { derive } from "../../core";
import type { DerivedSignal, MaybeSignalObject } from "../../types.ts";

/**
 * A method to get all of the properties of a signalled object as derived signals.
 * Any change in object signal results in an update in their property signals.
 * @param obj an object in MaybeSignalObject format (either 'object',
 * Signal<'object'> or NonSignal<'object'>)
 * @returns all of its properties as derived signals
 * @see MaybeSignalObject
 */

export const dobject = <T extends object>(obj: MaybeSignalObject<T>) => {
  if (!isPlainObject(obj.value)) {
    throw new Error(
      "Thee argument should be a plain object or a signal of plain object"
    );
  }

  return {
    prop: <K extends keyof T>(key: K) => derive(() => obj.value[key]),
    get props() {
      const signalledPropsObj = Object.keys(obj.value).reduce((map, k) => {
        const key = k as keyof T;
        map[key] = this.prop(key);
        return map;
      }, {} as { [key in keyof T]: DerivedSignal<T[key]> });

      return signalledPropsObj;
    },
  };
};
