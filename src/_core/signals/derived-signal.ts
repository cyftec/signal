import { isPlainObject } from "@cyftec/immut";
import { antenna } from "../antenna";
import { BaseSignal } from "./base-signal";
import { MaybeSignal, MaybeSignalsArray, Primitive, SignalType } from "./types";
import { getPlainMethodParams, value } from "../../utils";
import { DeadSignal } from "./dead-signal";

type ArrayItem<T> =
  NonNullable<T> extends readonly (infer Item)[] ? Item : never;
type SignalPredicate<T> = (item: T, index: number, array: T[]) => boolean;

type ThenMethods = {
  then: <Truthy, Falsy>(
    truthyOption: MaybeSignal<Truthy>,
    falsyOption: MaybeSignal<Falsy>,
  ) => DerivedSignal<Truthy | Falsy>;
};

type LogicalChecks<
  ReturnThen extends boolean,
  Deriver extends DerivedSignal<boolean> | DeadSignal<boolean>,
> = {
  readonly isTruthy: ReturnThen extends true ? ThenMethods : Deriver;
  readonly isFalsy: ReturnThen extends true ? ThenMethods : Deriver;
  isEqualTo: (
    compareValue: MaybeSignal<Primitive>,
  ) => ReturnThen extends true ? ThenMethods : Deriver;
  isNotEqualTo: (
    compareValue: MaybeSignal<Primitive>,
  ) => ReturnThen extends true ? ThenMethods : Deriver;
  isGreaterThan: (
    compareValue: MaybeSignal<number>,
  ) => ReturnThen extends true ? ThenMethods : Deriver;
  isGreaterThanOrEqualTo: (
    compareValue: MaybeSignal<number>,
  ) => ReturnThen extends true ? ThenMethods : Deriver;
  isSmallerThan: (
    compareValue: MaybeSignal<number>,
  ) => ReturnThen extends true ? ThenMethods : Deriver;
  isSmallerThanOrEqualTo: (
    compareValue: MaybeSignal<number>,
  ) => ReturnThen extends true ? ThenMethods : Deriver;
};

type PublicLogicalChecks<
  ReturnThen extends boolean,
  Deriver extends DerivedSignal<boolean> | DeadSignal<boolean>,
> = {
  truthy: () => ReturnThen extends true ? ThenMethods : Deriver;
  falsy: () => ReturnThen extends true ? ThenMethods : Deriver;
  equalTo: (
    compareValue: MaybeSignal<Primitive>,
  ) => ReturnThen extends true ? ThenMethods : Deriver;
  notEqualTo: (
    compareValue: MaybeSignal<Primitive>,
  ) => ReturnThen extends true ? ThenMethods : Deriver;
  greaterThan: (
    compareValue: MaybeSignal<number>,
  ) => ReturnThen extends true ? ThenMethods : Deriver;
  greaterThanOrEqualTo: (
    compareValue: MaybeSignal<number>,
  ) => ReturnThen extends true ? ThenMethods : Deriver;
  smallerThan: (
    compareValue: MaybeSignal<number>,
  ) => ReturnThen extends true ? ThenMethods : Deriver;
  smallerThanOrEqualTo: (
    compareValue: MaybeSignal<number>,
  ) => ReturnThen extends true ? ThenMethods : Deriver;
};

type WithLengthChecks<
  T,
  ReturnThen extends boolean,
  Deriver extends DerivedSignal<boolean> | DeadSignal<boolean>,
> =
  NonNullable<T> extends string | readonly unknown[]
    ? { length: PublicLogicalChecks<ReturnThen, Deriver> }
    : {};

type PublicLogicalMethods<
  T,
  ReturnThen extends boolean,
  Deriver extends DerivedSignal<boolean> | DeadSignal<boolean>,
> = PublicLogicalChecks<ReturnThen, Deriver> &
  WithLengthChecks<T, ReturnThen, Deriver>;

