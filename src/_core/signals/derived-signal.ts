import { isPlainObject } from "@cyftec/immut";
import { antenna } from "../antenna";
import { BaseSignal } from "./base-signal";
import { Primitive, SignalType } from "./types";

type SignalInput<T> = T | BaseSignal<T>;
type Present<T> = NonNullable<T>;
type ArrayItem<T> = Present<T> extends readonly (infer Item)[] ? Item : never;
type SignalPredicate<T> = (item: T, index: number, array: T[]) => unknown;

type ThenMethods = {
  then: <Truthy, Falsy>(
    truthyOption: SignalInput<Truthy>,
    falsyOption: SignalInput<Falsy>,
  ) => DerivedSignal<Truthy | Falsy>;
};

type LogicalChecks<ReturnThen extends boolean> = {
  readonly isTruthy: ReturnThen extends true
    ? ThenMethods
    : DerivedSignal<boolean>;
  readonly isFalsy: ReturnThen extends true
    ? ThenMethods
    : DerivedSignal<boolean>;
  isEqualTo: (
    compareValue: SignalInput<Primitive>,
  ) => ReturnThen extends true ? ThenMethods : DerivedSignal<boolean>;
  isNotEqualTo: (
    compareValue: SignalInput<Primitive>,
  ) => ReturnThen extends true ? ThenMethods : DerivedSignal<boolean>;
  isGreaterThan: (
    compareValue: SignalInput<number>,
  ) => ReturnThen extends true ? ThenMethods : DerivedSignal<boolean>;
  isGreaterThanOrEqualTo: (
    compareValue: SignalInput<number>,
  ) => ReturnThen extends true ? ThenMethods : DerivedSignal<boolean>;
  isSmallerThan: (
    compareValue: SignalInput<number>,
  ) => ReturnThen extends true ? ThenMethods : DerivedSignal<boolean>;
  isSmallerThanOrEqualTo: (
    compareValue: SignalInput<number>,
  ) => ReturnThen extends true ? ThenMethods : DerivedSignal<boolean>;
};

type PublicLogicalChecks<ReturnThen extends boolean> = {
  truthy: () => ReturnThen extends true ? ThenMethods : DerivedSignal<boolean>;
  falsy: () => ReturnThen extends true ? ThenMethods : DerivedSignal<boolean>;
  equalTo: (
    compareValue: SignalInput<Primitive>,
  ) => ReturnThen extends true ? ThenMethods : DerivedSignal<boolean>;
  notEqualTo: (
    compareValue: SignalInput<Primitive>,
  ) => ReturnThen extends true ? ThenMethods : DerivedSignal<boolean>;
  greaterThan: (
    compareValue: SignalInput<number>,
  ) => ReturnThen extends true ? ThenMethods : DerivedSignal<boolean>;
  greaterThanOrEqualTo: (
    compareValue: SignalInput<number>,
  ) => ReturnThen extends true ? ThenMethods : DerivedSignal<boolean>;
  smallerThan: (
    compareValue: SignalInput<number>,
  ) => ReturnThen extends true ? ThenMethods : DerivedSignal<boolean>;
  smallerThanOrEqualTo: (
    compareValue: SignalInput<number>,
  ) => ReturnThen extends true ? ThenMethods : DerivedSignal<boolean>;
};

type WithLengthChecks<T, ReturnThen extends boolean> =
  Present<T> extends string | readonly unknown[]
    ? { length: PublicLogicalChecks<ReturnThen> }
    : {};

type PublicLogicalMethods<
  T,
  ReturnThen extends boolean,
> = PublicLogicalChecks<ReturnThen> & WithLengthChecks<T, ReturnThen>;

