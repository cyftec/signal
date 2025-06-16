import { isPlainObject } from "@cyftech/immutjs";
import { type MaybeSignalValue, value } from "../../_core";
import { arrayTrap } from "./array-trap";
import { genericTrap } from "./generic-trap";
import { numberTrap } from "./number-trap";
import { objectTrap } from "./object-trap";
import { stringTrap } from "./string-trap";
import type { SignalTrap } from "./types";

/**
 * A method which traps a MaybeSignalValue and returns handy derived signals
 * of most-frequently required transforms
 *
 * @param input any value for which transformed derived signal is required
 * @see MaybeSignalValue
 * @returns an object of handy transform methods as its properties, which return
 * derived signal
 */
export const trap = <T>(input: MaybeSignalValue<T>) => {
  return (
    typeof value(input) === "number"
      ? numberTrap(input as MaybeSignalValue<number>)
      : typeof value(input) === "string"
      ? stringTrap(input as MaybeSignalValue<string>)
      : Array.isArray(value(input))
      ? arrayTrap(input as MaybeSignalValue<unknown[]>)
      : isPlainObject(value(input))
      ? objectTrap(input as MaybeSignalValue<Record<string, unknown>>)
      : genericTrap(input)
  ) as SignalTrap<T>;
};
