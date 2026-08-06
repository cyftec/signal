import { newVal } from "@cyftec/immut";
import { getPlainMethodParams, value, valueIsLiveSignal } from "../../utils";
import {
  BaseSignal,
  deadSignal,
  derive,
  MaybeSignal,
  MaybeSignalValues,
} from "../signals";
import {
  ArrayCustomNonMutatingMethods,
  ArrayIntrinsicNonMutatingMethods,
  ArrayMutatingAndNonMutatingMethods,
  ArrayMutatingMethods,
  ArrayNonMutatingMethods,
  DeriverReturnType,
  InputSignalType,
} from "./types";

const getArrayMethodDeriver = <InputSignal extends InputSignalType>(
  baseArraySignal: BaseSignal<any>,
) => {
  const inputIsLiveSignal = valueIsLiveSignal(baseArraySignal as any);

  return <T>(deriver: () => T): DeriverReturnType<InputSignal, T> =>
    (inputIsLiveSignal
      ? derive(deriver)
      : deadSignal(deriver())) as DeriverReturnType<InputSignal, T>;
};

/**
 * Creates intrinsic mutating methods for array signals.
 *
 * These methods mirror JavaScript Array mutating methods but internally create
 * new immutable arrays and trigger effects.
 *
 * @template T - The array type
 * @param valueSetter - Updates the signal value and triggers effects
 * @returns Intrinsic mutating methods for array signals
 *
 * @remarks
 * - All methods create new arrays internally using `Array.from()`
 * - Effects are triggered synchronously
 * - Methods expose a mutable-style API while maintaining immutability
 */
export const getArrayMutatingMethods = <T extends any[]>(
  baseArraySignal: BaseSignal<T>,
): ArrayMutatingMethods<T> => {
  const signalUpdator = (mutatorMethod: (newVal: T) => void): void =>
    baseArraySignal.mutateWith((oldValue: T) => {
      const newValue = Array.from(oldValue) as T;
      mutatorMethod(newValue);
      return newValue;
    });

  return {
    concat: (
      ...args: MaybeSignalValues<Parameters<Array<T[number]>["concat"]>>
    ) =>
      baseArraySignal.mutateWith(
        (oldValue) =>
          oldValue.concat(...getPlainMethodParams(...args)) as T,
      ),
    copyWithin: (
      ...args: MaybeSignalValues<Parameters<Array<T[number]>["copyWithin"]>>
    ) =>
      signalUpdator((newValue) =>
        newValue.copyWithin(...getPlainMethodParams(...args)),
      ),
    fill: (...args: MaybeSignalValues<Parameters<Array<T[number]>["fill"]>>) =>
      signalUpdator((newValue) =>
        newValue.fill(...getPlainMethodParams(...args)),
      ),
    filter: (
      ...args: MaybeSignalValues<Parameters<Array<T[number]>["filter"]>>
    ) =>
      baseArraySignal.mutateWith((oldValue: T) => {
        return oldValue.filter(...getPlainMethodParams(...args)) as T;
      }),
    pop: (...args: MaybeSignalValues<Parameters<Array<T[number]>["pop"]>>) =>
      signalUpdator((newValue) =>
        newValue.pop(...getPlainMethodParams(...args)),
      ),
    push: (...args: MaybeSignalValues<Parameters<Array<T[number]>["push"]>>) =>
      signalUpdator((newValue) =>
        newValue.push(...getPlainMethodParams(...args)),
      ),
    shift: (
      ...args: MaybeSignalValues<Parameters<Array<T[number]>["shift"]>>
    ) =>
      signalUpdator((newValue) =>
        newValue.shift(...getPlainMethodParams(...args)),
      ),
    toReversed: (
      ...args: MaybeSignalValues<Parameters<Array<T[number]>["reverse"]>>
    ) =>
      signalUpdator((newValue) =>
        newValue.reverse(...getPlainMethodParams(...args)),
      ),
    toSorted: (
      ...args: MaybeSignalValues<Parameters<Array<T[number]>["sort"]>>
    ) =>
      signalUpdator((newValue) =>
        newValue.sort(...getPlainMethodParams(...args)),
      ),
    toSpliced: (
      ...args: MaybeSignalValues<Parameters<Array<T[number]>["splice"]>>
    ) =>
      signalUpdator((newValue) =>
        newValue.splice(...getPlainMethodParams(...args)),
      ),
    unshift: (
      ...args: MaybeSignalValues<Parameters<Array<T[number]>["unshift"]>>
    ) =>
      signalUpdator((newValue) =>
        newValue.unshift(...getPlainMethodParams(...args)),
      ),
  };
};

