import { type MaybeSignal, value } from "../../_core";
import { genericOp } from "./generic-operation";
import { numberOp } from "./number-operation";
import { stringAndArrayOp } from "./string-and-array-operation";
import type { Operation } from "./types";

/**
 * Creates an operation object for composing logical and mathematical operations.
 *
 * This function evaluates the input and dispatches to the appropriate operation
 * implementation based on the evaluated type:
 * - Number values → numberOp (provides math operations: add, sub, mul, div, etc.)
 * - String or Array values → stringAndArrayOp (provides length-based operations)
 * - Other types → genericOp (provides logical operations: or, and, equals, etc.)
 *
 * @template T - The type of value the operation works with
 * @param input - A signal, plain value, or value-producing function
 * @returns A type-specific operation object with chainable methods
 *
 * @example
 * ```typescript
 * const count = signal(5);
 * const operation = op(count);
 * const doubled = operation.add(5).result; // DerivedSignal<number>
 *
 * const text = signal("hello");
 * const textOp = op(text);
 * const isLong = textOp.lengthGT(5).truthy; // DerivedSignal<boolean>
 *
 * const value = signal(10);
 * const check = op(value).isBetween(5, 15).truthy; // DerivedSignal<boolean>
 * ```
 *
 * @remarks
 * - The operation type is determined by the runtime type of the evaluated value
 * - If input is a function, it is called to get the value
 * - Type changes in the input signal are not reflected in the operation type
 * - Methods return new operation objects for chaining
 * - Final results are obtained via getters such as `truthy`, `falsy`, and `result`
 *
 * @see {@link Operation} - For the operation type union
 * @see {@link MaybeSignal} - For the input type
 */
export const op = <T>(input: MaybeSignal<T> | (() => T)): Operation<T> => {
  const evaluator: () => T =
    typeof input === "function"
      ? (input as () => T)
      : (): T => value(input as MaybeSignal<T>);
  const val = evaluator();

  return (
    typeof val === "number"
      ? numberOp(input as MaybeSignal<number> | (() => number))
      : typeof val === "string" || Array.isArray(val)
        ? stringAndArrayOp(
            input as
              | MaybeSignal<string | unknown[]>
              | (() => string | unknown[]),
          )
        : genericOp(input)
  ) as Operation<T>;
};
