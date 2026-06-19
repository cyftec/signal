import { derive, type MaybeSignalValue, value } from "../../_core";
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
  input: MaybeSignalValue<T> | (() => T)
): GenericOperation => {
  const evaluator: () => T =
    typeof input === "function"
      ? (input as () => T)
      : (): T => value(input as MaybeSignalValue<T>);

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
      valueIfTruthy: MaybeSignalValue<Tr>,
      valueIfFalsy: MaybeSignalValue<Fl>
    ) =>
      derive(() => {
        const val = evaluator();
        return !!val ? value(valueIfTruthy) : value(valueIfFalsy);
      }),
  };

  return {
    ...opResultGetters,
    or: (checkValue: MaybeSignalValue<any>) =>
      genericOp(() => {
        const val = evaluator();
        return !!(val || value(checkValue));
      }),
    orNot: (checkValue: MaybeSignalValue<any>) =>
      genericOp(() => {
        const val = evaluator();
        return !!(val || !value(checkValue));
      }),
    and: (checkValue: MaybeSignalValue<any>) =>
      genericOp(() => {
        const val = evaluator();
        return !!(val && value(checkValue));
      }),
    andNot: (checkValue: MaybeSignalValue<any>) =>
      genericOp(() => {
        const val = evaluator();
        return !!(val && !value(checkValue));
      }),
    equals: (compareValue: MaybeSignalValue<any>) =>
      genericOp(() => {
        const val = evaluator();
        return val === value(compareValue);
      }),
    notEquals: (compareValue: MaybeSignalValue<any>) =>
      genericOp(() => {
        const val = evaluator();
        return val !== value(compareValue);
      }),
    orBothEqual: (
      subjectValue: MaybeSignalValue<any>,
      compareValue: MaybeSignalValue<any>
    ) =>
      genericOp(() => {
        const val = evaluator();
        const comparisonResult = value(subjectValue) === value(compareValue);
        return !!(val || comparisonResult);
      }),
    orBothUnequal: (
      subjectValue: MaybeSignalValue<any>,
      compareValue: MaybeSignalValue<any>
    ) =>
      genericOp(() => {
        const val = evaluator();
        const comparisonResult = value(subjectValue) !== value(compareValue);
        return !!(val || comparisonResult);
      }),
    andBothEqual: (
      subjectValue: MaybeSignalValue<any>,
      compareValue: MaybeSignalValue<any>
    ) =>
      genericOp(() => {
        const val = evaluator();
        const comparisonResult = value(subjectValue) === value(compareValue);
        return !!(val && comparisonResult);
      }),
    andBothUnequal: (
      subjectValue: MaybeSignalValue<any>,
      compareValue: MaybeSignalValue<any>
    ) =>
      genericOp(() => {
        const val = evaluator();
        const comparisonResult = value(subjectValue) !== value(compareValue);
        return !!(val && comparisonResult);
      }),
    orThisIsLT: (
      subjectValue: MaybeSignalValue<number>,
      compareValue: MaybeSignalValue<number>
    ) =>
      genericOp(() => {
        const val = evaluator();
        const comparisonResult = value(subjectValue) < value(compareValue);
        return !!(val || comparisonResult);
      }),
    orThisIsLTE: (
      subjectValue: MaybeSignalValue<number>,
      compareValue: MaybeSignalValue<number>
    ) =>
      genericOp(() => {
        const val = evaluator();
        const comparisonResult = value(subjectValue) <= value(compareValue);
        return !!(val || comparisonResult);
      }),
    orThisIsGT: (
      subjectValue: MaybeSignalValue<number>,
      compareValue: MaybeSignalValue<number>
    ) =>
      genericOp(() => {
        const val = evaluator();
        const comparisonResult = value(subjectValue) > value(compareValue);
        return !!(val || comparisonResult);
      }),
    orThisIsGTE: (
      subjectValue: MaybeSignalValue<number>,
      compareValue: MaybeSignalValue<number>
    ) =>
      genericOp(() => {
        const val = evaluator();
        const comparisonResult = value(subjectValue) >= value(compareValue);
        return !!(val || comparisonResult);
      }),
    andThisIsLT: (
      subjectValue: MaybeSignalValue<number>,
      compareValue: MaybeSignalValue<number>
    ) =>
      genericOp(() => {
        const val = evaluator();
        const comparisonResult = value(subjectValue) < value(compareValue);
        return !!(val && comparisonResult);
      }),
    andThisIsLTE: (
      subjectValue: MaybeSignalValue<number>,
      compareValue: MaybeSignalValue<number>
    ) =>
      genericOp(() => {
        const val = evaluator();
        const comparisonResult = value(subjectValue) <= value(compareValue);
        return !!(val && comparisonResult);
      }),
    andThisIsGT: (
      subjectValue: MaybeSignalValue<number>,
      compareValue: MaybeSignalValue<number>
    ) =>
      genericOp(() => {
        const val = evaluator();
        const comparisonResult = value(subjectValue) > value(compareValue);
        return !!(val && comparisonResult);
      }),
    andThisIsGTE: (
      subjectValue: MaybeSignalValue<number>,
      compareValue: MaybeSignalValue<number>
    ) =>
      genericOp(() => {
        const val = evaluator();
        const comparisonResult = value(subjectValue) >= value(compareValue);
        return !!(val && comparisonResult);
      }),
  };
};
