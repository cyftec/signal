import { isPlainObject } from "@cyftech/immutjs";
import { derive } from "../../core.ts";
import type { DerivedSignal, Signal } from "../../types.ts";
import { valueIsSignal } from "../type-checkers.ts";

/**
 * A method to get all of the properties of a signalled object as derived signals.
 * Any change in object signal results in an update in their property signals.
 * @param objSignal an object signal
 * @returns all of its properties as derived signals
 */
export const dprops = <T extends object>(
  objSignal: Signal<T>
): { [key in keyof T]: DerivedSignal<T[key]> } => {
  if (!valueIsSignal(objSignal) || !isPlainObject(objSignal.value)) {
    throw new Error("Thee argument should be signal of a plain object");
  }

  const signalledPropsObj = Object.keys(objSignal.value).reduce((map, k) => {
    const key = k as keyof T;
    map[key] = derive(() => objSignal.value[key]);
    return map;
  }, {} as { [key in keyof T]: DerivedSignal<T[key]> });

  return signalledPropsObj;
};