type StringDerivedMethods<T> =
  Present<T> extends string
    ? {
        at: (
          ...args: Parameters<string["at"]>
        ) => DerivedSignal<string | undefined>;
        charAt: (
          ...args: Parameters<string["charAt"]>
        ) => DerivedSignal<string>;
        charCodeAt: (
          ...args: Parameters<string["charCodeAt"]>
        ) => DerivedSignal<number>;
        codePointAt: (
          ...args: Parameters<string["codePointAt"]>
        ) => DerivedSignal<number | undefined>;
        concat: (
          ...args: Parameters<string["concat"]>
        ) => DerivedSignal<string>;
        endsWith: (
          ...args: Parameters<string["endsWith"]>
        ) => DerivedSignal<boolean>;
        includes: (
          ...args: Parameters<string["includes"]>
        ) => DerivedSignal<boolean>;
        indexOf: (
          ...args: Parameters<string["indexOf"]>
        ) => DerivedSignal<number>;
        lastIndexOf: (
          ...args: Parameters<string["lastIndexOf"]>
        ) => DerivedSignal<number>;
        length: () => DerivedSignal<number>;
        localeCompare: (
          ...args: Parameters<string["localeCompare"]>
        ) => DerivedSignal<number>;
        normalize: (
          ...args: Parameters<string["normalize"]>
        ) => DerivedSignal<string>;
        padEnd: (
          ...args: Parameters<string["padEnd"]>
        ) => DerivedSignal<string>;
        padStart: (
          ...args: Parameters<string["padStart"]>
        ) => DerivedSignal<string>;
        repeat: (
          ...args: Parameters<string["repeat"]>
        ) => DerivedSignal<string>;
        replace: (
          ...args: Parameters<string["replace"]>
        ) => DerivedSignal<string>;
        replaceAll: (
          ...args: Parameters<string["replaceAll"]>
        ) => DerivedSignal<string>;
        search: (
          ...args: Parameters<string["search"]>
        ) => DerivedSignal<number>;
        slice: (...args: Parameters<string["slice"]>) => DerivedSignal<string>;
        split: (
          ...args: Parameters<string["split"]>
        ) => DerivedSignal<string[]>;
        startsWith: (
          ...args: Parameters<string["startsWith"]>
        ) => DerivedSignal<boolean>;
        substring: (
          ...args: Parameters<string["substring"]>
        ) => DerivedSignal<string>;
        toLocaleLowerCase: (
          ...args: Parameters<string["toLocaleLowerCase"]>
        ) => DerivedSignal<string>;
        toLocaleUpperCase: (
          ...args: Parameters<string["toLocaleUpperCase"]>
        ) => DerivedSignal<string>;
        trim: (...args: Parameters<string["trim"]>) => DerivedSignal<string>;
        trimEnd: (
          ...args: Parameters<string["trimEnd"]>
        ) => DerivedSignal<string>;
        trimStart: (
          ...args: Parameters<string["trimStart"]>
        ) => DerivedSignal<string>;
        deepTrim: () => DerivedSignal<string>;
        lowercase: () => DerivedSignal<string>;
        Sentencecase: () => DerivedSignal<string>;
        TitleCase: () => DerivedSignal<string>;
        toLowerCase: () => DerivedSignal<string>;
        UPPERCASE: () => DerivedSignal<string>;
        toUpperCase: () => DerivedSignal<string>;
      }
    : {};

type NumberDerivedMethods<T> =
  Present<T> extends number
    ? {
        toExponential: (
          ...args: Parameters<number["toExponential"]>
        ) => DerivedSignal<string>;
        toFixed: (
          ...args: Parameters<number["toFixed"]>
        ) => DerivedSignal<string>;
        toLocaleString: (
          ...args: Parameters<number["toLocaleString"]>
        ) => DerivedSignal<string>;
        toPrecision: (
          ...args: Parameters<number["toPrecision"]>
        ) => DerivedSignal<string>;
        toConfined: (
          start: SignalInput<number>,
          end: SignalInput<number>,
        ) => DerivedSignal<number>;
      }
    : {};

