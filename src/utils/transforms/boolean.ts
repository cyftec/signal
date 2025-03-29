import { derive, type DerivedValueGetterWithSignals } from "../../core.ts";
import type { DerivedSignal, MaybeSignalValue, Signal } from "../../types.ts";
import { val } from "./misc.ts";

/**
 * A method to get a pair of derived truthy and falsy value signals
 * @param boolGetter should be either a deriver function (with signals)
 * or any other javascript value, preferably signals
 * @returns a (pair) array of truthy and falsy derived signals
 * @see DerivedValueGetterWithSignals
 * @see Signal
 *
 */
export const dbools = (
  boolGetter: DerivedValueGetterWithSignals<any> | MaybeSignalValue<any>
): readonly [DerivedSignal<boolean>, DerivedSignal<boolean>] => {
  const truthy =
    typeof boolGetter === "function"
      ? derive(() => !!boolGetter())
      : derive(() => !!val(boolGetter));
  const falsy = derive(() => !truthy.value);

  return [truthy, falsy];
};
