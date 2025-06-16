import type {
  DerivedSignal,
  MaybeSignalValue,
  MaybeSignalValues,
} from "../../_core";

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