/**
 * Creates intrinsic non-mutating methods for array signals.
 *
 * These methods mirror JavaScript Array non-mutating methods but return
 * derived signals instead of plain values.
 *
 * @template T - The array type
 * @param baseArraySignal - The base array signal to access values from
 * @returns Intrinsic non-mutating methods for array signals
 *
 * @remarks
 * - Live bases return reactive derived signals
 * - Dead bases return dead-signal snapshots
 */
export const getArrayIntrinsicNonMutatingMethods = <
  InputSignal extends InputSignalType,
  T extends any[],
>(
  baseArraySignal: BaseSignal<T>,
): ArrayIntrinsicNonMutatingMethods<InputSignal, T> => {
  const deriveFromBase = getArrayMethodDeriver<InputSignal>(baseArraySignal);

  return {
    at: (...args: MaybeSignalValues<Parameters<Array<T[number]>["at"]>>) =>
      deriveFromBase(
        () =>
          baseArraySignal.value.at(...getPlainMethodParams(...args)) as
            | T[number]
            | undefined,
      ),
    concat: (
      ...args: MaybeSignalValues<Parameters<Array<T[number]>["concat"]>>
    ) =>
      deriveFromBase(
        () =>
          baseArraySignal.value.concat(
            ...getPlainMethodParams(...args),
          ) as T[number][],
      ),
    every: (
      ...args: MaybeSignalValues<Parameters<Array<T[number]>["every"]>>
    ) =>
      deriveFromBase(() =>
        baseArraySignal.value.every(...getPlainMethodParams(...args)),
      ),
    filter: (
      ...args: MaybeSignalValues<Parameters<Array<T[number]>["filter"]>>
    ) =>
      deriveFromBase(
        () =>
          baseArraySignal.value.filter(
            ...getPlainMethodParams(...args),
          ) as T[number][],
      ),
    find: (...args: MaybeSignalValues<Parameters<Array<T[number]>["find"]>>) =>
      deriveFromBase(
        () =>
          baseArraySignal.value.find(...getPlainMethodParams(...args)) as
            | T[number]
            | undefined,
      ),
    findIndex: (
      ...args: MaybeSignalValues<Parameters<Array<T[number]>["findIndex"]>>
    ) =>
      deriveFromBase(() =>
        baseArraySignal.value.findIndex(...getPlainMethodParams(...args)),
      ),
    findLast: (
      ...args: MaybeSignalValues<Parameters<Array<T[number]>["findLast"]>>
    ) =>
      deriveFromBase(
        () =>
          baseArraySignal.value.findLast(...getPlainMethodParams(...args)) as
            | T[number]
            | undefined,
      ),
    findLastIndex: (
      ...args: MaybeSignalValues<Parameters<Array<T[number]>["findLastIndex"]>>
    ) =>
      deriveFromBase(() =>
        baseArraySignal.value.findLastIndex(...getPlainMethodParams(...args)),
      ),
    length: () => deriveFromBase(() => baseArraySignal.value.length),
    map: <U>(mapFn: (item: T[number], index: number, array: T) => U) =>
      deriveFromBase(() => baseArraySignal.value.map(mapFn as any) as U[]),
    reduce: <U>(
      reducerFn: (
        previousValue: U,
        currentValue: T[number],
        currentIndex: number,
        array: T,
      ) => U,
      initialValue: MaybeSignal<U>,
    ) =>
      deriveFromBase(
        () =>
          baseArraySignal.value.reduce(
            reducerFn as any,
            value(initialValue),
          ) as U,
      ),
    reduceRight: <U>(
      reducerFn: (
        previousValue: U,
        currentValue: T[number],
        currentIndex: number,
        array: T,
      ) => U,
      initialValue: MaybeSignal<U>,
    ) =>
      deriveFromBase(
        () =>
          baseArraySignal.value.reduceRight(
            reducerFn as any,
            value(initialValue),
          ) as U,
      ),
    some: (...args: MaybeSignalValues<Parameters<Array<T[number]>["some"]>>) =>
      deriveFromBase(() =>
        baseArraySignal.value.some(...getPlainMethodParams(...args)),
      ),
    toReversed: (
      ...args: MaybeSignalValues<Parameters<Array<T[number]>["toReversed"]>>
    ) =>
      deriveFromBase(
        () =>
          baseArraySignal.value.toReversed(
            ...getPlainMethodParams(...args),
          ) as T[number][],
      ),
    toSorted: (
      ...args: MaybeSignalValues<Parameters<Array<T[number]>["toSorted"]>>
    ) =>
      deriveFromBase(
        () =>
          baseArraySignal.value.toSorted(
            ...getPlainMethodParams(...args),
          ) as T[number][],
      ),
    toSpliced: (
      ...args: MaybeSignalValues<Parameters<Array<T[number]>["toSpliced"]>>
    ) =>
      deriveFromBase(
        () =>
          baseArraySignal.value.toSpliced(
            ...getPlainMethodParams(...args),
          ) as T[number][],
      ),
  };
};

