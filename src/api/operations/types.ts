/**
 * Operation types.
 *
 * Operation objects compose multiple logical or mathematical transforms without
 * creating intermediate signals.
 */

import type { DerivedSignal, MaybeSignal } from "../../_core";

/** Type for logical operations that return a `GenericOperation` for chaining. */
type LogicalOperation<T> = (checkValue: MaybeSignal<T>) => GenericOperation;

/** Type for comparison operations that return a `GenericOperation` for chaining. */
type ComparisonOperation<T> = (
  compareValue: MaybeSignal<T>,
) => GenericOperation;

/** Type for operations combining logic with comparisons on two values. */
type LogicWithComparisonOperation<T> = (
  subjectValue: MaybeSignal<T>,
  compareValue: MaybeSignal<T>,
) => GenericOperation;

/**
 * Base operation result getters.
 *
 * These getters provide the final derived signal results of composed operations.
 */
export type OperationResult = {
  /** Derived signal of whether the value is truthy */
  get truthy(): DerivedSignal<boolean>;
  /** Derived signal of whether the value is falsy */
  get falsy(): DerivedSignal<boolean>;
  /** Derived signal of the `[isTruthy, isFalsy]` pair. */
  get truthyFalsyPair(): DerivedSignal<readonly [boolean, boolean]>;
  /** Returns `valueIfTruthy` if truthy, otherwise `valueIfFalsy`. */
  ternary: <Tr, Fl>(
    valueIfTruthy: MaybeSignal<Tr>,
    valueIfFalsy: MaybeSignal<Fl>,
  ) => DerivedSignal<Tr | Fl>;
};

/**
 * Generic operation with logical operations available for all types.
 */
export type GenericOperation = OperationResult & {
  /** Chains an OR operation */
  or: LogicalOperation<any>;
  /** Chains an OR-NOT operation */
  orNot: LogicalOperation<any>;
  /** Chains an AND operation */
  and: LogicalOperation<any>;
  /** Chains an AND-NOT operation */
  andNot: LogicalOperation<any>;
  /** Chains an equality comparison */
  equals: ComparisonOperation<any>;
  /** Chains an inequality comparison */
  notEquals: ComparisonOperation<any>;
  /** Chains an OR operation with an equality check on two other values */
  orBothEqual: LogicWithComparisonOperation<any>;
  /** Chains an OR operation with an inequality check on two other values */
  orBothUnequal: LogicWithComparisonOperation<any>;
  /** Chains an AND operation with an equality check on two other values */
  andBothEqual: LogicWithComparisonOperation<any>;
  /** Chains an AND operation with an inequality check on two other values */
  andBothUnequal: LogicWithComparisonOperation<any>;
  /** Chains an OR operation with a less-than comparison on two other values */
  orThisIsLT: LogicWithComparisonOperation<number>;
  /** Chains an OR operation with a less-than-or-equal comparison on two other values */
  orThisIsLTE: LogicWithComparisonOperation<number>;
  /** Chains an OR operation with a greater-than comparison on two other values */
  orThisIsGT: LogicWithComparisonOperation<number>;
  /** Chains an OR operation with a greater-than-or-equal comparison on two other values */
  orThisIsGTE: LogicWithComparisonOperation<number>;
  /** Chains an AND operation with a less-than comparison on two other values */
  andThisIsLT: LogicWithComparisonOperation<number>;
  /** Chains an AND operation with a less-than-or-equal comparison on two other values */
  andThisIsLTE: LogicWithComparisonOperation<number>;
  /** Chains an AND operation with a greater-than comparison on two other values */
  andThisIsGT: LogicWithComparisonOperation<number>;
  /** Chains an AND operation with a greater-than-or-equal comparison on two other values */
  andThisIsGTE: LogicWithComparisonOperation<number>;
};

/** Type for confinement/range check operations. */
type ConfinementCheckOperation = (
  lowerValue: MaybeSignal<number>,
  upperValue: MaybeSignal<number>,
  touchingLower?: boolean,
  touchingUpper?: boolean,
) => GenericOperation;

/** Type for math operations that return `NumberOperation` for chaining. */
type MathOperation = (num: MaybeSignal<number>) => NumberOperation;

/**
 * Number operation with math operations and comparisons.
 *
 * Extends `GenericOperation` with number-specific operations.
 */
export type NumberOperation = GenericOperation & {
  /** The numeric value as a derived signal. */
  get result(): DerivedSignal<number>;
  /** Chains an addition operation */
  add: MathOperation;
  /** Chains a subtraction operation */
  sub: MathOperation;
  /** Chains a multiplication operation */
  mul: MathOperation;
  /** Chains a division operation */
  div: MathOperation;
  /** Chains a modulo operation */
  mod: MathOperation;
  /** Chains an exponentiation operation */
  pow: MathOperation;
  /** Checks if the value is between lower and upper (inclusive by default) */
  isBetween: ConfinementCheckOperation;
  /** Chains a less-than comparison */
  isLT: ComparisonOperation<number>;
  /** Chains a less-than-or-equal comparison */
  isLTE: ComparisonOperation<number>;
  /** Chains a greater-than comparison */
  isGT: ComparisonOperation<number>;
  /** Chains a greater-than-or-equal comparison */
  isGTE: ComparisonOperation<number>;
};

/**
 * String and array operation with length-based operations.
 *
 * Extends `GenericOperation` with length-specific operations for strings and arrays.
 */
export type StringAndArrayOperation = GenericOperation & {
  /** Checks whether the length is between lower and upper values. */
  lengthBetween: ConfinementCheckOperation;
  /** Chains a length equality comparison. */
  lengthEquals: ComparisonOperation<number>;
  /** Chains a length inequality comparison. */
  lengthNotEquals: ComparisonOperation<number>;
  /** Chains a length less-than comparison. */
  lengthLT: ComparisonOperation<number>;
  /** Chains a length less-than-or-equal comparison. */
  lengthLTE: ComparisonOperation<number>;
  /** Chains a length greater-than comparison. */
  lengthGT: ComparisonOperation<number>;
  /** Chains a length greater-than-or-equal comparison. */
  lengthGTE: ComparisonOperation<number>;
};

/**
 * Union type for all operation types, determined by the value type.
 *
 * @template T - The type of value the operation works with
 *
 * @remarks
 * - Number values map to `NumberOperation`
 * - String or array values map to `StringAndArrayOperation`
 * - Other types map to `GenericOperation`
 */
export type Operation<T> = T extends number
  ? NumberOperation
  : T extends string | unknown[]
    ? StringAndArrayOperation
    : GenericOperation;