type ArrayDerivedMethods<T> =
  Present<T> extends readonly unknown[]
    ? {
        at: (index: number) => DerivedSignal<ArrayItem<T> | undefined>;
        concat: (
          ...items: ConcatArray<ArrayItem<T>>[]
        ) => DerivedSignal<ArrayItem<T>[]>;
        every: (
          predicate: SignalPredicate<ArrayItem<T>>,
          thisArg?: any,
        ) => DerivedSignal<boolean>;
        filter: (
          predicate: SignalPredicate<ArrayItem<T>>,
          thisArg?: any,
        ) => DerivedSignal<ArrayItem<T>[]>;
        find: (
          predicate: SignalPredicate<ArrayItem<T>>,
          thisArg?: any,
        ) => DerivedSignal<ArrayItem<T> | undefined>;
        findIndex: (
          predicate: SignalPredicate<ArrayItem<T>>,
          thisArg?: any,
        ) => DerivedSignal<number>;
        findLast: (
          predicate: SignalPredicate<ArrayItem<T>>,
          thisArg?: any,
        ) => DerivedSignal<ArrayItem<T> | undefined>;
        findLastIndex: (
          predicate: SignalPredicate<ArrayItem<T>>,
          thisArg?: any,
        ) => DerivedSignal<number>;
        length: () => DerivedSignal<number>;
        map: <Mapped>(
          callbackfn: (
            value: ArrayItem<T>,
            index: number,
            array: ArrayItem<T>[],
          ) => Mapped,
          thisArg?: any,
        ) => DerivedSignal<Mapped[]>;
        reduce: <Reduced>(
          callbackfn: (
            previousValue: Reduced,
            currentValue: ArrayItem<T>,
            currentIndex: number,
            array: ArrayItem<T>[],
          ) => Reduced,
          initialValue: Reduced,
        ) => DerivedSignal<Reduced>;
        reduceRight: <Reduced>(
          callbackfn: (
            previousValue: Reduced,
            currentValue: ArrayItem<T>,
            currentIndex: number,
            array: ArrayItem<T>[],
          ) => Reduced,
          initialValue: Reduced,
        ) => DerivedSignal<Reduced>;
        some: (
          predicate: SignalPredicate<ArrayItem<T>>,
          thisArg?: any,
        ) => DerivedSignal<boolean>;
        toReversed: () => DerivedSignal<ArrayItem<T>[]>;
        toSorted: (
          compareFn?: (a: ArrayItem<T>, b: ArrayItem<T>) => number,
        ) => DerivedSignal<ArrayItem<T>[]>;
        toSpliced: (
          start: number,
          deleteCount?: number,
          ...items: ArrayItem<T>[]
        ) => DerivedSignal<ArrayItem<T>[]>;
        lastItem: () => DerivedSignal<ArrayItem<T> | undefined>;
        partition: (
          predicate: SignalPredicate<ArrayItem<T>>,
        ) => [DerivedSignal<ArrayItem<T>[]>, DerivedSignal<ArrayItem<T>[]>];
      }
    : {};

type ObjectDerivedMethods<T> =
  Present<T> extends object
    ? Present<T> extends readonly unknown[]
      ? {}
      : {
          keys: () => DerivedSignal<string[]>;
          get: <K extends keyof Present<T>>(
            key: K,
          ) => DerivedSignal<Present<T>[K]>;
          props: () => {
            [K in keyof Present<T>]: DerivedSignal<Present<T>[K]>;
          };
        }
    : {};

type DerivedSignalMethods<T> = StringDerivedMethods<T> &
  NumberDerivedMethods<T> &
  ArrayDerivedMethods<T> &
  ObjectDerivedMethods<T>;

type SignalMethod<
  T,
  K extends PropertyKey,
> = K extends keyof DerivedSignalMethods<T>
  ? DerivedSignalMethods<T>[K]
  : never;

