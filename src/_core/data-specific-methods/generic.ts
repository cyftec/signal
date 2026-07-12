import { value } from "../../utils";
import {
  derive,
  MaybeSignal,
  type BaseSignalifiedObject,
  type DerivedSignal,
} from "../signals";
import type {
  ArrayLogicalMethods,
  BooleanLogicalMethods,
  LogicalEquality,
  LogicalLengthComparison,
  LogicalMap,
  LogicalNumberInequality,
  LogicalTruthiness,
  NullableLogicalMethods,
  NumberLogicalMethods,
  ObjectLogicalMethods,
  Primitive,
  StringLogicalMethods,
} from "./types";

export const getNullableLogicalNonMutatingMethodsObject = <T>(
  baseSignalifiedObject: MaybeSignal<T>,
): NullableLogicalMethods<T> => {
  return {
    truthy: () => derive(() => !!value(baseSignalifiedObject)),
    falsy: () => derive(() => !value(baseSignalifiedObject)),
    or: <R>(alternativeValue: MaybeSignal<R>) =>
      derive(() => {
        const altValue = value(alternativeValue);
        return value(baseSignalifiedObject) || altValue;
      }),
  };
};

/**
 * Creates a logical map object for conditional value selection.
 *
 * @param conditionSignal - The condition signal to evaluate
 * @returns A logical map object with a `map` method
 */
const createLogicalMap = (truthyEvaluator: () => boolean): LogicalMap => {
  return {
    map: <U, V>(
      truthyOption: MaybeSignal<U>,
      falsyOption: MaybeSignal<V>,
    ): DerivedSignal<U | V> => {
      return derive(() => {
        const truthyValue = value(truthyOption) as U;
        const falsyValue = value(falsyOption) as V;
        return truthyEvaluator() ? truthyValue : falsyValue;
      });
    },
  };
};

/**
 * Creates a logical truthiness object for truthy/falsy checks.
 *
 * @param baseSignalifiedObjectGetter - The base signal to check truthiness
 * @returns A logical truthiness object
 */
const createLogicalTruthiness = <T>(
  valueGetter: () => T,
): LogicalTruthiness => {
  const isTruthyEvaluator = () => !!valueGetter();
  return {
    isTruthy: createLogicalMap(isTruthyEvaluator),
  };
};

/**
 * Creates a logical equality object for equality comparisons.
 *
 * @param baseSignalifiedObjectGetter - The base signal to compare
 * @returns A logical equality object
 */
const createLogicalEquality = <T extends Primitive>(
  valueGetter: () => T,
): LogicalEquality<T> => {
  return {
    equals: (compareValue: MaybeSignal<T>) => {
      const equalityEvaluator = () =>
        valueGetter() === (value(compareValue) as Primitive);
      return createLogicalMap(equalityEvaluator);
    },
    notEquals: (compareValue: MaybeSignal<T>) => {
      const notEqualityEvaluator = () =>
        valueGetter() !== (value(compareValue) as Primitive);
      return createLogicalMap(notEqualityEvaluator);
    },
  };
};

/**
 * Creates a logical number inequality object for numeric comparisons.
 *
 * @param baseSignalifiedObjectGetter - The base number signal to compare
 * @returns A logical number inequality object
 */
const createLogicalNumberInequality = (
  numberGetter: () => number,
): LogicalNumberInequality => {
  return {
    greaterThan: (compareValue: MaybeSignal<number>) => {
      const greaterThanEvaluator = () =>
        numberGetter() > (value(compareValue) as number);
      return createLogicalMap(greaterThanEvaluator);
    },
    greaterThanOrEqualTo: (compareValue: MaybeSignal<number>) => {
      const greaterThanOrEqualToEvaluator = () =>
        numberGetter() >= (value(compareValue) as number);
      return createLogicalMap(greaterThanOrEqualToEvaluator);
    },
    smallerThan: (compareValue: MaybeSignal<number>) => {
      const smallerThanEvaluator = () =>
        numberGetter() < (value(compareValue) as number);
      return createLogicalMap(smallerThanEvaluator);
    },
    smallerThanOrEqualTo: (compareValue: MaybeSignal<number>) => {
      const smallerThanOrEqualToEvaluator = () =>
        numberGetter() <= (value(compareValue) as number);
      return createLogicalMap(smallerThanOrEqualToEvaluator);
    },
  };
};

/**
 * Creates a logical length comparison object for length-based comparisons.
 *
 * @param baseSignalifiedObjectGetter - The base signal with length property
 * @returns A logical length comparison object
 */
const createLogicalLengthComparison = (
  lengthGetter: () => number,
): LogicalLengthComparison => {
  return {
    length: {
      ...createLogicalEquality(lengthGetter),
      ...createLogicalNumberInequality(lengthGetter),
    },
  };
};

/**
 * Creates logical methods for array signals.
 *
 * @template T - The array type
 * @param baseSignalifiedObject - The base array signal
 * @returns Logical methods for array signals
 */
export const getArrayLogicalMethods = <T extends any[]>(
  baseSignalifiedObject: BaseSignalifiedObject<T>,
): ArrayLogicalMethods => {
  const lengthGetter = () => (value(baseSignalifiedObject) as any[]).length;
  return {
    when: {
      ...createLogicalLengthComparison(lengthGetter),
    },
  };
};

/**
 * Creates logical methods for string signals.
 *
 * @param baseSignalifiedObject - The base string signal
 * @returns Logical methods for string signals
 */
export const getStringLogicalMethods = (
  baseSignalifiedObject: BaseSignalifiedObject<string>,
): StringLogicalMethods => {
  const valueGetter = () => value(baseSignalifiedObject) as string;
  const lengthGetter = () => (value(baseSignalifiedObject) as string).length;

  return {
    when: {
      ...createLogicalTruthiness(valueGetter),
      ...createLogicalEquality(valueGetter),
      ...createLogicalLengthComparison(lengthGetter),
    },
  };
};

/**
 * Creates logical methods for number signals.
 *
 * @param baseSignalifiedObject - The base number signal
 * @returns Logical methods for number signals
 */
export const getNumberLogicalMethods = (
  baseSignalifiedObject: BaseSignalifiedObject<number>,
): NumberLogicalMethods => {
  const valueGetter = () => value(baseSignalifiedObject) as number;

  return {
    when: {
      ...createLogicalTruthiness(valueGetter),
      ...createLogicalEquality(valueGetter),
      ...createLogicalNumberInequality(valueGetter),
    },
  };
};

/**
 * Creates logical methods for boolean signals.
 *
 * @param baseSignalifiedObject - The base boolean signal
 * @returns Logical methods for boolean signals
 */
export const getBooleanLogicalMethods = (
  baseSignalifiedObject: BaseSignalifiedObject<boolean>,
): BooleanLogicalMethods => {
  const valueGetter = () => value(baseSignalifiedObject) as boolean;

  return {
    when: {
      ...createLogicalTruthiness(valueGetter),
      ...createLogicalEquality(valueGetter),
    },
  };
};

/**
 * Creates logical methods for object signals.
 *
 * @template T - The object type
 * @param baseSignalifiedObject - The base object signal
 * @returns Logical methods for object signals
 */
export const getObjectLogicalMethods = (): ObjectLogicalMethods => ({});
