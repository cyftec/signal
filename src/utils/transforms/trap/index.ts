import { isPlainObject } from "@cyftech/immutjs";
import { value } from "../../../core/value-extractor";
import {
  GenericSignalTrap,
  MaybeSignalValue,
  SignalTrap,
  SpecificTypeSignalTrap,
} from "../../../types";
import { arrayTrap } from "./array-trap";
import { genericTrap } from "./generic-trap";
import { numberTrap } from "./number-trap";
import { objectTrap } from "./object-trap";
import { stringTrap } from "./string-trap";

/**
 * A method which traps a MaybeSignalValue and returns handy derived signals
 * of most-frequently required transforms
 *
 * @param input any value for which transformed derived signal is required
 * @see MaybeSignalValue
 * @returns an object of handy transform methods as its properties, which return
 * derived signal
 */
export const specificTrap = <T>(input: MaybeSignalValue<T>) => {
  return typeof value(input) === "number"
    ? numberTrap(input as MaybeSignalValue<number>)
    : typeof value(input) === "string"
    ? stringTrap(input as MaybeSignalValue<string>)
    : Array.isArray(value(input))
    ? arrayTrap(input as MaybeSignalValue<unknown[]>)
    : isPlainObject(value(input))
    ? objectTrap(input as MaybeSignalValue<Record<string, unknown>>)
    : ({} as never);
};

export const trap = <T>(input: MaybeSignalValue<T>): SignalTrap<T> => ({
  ...(genericTrap(input) as GenericSignalTrap<T>),
  ...(specificTrap(input) as SpecificTypeSignalTrap<T>),
});
