import { value } from "../../utils";
import { derive, MaybeSignal, type DerivedSignal } from "../signals";
import type {
  Comparison,
  ExistenceComparison,
  LengthComparison,
  ComparisonReturnType,
  GenericMethods,
  TernaryThen,
  MeasureComparison,
  Primitive,
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
 * - Returns a derived signal that updates when the condition or options change
 * - Used by the `when` logical methods for conditional value selection
 */
const getTernaryThen = (truthyEvaluator: () => boolean): TernaryThen => {
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
const getPrimitiveMethods = <
  T extends Primitive,
  R extends ComparisonReturnType,
>(
  valueGetter: () => T,
  forTernary: boolean,
): ExistenceComparison<T, R> => {
  const truthyEvaluator = () => !!valueGetter();
  const falsyEvaluator = () => !valueGetter();

  const truthyChecker = (forTernaryThen: boolean) => () =>
    forTernaryThen ? getTernaryThen(truthyEvaluator) : derive(truthyEvaluator);

  const falsyChecker = (forTernaryThen: boolean) => () =>
    forTernaryThen ? getTernaryThen(falsyEvaluator) : derive(falsyEvaluator);

  const equalToChecker =
    (forTernaryThen: boolean) => (compareValue: MaybeSignal<T>) => {
      const equalityEvaluator = () =>
        valueGetter() === (value(compareValue) as T);
      return forTernaryThen
        ? getTernaryThen(equalityEvaluator)
        : derive(equalityEvaluator);
    };

  const notEqualToChecker =
    (forTernaryThen: boolean) => (compareValue: MaybeSignal<T>) => {
      const notEqualityEvaluator = () =>
        valueGetter() !== (value(compareValue) as T);
      return forTernaryThen
        ? getTernaryThen(notEqualityEvaluator)
        : derive(notEqualityEvaluator);
    };

  return {
    truthy: truthyChecker(forTernary),
    falsy: falsyChecker(forTernary),
    equalTo: equalToChecker(forTernary),
    notEqualTo: notEqualToChecker(forTernary),
  } as ExistenceComparison<T, R>;
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
const getNumberOnlyMethods = <R extends ComparisonReturnType>(
  numberGetter: () => number,
  forTernary: boolean,
): MeasureComparison<R> => {
  const greaterThanChecker =
    (forTernaryThen: boolean) => (compareValue: MaybeSignal<number>) => {
      const greaterThanEvaluator = () =>
        numberGetter() > (value(compareValue) as number);
      return forTernaryThen
        ? getTernaryThen(greaterThanEvaluator)
        : derive(greaterThanEvaluator);
    };
  const greaterThanOrEqualToChecker =
    (forTernaryThen: boolean) => (compareValue: MaybeSignal<number>) => {
      const greaterThanOrEqualToEvaluator = () =>
        numberGetter() >= (value(compareValue) as number);
      return forTernaryThen
        ? getTernaryThen(greaterThanOrEqualToEvaluator)
        : derive(greaterThanOrEqualToEvaluator);
    };
  const smallerThanChecker =
    (forTernaryThen: boolean) => (compareValue: MaybeSignal<number>) => {
      const smallerThanEvaluator = () =>
        numberGetter() < (value(compareValue) as number);
      return forTernaryThen
        ? getTernaryThen(smallerThanEvaluator)
        : derive(smallerThanEvaluator);
    };
  const smallerThanOrEqualToChecker =
    (forTernaryThen: boolean) => (compareValue: MaybeSignal<number>) => {
      const smallerThanOrEqualToEvaluator = () =>
        numberGetter() <= (value(compareValue) as number);
      return forTernaryThen
        ? getTernaryThen(smallerThanOrEqualToEvaluator)
        : derive(smallerThanOrEqualToEvaluator);
    };

  return {
    greaterThan: greaterThanChecker(forTernary),
    greaterThanOrEqualTo: greaterThanOrEqualToChecker(forTernary),
    smallerThan: smallerThanChecker(forTernary),
    smallerThanOrEqualTo: smallerThanOrEqualToChecker(forTernary),
  } as MeasureComparison<R>;
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
  T extends Primitive,
  R extends ComparisonReturnType,
>(
  valueGetter: () => T,
  forTernary: boolean,
): Comparison<T, R> => {
  return {
    ...getPrimitiveMethods(valueGetter, forTernary),
    ...getNumberOnlyMethods(valueGetter as () => number, forTernary),
  };
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
const getLengthMethods = <R extends ComparisonReturnType>(
  lengthGetter: () => number,
  forTernary: boolean,
): LengthComparison<R> => {
  return {
    length: getComparisonMethods(lengthGetter, forTernary),
  };
};

/**
 * Creates logical methods for signals.
 *
 * This function creates a comprehensive logical methods object that supports:
 * - OR operations for providing alternative values
 * - Truthy/falsy checks via `is`
 * - Conditional value selection via `when`
 * - Length-based checks for strings and arrays
 * - Numeric comparisons for numbers
 *
 * @template T - The type of the signal
 * @param baseSignal - The signal to add logical methods to
 * @returns A logical methods object
 *
 * @remarks
 * - `or` provides alternative values for nullable/undefined cases
 * - `is` returns derived signals for boolean checks
 * - `when` returns TernaryThen objects for conditional value selection
 * - Length methods are only available for strings and arrays
 * - Numeric comparison methods are only available for numbers
 *
 * @example
 * ```typescript
 * const count = signal(5);
 * const logical = getGenericMethods(count);
 * logical.is.truthy; // DerivedSignal<boolean>
 * logical.is.greaterThan(3).truthy; // DerivedSignal<boolean>
 * logical.when.greaterThan(10).then("big", "small"); // DerivedSignal<string>
 * ```
 */
export const getGenericMethods = <T>(
  baseSignal: MaybeSignal<T>,
): GenericMethods<T> => {
  const valueGetter = () => value(baseSignal) as Primitive;
  const lenghtGetter = () => {
    const val = value(baseSignal);
    if (typeof val === "string" || Array.isArray(val)) return val.length;
    return NaN;
  };

  return {
    or: <A>(alternativeValue: MaybeSignal<A>) =>
      derive(() => {
        const altValue = value(alternativeValue);
        return value(baseSignal) || altValue;
      }),
    is: {
      ...getComparisonMethods(valueGetter, false),
      ...getLengthMethods(lenghtGetter, false),
    },
    when: {
      ...getComparisonMethods(valueGetter, true),
      ...getLengthMethods(lenghtGetter, false),
    },
  } as unknown as GenericMethods<T>;
};
