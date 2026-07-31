import { isPlainObject } from "@cyftec/immut";
import { DerivedSignal } from "./derived-signal";
import { SignalType } from "./types";

type Present<T> = NonNullable<T>;
type ArrayItem<T> = Present<T> extends readonly (infer Item)[] ? Item : never;
type SignalPredicate<T> = (item: T, index: number, array: T[]) => unknown;

type ArrayMutatingMethods<T> =
  Present<T> extends readonly unknown[]
    ? {
        concat: (...items: ConcatArray<ArrayItem<T>>[]) => void;
        copyWithin: (target: number, start: number, end?: number) => void;
        fill: (value: ArrayItem<T>, start?: number, end?: number) => void;
        pop: () => void;
        push: (...items: ArrayItem<T>[]) => void;
        reverse: () => void;
        shift: () => void;
        sort: (
          compareFn?: (a: ArrayItem<T>, b: ArrayItem<T>) => number,
        ) => void;
        splice: (
          start: number,
          deleteCount?: number,
          ...items: ArrayItem<T>[]
        ) => void;
        unshift: (...items: ArrayItem<T>[]) => void;
        keep: (predicate: SignalPredicate<ArrayItem<T>>) => void;
        remove: (predicate: SignalPredicate<ArrayItem<T>>) => void;
      }
    : {};

type ObjectMutatingMethods<T> =
  Present<T> extends object
    ? Present<T> extends readonly unknown[]
      ? {}
      : { set: (partiallyNewObjectValue: Partial<Present<T>>) => void }
    : {};

type StringMutatingMethods<T> =
  Present<T> extends string
    ? {
        toLocaleLowerCase: (
          ...args: Parameters<string["toLocaleLowerCase"]>
        ) => void;
        toLocaleUpperCase: (
          ...args: Parameters<string["toLocaleUpperCase"]>
        ) => void;
        concat: (...args: Parameters<string["concat"]>) => void;
        padEnd: (...args: Parameters<string["padEnd"]>) => void;
        padStart: (...args: Parameters<string["padStart"]>) => void;
        repeat: (...args: Parameters<string["repeat"]>) => void;
        replace: (...args: Parameters<string["replace"]>) => void;
        replaceAll: (...args: Parameters<string["replaceAll"]>) => void;
        slice: (...args: Parameters<string["slice"]>) => void;
        trim: () => void;
        trimEnd: () => void;
        trimStart: () => void;
        deepTrim: () => void;
        toLowerCase: () => void;
        toUpperCase: () => void;
      }
    : {};

type BooleanMutatingMethods<T> =
  Present<T> extends boolean ? { toggle: () => void } : {};

type MutableMethods<T> = ArrayMutatingMethods<T> &
  ObjectMutatingMethods<T> &
  StringMutatingMethods<T> &
  BooleanMutatingMethods<T>;

type MutableMethod<T, K extends PropertyKey> = K extends keyof MutableMethods<T>
  ? MutableMethods<T>[K]
  : never;

export class MutableSignal<T> extends DerivedSignal<T> {
  readonly type: SignalType = "mutable-signal";
  declare mutate: MutableMethods<T>;
  declare copyWithin: MutableMethod<T, "copyWithin">;
  declare fill: MutableMethod<T, "fill">;
  declare pop: MutableMethod<T, "pop">;
  declare push: MutableMethod<T, "push">;
  declare reverse: MutableMethod<T, "reverse">;
  declare shift: MutableMethod<T, "shift">;
  declare sort: MutableMethod<T, "sort">;
  declare splice: MutableMethod<T, "splice">;
  declare unshift: MutableMethod<T, "unshift">;
  declare keep: MutableMethod<T, "keep">;
  declare remove: MutableMethod<T, "remove">;
  declare set: MutableMethod<T, "set">;
  declare toggle: MutableMethod<T, "toggle">;

  constructor(initialValue: T, nonNullableInitialValue?: NonNullable<T>) {
    const sureInitialValue =
      initialValue === undefined || initialValue === null
        ? initialValue || nonNullableInitialValue
        : initialValue;
    super(() => sureInitialValue as T, true);
    this._addMutatingMethodsFor(sureInitialValue as T);
  }

  private _mutateValue(getMutatedValue: (oldValue: T) => T): void {
    this._setValueAndCallReceivers(getMutatedValue(this._value));
  }

