import { type MaybeSignalValue, value } from "../../_core";
import { genericOp } from "./generic-operation";
import type { StringAndArrayOperation } from "./types";

/**
 * Creates the string/array-specific operation chain for a value.
 *
 * @template T - The string or array value type
 * @param input - A signalified string/array or value-producing function
 * @returns A string-and-array operation object with length-based methods
 *
 * @remarks
 * - Used when the evaluated value is a string or array
 * - Methods return new operation objects for chaining
 */
export const stringAndArrayOp = <T extends string | unknown[]>(
  input: MaybeSignalValue<T> | (() => T)
): StringAndArrayOperation => {
  const evaluate: () => T =
    typeof input === "function"
      ? (input as () => T)
      : (): T => value(input as MaybeSignalValue<T>);

  return {
    ...genericOp(input),
    lengthBetween: (
      lowerValue: MaybeSignalValue<number>,
      upperValue: MaybeSignalValue<number>,
      touchingLower = true,
      touchingUpper = true
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
    lengthEquals: (compareValue: MaybeSignalValue<number>) =>
      genericOp(() => {
        const val = evaluate();
        return val.length === value(compareValue);
      }),
    lengthNotEquals: (compareValue: MaybeSignalValue<number>) =>
      genericOp(() => {
        const val = evaluate();
        return val.length !== value(compareValue);
      }),
    lengthLT: (compareValue: MaybeSignalValue<number>) =>
      genericOp(() => {
        const val = evaluate();
        return val.length < value(compareValue);
      }),
    lengthLTE: (compareValue: MaybeSignalValue<number>) =>
      genericOp(() => {
        const val = evaluate();
        return val.length <= value(compareValue);
      }),
    lengthGT: (compareValue: MaybeSignalValue<number>) =>
      genericOp(() => {
        const val = evaluate();
        return val.length > value(compareValue);
      }),
    lengthGTE: (compareValue: MaybeSignalValue<number>) =>
      genericOp(() => {
        const val = evaluate();
        return val.length >= value(compareValue);
      }),
  };
};
