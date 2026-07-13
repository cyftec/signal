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

/**
 * Creates an OR method object for providing alternative values.
 *
 * This function creates a logical OR operation that returns the current value
 * if it's truthy, otherwise returns the alternative value.
 *
 * @template T - The type of the base value
 * @param baseSignalifiedObject - The base signalified value to check
 * @returns An object with an `or` method for providing alternative values
 *
 * @remarks
 * - The `or` method returns the current value if truthy, otherwise the alternative
 * - Useful for providing default values for nullable signals
 * - Returns a derived signal that updates when either value changes
 */
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
 * This function creates an object with a `then` method that selects between
 * two values based on a condition. Used for ternary-style conditional logic.
 *
 * @param truthyEvaluator - A function that evaluates to true or false
 * @returns A logical map object with a `then` method
 *
 * @remarks
 * - The `then` method returns truthyOption if the condition is true, otherwise falsyOption
 * - Returns a derived signal that updates when the condition or options change
 * - Used by the `when` logical methods for conditional value selection
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
 * Creates a logical primitive methods object for truthy/falsy and equality checks.
 *
 * This function creates methods for checking if a value is truthy or falsy,
 * and for comparing it with other values for equality.
 *
 * @template T - The type of value to check
 * @template R - The return type (DerivedSignal or LogicalThen)
 * @param valueGetter - A function that returns the value to check
 * @param forTernaryMap - Whether to return LogicalThen for ternary operations
 * @returns A logical primitive methods object
 *
 * @remarks
 * - `truthy` returns true if the value is truthy
 * - `falsy` returns true if the value is falsy
 * - `equalTo` returns true if the value equals the comparison value
 * - `notEqualTo` returns true if the value does not equal the comparison value
 * - When forTernaryMap is true, methods return LogicalThen for conditional selection
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
 * Creates a logical number methods object for numeric comparisons.
 *
 * This function creates methods for comparing numeric values using
 * greater-than and less-than operators.
 *
 * @template R - The return type (DerivedSignal or LogicalThen)
 * @param numberGetter - A function that returns the number to compare
 * @param forTernaryMap - Whether to return LogicalThen for ternary operations
 * @returns A logical number methods object
 *
 * @remarks
 * - `greaterThan` returns true if the value is greater than the comparison value
 * - `greaterThanOrEqualTo` returns true if the value is greater than or equal
 * - `smallerThan` returns true if the value is less than the comparison value
 * - `smallerThanOrEqualTo` returns true if the value is less than or equal
 * - When forTernaryMap is true, methods return LogicalThen for conditional selection
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

/**
 * Combines primitive and number logical methods into a single checker.
 *
 * @template T - The type of value to check
 * @template R - The return type (DerivedSignal or LogicalThen)
 * @param valueGetter - A function that returns the value to check
 * @param forTernaryMap - Whether to return LogicalThen for ternary operations
 * @returns A combined logical checker object
 */
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
 * Creates a logical length methods object for length-based comparisons.
 *
 * This function creates methods for comparing the length of strings and arrays.
 *
 * @template R - The return type (DerivedSignal or LogicalThen)
 * @param lengthGetter - A function that returns the length to compare
 * @param forTernaryMap - Whether to return LogicalThen for ternary operations
 * @returns A logical length methods object
 *
 * @remarks
 * - The `length` property provides all logical checks on the length value
 * - Returns NaN for values that don't have a length property
 * - Used by string and array signals for length-based logic
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
 * Creates logical methods for signalified values.
 *
 * This function creates a comprehensive logical methods object that supports:
 * - OR operations for providing alternative values
 * - Truthy/falsy checks via `is`
 * - Conditional value selection via `when`
 * - Length-based checks for strings and arrays
 * - Numeric comparisons for numbers
 *
 * @template T - The type of the signalified value
 * @param baseSignalifiedObject - The signalified value to add logical methods to
 * @returns A logical methods object
 *
 * @remarks
 * - `or` provides alternative values for nullable/undefined cases
 * - `is` returns derived signals for boolean checks
 * - `when` returns LogicalThen objects for conditional value selection
 * - Length methods are only available for strings and arrays
 * - Numeric comparison methods are only available for numbers
 *
 * @example
 * ```typescript
 * const count = signal(5);
 * const logical = getLogicalMethods(count);
 * logical.is.truthy; // DerivedSignal<boolean>
 * logical.is.greaterThan(3).truthy; // DerivedSignal<boolean>
 * logical.when.greaterThan(10).then("big", "small"); // DerivedSignal<string>
 * ```
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