export class DerivedSignal<T> extends BaseSignal<T> {
  readonly type: SignalType = "derived-signal";
  declare or: Present<T> extends readonly unknown[]
    ? never
    : <U>(alternativeValue: SignalInput<U>) => DerivedSignal<Present<T> | U>;
  declare isTruthy: Present<T> extends object
    ? never
    : LogicalChecks<false>["isTruthy"];
  declare isFalsy: Present<T> extends object
    ? never
    : LogicalChecks<false>["isFalsy"];
  declare isEqualTo: Present<T> extends object
    ? never
    : LogicalChecks<false>["isEqualTo"];
  declare isNotEqualTo: Present<T> extends object
    ? never
    : LogicalChecks<false>["isNotEqualTo"];
  declare isGreaterThan: Present<T> extends object
    ? never
    : LogicalChecks<false>["isGreaterThan"];
  declare isGreaterThanOrEqualTo: Present<T> extends object
    ? never
    : LogicalChecks<false>["isGreaterThanOrEqualTo"];
  declare isSmallerThan: Present<T> extends object
    ? never
    : LogicalChecks<false>["isSmallerThan"];
  declare isSmallerThanOrEqualTo: Present<T> extends object
    ? never
    : LogicalChecks<false>["isSmallerThanOrEqualTo"];
  declare when: Present<T> extends object
    ? never
    : LogicalChecks<true> &
        (Present<T> extends string | readonly unknown[]
          ? { length: LogicalChecks<true> }
          : {});
  declare is: PublicLogicalMethods<T, false>;
  declare at: SignalMethod<T, "at">;
  declare charAt: SignalMethod<T, "charAt">;
  declare charCodeAt: SignalMethod<T, "charCodeAt">;
  declare codePointAt: SignalMethod<T, "codePointAt">;
  declare concat: SignalMethod<T, "concat">;
  declare endsWith: SignalMethod<T, "endsWith">;
  declare every: SignalMethod<T, "every">;
  declare filter: SignalMethod<T, "filter">;
  declare find: SignalMethod<T, "find">;
  declare findIndex: SignalMethod<T, "findIndex">;
  declare findLast: SignalMethod<T, "findLast">;
  declare findLastIndex: SignalMethod<T, "findLastIndex">;
  declare get: SignalMethod<T, "get">;
  declare includes: SignalMethod<T, "includes">;
  declare indexOf: SignalMethod<T, "indexOf">;
  declare keys: SignalMethod<T, "keys">;
  declare lastIndexOf: SignalMethod<T, "lastIndexOf">;
  declare lastItem: SignalMethod<T, "lastItem">;
  declare length: SignalMethod<T, "length">;
  declare localeCompare: SignalMethod<T, "localeCompare">;
  declare map: SignalMethod<T, "map">;
  declare normalize: SignalMethod<T, "normalize">;
  declare padEnd: SignalMethod<T, "padEnd">;
  declare padStart: SignalMethod<T, "padStart">;
  declare partition: SignalMethod<T, "partition">;
  declare props: SignalMethod<T, "props">;
  declare reduce: SignalMethod<T, "reduce">;
  declare reduceRight: SignalMethod<T, "reduceRight">;
  declare repeat: SignalMethod<T, "repeat">;
  declare replace: SignalMethod<T, "replace">;
  declare replaceAll: SignalMethod<T, "replaceAll">;
  declare search: SignalMethod<T, "search">;
  declare slice: SignalMethod<T, "slice">;
  declare some: SignalMethod<T, "some">;
  declare split: SignalMethod<T, "split">;
  declare startsWith: SignalMethod<T, "startsWith">;
  declare substring: SignalMethod<T, "substring">;
  declare toExponential: SignalMethod<T, "toExponential">;
  declare toFixed: SignalMethod<T, "toFixed">;
  declare toLocaleLowerCase: SignalMethod<T, "toLocaleLowerCase">;
  declare toLocaleString: SignalMethod<T, "toLocaleString">;
  declare toLocaleUpperCase: SignalMethod<T, "toLocaleUpperCase">;
  declare toPrecision: SignalMethod<T, "toPrecision">;
  declare toReversed: SignalMethod<T, "toReversed">;
  declare toSorted: SignalMethod<T, "toSorted">;
  declare toSpliced: SignalMethod<T, "toSpliced">;
  declare trim: SignalMethod<T, "trim">;
  declare trimEnd: SignalMethod<T, "trimEnd">;
  declare trimStart: SignalMethod<T, "trimStart">;
  declare deepTrim: SignalMethod<T, "deepTrim">;
  declare lowercase: SignalMethod<T, "lowercase">;
  declare Sentencecase: SignalMethod<T, "Sentencecase">;
  declare TitleCase: SignalMethod<T, "TitleCase">;
  declare toLowerCase: SignalMethod<T, "toLowerCase">;
  declare UPPERCASE: SignalMethod<T, "UPPERCASE">;
  declare toUpperCase: SignalMethod<T, "toUpperCase">;
  declare toConfined: SignalMethod<T, "toConfined">;

  constructor(
    signalsCatcher: (prevValue: T | undefined) => T,
    noSignalsInSignalsCatcher = false,
  ) {
    super(undefined as T);
    if (noSignalsInSignalsCatcher) {
      const initialValue = signalsCatcher(this.prevValue);
      this._addNonMutatingMethodsFor(initialValue);
      this._addNonMutatingLogicalCheckerMethods(initialValue);
      this._setValueAndCallReceivers(initialValue);
      return;
    }

    const reciver = antenna(() => {
      this._setValueAndCallReceivers(signalsCatcher(this.prevValue));
    });
    reciver.registerDependentSignal(this);
    this._addNonMutatingMethodsFor(this._value);
    this._addNonMutatingLogicalCheckerMethods(this._value);
  }