type StringDerivedMethods<T> =
  NonNullable<T> extends string
    ? {
        at: (
          ...args: MaybeSignalsArray<Parameters<string["at"]>>
        ) => DerivedSignal<string | undefined>;
        charAt: (
          ...args: MaybeSignalsArray<Parameters<string["charAt"]>>
        ) => DerivedSignal<string>;
        charCodeAt: (
          ...args: MaybeSignalsArray<Parameters<string["charCodeAt"]>>
        ) => DerivedSignal<number>;
        codePointAt: (
          ...args: MaybeSignalsArray<Parameters<string["codePointAt"]>>
        ) => DerivedSignal<number | undefined>;
        concat: (
          ...args: MaybeSignalsArray<Parameters<string["concat"]>>
        ) => DerivedSignal<string>;
        endsWith: (
          ...args: MaybeSignalsArray<Parameters<string["endsWith"]>>
        ) => DerivedSignal<boolean>;
        includes: (
          ...args: MaybeSignalsArray<Parameters<string["includes"]>>
        ) => DerivedSignal<boolean>;
        indexOf: (
          ...args: MaybeSignalsArray<Parameters<string["indexOf"]>>
        ) => DerivedSignal<number>;
        lastIndexOf: (
          ...args: MaybeSignalsArray<Parameters<string["lastIndexOf"]>>
        ) => DerivedSignal<number>;
        get length(): DerivedSignal<number>;
        localeCompare: (
          ...args: MaybeSignalsArray<Parameters<string["localeCompare"]>>
        ) => DerivedSignal<number>;
        normalize: (
          ...args: MaybeSignalsArray<Parameters<string["normalize"]>>
        ) => DerivedSignal<string>;
        padEnd: (
          ...args: MaybeSignalsArray<Parameters<string["padEnd"]>>
        ) => DerivedSignal<string>;
        padStart: (
          ...args: MaybeSignalsArray<Parameters<string["padStart"]>>
        ) => DerivedSignal<string>;
        repeat: (
          ...args: MaybeSignalsArray<Parameters<string["repeat"]>>
        ) => DerivedSignal<string>;
        replace: (
          ...args: MaybeSignalsArray<Parameters<string["replace"]>>
        ) => DerivedSignal<string>;
        replaceAll: (
          ...args: MaybeSignalsArray<Parameters<string["replaceAll"]>>
        ) => DerivedSignal<string>;
        search: (
          ...args: MaybeSignalsArray<Parameters<string["search"]>>
        ) => DerivedSignal<number>;
        slice: (
          ...args: MaybeSignalsArray<Parameters<string["slice"]>>
        ) => DerivedSignal<string>;
        split: (
          ...args: MaybeSignalsArray<Parameters<string["split"]>>
        ) => DerivedSignal<string[]>;
        startsWith: (
          ...args: MaybeSignalsArray<Parameters<string["startsWith"]>>
        ) => DerivedSignal<boolean>;
        substring: (
          ...args: MaybeSignalsArray<Parameters<string["substring"]>>
        ) => DerivedSignal<string>;
        toLocaleLowerCase: (
          ...args: MaybeSignalsArray<Parameters<string["toLocaleLowerCase"]>>
        ) => DerivedSignal<string>;
        toLocaleUpperCase: (
          ...args: MaybeSignalsArray<Parameters<string["toLocaleUpperCase"]>>
        ) => DerivedSignal<string>;
        trim: (
          ...args: MaybeSignalsArray<Parameters<string["trim"]>>
        ) => DerivedSignal<string>;
        trimEnd: (
          ...args: MaybeSignalsArray<Parameters<string["trimEnd"]>>
        ) => DerivedSignal<string>;
        trimStart: (
          ...args: MaybeSignalsArray<Parameters<string["trimStart"]>>
        ) => DerivedSignal<string>;
        deepTrim: () => DerivedSignal<string>;
        toLowerCase: () => DerivedSignal<string>;
        toUpperCase: () => DerivedSignal<string>;
      }
    : {};

type NumberDerivedMethods<T> =
  NonNullable<T> extends number
    ? {
        toExponential: (
          ...args: MaybeSignalsArray<Parameters<number["toExponential"]>>
        ) => DerivedSignal<string>;
        toFixed: (
          ...args: MaybeSignalsArray<Parameters<number["toFixed"]>>
        ) => DerivedSignal<string>;
        toLocaleString: (
          ...args: MaybeSignalsArray<Parameters<number["toLocaleString"]>>
        ) => DerivedSignal<string>;
        toPrecision: (
          ...args: MaybeSignalsArray<Parameters<number["toPrecision"]>>
        ) => DerivedSignal<string>;
        toConfined: (
          start: MaybeSignal<number>,
          end: MaybeSignal<number>,
        ) => DerivedSignal<number>;
      }
    : {};

type ArrayDerivedMethods<T> =
  NonNullable<T> extends readonly unknown[]
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
        get length(): DerivedSignal<number>;
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
  NonNullable<T> extends object
    ? NonNullable<T> extends readonly unknown[]
      ? {}
      : {
          keys: () => DerivedSignal<string[]>;
          get: <K extends keyof NonNullable<T>>(
            key: K,
          ) => DerivedSignal<NonNullable<T>[K]>;
          props: () => {
            [K in keyof NonNullable<T>]: DerivedSignal<NonNullable<T>[K]>;
          };
        }
    : {};

