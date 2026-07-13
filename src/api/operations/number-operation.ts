import { derive, type MaybeSignal } from "../../_core";
import { value } from "../../utils";
import { genericOp } from "./generic-operation";
import type { NumberOperation } from "./types";

/**
 * Creates the number-specific operation chain for a value.
 *
 * @template T - The numeric value type
 * @param input - A signalified number or value-producing function
 * @returns A number operation object with math and comparison methods
 *
 * @example
 * ```typescript
 * const count = signal(10);
 * const op = numberOp(count);
 * op.result; // DerivedSignal<number>
 * op.add(5).result; // DerivedSignal<number> = 15
 * op.isBetween(5, 15).truthy; // DerivedSignal<boolean>
 * op.mul(2).isGT(20).truthy; // Chained operations
 * ```
 *
 * @remarks
 * - Used when the evaluated value is a number
 * - Methods return new operation objects for chaining
 * - Supports arithmetic operations (add, sub, mul, div, mod, pow)
 * - Supports numeric comparisons (isBetween, isLT, isLTE, isGT, isGTE)
 * - Inherits all generic logical operations (AND, OR, NOT, equals)
 */
export const numberOp = (
  input: MaybeSignal<number> | (() => number),
): NumberOperation => {
  const evaluate: () => number =
    typeof input === "function"
      ? (input as () => number)
      : (): number => value(input as MaybeSignal<number>);

  return {
    ...genericOp(input),
    get result() {
      return derive(evaluate);
    },
    add: (num: MaybeSignal<number>) =>
      numberOp(() => {
        const val = evaluate();
        return val + value(num);
      }),
    sub: (num: MaybeSignal<number>) =>
      numberOp(() => {
        const val = evaluate();
        return val - value(num);
      }),
    mul: (num: MaybeSignal<number>) =>
      numberOp(() => {
        const val = evaluate();
        return val * value(num);
      }),
    div: (num: MaybeSignal<number>) =>
      numberOp(() => {
        const val = evaluate();
        return val / value(num);
      }),
    mod: (num: MaybeSignal<number>) =>
      numberOp(() => {
        const val = evaluate();
        return val % value(num);
      }),
    pow: (num: MaybeSignal<number>) =>
      numberOp(() => {
        const val = evaluate();
        return val ** value(num);
      }),
    isBetween: (
      lowerValue: MaybeSignal<number>,
      upperValue: MaybeSignal<number>,
      touchingLower = true,
      touchingUpper = true,
    ) =>
      genericOp(() => {
        const val = evaluate();
        const lowerVal = value(lowerValue);
        const upperVal = value(upperValue);
        const lowerCheckPass = touchingLower ? val >= lowerVal : val > lowerVal;
        const upperCheckPass = touchingUpper ? val <= upperVal : val < upperVal;
        return lowerCheckPass && upperCheckPass;
      }),
    isLT: (compareValue: MaybeSignal<number>) =>
      genericOp(() => evaluate() < value(compareValue)),
    isLTE: (compareValue: MaybeSignal<number>) =>
      genericOp(() => evaluate() <= value(compareValue)),
    isGT: (compareValue: MaybeSignal<number>) =>
      genericOp(() => evaluate() > value(compareValue)),
    isGTE: (compareValue: MaybeSignal<number>) =>
      genericOp(() => evaluate() >= value(compareValue)),
  };
};
