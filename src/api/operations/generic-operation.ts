import { derive, type MaybeSignal, value } from "../../_core";
import type { GenericOperation, OperationResult } from "./types";

/**
 * Creates the generic operation chain for a value.
 *
 * @template T - The value type
 * @param input - A signalified value or value-producing function
 * @returns A generic operation object with composable logical methods
 *
 * @remarks
 * - Used for non-numeric and non-string-or-array inputs
 * - Methods return new operation objects for chaining
 */
export const genericOp = <T>(
  input: MaybeSignal<T> | (() => T),
): GenericOperation => {
  const evaluator: () => T =
    typeof input === "function"
      ? (input as () => T)
      : (): T => value(input as MaybeSignal<T>);

  const opResultGetters: OperationResult = {
    get truthy() {
      return derive(() => !!evaluator());
    },
    get falsy() {
      return derive(() => !evaluator());
    },
    get truthyFalsyPair() {
      return derive(() => {
        const truthyVal = !!evaluator();
        const pair = [truthyVal, !truthyVal] as const;
        return pair;
      });
    },
    ternary: <Tr, Fl>(
      valueIfTruthy: MaybeSignal<Tr>,
      valueIfFalsy: MaybeSignal<Fl>,
    ) =>
      derive(() => {
        const val = evaluator();
        return !!val ? value(valueIfTruthy) : value(valueIfFalsy);
      }),
  };

  return {
    ...opResultGetters,
    or: (checkValue: MaybeSignal<any>) =>
      genericOp(() => {
        const val = evaluator();
        return !!(val || value(checkValue));
      }),
    orNot: (checkValue: MaybeSignal<any>) =>
      genericOp(() => {
        const val = evaluator();
        return !!(val || !value(checkValue));
      }),
    and: (checkValue: MaybeSignal<any>) =>
      genericOp(() => {
        const val = evaluator();
        return !!(val && value(checkValue));
      }),
    andNot: (checkValue: MaybeSignal<any>) =>
      genericOp(() => {
        const val = evaluator();
        return !!(val && !value(checkValue));
      }),
    equals: (compareValue: MaybeSignal<any>) =>
      genericOp(() => {
        const val = evaluator();
        return val === value(compareValue);
      }),
    notEquals: (compareValue: MaybeSignal<any>) =>
      genericOp(() => {
        const val = evaluator();
        return val !== value(compareValue);
      }),
    orBothEqual: (
      subjectValue: MaybeSignal<any>,
      compareValue: MaybeSignal<any>,
    ) =>
      genericOp(() => {
        const val = evaluator();
        const comparisonResult = value(subjectValue) === value(compareValue);
        return !!(val || comparisonResult);
      }),
    orBothUnequal: (
      subjectValue: MaybeSignal<any>,
      compareValue: MaybeSignal<any>,
    ) =>
      genericOp(() => {
        const val = evaluator();
        const comparisonResult = value(subjectValue) !== value(compareValue);
        return !!(val || comparisonResult);
      }),
    andBothEqual: (
      subjectValue: MaybeSignal<any>,
      compareValue: MaybeSignal<any>,
    ) =>
      genericOp(() => {
        const val = evaluator();
        const comparisonResult = value(subjectValue) === value(compareValue);
        return !!(val && comparisonResult);
      }),
    andBothUnequal: (
      subjectValue: MaybeSignal<any>,
      compareValue: MaybeSignal<any>,
    ) =>
      genericOp(() => {
        const val = evaluator();
        const comparisonResult = value(subjectValue) !== value(compareValue);
        return !!(val && comparisonResult);
      }),
    orThisIsLT: (
      subjectValue: MaybeSignal<number>,
      compareValue: MaybeSignal<number>,
    ) =>
      genericOp(() => {
        const val = evaluator();
        const comparisonResult = value(subjectValue) < value(compareValue);
        return !!(val || comparisonResult);
      }),
    orThisIsLTE: (
      subjectValue: MaybeSignal<number>,
      compareValue: MaybeSignal<number>,
    ) =>
      genericOp(() => {
        const val = evaluator();
        const comparisonResult = value(subjectValue) <= value(compareValue);
        return !!(val || comparisonResult);
      }),
    orThisIsGT: (
      subjectValue: MaybeSignal<number>,
      compareValue: MaybeSignal<number>,
    ) =>
      genericOp(() => {
        const val = evaluator();
        const comparisonResult = value(subjectValue) > value(compareValue);
        return !!(val || comparisonResult);
      }),
    orThisIsGTE: (
      subjectValue: MaybeSignal<number>,
      compareValue: MaybeSignal<number>,
    ) =>
      genericOp(() => {
        const val = evaluator();
        const comparisonResult = value(subjectValue) >= value(compareValue);
        return !!(val || comparisonResult);
      }),
    andThisIsLT: (
      subjectValue: MaybeSignal<number>,
      compareValue: MaybeSignal<number>,
    ) =>
      genericOp(() => {
        const val = evaluator();
        const comparisonResult = value(subjectValue) < value(compareValue);
        return !!(val && comparisonResult);
      }),
    andThisIsLTE: (
      subjectValue: MaybeSignal<number>,
      compareValue: MaybeSignal<number>,
    ) =>
      genericOp(() => {
        const val = evaluator();
        const comparisonResult = value(subjectValue) <= value(compareValue);
        return !!(val && comparisonResult);
      }),
    andThisIsGT: (
      subjectValue: MaybeSignal<number>,
      compareValue: MaybeSignal<number>,
    ) =>
      genericOp(() => {
        const val = evaluator();
        const comparisonResult = value(subjectValue) > value(compareValue);
        return !!(val && comparisonResult);
      }),
    andThisIsGTE: (
      subjectValue: MaybeSignal<number>,
      compareValue: MaybeSignal<number>,
    ) =>
      genericOp(() => {
        const val = evaluator();
        const comparisonResult = value(subjectValue) >= value(compareValue);
        return !!(val && comparisonResult);
      }),
  };
};
