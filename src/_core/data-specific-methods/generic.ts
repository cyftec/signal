import { value } from "../../utils";
import {
  derive,
  MaybeSignal,
  type BaseSignalifiedObject,
  type DerivedSignal,
} from "../signals";
import type {
  LogicalPrimitiveMethods,
  LogicalLengthMethods,
  LogicalThen,
  LogicalNumberOnlyMethods,
  LogicalOrMethods,
  LogicalCheckReturnType,
  Primitive,
  LogicalMethods,
  LogicalChecker,
} from "./types";

export const getOrMethodsObject = <T>(
  baseSignalifiedObject: MaybeSignal<T>,
): LogicalOrMethods<Primitive> => {
  return {
    or: <R>(alternativeValue: MaybeSignal<R>) =>
      derive(() => {
        const altValue = value(alternativeValue);
        return value(baseSignalifiedObject) || altValue;
      }),
  } as LogicalOrMethods<Primitive>;
};

/**
 * Creates a logical map object for conditional value selection.
 *
 * @param conditionSignal - The condition signal to evaluate
 * @returns A logical map object with a `map` method
 */
const getLogicalMap = (truthyEvaluator: () => boolean): LogicalThen => {
  return {
    then: <U, V>(
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
 * Creates a logical equality object for equality comparisons.
 *
 * @param baseSignalifiedObjectGetter - The base signal to compare
 * @returns A logical equality object
 */
const getPrimitiveMethods = <T extends any, R extends LogicalCheckReturnType>(
  valueGetter: () => T,
  forTernaryMap: boolean,
): LogicalPrimitiveMethods<Primitive, R> => {
  const truthyEvaluator = () => !!valueGetter();
  const falsyEvaluator = () => !valueGetter();

  const truthyChecker = (forTernaryOpMap: boolean) => () =>
    forTernaryOpMap ? getLogicalMap(truthyEvaluator) : derive(truthyEvaluator);

  const falsyChecker = (forTernaryOpMap: boolean) => () =>
    forTernaryOpMap ? getLogicalMap(falsyEvaluator) : derive(falsyEvaluator);

  const equalToChecker =
    (forTernaryOpMap: boolean) => (compareValue: MaybeSignal<T>) => {
      const equalityEvaluator = () =>
        valueGetter() === (value(compareValue) as Primitive);
      return forTernaryOpMap
        ? getLogicalMap(equalityEvaluator)
        : derive(equalityEvaluator);
    };

  const notEqualToChecker =
    (forTernaryOpMap: boolean) => (compareValue: MaybeSignal<T>) => {
      const notEqualityEvaluator = () =>
        valueGetter() !== (value(compareValue) as Primitive);
      return forTernaryOpMap
        ? getLogicalMap(notEqualityEvaluator)
        : derive(notEqualityEvaluator);
    };

  return {
    truthy: truthyChecker(forTernaryMap),
    falsy: falsyChecker(forTernaryMap),
    equalTo: equalToChecker(forTernaryMap),
    notEqualTo: notEqualToChecker(forTernaryMap),
  } as LogicalPrimitiveMethods<Primitive, R>;
};

/**
 * Creates a logical number inequality object for numeric comparisons.
 *
 * @param baseSignalifiedObjectGetter - The base number signal to compare
 * @returns A logical number inequality object
 */
const getNumberOnlyMethods = <R extends LogicalCheckReturnType>(
  numberGetter: () => number,
  forTernaryMap: boolean,
): LogicalNumberOnlyMethods<R> => {
  const greaterThanChecker =
    (forTernaryOpMap: boolean) => (compareValue: MaybeSignal<number>) => {
      const greaterThanEvaluator = () =>
        numberGetter() > (value(compareValue) as number);
      return forTernaryOpMap
        ? getLogicalMap(greaterThanEvaluator)
        : derive(greaterThanEvaluator);
    };
  const greaterThanOrEqualToChecker =
    (forTernaryOpMap: boolean) => (compareValue: MaybeSignal<number>) => {
      const greaterThanOrEqualToEvaluator = () =>
        numberGetter() >= (value(compareValue) as number);
      return forTernaryOpMap
        ? getLogicalMap(greaterThanOrEqualToEvaluator)
        : derive(greaterThanOrEqualToEvaluator);
    };
  const smallerThanChecker =
    (forTernaryOpMap: boolean) => (compareValue: MaybeSignal<number>) => {
      const smallerThanEvaluator = () =>
        numberGetter() < (value(compareValue) as number);
      return forTernaryOpMap
        ? getLogicalMap(smallerThanEvaluator)
        : derive(smallerThanEvaluator);
    };
  const smallerThanOrEqualToChecker =
    (forTernaryOpMap: boolean) => (compareValue: MaybeSignal<number>) => {
      const smallerThanOrEqualToEvaluator = () =>
        numberGetter() <= (value(compareValue) as number);
      return forTernaryOpMap
        ? getLogicalMap(smallerThanOrEqualToEvaluator)
        : derive(smallerThanOrEqualToEvaluator);
    };

  return {
    greaterThan: greaterThanChecker(forTernaryMap),
    greaterThanOrEqualTo: greaterThanOrEqualToChecker(forTernaryMap),
    smallerThan: smallerThanChecker(forTernaryMap),
    smallerThanOrEqualTo: smallerThanOrEqualToChecker(forTernaryMap),
  } as LogicalNumberOnlyMethods<R>;
};

const getLogicalCheckerMethods = <
  T extends Primitive,
  R extends LogicalCheckReturnType,
>(
  valueGetter: () => T,
  forTernaryMap: boolean,
): LogicalChecker<T, R> => {
  return {
    ...getPrimitiveMethods(valueGetter, forTernaryMap),
    ...getNumberOnlyMethods(valueGetter as () => number, forTernaryMap),
  };
};

/**
 * Creates a logical length comparison object for length-based comparisons.
 *
 * @param baseSignalifiedObjectGetter - The base signal with length property
 * @returns A logical length comparison object
 */
const getLengthMethods = <R extends LogicalCheckReturnType>(
  lengthGetter: () => number,
  forTernaryMap: boolean,
): LogicalLengthMethods<R> => {
  return {
    length: getLogicalCheckerMethods(lengthGetter, forTernaryMap),
  };
};

/**
 * Creates logical methods for boolean signals.
 *
 * @param baseSignalifiedObject - The base boolean signal
 * @returns Logical methods for boolean signals
 */
export const getLogicalMethods = <T>(
  baseSignalifiedObject: MaybeSignal<T>,
): LogicalMethods<T> => {
  const valueGetter = () => value(baseSignalifiedObject) as Primitive;
  const lenghtGetter = () => {
    const val = value(baseSignalifiedObject);
    if (typeof val === "string" || Array.isArray(val)) return val.length;
    return NaN;
  };

  return {
    or: <A>(alternativeValue: MaybeSignal<A>) =>
      derive(() => {
        const altValue = value(alternativeValue);
        return value(baseSignalifiedObject) || altValue;
      }),
    is: {
      ...getLogicalCheckerMethods(valueGetter, false),
      ...getLengthMethods(lenghtGetter, false),
    },
    when: {
      ...getLogicalCheckerMethods(valueGetter, true),
      ...getLengthMethods(lenghtGetter, false),
    },
  } as unknown as LogicalMethods<T>;
};
