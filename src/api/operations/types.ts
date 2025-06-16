/**
 * Operation types
 * The purpose of operation is to compose multiple
 * logical (or otherwise) operations without creating
 * any signal. The result of multiple composed operations
 * is derived by calling any of the (getters or) methods
 * which yeilds a DerivedSignal of operation result.
 */

import type { DerivedSignal, MaybeSignalValue } from "../../_core";

type LogicalOperation<T> = (
  checkValue: MaybeSignalValue<T>
) => GenericOperation;

type ComparisonOperation<T> = (
  compareValue: MaybeSignalValue<T>
) => GenericOperation;

type LogicWithComparisonOperation<T> = (
  subjectValue: MaybeSignalValue<T>,
  compareValue: MaybeSignalValue<T>
) => GenericOperation;

export type OperationResult = {
  get truthy(): DerivedSignal<boolean>;
  get falsy(): DerivedSignal<boolean>;
  get truthyFalsyPair(): DerivedSignal<readonly [boolean, boolean]>;
  ternary: <Tr, Fl>(
    valueIfTruthy: MaybeSignalValue<Tr>,
    valueIfFalsy: MaybeSignalValue<Fl>
  ) => DerivedSignal<Tr | Fl>;
};

export type GenericOperation = OperationResult & {
  or: LogicalOperation<any>;
  orNot: LogicalOperation<any>;
  and: LogicalOperation<any>;
  andNot: LogicalOperation<any>;
  equals: ComparisonOperation<any>;
  notEquals: ComparisonOperation<any>;
  orBothEqual: LogicWithComparisonOperation<any>;
  orBothUnequal: LogicWithComparisonOperation<any>;
  andBothEqual: LogicWithComparisonOperation<any>;
  andBothUnequal: LogicWithComparisonOperation<any>;
  orThisIsLT: LogicWithComparisonOperation<number>;
  orThisIsLTE: LogicWithComparisonOperation<number>;
  orThisIsGT: LogicWithComparisonOperation<number>;
  orThisIsGTE: LogicWithComparisonOperation<number>;
  andThisIsLT: LogicWithComparisonOperation<number>;
  andThisIsLTE: LogicWithComparisonOperation<number>;
  andThisIsGT: LogicWithComparisonOperation<number>;
  andThisIsGTE: LogicWithComparisonOperation<number>;
};

type ConfinementCheckOperation = (
  lowerValue: MaybeSignalValue<number>,
  upperValue: MaybeSignalValue<number>,
  touchingLower?: boolean,
  touchingUpper?: boolean
) => GenericOperation;

type MathOperation = (num: MaybeSignalValue<number>) => NumberOperation;
export type NumberOperation = GenericOperation & {
  get result(): DerivedSignal<number>;
  add: MathOperation;
  sub: MathOperation;
  mul: MathOperation;
  div: MathOperation;
  mod: MathOperation;
  pow: MathOperation;
  isBetween: ConfinementCheckOperation;
  isLT: ComparisonOperation<number>;
  isLTE: ComparisonOperation<number>;
  isGT: ComparisonOperation<number>;
  isGTE: ComparisonOperation<number>;
};

export type StringAndArrayOperation = GenericOperation & {
  lengthBetween: ConfinementCheckOperation;
  lengthEquals: ComparisonOperation<number>;
  lengthNotEquals: ComparisonOperation<number>;
  lengthLT: ComparisonOperation<number>;
  lengthLTE: ComparisonOperation<number>;
  lengthGT: ComparisonOperation<number>;
  lengthGTE: ComparisonOperation<number>;
};

export type Operation<T> = T extends number
  ? NumberOperation
  : T extends string | unknown[]
  ? StringAndArrayOperation
  : GenericOperation;
