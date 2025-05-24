import { DerivedSignal, GenericTrap, MaybeSignalValue } from "../../types";
import { value } from "../../utils";
import { derive } from "../_core";

/**
 * A method which traps a MaybeSignalValue and returns handy derived signals
 * of most-frequently required transforms
 *
 * @param input any value for which transformed derived signal is required
 * @see MaybeSignalValue
 * @returns an object of handy transform methods as its properties, which return
 * derived signal
 */
export const genericTrap = <T>(input: MaybeSignalValue<T>): GenericTrap<T> => {
  return {
    get string() {
      return derive(() => {
        const val = value(input);
        const str = (
          val === undefined || val === null ? undefined : val.toString()
        ) as T extends null | undefined ? undefined : string;
        return str;
      });
    },
    or: <OV>(
      orValue: MaybeSignalValue<OV>
    ): DerivedSignal<OV | NonNullable<T>> =>
      derive(() => value(input) || value(orValue)),
  };
};