  protected _derive<R>(valueGetter: () => R): DerivedSignal<R> {
    return new DerivedSignal(valueGetter);
  }

  private _addDerivedGetterProperty<R>(
    key: string,
    valueGetter: () => R,
  ): DerivedSignal<R> {
    const derivedSignal = this._derive(valueGetter);
    Object.defineProperty(this, key, {
      get: () => derivedSignal,
      configurable: true,
    });
    return derivedSignal;
  }

  private _valueOf<R>(input: R | BaseSignal<R>): R {
    return input instanceof DerivedSignal ? input.value : (input as R);
  }

  protected _deepTrimString(value: string): string {
    return value.trim().replace(/\s+/g, " ");
  }

  private _logicalThen(predicate: () => boolean): any {
    return {
      then: <U, V>(
        truthyOption: U | BaseSignal<U>,
        falsyOption: V | BaseSignal<V>,
      ) =>
        this._derive(() =>
          predicate()
            ? this._valueOf(truthyOption)
            : this._valueOf(falsyOption),
        ) as unknown as DerivedSignal<U | V>,
    };
  }

  private _logicalResult(predicate: () => boolean, returnThen: boolean): any {
    return returnThen ? this._logicalThen(predicate) : this._derive(predicate);
  }

  private _existentialCheckerMethods(
    valueGetter: () => Primitive,
    returnThen: boolean,
  ): Record<string, any> {
    return {
      get isTruthy() {
        return this._logicalResult(() => !!valueGetter(), returnThen);
      },
      get isFalsy() {
        return this._logicalResult(() => !valueGetter(), returnThen);
      },
      isEqualTo: (compareValue: Primitive | BaseSignal<Primitive>) =>
        this._logicalResult(
          () => valueGetter() === this._valueOf(compareValue),
          returnThen,
        ),
      isNotEqualTo: (compareValue: Primitive | BaseSignal<Primitive>) =>
        this._logicalResult(
          () => valueGetter() !== this._valueOf(compareValue),
          returnThen,
        ),
    };
  }

  private _comparisonCheckerMethods(
    valueGetter: () => number,
    returnThen: boolean,
  ): Record<string, any> {
    return {
      isGreaterThan: (compareValue: number | BaseSignal<number>) =>
        this._logicalResult(
          () => valueGetter() > this._valueOf(compareValue),
          returnThen,
        ),
      isGreaterThanOrEqualTo: (compareValue: number | BaseSignal<number>) =>
        this._logicalResult(
          () => valueGetter() >= this._valueOf(compareValue),
          returnThen,
        ),
      isSmallerThan: (compareValue: number | BaseSignal<number>) =>
        this._logicalResult(
          () => valueGetter() < this._valueOf(compareValue),
          returnThen,
        ),
      isSmallerThanOrEqualTo: (compareValue: number | BaseSignal<number>) =>
        this._logicalResult(
          () => valueGetter() <= this._valueOf(compareValue),
          returnThen,
        ),
    };
  }

  private _logicalCheckerMethods(
    valueGetter: () => Primitive,
    returnThen: boolean,
  ): Record<string, any> {
    return {
      ...this._existentialCheckerMethods(valueGetter, returnThen),
      ...this._comparisonCheckerMethods(
        valueGetter as () => number,
        returnThen,
      ),
    };
  }

  private _lengthCheckerMethods(
    lengthGetter: () => number,
    returnThen: boolean,
  ): Record<string, any> {
    return {
      length: this._logicalCheckerMethods(lengthGetter, returnThen),
    };
  }