  private _addArrayMutatingMethods(): void {
    const updateArray = (mutator: (newValue: unknown[]) => void): void => {
      this._mutateValue((oldValue) => {
        const newValue = Array.from(oldValue as unknown[]);
        mutator(newValue);
        return newValue as T;
      });
    };

    this.mutate = {
      concat: (...args: Parameters<unknown[]["concat"]>) =>
        updateArray((oldValue) => (oldValue = oldValue.concat(...args))),
      copyWithin: (...args: Parameters<unknown[]["copyWithin"]>) =>
        updateArray((oldValue) => oldValue.copyWithin(...args)),
      fill: (...args: Parameters<unknown[]["fill"]>) =>
        updateArray((oldValue) => oldValue.fill(...args)),
      pop: (...args: Parameters<unknown[]["pop"]>) =>
        updateArray((oldValue) => oldValue.pop(...args)),
      push: (...args: Parameters<unknown[]["push"]>) =>
        updateArray((oldValue) => oldValue.push(...args)),
      reverse: (...args: Parameters<unknown[]["reverse"]>) =>
        updateArray((oldValue) => oldValue.reverse(...args)),
      shift: (...args: Parameters<unknown[]["shift"]>) =>
        updateArray((oldValue) => oldValue.shift(...args)),
      sort: (...args: Parameters<unknown[]["sort"]>) =>
        updateArray((oldValue) => oldValue.sort(...args)),
      splice: (...args: Parameters<unknown[]["splice"]>) =>
        updateArray((oldValue) => oldValue.splice(...args)),
      unshift: (...args: Parameters<unknown[]["unshift"]>) =>
        updateArray((oldValue) => oldValue.unshift(...args)),
      keep: (...args: Parameters<unknown[]["filter"]>) =>
        this._mutateValue(
          (oldValue) => (oldValue as unknown[]).filter(...args) as T,
        ),
      remove: (...args: Parameters<unknown[]["filter"]>) =>
        this._mutateValue(
          (oldValue) =>
            (oldValue as unknown[]).filter(
              (item, index, array) => !args[0](item, index, array),
            ) as T,
        ),
    } as unknown as MutableMethods<T>;
  }

  private _addObjectMutatingMethods(): void {
    this.mutate = {
      set: (partiallyNewObjectValue: Partial<Record<string, any>>) =>
        this._mutateValue(
          (oldValue) =>
            ({
              ...(oldValue as Record<string, any>),
              ...partiallyNewObjectValue,
            }) as T,
        ),
    } as unknown as MutableMethods<T>;
  }

  private _addStringMutatingMethods(): void {
    this.mutate = {
      toLocaleLowerCase: (...args: Parameters<string["toLocaleLowerCase"]>) =>
        this._mutateValue(
          (oldValue) => (oldValue as string).toLocaleLowerCase(...args) as T,
        ),
      toLocaleUpperCase: (...args: Parameters<string["toLocaleUpperCase"]>) =>
        this._mutateValue(
          (oldValue) => (oldValue as string).toLocaleUpperCase(...args) as T,
        ),
      concat: (...args: Parameters<string["concat"]>) =>
        this._mutateValue(
          (oldValue) => (oldValue as string).concat(...args) as T,
        ),
      padEnd: (...args: Parameters<string["padEnd"]>) =>
        this._mutateValue(
          (oldValue) => (oldValue as string).padEnd(...args) as T,
        ),
      padStart: (...args: Parameters<string["padStart"]>) =>
        this._mutateValue(
          (oldValue) => (oldValue as string).padStart(...args) as T,
        ),
      repeat: (...args: Parameters<string["repeat"]>) =>
        this._mutateValue(
          (oldValue) => (oldValue as string).repeat(...args) as T,
        ),
      replace: (...args: Parameters<string["replace"]>) =>
        this._mutateValue(
          (oldValue) => (oldValue as string).replace(...args) as T,
        ),
      replaceAll: (...args: Parameters<string["replaceAll"]>) =>
        this._mutateValue(
          (oldValue) => (oldValue as string).replaceAll(...args) as T,
        ),
      slice: (...args: Parameters<string["slice"]>) =>
        this._mutateValue(
          (oldValue) => (oldValue as string).slice(...args) as T,
        ),
      trim: () =>
        this._mutateValue((oldValue) => (oldValue as string).trim() as T),
      trimEnd: () =>
        this._mutateValue((oldValue) => (oldValue as string).trimEnd() as T),
      trimStart: () =>
        this._mutateValue((oldValue) => (oldValue as string).trimStart() as T),
      deepTrim: () =>
        this._mutateValue(
          (oldValue) => this._deepTrimString(oldValue as string) as T,
        ),
      toLowerCase: () =>
        this._mutateValue(
          (oldValue) => (oldValue as string).toLowerCase() as T,
        ),
      toUpperCase: () =>
        this._mutateValue(
          (oldValue) => (oldValue as string).toUpperCase() as T,
        ),
    } as unknown as MutableMethods<T>;
  }

  private _addBooleanMutatingMethods(): void {
    this.mutate = {
      toggle: () => this._mutateValue((oldValue) => !oldValue as T),
    } as unknown as MutableMethods<T>;
  }

  private _addMutatingMethodsFor(initialValue: T): void {
    if (Array.isArray(initialValue)) {
      this._addArrayMutatingMethods();
      return;
    }

    if (isPlainObject(initialValue)) {
      this._addObjectMutatingMethods();
      return;
    }

    if (typeof initialValue === "string") {
      this._addStringMutatingMethods();
      return;
    }

    if (typeof initialValue === "boolean") {
      this._addBooleanMutatingMethods();
    }
  }

  set value(newValue: T) {
    this._setValueAndCallReceivers(newValue);
  }
}

export const mutable = <T>(
  initialValue: T,
  nonNullableInitialValue?: NonNullable<T>,
) => new MutableSignal(initialValue, nonNullableInitialValue);
