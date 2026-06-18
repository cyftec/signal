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
 * This function uses runtime type checking to dispatch to the appropriate
 * type-specific trap implementation. The dispatch order is:
 * 1. Number values -> numberTrap (provides math operations, formatting)
 * 2. String values -> stringTrap (provides string manipulation methods)
 * 3. Array values -> arrayTrap (provides array transformation methods)
 * 4. Plain objects -> objectTrap (provides property access methods)
 * 5. Other types -> genericTrap (provides basic string and fallback methods)
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
