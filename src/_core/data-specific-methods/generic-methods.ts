import { value, valueIsLiveSignal } from "../../utils";
import {
  deadSignal,
  derive,
  MaybeSignal,
} from "../signals";
import type {
  Comparison,
  ComparisonReturnType,
  DeriverReturnType,
  ExistenceComparison,
  GenericMethodReturnType,
  GenericMethods,
  InputSignalType,
  LengthComparison,
  MeasureComparison,
  Primitive,
  TernaryThen,
} from "./types";

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
 * - Live bases return a reactive derived signal
 * - Dead bases return a dead-signal snapshot
 * - Used by the `if` logical methods for conditional value selection
 */
const getTernaryThen = <InputSignal extends InputSignalType>(
  inputIsLiveSignal: boolean,
  truthyEvaluator: () => boolean,
): TernaryThen<InputSignal> => {
  return {
    then: <U, V>(
      truthyOption: MaybeSignal<U>,
      falsyOption: MaybeSignal<V>,
    ): DeriverReturnType<InputSignal, U | V> => {
      const deriver = () => {
        const truthyValue = value(truthyOption) as U;
        const falsyValue = value(falsyOption) as V;
        return truthyEvaluator() ? truthyValue : falsyValue;
      };

      return (
        inputIsLiveSignal ? derive(deriver) : deadSignal(deriver())
      ) as DeriverReturnType<InputSignal, U | V>;
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
 * @template R - The return type (DerivedSignal or TernaryThen)
 * @param valueGetter - A function that returns the value to check
 * @param forTernary - Whether to return TernaryThen for ternary operations
 * @returns A logical primitive methods object
 *
 * @remarks
 * - `truthy` returns true if the value is truthy
 * - `falsy` returns true if the value is falsy
 * - `equalTo` returns true if the value equals the comparison value
 * - `notEqualTo` returns true if the value does not equal the comparison value
 * - When forTernary is true, methods return TernaryThen for conditional selection
 */
const getExistenceComparisonMethods = <
  InputSignal extends InputSignalType,
  GenericMethodReturn extends GenericMethodReturnType,
  T extends Primitive,
  R extends ComparisonReturnType<InputSignal, GenericMethodReturn>,
>(
  inputIsLiveSignal: boolean,
  valueGetter: () => T,
  forTernary: boolean,
): ExistenceComparison<InputSignal, GenericMethodReturn, T, R> => {
  const truthyEvaluator = () => !!valueGetter();
  const falsyEvaluator = () => !valueGetter();

  const truthyChecker = (forTernaryThen: boolean) => () =>
    forTernaryThen
      ? getTernaryThen(inputIsLiveSignal, truthyEvaluator)
      : inputIsLiveSignal
        ? derive(truthyEvaluator)
        : deadSignal(truthyEvaluator());

  const falsyChecker = (forTernaryThen: boolean) => () =>
    forTernaryThen
      ? getTernaryThen(inputIsLiveSignal, falsyEvaluator)
      : inputIsLiveSignal
        ? derive(falsyEvaluator)
        : deadSignal(falsyEvaluator());

  const equalToChecker =
    (forTernaryThen: boolean) => (compareValue: MaybeSignal<T>) => {
      const equalityEvaluator = () =>
        valueGetter() === (value(compareValue) as T);
      return forTernaryThen
        ? getTernaryThen(inputIsLiveSignal, equalityEvaluator)
        : inputIsLiveSignal
          ? derive(equalityEvaluator)
          : deadSignal(equalityEvaluator());
    };

  const notEqualToChecker =
    (forTernaryThen: boolean) => (compareValue: MaybeSignal<T>) => {
      const notEqualityEvaluator = () =>
        valueGetter() !== (value(compareValue) as T);
      return forTernaryThen
        ? getTernaryThen(inputIsLiveSignal, notEqualityEvaluator)
        : inputIsLiveSignal
          ? derive(notEqualityEvaluator)
          : deadSignal(notEqualityEvaluator());
    };

  return {
    truthy: truthyChecker(forTernary),
    falsy: falsyChecker(forTernary),
    equalTo: equalToChecker(forTernary),
    notEqualTo: notEqualToChecker(forTernary),
  } as ExistenceComparison<InputSignal, GenericMethodReturn, T, R>;
};

/**
 * Creates a logical number methods object for numeric comparisons.
 *
 * This function creates methods for comparing numeric values using
 * greater-than and less-than operators.
 *
 * @template R - The return type (DerivedSignal or TernaryThen)
 * @param numberGetter - A function that returns the number to compare
 * @param forTernary - Whether to return TernaryThen for ternary operations
 * @returns A logical number methods object
 *
 * @remarks
 * - `greaterThan` returns true if the value is greater than the comparison value
 * - `greaterThanOrEqualTo` returns true if the value is greater than or equal
 * - `smallerThan` returns true if the value is less than the comparison value
 * - `smallerThanOrEqualTo` returns true if the value is less than or equal
 * - When forTernary is true, methods return TernaryThen for conditional selection
 */
const getMeasureComparisonMethods = <
  InputSignal extends InputSignalType,
  GenericMethodReturn extends GenericMethodReturnType,
  R extends ComparisonReturnType<InputSignal, GenericMethodReturn>,
>(
  inputIsLiveSignal: boolean,
  numberGetter: () => number,
  forTernary: boolean,
): MeasureComparison<InputSignal, GenericMethodReturn, R> => {
  const greaterThanChecker =
    (forTernaryThen: boolean) => (compareValue: MaybeSignal<number>) => {
      const greaterThanEvaluator = () =>
        numberGetter() > (value(compareValue) as number);
      return forTernaryThen
        ? getTernaryThen(inputIsLiveSignal, greaterThanEvaluator)
        : inputIsLiveSignal
          ? derive(greaterThanEvaluator)
          : deadSignal(greaterThanEvaluator());
    };
  const greaterThanOrEqualToChecker =
    (forTernaryThen: boolean) => (compareValue: MaybeSignal<number>) => {
      const greaterThanOrEqualToEvaluator = () =>
        numberGetter() >= (value(compareValue) as number);
      return forTernaryThen
        ? getTernaryThen(inputIsLiveSignal, greaterThanOrEqualToEvaluator)
        : inputIsLiveSignal
          ? derive(greaterThanOrEqualToEvaluator)
          : deadSignal(greaterThanOrEqualToEvaluator());
    };
  const smallerThanChecker =
    (forTernaryThen: boolean) => (compareValue: MaybeSignal<number>) => {
      const smallerThanEvaluator = () =>
        numberGetter() < (value(compareValue) as number);
      return forTernaryThen
        ? getTernaryThen(inputIsLiveSignal, smallerThanEvaluator)
        : inputIsLiveSignal
          ? derive(smallerThanEvaluator)
          : deadSignal(smallerThanEvaluator());
    };
  const smallerThanOrEqualToChecker =
    (forTernaryThen: boolean) => (compareValue: MaybeSignal<number>) => {
      const smallerThanOrEqualToEvaluator = () =>
        numberGetter() <= (value(compareValue) as number);
      return forTernaryThen
        ? getTernaryThen(inputIsLiveSignal, smallerThanOrEqualToEvaluator)
        : inputIsLiveSignal
          ? derive(smallerThanOrEqualToEvaluator)
          : deadSignal(smallerThanOrEqualToEvaluator());
    };

  return {
    greaterThan: greaterThanChecker(forTernary),
    greaterThanOrEqualTo: greaterThanOrEqualToChecker(forTernary),
    smallerThan: smallerThanChecker(forTernary),
    smallerThanOrEqualTo: smallerThanOrEqualToChecker(forTernary),
  } as MeasureComparison<InputSignal, GenericMethodReturn, R>;
};

/**
 * Combines primitive and number logical methods into a single checker.
 *
 * @template T - The type of value to check
 * @template R - The return type (DerivedSignal or TernaryThen)
 * @param valueGetter - A function that returns the value to check
 * @param forTernary - Whether to return TernaryThen for ternary operations
 * @returns A combined logical checker object
 */
const getComparisonMethods = <
  InputSignal extends InputSignalType,
  GenericMethodReturn extends GenericMethodReturnType,
  T extends Primitive,
>(
  inputIsLiveSignal: boolean,
  valueGetter: () => T,
  forTernary: boolean,
): Comparison<InputSignal, GenericMethodReturn, T> => {
  return {
    ...getExistenceComparisonMethods(
      inputIsLiveSignal,
      valueGetter,
      forTernary,
    ),
    ...getMeasureComparisonMethods(
      inputIsLiveSignal,
      valueGetter as () => number,
      forTernary,
    ),
  } as unknown as Comparison<InputSignal, GenericMethodReturn, T>;
};

/**
 * Creates a logical length methods object for length-based comparisons.
 *
 * This function creates methods for comparing the length of strings and arrays.
 *
 * @template R - The return type (DerivedSignal or TernaryThen)
 * @param lengthGetter - A function that returns the length to compare
 * @param forTernary - Whether to return TernaryThen for ternary operations
 * @returns A logical length methods object
 *
 * @remarks
 * - The `length` property provides all logical checks on the length value
 * - Returns NaN for values that don't have a length property
 * - Used by string and array signals for length-based logic
 */
const getLengthMethods = <
  InputSignal extends InputSignalType,
  GenericMethodReturn extends GenericMethodReturnType,
>(
  inputIsLiveSignal: boolean,
  lengthGetter: () => number,
  forTernary: boolean,
): LengthComparison<InputSignal, GenericMethodReturn> => {
  return {
    length: getComparisonMethods(inputIsLiveSignal, lengthGetter, forTernary),
  };
};

/**
 * Creates logical methods for signals.
 *
 * This function creates a comprehensive logical methods object that supports:
 * - OR operations for providing alternative values
 * - Truthy/falsy checks via `is`
 * - Conditional value selection via `if`
 * - Length-based checks for strings and arrays
 * - Numeric comparisons for numbers
 *
 * @template T - The type of the signal
 * @param baseSignal - The signal to add logical methods to
 * @returns A logical methods object
 *
 * @remarks
 * - `or` provides alternative values for nullable/undefined cases
 * - `is` returns signals matching the base kind for boolean checks
 * - `if` returns TernaryThen objects for conditional value selection
 * - Length methods are only available for strings and arrays
 * - Numeric comparison methods are only available for numbers
 *
 * @example
 * ```typescript
 * const count = signal(5);
 * const logical = getGenericMethods(count);
 * logical.is.truthy; // DerivedSignal<boolean>
 * logical.is.greaterThan(3).truthy; // DerivedSignal<boolean>
 * logical.if.greaterThan(10).then("big", "small"); // DerivedSignal<string>
 * ```
 */
export const getGenericMethods = <InputSignal extends InputSignalType, T>(
  // generic methods are valid even for null or undefined
  baseSignal: MaybeSignal<T>,
): GenericMethods<InputSignal, T> => {
  const isLiveSignal = valueIsLiveSignal(baseSignal);
  const valueGetter = () => value(baseSignal) as Primitive;
  const lengthGetter = () => {
    const val = value(baseSignal);
    if (typeof val === "string" || Array.isArray(val)) return val.length;
    return NaN;
  };

  return {
    or: <A>(
      alternativeValue: MaybeSignal<A>,
    ): DeriverReturnType<
      InputSignal,
      NonNullable<Extract<T, Primitive>> | A
    > => {
      const deriver = () => {
        const altValue = value(alternativeValue);
        return value(baseSignal) || altValue;
      };

      return (
        isLiveSignal ? derive(deriver) : deadSignal(deriver())
      ) as DeriverReturnType<
        InputSignal,
        NonNullable<Extract<T, Primitive>> | A
      >;
    },
    is: {
      ...getComparisonMethods(isLiveSignal, valueGetter, false),
      ...getLengthMethods(isLiveSignal, lengthGetter, false),
    },
    if: {
      ...getComparisonMethods(isLiveSignal, valueGetter, true),
      ...getLengthMethods(isLiveSignal, lengthGetter, true),
    },
  } as unknown as GenericMethods<InputSignal, T>;
};
