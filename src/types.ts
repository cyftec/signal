/**
 * It executes the subscriber functions when a new ```value``` is set.
 *
 * It can be used to derive a read-only version of the signal.
 * @see DerivedSignal
 */
export type SourceSignal<T> = {
  type: "source-signal";
  value: T;
};

/**
 * It is the read-only version of a source signal.
 *
 * A derived signal can be derived from both a source and/or an another
 * derived signal. The subscribers of a derived signal are triggered only when the value of a
 * root source signal (from where it is derived), changes.
 *
 * @see SourceSignal
 */
export type DerivedSignal<T> = {
  type: "derived-signal";
  get prevValue(): T | undefined;
  get value(): T;
};

/**
 * It is the object format, similar to Signal, of plain value of type T.
 *
 * Using MaybeSignal adds a level of ambiguity to the incoming variable. During
 * compile time TypeScript is smart enough to differentiate between type T
 * and Signal<T> for a given MaybeSignal<T>. But at runtime it becomes more cumbersome.
 *
 * @see Signal
 * @see MaybeSignal
 *
 */
export type NonSignal<T> = {
  type: "non-signal";
  get value(): T;
};

/** Either a source or a derived signal of type T*/
export type Signal<T> = SourceSignal<T> | DerivedSignal<T>;
/** Either a source signal or a plain value of type T*/
export type MaybeSourceSignal<T> = T | SourceSignal<T>;
/** Either a derived signal or a plain value of type T*/
export type MaybeDerivedSignal<T> = T | DerivedSignal<T>;
/** Either of a source signal, a derived signal or a plain value of type T*/
export type MaybeSignal<T> = T | Signal<T>;
/**
 * Object only form of MaybeSignal
 */
export type MaybeSignalObject<T> = NonSignal<T> | Signal<T>;
/**
 * MaybeSignal along with NonSignal object
 */
export type MaybeSignalValue<T> = NonSignal<T> | MaybeSignal<T>;
export type MaybeSignalValues<T extends any[]> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? T[K]
    : MaybeSignalValue<T[K]>;
};
export type PlainValues<T extends MaybeSignalValues<any[]>> = {
  [K in keyof T]: T[K] extends MaybeSignalValue<infer V> ? V : never;
};
export type SignalifiedFunction<F extends (...args: any[]) => any> = (
  ...args: MaybeSignalValues<Parameters<F>>
) => DerivedSignal<ReturnType<F>>;

/**
 * Signal Traps
 * A trap traps a singal or plain value of any type
 * and returns an object with most common tranforms of that
 * particular (JS data) type.
 *
 * For example, a number-trap will receive a plain or signal
 * value of number and returns an object with all the intance
 * getters or methods of a number type in javascript.
 * See below use cases for example.
 *
 */

export type GenericTrap<T> = {
  get string(): DerivedSignal<T extends null | undefined ? undefined : string>;
  or: <OV>(orValue: MaybeSignalValue<OV>) => DerivedSignal<NonNullable<T> | OV>;
};

export type NumberSignalTrap = GenericTrap<number> & {
  toConfined: (
    start: MaybeSignalValue<number>,
    end: MaybeSignalValue<number>
  ) => DerivedSignal<number>;
  toExponential: SignalifiedFunction<number["toExponential"]>;
  toLocaleString: (
    locales?: MaybeSignalValue<string | string[] | undefined>,
    options?: Intl.NumberFormatOptions
  ) => DerivedSignal<string>;
  toFixed: SignalifiedFunction<number["toFixed"]>;
  toPrecision: SignalifiedFunction<number["toPrecision"]>;
};

export type StringSignalTrap = GenericTrap<string> & {
  at: SignalifiedFunction<string["at"]>;
  charAt: SignalifiedFunction<string["charAt"]>;
  charCodeAt: SignalifiedFunction<string["charCodeAt"]>;
  codePointAt: SignalifiedFunction<string["codePointAt"]>;
  concat: SignalifiedFunction<string["concat"]>;
  endsWith: SignalifiedFunction<string["endsWith"]>;
  includes: SignalifiedFunction<string["includes"]>;
  indexOf: SignalifiedFunction<string["indexOf"]>;
  lastIndexOf: SignalifiedFunction<string["lastIndexOf"]>;
  padEnd: SignalifiedFunction<string["padEnd"]>;
  padStart: SignalifiedFunction<string["padStart"]>;
  repeat: SignalifiedFunction<string["repeat"]>;
  slice: SignalifiedFunction<string["slice"]>;
  startsWith: SignalifiedFunction<string["startsWith"]>;
  substring: SignalifiedFunction<string["substring"]>;
  trim: SignalifiedFunction<string["trim"]>;
  trimEnd: SignalifiedFunction<string["trimEnd"]>;
  trimStart: SignalifiedFunction<string["trimStart"]>;
  /**
   * Below methods are either overloaded ones or methods
   * which can be converted into getters.
   *
   * The overloaded methods cannot be converted using
   * generic type 'SignalifiedFunction<Patameters<...>>'
   * because Parameters<...> only returns the last overload
   * signature of the method. Hence they are redefined using
   * the most useful signature of that method.
   */
  get length(): DerivedSignal<number>;
  get lowercase(): DerivedSignal<string>;
  get Sentencecase(): DerivedSignal<string>;
  get TitleCase(): DerivedSignal<string>;
  get UPPERCASE(): DerivedSignal<string>;
  localeCompare: (
    that: MaybeSignalValue<string>,
    locales?: MaybeSignalValue<string | string[] | undefined>,
    options?: Intl.CollatorOptions
  ) => DerivedSignal<number>;
  normalize: (
    form: MaybeSignalValue<"NFC" | "NFD" | "NFKC" | "NFKD">
  ) => DerivedSignal<string>;
  replace: (
    searchValue: MaybeSignalValue<string> | RegExp,
    replaceValue: MaybeSignalValue<string>
  ) => DerivedSignal<string>;
  replaceAll: (
    searchValue: MaybeSignalValue<string> | RegExp,
    replaceValue: MaybeSignalValue<string>
  ) => DerivedSignal<string>;
  search: (regexp: RegExp) => DerivedSignal<number>;
  split: (
    separator: MaybeSignalValue<string> | RegExp,
    limit?: MaybeSignalValue<number | undefined>
  ) => DerivedSignal<string[]>;
  toLocaleLowerCase: (
    locales?: MaybeSignalValue<string | string[] | undefined>
  ) => DerivedSignal<string>;
  toLocaleUpperCase: (
    locales?: MaybeSignalValue<string | string[] | undefined>
  ) => DerivedSignal<string>;
};

