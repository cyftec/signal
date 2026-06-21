import {
  derive,
  type DerivedSignal,
  type MaybeSignalValue,
  value,
} from "../../_core";
import type { GenericTrap } from "./types";

/**
 * Creates the fallback trap for values that do not match a specialized trap.
 *
 * @template T - The type of the trapped value
 * @param input - A signalified or plain value to trap
 * @returns A generic trap with string coercion and fallback selection
 */
export const genericTrap = <T>(input: MaybeSignalValue<T>): GenericTrap<T> => {
  return {
    get string() {
      return derive(() => {
        const val = value(input);
        const str = (
          val === undefined || val === null ? "" : val.toString()
        )
        return str;
      });
    },
    or: <OV>(
      orValue: MaybeSignalValue<OV>,
    ): DerivedSignal<OV | NonNullable<T>> =>
      derive(() => value(input) || value(orValue)),
  };
};
