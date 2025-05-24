import { MaybeSignalValue, StringAndArrayOperation } from "../../types";
import { value } from "../../utils";
import { genericOp } from "./generic-operation";

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
