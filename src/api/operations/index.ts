import { type MaybeSignalValue, value } from "../../_core";
import { genericOp } from "./generic-operation";
import { numberOp } from "./number-operation";
import { stringAndArrayOp } from "./string-and-array-operation";
import type { Operation } from "./types";

/**
 * Factory function that creates type-specific operation objects.
 *
 * This function evaluates the input (which can be a signal, plain value, or function)
 * and dispatches to the appropriate operation implementation based on the evaluated type:
 * - Number values -> numberOp (provides math operations: add, sub, mul, div, etc.)
 * - String or Array values -> stringAndArrayOp (provides length-based operations)
 * - Other types -> genericOp (provides logical operations: or, and, equals, etc.)
 *
 * The function supports both direct values and functions that compute values,
 * allowing for dynamic operation creation.
 *
 * @param input A signal, plain value, or function that evaluates to a value
 * @returns A type-specific operation object with chainable methods
 */
export const op = <T>(input: MaybeSignalValue<T> | (() => T)): Operation<T> => {
  // Create an evaluator function that handles both direct values and functions
  const evaluator: () => T =
    typeof input === "function"
      ? (input as () => T)
      : (): T => value(input as MaybeSignalValue<T>);
  const val = evaluator();

  // Dispatch to type-specific operation based on evaluated value type
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