export type ArraySignalTrap<T> = GenericTrap<T> & {
  at: SignalifiedFunction<Array<T>["at"]>;
  concat: (items: MaybeSignalValue<T[]>) => DerivedSignal<T[]>;
  copyWithin: SignalifiedFunction<Array<T>["copyWithin"]>;
  fill: SignalifiedFunction<Array<T>["fill"]>;
  includes: SignalifiedFunction<Array<T>["includes"]>;
  indexOf: SignalifiedFunction<Array<T>["indexOf"]>;
  join: SignalifiedFunction<Array<T>["join"]>;
  lastIndexOf: SignalifiedFunction<Array<T>["lastIndexOf"]>;
  slice: SignalifiedFunction<Array<T>["slice"]>;
  with: SignalifiedFunction<Array<T>["with"]>;
  /**
   * Below methods are either overloaded ones or methods
   * which can be converted into getters.
   *
   * The overloaded methods cannot be converted using
   * generic type 'SignalifiedFunction<Patameters<...>>'
   * because Parameters<...> only returns the last overload
   * signature of the method. Hence they are redefined using
   * the most useful signature of that method.
   *
   * NOTE: Some of the array instance methods which mutates
   * the array are completely ignored here. Because the incoming
   * signal is mostly a derived-signal which is immutable.
   */
  every: (
    itemSatifiesCondition: (item: T, index: number, array: T[]) => boolean
  ) => DerivedSignal<boolean>;
  filter: (
    where: (item: T, index: number, array: T[]) => boolean
  ) => DerivedSignal<T[]>;
  find: (
    where: (item: T, index: number, array: T[]) => boolean
  ) => DerivedSignal<T | undefined>;
  findIndex: (
    where: (item: T, index: number, array: T[]) => boolean
  ) => DerivedSignal<number>;
  findLast: (
    where: (item: T, index: number, array: T[]) => boolean
  ) => DerivedSignal<T | undefined>;
  findLastIndex: (
    where: (item: T, index: number, array: T[]) => boolean
  ) => DerivedSignal<number>;
  get lastItem(): DerivedSignal<T | undefined>;
  get length(): DerivedSignal<number>;
  map: <U>(
    mapFn: (item: T, index: number, array: T[]) => U
  ) => DerivedSignal<U[]>;
  partition: (
    where: (item: T, index: number, array: T[]) => boolean
  ) => readonly [DerivedSignal<T[]>, DerivedSignal<T[]>];
  reduce: <U>(
    reducerFn: (
      previousValue: U,
      currentValue: T,
      currentIndex: number,
      array: T[]
    ) => U,
    initialValue: U
  ) => DerivedSignal<U>;
  reduceRight: <U>(
    reducerFn: (
      previousValue: U,
      currentValue: T,
      currentIndex: number,
      array: T[]
    ) => U,
    initialValue: U
  ) => DerivedSignal<U>;
  get reversed(): DerivedSignal<T[]>;
  some: (
    itemSatifiesCondition: (item: T, index: number, array: T[]) => boolean
  ) => DerivedSignal<boolean>;
  toSorted: (
    compareFn?: ((a: T, b: T) => number) | undefined
  ) => DerivedSignal<T[]>;
  toSpliced: (
    start: MaybeSignalValue<number>,
    deleteCount: MaybeSignalValue<number>,
    ...items: T[]
  ) => DerivedSignal<T[]>;
};

export type RecordSignalTrap<T extends Record<string, unknown>> =
  GenericTrap<T> & {
    prop: <K extends keyof T>(key: K) => DerivedSignal<T[K]>;
    get props(): { [key in keyof T]: DerivedSignal<T[key]> };
    get keys(): DerivedSignal<string[]>;
  };

export type SignalTrap<T> = T extends number
  ? NumberSignalTrap
  : T extends string
  ? StringSignalTrap
  : T extends (infer I)[]
  ? ArraySignalTrap<I>
  : T extends Record<string, unknown>
  ? RecordSignalTrap<T>
  : GenericTrap<T>;

/**
 * Operation types
 * The purpose of operation is to compose multiple
 * logical (or otherwise) operations without creating
 * any signal. The result of multiple composed operations
 * is derived by calling any of the (getters or) methods
 * which yeilds a DerivedSignal of operation result.
 */

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
