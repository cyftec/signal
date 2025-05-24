import { MaybeSignalValue, NumberOperation } from "../../types";
import { value } from "../../utils";
import { derive } from "../_core";
import { genericOp } from "./generic-operation";

export const numberOp = (
  input: MaybeSignalValue<number> | (() => number)
): NumberOperation => {
  const evaluate: () => number =
    typeof input === "function"
      ? (input as () => number)
      : (): number => value(input as MaybeSignalValue<number>);

  return {
    ...genericOp(input),
    get result() {
      return derive(evaluate);
    },
    add: (num: MaybeSignalValue<number>) =>
      numberOp(() => {
        const val = evaluate();
        return val + value(num);
      }),
    sub: (num: MaybeSignalValue<number>) =>
      numberOp(() => {
        const val = evaluate();
        return val - value(num);
      }),
    mul: (num: MaybeSignalValue<number>) =>
      numberOp(() => {
        const val = evaluate();
        return val * value(num);
      }),
    div: (num: MaybeSignalValue<number>) =>
      numberOp(() => {
        const val = evaluate();
        return val / value(num);
      }),
    mod: (num: MaybeSignalValue<number>) =>
      numberOp(() => {
        const val = evaluate();
        return val % value(num);
      }),
    pow: (num: MaybeSignalValue<number>) =>
      numberOp(() => {
        const val = evaluate();
        return val ** value(num);
      }),
    isBetween: (
      lowerValue: MaybeSignalValue<number>,
      upperValue: MaybeSignalValue<number>,
      touchingLower = true,
      touchingUpper = true
    ) =>
      genericOp(() => {
        const val = evaluate();
        const lowerVal = value(lowerValue);
        const upperVal = value(upperValue);
        const lowerCheckPass = touchingLower ? val >= lowerVal : val > lowerVal;
        const upperCheckPass = touchingUpper ? val <= upperVal : val < upperVal;
        return lowerCheckPass && upperCheckPass;
      }),
    isLT: (compareValue: MaybeSignalValue<number>) =>
      genericOp(() => evaluate() < value(compareValue)),
    isLTE: (compareValue: MaybeSignalValue<number>) =>
      genericOp(() => evaluate() <= value(compareValue)),
    isGT: (compareValue: MaybeSignalValue<number>) =>
      genericOp(() => evaluate() > value(compareValue)),
    isGTE: (compareValue: MaybeSignalValue<number>) =>
      genericOp(() => evaluate() >= value(compareValue)),
  };
};
