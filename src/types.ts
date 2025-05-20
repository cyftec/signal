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
 * Handy (derived-signal) properties and methods for most commonly used scenarios
 */
type EitherOrResolver = <Tr, Fl>(
  valueIfTruthy: MaybeSignalValue<Tr>,
  valueIfFalsy: MaybeSignalValue<Fl>
) => DerivedSignal<Tr | Fl>;

type ComparisonResultObject = {
  get truthy(): DerivedSignal<boolean>;
  get falsy(): DerivedSignal<boolean>;
  resolvesTo: EitherOrResolver;
};

export type NumberSignalTrap = {
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
  isLT: (compareValue: MaybeSignalValue<number>) => ComparisonResultObject;
  isGT: (compareValue: MaybeSignalValue<number>) => ComparisonResultObject;
  equals: (compareValue: MaybeSignalValue<number>) => ComparisonResultObject;
  notEquals: (compareValue: MaybeSignalValue<number>) => ComparisonResultObject;
  isLTE: (compareValue: MaybeSignalValue<number>) => ComparisonResultObject;
  isGTE: (compareValue: MaybeSignalValue<number>) => ComparisonResultObject;
};

export type StringAndArraySignalTrap = {
  get length(): DerivedSignal<number>;
  lengthLT: (compareValue: MaybeSignalValue<number>) => ComparisonResultObject;
  lengthGT: (compareValue: MaybeSignalValue<number>) => ComparisonResultObject;
  lengthE: (compareValue: MaybeSignalValue<number>) => ComparisonResultObject;
  lengthNE: (compareValue: MaybeSignalValue<number>) => ComparisonResultObject;
  lengthLTE: (compareValue: MaybeSignalValue<number>) => ComparisonResultObject;
  lengthGTE: (compareValue: MaybeSignalValue<number>) => ComparisonResultObject;
};

export type StringSignalTrap = StringAndArraySignalTrap & {
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
  get lowerCase(): DerivedSignal<string>;
  get upperCase(): DerivedSignal<string>;
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

export type ArraySignalTrap<T> = StringAndArraySignalTrap & {
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

export type RecordSignalTrap<T extends Record<string, unknown>> = {
  prop: <K extends keyof T>(key: K) => DerivedSignal<T[K]>;
  get props(): { [key in keyof T]: DerivedSignal<T[key]> };
  get keys(): DerivedSignal<string[]>;
};

export type SpecificTypeSignalTrap<T> = T extends string
  ? StringSignalTrap
  : T extends (infer I)[]
  ? ArraySignalTrap<I>
  : T extends number
  ? NumberSignalTrap
  : T extends Record<string, unknown>
  ? RecordSignalTrap<T>
  : {};

type AndComparisonFunction<T> = (
  subjectValue: MaybeSignalValue<number>,
  compareValue: MaybeSignalValue<number>
) => GenericSignalTrap<T | boolean>;

type OrComparisonFunction<T> = (
  subjectValue: MaybeSignalValue<number>,
  compareValue: MaybeSignalValue<number>
) => GenericSignalTrap<NonNullable<T> | boolean>;

export type GenericSignalTrap<T> = {
  orNonNullable: <OV>(
    orValue: MaybeSignalValue<OV>
  ) => GenericSignalTrap<NonNullable<T> | OV>;
  or: <OV>(
    orValue: MaybeSignalValue<OV>
  ) => GenericSignalTrap<NonNullable<T> | OV>;
  orNot: (
    orNotValue: MaybeSignalValue<any>
  ) => GenericSignalTrap<NonNullable<T> | boolean>;
  orLT: OrComparisonFunction<T>;
  orLTE: OrComparisonFunction<T>;
  orEquals: OrComparisonFunction<T>;
  orNotEquals: OrComparisonFunction<T>;
  orGT: OrComparisonFunction<T>;
  orGTE: OrComparisonFunction<T>;
  and: <AV>(andValue: MaybeSignalValue<AV>) => GenericSignalTrap<T | AV>;
  andNot: (
    andNotValue: MaybeSignalValue<any>
  ) => GenericSignalTrap<T | boolean>;
  andLT: AndComparisonFunction<T>;
  andLTE: AndComparisonFunction<T>;
  andEquals: AndComparisonFunction<T>;
  andNotEquals: AndComparisonFunction<T>;
  andGT: AndComparisonFunction<T>;
  andGTE: AndComparisonFunction<T>;
  resolvesTo: EitherOrResolver;
  get result(): DerivedSignal<T>;
  get stringified(): DerivedSignal<
    T extends null | undefined ? undefined : string
  >;
  get truthy(): DerivedSignal<boolean>;
  get falsy(): DerivedSignal<boolean>;
  get truthyFalsyPair(): DerivedSignal<readonly [boolean, boolean]>;
};

export type SignalTrap<T> = GenericSignalTrap<T> & SpecificTypeSignalTrap<T>;
