import { isPlainObject } from "@cyf__/immutjs";
import { derived, valueIsSignal } from "../../core.ts";
import type { DerivedSignal, Signal } from "../../types.ts";

/**
 * Derived object with all of its properties are derived signals
 * @param objSignal
 * @returns
 */
export const dprops = <T extends object>(
  objSignal: Signal<T>
): { [key in keyof T]: DerivedSignal<T[key]> } => {
  if (!valueIsSignal(objSignal) || !isPlainObject(objSignal.value)) {
    throw new Error("Thee argument should be signal of a plain object");
  }

  const signalledPropsObj = Object.keys(objSignal.value).reduce((map, k) => {
    const key = k as keyof T;
    map[key] = derived(() => objSignal.value[key]);
    return map;
  }, {} as { [key in keyof T]: DerivedSignal<T[key]> });

  return signalledPropsObj;
};
