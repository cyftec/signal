import { type MaybeSignalValue, value } from "../../_core";
import { genericOp } from "./generic-operation";
import { numberOp } from "./number-operation";
import { stringAndArrayOp } from "./string-and-array-operation";
import type { Operation } from "./types";

export const op = <T>(input: MaybeSignalValue<T> | (() => T)): Operation<T> => {
  const evaluator: () => T =
    typeof input === "function"
      ? (input as () => T)
      : (): T => value(input as MaybeSignalValue<T>);
  const val = evaluator();

  return (
    typeof val === "number"
      ? numberOp(input as MaybeSignalValue<number> | (() => number))
      : typeof val === "string" || Array.isArray(val)
      ? stringAndArrayOp(
          input as
            | MaybeSignalValue<string | unknown[]>
            | (() => string | unknown[])
        )
      : genericOp(input)
  ) as Operation<T>;
};
