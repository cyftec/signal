import { newVal } from "@cyftec/immut";
import { getPlainMethodParams, value } from "../../utils";
import { BaseSignal, derive, MaybeSignal, MaybeSignalValues } from "../signals";
import {
  ArrayCustomMutatingMethods,
  ArrayCustomNonMutatingMethods,
  ArrayIntrinsicMutatingMethods,
  ArrayIntrinsicNonMutatingMethods,
  ArrayMutatingAndNonMutatingMethods,
  ArrayMutatingMethods,
  ArrayNonMutatingMethods,
} from "./types";

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
export const getArrayIntrinsicMutatingMethods = <T extends any[]>(
  baseArraySignal: BaseSignal<T>,
): ArrayIntrinsicMutatingMethods<T> => {
  const signalUpdator = (mutatorMethod: (newVal: T) => void): void =>
    baseArraySignal.mutate((oldValue: T) => {
      const newValue = Array.from(oldValue) as T;
      mutatorMethod(newValue);
      return newValue;
    });

  return {
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
    pop: (...args: MaybeSignalValues<Parameters<Array<T[number]>["pop"]>>) =>
      signalUpdator((newValue) =>
        newValue.pop(...getPlainMethodParams(...args)),
      ),
    push: (...args: MaybeSignalValues<Parameters<Array<T[number]>["push"]>>) =>
      signalUpdator((newValue) =>
        newValue.push(...getPlainMethodParams(...args)),
      ),
    reverse: (
      ...args: MaybeSignalValues<Parameters<Array<T[number]>["reverse"]>>
    ) =>
      signalUpdator((newValue) =>
        newValue.reverse(...getPlainMethodParams(...args)),
      ),
    shift: (
      ...args: MaybeSignalValues<Parameters<Array<T[number]>["shift"]>>
    ) =>
      signalUpdator((newValue) =>
        newValue.shift(...getPlainMethodParams(...args)),
      ),
    sort: (...args: MaybeSignalValues<Parameters<Array<T[number]>["sort"]>>) =>
      signalUpdator((newValue) =>
        newValue.sort(...getPlainMethodParams(...args)),
      ),
    splice: (
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
 * Creates custom mutating methods for array signals.
 *
 * These are library-specific methods that provide additional functionality
 * beyond JavaScript's intrinsic array methods.
 *
 * @template T - The array type
 * @param valueSetter - Updates the signal value and triggers effects
 * @returns Custom mutating methods for array signals
 *
 * @remarks
 * - `keep()` is the inverse of `filter()` - keeps items matching the predicate
 * - `remove()` deletes items matching the predicate
 */
export const getArrayCustomMutatingMethods = <T extends any[]>(
  baseArraySignal: BaseSignal<T>,
): ArrayCustomMutatingMethods<T> => ({
  /** Keeps items where the predicate returns true. */
  keep: (...args: MaybeSignalValues<Parameters<Array<T[number]>["filter"]>>) =>
    baseArraySignal.mutate((oldValue: T) => {
      return oldValue.filter(...getPlainMethodParams(...args)) as T;
    }),
  /** Removes items where the predicate returns true. */
  remove: (
    ...args: MaybeSignalValues<Parameters<Array<T[number]>["filter"]>>
  ) => {
    const predicate = args[0];
    const negativeLogicPredicate = (
      ...predicateArgs: Parameters<typeof predicate>
    ) => !predicate(...predicateArgs);
    args[0] = negativeLogicPredicate;
    baseArraySignal.mutate((oldValue: T) => {
      return oldValue.filter(...getPlainMethodParams(...args)) as T;
    });
  },
});

/**
 * Creates combined mutating methods for array signals.
 *
 * Combines intrinsic and custom mutating methods into a single object.
 *
 * @template T - The array type
 * @param valueSetter - Updates the signal value and triggers effects
 * @returns Combined mutating methods for array signals
 */
export const getArrayMutatingMethods = <T extends any[]>(
  baseArraySignal: BaseSignal<T>,
): ArrayMutatingMethods<T> => ({
  ...getArrayIntrinsicMutatingMethods(baseArraySignal),
  ...getArrayCustomMutatingMethods(baseArraySignal),
});

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
 * - All methods return derived signals
 * - Methods are reactive and update when the source array changes
 * - Works with both source and derived signals
 */
export const getArrayIntrinsicNonMutatingMethods = <T extends any[]>(
  baseArraySignal: BaseSignal<T>,
): ArrayIntrinsicNonMutatingMethods<T> => {
  return {
    at: (...args: MaybeSignalValues<Parameters<Array<T[number]>["at"]>>) =>
      derive(
        () =>
          baseArraySignal.value.at(...getPlainMethodParams(...args)) as
            | T[number]
            | undefined,
      ),
    concat: (
      ...args: MaybeSignalValues<Parameters<Array<T[number]>["concat"]>>
    ) =>
      derive(
        () =>
          baseArraySignal.value.concat(
            ...getPlainMethodParams(...args),
          ) as T[number][],
      ),
    every: (
      ...args: MaybeSignalValues<Parameters<Array<T[number]>["every"]>>
    ) =>
      derive(() =>
        baseArraySignal.value.every(...getPlainMethodParams(...args)),
      ),
    filter: (
      ...args: MaybeSignalValues<Parameters<Array<T[number]>["filter"]>>
    ) =>
      derive(
        () =>
          baseArraySignal.value.filter(
            ...getPlainMethodParams(...args),
          ) as T[number][],
      ),
    find: (...args: MaybeSignalValues<Parameters<Array<T[number]>["find"]>>) =>
      derive(
        () =>
          baseArraySignal.value.find(...getPlainMethodParams(...args)) as
            | T[number]
            | undefined,
      ),
    findIndex: (
      ...args: MaybeSignalValues<Parameters<Array<T[number]>["findIndex"]>>
    ) =>
      derive(() =>
        baseArraySignal.value.findIndex(...getPlainMethodParams(...args)),
      ),
    findLast: (
      ...args: MaybeSignalValues<Parameters<Array<T[number]>["findLast"]>>
    ) =>
      derive(
        () =>
          baseArraySignal.value.findLast(...getPlainMethodParams(...args)) as
            | T[number]
            | undefined,
      ),
    findLastIndex: (
      ...args: MaybeSignalValues<Parameters<Array<T[number]>["findLastIndex"]>>
    ) =>
      derive(() =>
        baseArraySignal.value.findLastIndex(...getPlainMethodParams(...args)),
      ),
    length: () => derive(() => baseArraySignal.value.length),
    map: <U>(mapFn: (item: T[number], index: number, array: T) => U) =>
      derive(() => baseArraySignal.value.map(mapFn as any) as U[]),
    reduce: <U>(
      reducerFn: (
        previousValue: U,
        currentValue: T[number],
        currentIndex: number,
        array: T,
      ) => U,
      initialValue: MaybeSignal<U>,
    ) =>
      derive(
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
      derive(
        () =>
          baseArraySignal.value.reduceRight(
            reducerFn as any,
            value(initialValue),
          ) as U,
      ),
    some: (...args: MaybeSignalValues<Parameters<Array<T[number]>["some"]>>) =>
      derive(() =>
        baseArraySignal.value.some(...getPlainMethodParams(...args)),
      ),
    toReversed: (
      ...args: MaybeSignalValues<Parameters<Array<T[number]>["toReversed"]>>
    ) =>
      derive(
        () =>
          baseArraySignal.value.toReversed(
            ...getPlainMethodParams(...args),
          ) as T[number][],
      ),
    toSorted: (
      ...args: MaybeSignalValues<Parameters<Array<T[number]>["toSorted"]>>
    ) =>
      derive(
        () =>
          baseArraySignal.value.toSorted(
            ...getPlainMethodParams(...args),
          ) as T[number][],
      ),
    toSpliced: (
      ...args: MaybeSignalValues<Parameters<Array<T[number]>["toSpliced"]>>
    ) =>
      derive(
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
 * - `lastItem` returns a derived signal for the last array element
 * - `partition` splits an array into two derived signals based on a predicate
 */
export const getArrayCustomNonMutatingMethods = <T extends any[]>(
  baseArraySignal: BaseSignal<T>,
): ArrayCustomNonMutatingMethods<T> => {
  return {
    lastItem: () => {
      return derive(() => {
        const updatedArr = newVal(baseArraySignal.value);
        const returnVal = updatedArr.pop() as T[number] | undefined;
        return returnVal;
      });
    },
    partition: (
      ...args: MaybeSignalValues<Parameters<Array<T[number]>["filter"]>>
    ) => {
      const conditionPassArray = derive(
        () =>
          baseArraySignal.value.filter(...getPlainMethodParams(...args)) as T,
      );
      const conditionFailArray = derive(
        () =>
          baseArraySignal.value.filter(
            (item, index, array) => !args[0](item, index, array),
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
 * - All methods return derived signals
 * - Works with both source and derived signals
 * - Methods are reactive and update when the source array changes
 */
export const getArrayNonMutatingMethods = <T extends any[]>(
  baseArraySignal: BaseSignal<T>,
): ArrayNonMutatingMethods<T> => ({
  ...getArrayIntrinsicNonMutatingMethods(baseArraySignal),
  ...getArrayCustomNonMutatingMethods(baseArraySignal),
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
export const getArrayMutatingAndNonMutatingMethods = <T extends any[]>(
  baseArraySignal: BaseSignal<T>,
): ArrayMutatingAndNonMutatingMethods<T> => ({
  ...getArrayMutatingMethods(baseArraySignal),
  ...getArrayNonMutatingMethods(baseArraySignal),
});