/**
 * Creates custom non-mutating methods for array signals.
 *
 * These are library-specific methods that provide additional functionality
 * beyond JavaScript's intrinsic array methods.
 *
 * @template T - The array type
 * @param baseArraySignal - The base array signal to access values from
 * @returns Custom non-mutating methods for array signals
 *
 * @remarks
 * - `lastItem` returns the matching signal kind for the last array element
 * - `partition` splits an array into two signals matching the base kind
 */
export const getArrayCustomNonMutatingMethods = <
  InputSignal extends InputSignalType,
  T extends any[],
>(
  baseArraySignal: BaseSignal<T>,
): ArrayCustomNonMutatingMethods<InputSignal, T> => {
  const deriveFromBase = getArrayMethodDeriver<InputSignal>(baseArraySignal);

  return {
    lastItem: () => {
      return deriveFromBase(() => {
        const updatedArr = newVal(baseArraySignal.value);
        const returnVal = updatedArr.pop() as T[number] | undefined;
        return returnVal;
      });
    },
    partition: (
      ...args: MaybeSignalValues<Parameters<Array<T[number]>["filter"]>>
    ) => {
      const conditionPassArray = deriveFromBase(
        () =>
          baseArraySignal.value.filter(...getPlainMethodParams(...args)) as T,
      );
      const conditionFailArray = deriveFromBase(
        () =>
          baseArraySignal.value.filter(
            (item, index, array) =>
              !args[0].call(value(args[1]), item, index, array),
          ) as T,
      );
      return [conditionPassArray, conditionFailArray];
    },
  };
};

/**
 * Creates combined non-mutating methods for array signals.
 *
 * Combines intrinsic, custom, and logical non-mutating methods into a single object.
 *
 * @template T - The array type
 * @param baseArraySignal - The base array signal to access values from
 * @returns Combined non-mutating methods for array signals
 *
 * @remarks
 * - Live bases return reactive derived signals
 * - Dead bases return dead-signal snapshots
 */
export const getArrayNonMutatingMethods = <
  InputSignal extends InputSignalType,
  T extends any[],
>(
  baseArraySignal: BaseSignal<T>,
): ArrayNonMutatingMethods<InputSignal, T> => ({
  ...getArrayIntrinsicNonMutatingMethods<InputSignal, T>(baseArraySignal),
  ...getArrayCustomNonMutatingMethods<InputSignal, T>(baseArraySignal),
});

/**
 * Creates combined methods for array source signals.
 *
 * Combines mutating and non-mutating methods for array source signals.
 *
 * @template T - The array type
 * @param valueSetter - Updates the signal value and triggers effects
 * @param baseArraySignal - The base array signal to access values from
 * @returns Combined methods for array source signals
 *
 * @remarks
 * - Non-mutating methods return derived signals
 * - Mutating methods create new arrays internally but feel mutable
 */
export const getArrayMutatingAndNonMutatingMethods = <
  InputSignal extends InputSignalType,
  T extends any[],
>(
  baseArraySignal: BaseSignal<T>,
): ArrayMutatingAndNonMutatingMethods<InputSignal, T> => ({
  mutate: { ...getArrayMutatingMethods(baseArraySignal) },
  ...getArrayNonMutatingMethods<InputSignal, T>(baseArraySignal),
});
