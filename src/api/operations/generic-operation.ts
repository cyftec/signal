import {
  GenericOperation,
  MaybeSignalValue,
  OperationResult,
} from "../../types";
import { value } from "../../utils";
import { derive } from "../_core";

/**
 * Acronym for 'GenericOperation'.
 * A method to accumulate all operations on signal(s), to ultimately resolve
 * into a final singal signal. Without this utility, one needs to create
 * n number of derived signals for doing n operations, unnecessarily.
 *
 * @param input any value for which transformed derived signal is required
 * @see MaybeSignalValue
 * @returns an object of handy transform methods as its properties, which return
 * derived signal
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