  private _addNonMutatingLogicalCheckerMethods(initialValue: T): void {
    if (isPlainObject(initialValue)) return;

    const methods = this as Record<string, any>;
    const valueGetter = () => this.value as Primitive;
    const lengthGetter = () => {
      const value = this.value;
      return typeof value === "string" || Array.isArray(value)
        ? value.length
        : NaN;
    };

    if (!Array.isArray(initialValue)) {
      methods.or = <U>(alternativeValue: U | BaseSignal<U>) =>
        this._derive(() => this.value || this._valueOf(alternativeValue));
    }

    Object.assign(methods, this._logicalCheckerMethods(valueGetter, false));
    methods.when = this._logicalCheckerMethods(valueGetter, true);

    if (typeof initialValue === "string" || Array.isArray(initialValue)) {
      Object.assign(
        methods.when,
        this._lengthCheckerMethods(lengthGetter, true),
      );
    }
  }

  private _addArrayNonMutatingMethods(): void {
    const self = this as any;

    self.at = (...args: Parameters<unknown[]["at"]>) =>
      this._derive(() => self.value.at(...args));
    self.concat = (...args: Parameters<unknown[]["concat"]>) =>
      this._derive(() => self.value.concat(...args));
    self.every = (...args: Parameters<unknown[]["every"]>) =>
      this._derive(() => self.value.every(...args));
    self.filter = (...args: Parameters<unknown[]["filter"]>) =>
      this._derive(() => self.value.filter(...args));
    self.find = (...args: Parameters<unknown[]["find"]>) =>
      this._derive(() => self.value.find(...args));
    self.findIndex = (...args: Parameters<unknown[]["findIndex"]>) =>
      this._derive(() => self.value.findIndex(...args));
    self.findLast = (...args: Parameters<unknown[]["findLast"]>) =>
      this._derive(() => self.value.findLast(...args));
    self.findLastIndex = (...args: Parameters<unknown[]["findLastIndex"]>) =>
      this._derive(() => self.value.findLastIndex(...args));
    this._addDerivedGetterProperty("length", () => self.value.length);
    self.map = (...args: Parameters<unknown[]["map"]>) =>
      this._derive(() => self.value.map(...args));
    self.reduce = (...args: Parameters<unknown[]["reduce"]>) =>
      this._derive(() => self.value.reduce(...args));
    self.reduceRight = (...args: Parameters<unknown[]["reduceRight"]>) =>
      this._derive(() => self.value.reduceRight(...args));
    self.some = (...args: Parameters<unknown[]["some"]>) =>
      this._derive(() => self.value.some(...args));
    self.toReversed = (...args: Parameters<unknown[]["toReversed"]>) =>
      this._derive(() => self.value.toReversed(...args));
    self.toSorted = (...args: Parameters<unknown[]["toSorted"]>) =>
      this._derive(() => self.value.toSorted(...args));
    self.toSpliced = (...args: Parameters<unknown[]["toSpliced"]>) =>
      this._derive(() => self.value.toSpliced(...args));
    self.lastItem = () => this._derive(() => self.value.at(-1));
    self.partition = (...args: Parameters<unknown[]["filter"]>) => [
      this._derive(() => self.value.filter(...args)),
      this._derive(() =>
        self.value.filter(
          (item: unknown, index: number, array: unknown[]) =>
            !args[0](item, index, array),
        ),
      ),
    ];
  }

  private _addObjectNonMutatingMethods(): void {
    const self = this as any;

    self.keys = () => this._derive(() => Object.keys(self.value));
    self.get = (key: string) => this._derive(() => self.value[key]);
    self.props = () => {
      const derivedProps: Record<string, any> = {};
      Object.keys(self.value).forEach((key) => {
        derivedProps[key] = this._derive(() => self.value[key]);
      });
      return derivedProps;
    };
  }