export type DerivedSignalMethods<T> = StringDerivedMethods<T> &
  NumberDerivedMethods<T> &
  ArrayDerivedMethods<T> &
  ObjectDerivedMethods<T>;

export class DerivedSignal<T> extends BaseSignal<T> {
  readonly type: SignalType = "derived-signal";

  constructor(
    signalsCatcher: (prevValue: T | undefined) => T,
    noSignalsInSignalsCatcher = false,
  ) {
    super(undefined as T);
    if (noSignalsInSignalsCatcher) {
      const initialValue = signalsCatcher(this.prevValue);
      this._addDeriverMethods(initialValue);
      this._setValueAndCallReceivers(initialValue);
      return;
    }

    const reciver = antenna(() => {
      this._setValueAndCallReceivers(signalsCatcher(this.prevValue));
    });
    reciver.registerDependentSignal(this);
    this._addDeriverMethods(this._value);
  }

  protected _addDeriverMethods(initialValue: T) {
    this._addNonMutatingMethodsFor(initialValue);
    this._addNonMutatingLogicalCheckerMethods(initialValue);
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

  private _valueOf<R>(input: MaybeSignal<R>): R {
    return value(input);
  }

  protected _deepTrimString(value: string): string {
    return value.trim().replace(/\s+/g, " ");
  }

  private _logicalThen(predicate: () => boolean): any {
    return {
      then: <U, V>(truthyOption: MaybeSignal<U>, falsyOption: MaybeSignal<V>) =>
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
      isEqualTo: (compareValue: MaybeSignal<Primitive>) =>
        this._logicalResult(
          () => valueGetter() === this._valueOf(compareValue),
          returnThen,
        ),
      isNotEqualTo: (compareValue: MaybeSignal<Primitive>) =>
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
      isGreaterThan: (compareValue: MaybeSignal<number>) =>
        this._logicalResult(
          () => valueGetter() > this._valueOf(compareValue),
          returnThen,
        ),
      isGreaterThanOrEqualTo: (compareValue: MaybeSignal<number>) =>
        this._logicalResult(
          () => valueGetter() >= this._valueOf(compareValue),
          returnThen,
        ),
      isSmallerThan: (compareValue: MaybeSignal<number>) =>
        this._logicalResult(
          () => valueGetter() < this._valueOf(compareValue),
          returnThen,
        ),
      isSmallerThanOrEqualTo: (compareValue: MaybeSignal<number>) =>
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

  private _logicalLengthCheckerMethods(
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
      methods.or = <U>(alternativeValue: MaybeSignal<U>) =>
        this._derive(() => this.value || this._valueOf(alternativeValue));
    }

    Object.assign(methods, this._logicalCheckerMethods(valueGetter, false));
    methods.when = this._logicalCheckerMethods(valueGetter, true);

    if (typeof initialValue === "string" || Array.isArray(initialValue)) {
      Object.assign(
        methods.when,
        this._logicalLengthCheckerMethods(lengthGetter, true),
      );
    }
  }

  private _addArrayNonMutatingMethods(): void {
    const self = this as any;

    self.at = (...args: MaybeSignalsArray<Parameters<unknown[]["at"]>>) =>
      this._derive(() => self.value.at(...getPlainMethodParams(...args)));
    self.concat = (
      ...args: MaybeSignalsArray<Parameters<unknown[]["concat"]>>
    ) =>
      this._derive(() => self.value.concat(...getPlainMethodParams(...args)));
    self.every = (...args: MaybeSignalsArray<Parameters<unknown[]["every"]>>) =>
      this._derive(() => self.value.every(...getPlainMethodParams(...args)));
    self.filter = (
      ...args: MaybeSignalsArray<Parameters<unknown[]["filter"]>>
    ) =>
      this._derive(() => self.value.filter(...getPlainMethodParams(...args)));
    self.find = (...args: MaybeSignalsArray<Parameters<unknown[]["find"]>>) =>
      this._derive(() => self.value.find(...getPlainMethodParams(...args)));
    self.findIndex = (
      ...args: MaybeSignalsArray<Parameters<unknown[]["findIndex"]>>
    ) =>
      this._derive(() =>
        self.value.findIndex(...getPlainMethodParams(...args)),
      );
    self.findLast = (
      ...args: MaybeSignalsArray<Parameters<unknown[]["findLast"]>>
    ) =>
      this._derive(() => self.value.findLast(...getPlainMethodParams(...args)));
    self.findLastIndex = (
      ...args: MaybeSignalsArray<Parameters<unknown[]["findLastIndex"]>>
    ) =>
      this._derive(() =>
        self.value.findLastIndex(...getPlainMethodParams(...args)),
      );
    this._addDerivedGetterProperty("length", () => self.value.length);
    self.map = (...args: MaybeSignalsArray<Parameters<unknown[]["map"]>>) =>
      this._derive(() => self.value.map(...getPlainMethodParams(...args)));
    self.reduce = (
      ...args: MaybeSignalsArray<Parameters<unknown[]["reduce"]>>
    ) =>
      this._derive(() => self.value.reduce(...getPlainMethodParams(...args)));
    self.reduceRight = (
      ...args: MaybeSignalsArray<Parameters<unknown[]["reduceRight"]>>
    ) =>
      this._derive(() =>
        self.value.reduceRight(...getPlainMethodParams(...args)),
      );
    self.some = (...args: MaybeSignalsArray<Parameters<unknown[]["some"]>>) =>
      this._derive(() => self.value.some(...getPlainMethodParams(...args)));
    self.toReversed = (
      ...args: MaybeSignalsArray<Parameters<unknown[]["toReversed"]>>
    ) =>
      this._derive(() =>
        self.value.toReversed(...getPlainMethodParams(...args)),
      );
    self.toSorted = (
      ...args: MaybeSignalsArray<Parameters<unknown[]["toSorted"]>>
    ) =>
      this._derive(() => self.value.toSorted(...getPlainMethodParams(...args)));
    self.toSpliced = (
      ...args: MaybeSignalsArray<Parameters<unknown[]["toSpliced"]>>
    ) =>
      this._derive(() =>
        self.value.toSpliced(...getPlainMethodParams(...args)),
      );
    self.lastItem = () => this._derive(() => self.value.at(-1));
    self.partition = (
      ...args: MaybeSignalsArray<Parameters<unknown[]["filter"]>>
    ) => [
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

    self.at = (...args: MaybeSignalsArray<Parameters<string["at"]>>) =>
      this._derive(() => self.value.at(...getPlainMethodParams(...args)));
    self.charAt = (...args: MaybeSignalsArray<Parameters<string["charAt"]>>) =>
      this._derive(() => self.value.charAt(...getPlainMethodParams(...args)));
    self.charCodeAt = (
      ...args: MaybeSignalsArray<Parameters<string["charCodeAt"]>>
    ) =>
      this._derive(() =>
        self.value.charCodeAt(...getPlainMethodParams(...args)),
      );
    self.codePointAt = (
      ...args: MaybeSignalsArray<Parameters<string["codePointAt"]>>
    ) =>
      this._derive(() =>
        self.value.codePointAt(...getPlainMethodParams(...args)),
      );
    self.concat = (...args: MaybeSignalsArray<Parameters<string["concat"]>>) =>
      this._derive(() => self.value.concat(...getPlainMethodParams(...args)));
    self.endsWith = (
      ...args: MaybeSignalsArray<Parameters<string["endsWith"]>>
    ) =>
      this._derive(() => self.value.endsWith(...getPlainMethodParams(...args)));
    self.includes = (
      ...args: MaybeSignalsArray<Parameters<string["includes"]>>
    ) =>
      this._derive(() => self.value.includes(...getPlainMethodParams(...args)));
    self.indexOf = (
      ...args: MaybeSignalsArray<Parameters<string["indexOf"]>>
    ) =>
      this._derive(() => self.value.indexOf(...getPlainMethodParams(...args)));
    self.lastIndexOf = (
      ...args: MaybeSignalsArray<Parameters<string["lastIndexOf"]>>
    ) =>
      this._derive(() =>
        self.value.lastIndexOf(...getPlainMethodParams(...args)),
      );
    this._addDerivedGetterProperty("length", () => self.value.length);
    self.localeCompare = (
      ...args: MaybeSignalsArray<Parameters<string["localeCompare"]>>
    ) =>
      this._derive(() =>
        self.value.localeCompare(...getPlainMethodParams(...args)),
      );
    self.normalize = (
      ...args: MaybeSignalsArray<Parameters<string["normalize"]>>
    ) =>
      this._derive(() =>
        self.value.normalize(...getPlainMethodParams(...args)),
      );
    self.padEnd = (...args: MaybeSignalsArray<Parameters<string["padEnd"]>>) =>
      this._derive(() => self.value.padEnd(...getPlainMethodParams(...args)));
    self.padStart = (
      ...args: MaybeSignalsArray<Parameters<string["padStart"]>>
    ) =>
      this._derive(() => self.value.padStart(...getPlainMethodParams(...args)));
    self.repeat = (...args: MaybeSignalsArray<Parameters<string["repeat"]>>) =>
      this._derive(() => self.value.repeat(...getPlainMethodParams(...args)));
    self.replace = (
      ...args: MaybeSignalsArray<Parameters<string["replace"]>>
    ) =>
      this._derive(() => self.value.replace(...getPlainMethodParams(...args)));
    self.replaceAll = (
      ...args: MaybeSignalsArray<Parameters<string["replaceAll"]>>
    ) =>
      this._derive(() =>
        self.value.replaceAll(...getPlainMethodParams(...args)),
      );
    self.search = (...args: MaybeSignalsArray<Parameters<string["search"]>>) =>
      this._derive(() => self.value.search(...getPlainMethodParams(...args)));
    self.slice = (...args: MaybeSignalsArray<Parameters<string["slice"]>>) =>
      this._derive(() => self.value.slice(...getPlainMethodParams(...args)));
    self.split = (...args: MaybeSignalsArray<Parameters<string["split"]>>) =>
      this._derive(() => self.value.split(...getPlainMethodParams(...args)));
    self.startsWith = (
      ...args: MaybeSignalsArray<Parameters<string["startsWith"]>>
    ) =>
      this._derive(() =>
        self.value.startsWith(...getPlainMethodParams(...args)),
      );
    self.substring = (
      ...args: MaybeSignalsArray<Parameters<string["substring"]>>
    ) =>
      this._derive(() =>
        self.value.substring(...getPlainMethodParams(...args)),
      );
    self.toLocaleLowerCase = (
      ...args: MaybeSignalsArray<Parameters<string["toLocaleLowerCase"]>>
    ) =>
      this._derive(() =>
        self.value.toLocaleLowerCase(...getPlainMethodParams(...args)),
      );
    self.toLocaleUpperCase = (
      ...args: MaybeSignalsArray<Parameters<string["toLocaleUpperCase"]>>
    ) =>
      this._derive(() =>
        self.value.toLocaleUpperCase(...getPlainMethodParams(...args)),
      );
    self.trim = (...args: MaybeSignalsArray<Parameters<string["trim"]>>) =>
      this._derive(() => self.value.trim(...getPlainMethodParams(...args)));
    self.trimEnd = (
      ...args: MaybeSignalsArray<Parameters<string["trimEnd"]>>
    ) =>
      this._derive(() => self.value.trimEnd(...getPlainMethodParams(...args)));
    self.trimStart = (
      ...args: MaybeSignalsArray<Parameters<string["trimStart"]>>
    ) =>
      this._derive(() =>
        self.value.trimStart(...getPlainMethodParams(...args)),
      );
    self.deepTrim = () => this._derive(() => this._deepTrimString(self.value));
    self.toLowerCase = () => this._derive(() => self.value.toLowerCase());
    self.toUpperCase = () => this._derive(() => self.value.toUpperCase());
  }

  private _addNumberNonMutatingMethods(): void {
    const self = this as unknown as DerivedSignal<number>;
    const methods = this as Record<string, any>;

    methods.toExponential = (
      ...args: MaybeSignalsArray<Parameters<number["toExponential"]>>
    ) =>
      this._derive(() =>
        self.value.toExponential(...getPlainMethodParams(...args)),
      );
    methods.toFixed = (
      ...args: MaybeSignalsArray<Parameters<number["toFixed"]>>
    ) =>
      this._derive(() => self.value.toFixed(...getPlainMethodParams(...args)));
    methods["toLocaleString"] = (
      ...args: MaybeSignalsArray<Parameters<number["toLocaleString"]>>
    ) =>
      this._derive(() =>
        self.value.toLocaleString(...getPlainMethodParams(...args)),
      );
    methods.toPrecision = (
      ...args: MaybeSignalsArray<Parameters<number["toPrecision"]>>
    ) =>
      this._derive(() =>
        self.value.toPrecision(...getPlainMethodParams(...args)),
      );
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

export const derive = <T>(
  signalsCatcher: (prevValue: T | undefined) => T,
): DerivedSignal<T> & DerivedSignalMethods<T> =>
  new DerivedSignal(signalsCatcher) as DerivedSignal<T> &
    DerivedSignalMethods<T>;

const der = derive(() => `[""]`);
der;
