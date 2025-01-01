import { derived, valueIsSignal } from "../../core.ts";
import type { DerivedSignal, MaybeSignal, Signal } from "../../types.ts";
import { val } from "./misc.ts";

type BoolGetter = (() => any) | MaybeSignal<any>;

type TruthyFalsyDerivedSignalsPair = [
  DerivedSignal<boolean>,
  DerivedSignal<boolean>
];

/**
 * A method to get derived signals Tuple of truthy and falsy values
 * @param @type BoolGetter
 * @returns @type TruthyFalsyDerivedSignalsPair
 */
type DerivedBoolsPair = (
  boolGetter: BoolGetter
) => TruthyFalsyDerivedSignalsPair;

export const dbools: DerivedBoolsPair = (boolGetter) => {
  const truthy =
    typeof boolGetter === "function"
      ? derived(() => !!boolGetter())
      : derived(() => !!val(boolGetter));
  const falsy = derived(() => !truthy.value);

  return [truthy, falsy];
};