  private _addStringNonMutatingMethods(): void {
    const self = this as any;

    self.at = (...args: Parameters<string["at"]>) =>
      this._derive(() => self.value.at(...args));
    self.charAt = (...args: Parameters<string["charAt"]>) =>
      this._derive(() => self.value.charAt(...args));
    self.charCodeAt = (...args: Parameters<string["charCodeAt"]>) =>
      this._derive(() => self.value.charCodeAt(...args));
    self.codePointAt = (...args: Parameters<string["codePointAt"]>) =>
      this._derive(() => self.value.codePointAt(...args));
    self.concat = (...args: Parameters<string["concat"]>) =>
      this._derive(() => self.value.concat(...args));
    self.endsWith = (...args: Parameters<string["endsWith"]>) =>
      this._derive(() => self.value.endsWith(...args));
    self.includes = (...args: Parameters<string["includes"]>) =>
      this._derive(() => self.value.includes(...args));
    self.indexOf = (...args: Parameters<string["indexOf"]>) =>
      this._derive(() => self.value.indexOf(...args));
    self.lastIndexOf = (...args: Parameters<string["lastIndexOf"]>) =>
      this._derive(() => self.value.lastIndexOf(...args));
    this._addDerivedGetterProperty("length", () => self.value.length);
    self.localeCompare = (...args: Parameters<string["localeCompare"]>) =>
      this._derive(() => self.value.localeCompare(...args));
    self.normalize = (...args: Parameters<string["normalize"]>) =>
      this._derive(() => self.value.normalize(...args));
    self.padEnd = (...args: Parameters<string["padEnd"]>) =>
      this._derive(() => self.value.padEnd(...args));
    self.padStart = (...args: Parameters<string["padStart"]>) =>
      this._derive(() => self.value.padStart(...args));
    self.repeat = (...args: Parameters<string["repeat"]>) =>
      this._derive(() => self.value.repeat(...args));
    self.replace = (...args: Parameters<string["replace"]>) =>
      this._derive(() => self.value.replace(...args));
    self.replaceAll = (...args: Parameters<string["replaceAll"]>) =>
      this._derive(() => self.value.replaceAll(...args));
    self.search = (...args: Parameters<string["search"]>) =>
      this._derive(() => self.value.search(...args));
    self.slice = (...args: Parameters<string["slice"]>) =>
      this._derive(() => self.value.slice(...args));
    self.split = (...args: Parameters<string["split"]>) =>
      this._derive(() => self.value.split(...args));
    self.startsWith = (...args: Parameters<string["startsWith"]>) =>
      this._derive(() => self.value.startsWith(...args));
    self.substring = (...args: Parameters<string["substring"]>) =>
      this._derive(() => self.value.substring(...args));
    self.toLocaleLowerCase = (
      ...args: Parameters<string["toLocaleLowerCase"]>
    ) => this._derive(() => self.value.toLocaleLowerCase(...args));
    self.toLocaleUpperCase = (
      ...args: Parameters<string["toLocaleUpperCase"]>
    ) => this._derive(() => self.value.toLocaleUpperCase(...args));
    self.trim = (...args: Parameters<string["trim"]>) =>
      this._derive(() => self.value.trim(...args));
    self.trimEnd = (...args: Parameters<string["trimEnd"]>) =>
      this._derive(() => self.value.trimEnd(...args));
    self.trimStart = (...args: Parameters<string["trimStart"]>) =>
      this._derive(() => self.value.trimStart(...args));
    self.deepTrim = () => this._derive(() => this._deepTrimString(self.value));
    self.toLowerCase = () => this._derive(() => self.value.toLowerCase());
    self.toUpperCase = () => this._derive(() => self.value.toUpperCase());
  }

  private _addNumberNonMutatingMethods(): void {
    const self = this as unknown as DerivedSignal<number>;
    const methods = this as Record<string, any>;

    methods.toExponential = (...args: Parameters<number["toExponential"]>) =>
      this._derive(() => self.value.toExponential(...args));
    methods.toFixed = (...args: Parameters<number["toFixed"]>) =>
      this._derive(() => self.value.toFixed(...args));
    methods["toLocaleString"] = (
      ...args: Parameters<number["toLocaleString"]>
    ) => this._derive(() => self.value.toLocaleString(...args));
    methods.toPrecision = (...args: Parameters<number["toPrecision"]>) =>
      this._derive(() => self.value.toPrecision(...args));
    methods.toConfined = (start: number, end: number) =>
      this._derive(() =>
        self.value < start ? start : self.value > end ? end : self.value,
      );
  }

  private _addNonMutatingMethodsFor(initialValue: T): void {
    if (Array.isArray(initialValue)) {
      this._addArrayNonMutatingMethods();
      return;
    }

    if (isPlainObject(initialValue)) {
      this._addObjectNonMutatingMethods();
      return;
    }

    if (typeof initialValue === "string") {
      this._addStringNonMutatingMethods();
      return;
    }

    if (typeof initialValue === "number") {
      this._addNumberNonMutatingMethods();
    }
  }
}

export const derive = <T>(signalsCatcher: (prevValue: T | undefined) => T) =>
  new DerivedSignal(signalsCatcher);
