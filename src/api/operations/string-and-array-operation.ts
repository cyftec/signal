import { type MaybeSignal } from "../../_core";
import { value } from "../../utils";
import { genericOp } from "./generic-operation";
import type { StringAndArrayOperation } from "./types";

/**
 * Creates the string/array-specific operation chain for a value.
 *
 * @template T - The string or array value type
 * @param input - A signalified string/array or value-producing function
 * @returns A string-and-array operation object with length-based methods
 *
 * @example
 * ```typescript
 * const text = signal("hello");
 * const op = stringAndArrayOp(text);
 * op.lengthEquals(5).truthy; // DerivedSignal<boolean>
 * op.lengthBetween(3, 10).truthy; // DerivedSignal<boolean>
 *
 * const items = signal([1, 2, 3]);
 * const arrOp = stringAndArrayOp(items);
 * arrOp.lengthGT(2).truthy; // DerivedSignal<boolean>
 * ```
 *
 * @remarks
 * - Used when the evaluated value is a string or array
 * - Methods return new operation objects for chaining
 * - Supports length comparisons (lengthBetween, lengthEquals, lengthLT, etc.)
 * - Inherits all generic logical operations (AND, OR, NOT, equals)
 */
export const stringAndArrayOp = <T extends string | unknown[]>(
  input: MaybeSignal<T> | (() => T),
): StringAndArrayOperation => {
  const evaluate: () => T =
    typeof input === "function"
      ? (input as () => T)
      : (): T => value(input as MaybeSignal<T>);

  return {
    ...genericOp(input),
    lengthBetween: (
      lowerValue: MaybeSignal<number>,
      upperValue: MaybeSignal<number>,
      touchingLower = true,
      touchingUpper = true,
    ) =>
      genericOp(() => {
        const val = evaluate();
        const len = val.length;
        const lowerVal = value(lowerValue);
        const upperVal = value(upperValue);
        const lowerCheckPass = touchingLower ? len >= lowerVal : len > lowerVal;
        const upperCheckPass = touchingUpper ? len <= upperVal : len < upperVal;
        return lowerCheckPass && upperCheckPass;
      }),
    lengthEquals: (compareValue: MaybeSignal<number>) =>
      genericOp(() => {
        const val = evaluate();
        return val.length === value(compareValue);
      }),
    lengthNotEquals: (compareValue: MaybeSignal<number>) =>
      genericOp(() => {
        const val = evaluate();
        return val.length !== value(compareValue);
      }),
    lengthLT: (compareValue: MaybeSignal<number>) =>
      genericOp(() => {
        const val = evaluate();
        return val.length < value(compareValue);
      }),
    lengthLTE: (compareValue: MaybeSignal<number>) =>
      genericOp(() => {
        const val = evaluate();
        return val.length <= value(compareValue);
      }),
    lengthGT: (compareValue: MaybeSignal<number>) =>
      genericOp(() => {
        const val = evaluate();
        return val.length > value(compareValue);
      }),
    lengthGTE: (compareValue: MaybeSignal<number>) =>
      genericOp(() => {
        const val = evaluate();
        return val.length >= value(compareValue);
      }),
  };
};
