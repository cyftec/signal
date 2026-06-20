import { newVal } from "@cyftech/immutjs";
import { derive } from "../../derive";
import {
  ArraySignalCustomMutatingMethodsObject,
  ArraySignalCustomNonMutatingMethodsObject,
  ArraySignalIntrinsicMutatingMethodsObject,
  ArraySignalIntrinsicNonMutatingMethodsObject,
  ArraySignalMutatingMethodsObject,
  ArraySignalNonMutatingMethodsObject,
  ArraySourceSignalMethodsObject,
  BaseSignal,
} from "../types";

export const getArraySignalIntrinsicMutatingMethodsObject = <T extends any[]>(
  valueSetter: (method: (oldValue: T) => T) => void,
): ArraySignalIntrinsicMutatingMethodsObject<T> => {
  const mutator = (mutate: (newVal: T) => void): void =>
    valueSetter((oldValue: T) => {
      const newValue = Array.from(oldValue) as T;
      mutate(newValue);
      return newValue;
    });

  return {
    copyWithin: (...args: Parameters<Array<T[number]>["copyWithin"]>) =>
      mutator((newValue) => newValue.copyWithin(...args)),
    fill: (...args: Parameters<Array<T[number]>["fill"]>) =>
      mutator((newValue) => newValue.fill(...args)),
    pop: (...args: Parameters<Array<T[number]>["pop"]>) =>
      mutator((newValue) => newValue.pop(...args)),
    push: (...args: Parameters<Array<T[number]>["push"]>) =>
      mutator((newValue) => newValue.push(...args)),
    reverse: (...args: Parameters<Array<T[number]>["reverse"]>) =>
      mutator((newValue) => newValue.reverse(...args)),
    shift: (...args: Parameters<Array<T[number]>["shift"]>) =>
      mutator((newValue) => newValue.shift(...args)),
    sort: (...args: Parameters<Array<T[number]>["sort"]>) =>
      mutator((newValue) => newValue.sort(...args)),
    splice: (...args: Parameters<Array<T[number]>["splice"]>) =>
      mutator((newValue) => newValue.splice(...args)),
    unshift: (...args: Parameters<Array<T[number]>["unshift"]>) =>
      mutator((newValue) => newValue.unshift(...args)),
  };
};

export const getArraySignalCustomMutatingMethodsObject = <T extends any[]>(
  valueSetter: (method: (oldValue: T) => T) => void,
): ArraySignalCustomMutatingMethodsObject<T> => ({
  /** Keeps items where the predicate returns true. */
  keep: (...args: Parameters<Array<T[number]>["filter"]>) =>
    valueSetter((oldValue: T) => {
      return oldValue.filter(...args) as T;
    }),
  /** Removes items where the predicate returns true. */
  remove: (...args: Parameters<Array<T[number]>["filter"]>) => {
    const predicate = args[0];
    const negativeLogicPredicate = (
      ...predicateArgs: Parameters<typeof predicate>
    ) => !predicate(...predicateArgs);
    args[0] = negativeLogicPredicate;
    valueSetter((oldValue: T) => {
      return oldValue.filter(...args) as T;
    });
  },
});

export const getArraySignalMutatingMethodsObject = <T extends any[]>(
  valueSetter: (method: (oldValue: T) => T) => void,
): ArraySignalMutatingMethodsObject<T> => ({
  ...getArraySignalIntrinsicMutatingMethodsObject(valueSetter),
  ...getArraySignalCustomMutatingMethodsObject(valueSetter),
});

export const getArraySignalIntrinsicNonMutatingMethodsObject = <
  T extends any[],
>(
  baseArraySignal: BaseSignal<T>,
): ArraySignalIntrinsicNonMutatingMethodsObject<T> => {
  return {
    at: (...args: Parameters<Array<T[number]>["at"]>) =>
      derive(() => baseArraySignal.value.at(...args)),
    concat: (...args: Parameters<Array<T[number]>["concat"]>) =>
      derive(() => baseArraySignal.value.concat(...args)),
    every: (...args: Parameters<Array<T[number]>["every"]>) =>
      derive(() => baseArraySignal.value.every(...args)),
    filter: (...args: Parameters<Array<T[number]>["filter"]>) =>
      derive(() => baseArraySignal.value.filter(...args)),
    find: (...args: Parameters<Array<T[number]>["find"]>) =>
      derive(() => baseArraySignal.value.find(...args)),
    findIndex: (...args: Parameters<Array<T[number]>["findIndex"]>) =>
      derive(() => baseArraySignal.value.findIndex(...args)),
    findLast: (...args: Parameters<Array<T[number]>["findLast"]>) =>
      derive(() => baseArraySignal.value.findLast(...args)),
    findLastIndex: (...args: Parameters<Array<T[number]>["findLastIndex"]>) =>
      derive(() => baseArraySignal.value.findLastIndex(...args)),
    get length() {
      return derive(() => baseArraySignal.value.length);
    },
    map: <U>(mapFn: (item: T[number], index: number, array: T) => U) =>
      derive(() => baseArraySignal.value.map(mapFn as any) as U[]),
    reduce: <U>(
      reducerFn: (
        previousValue: U,
        currentValue: T[number],
        currentIndex: number,
        array: T,
      ) => U,
      initialValue: U,
    ) =>
      derive(
        () => baseArraySignal.value.reduce(reducerFn as any, initialValue) as U,
      ),
    reduceRight: <U>(
      reducerFn: (
        previousValue: U,
        currentValue: T[number],
        currentIndex: number,
        array: T,
      ) => U,
      initialValue: U,
    ) =>
      derive(
        () =>
          baseArraySignal.value.reduceRight(
            reducerFn as any,
            initialValue,
          ) as U,
      ),
    some: (...args: Parameters<Array<T[number]>["some"]>) =>
      derive(() => baseArraySignal.value.some(...args)),
    toReversed: (...args: Parameters<Array<T[number]>["toReversed"]>) =>
      derive(() => baseArraySignal.value.toReversed(...args)),
    toSorted: (...args: Parameters<Array<T[number]>["toSorted"]>) =>
      derive(() => baseArraySignal.value.toSorted(...args)),
    toSpliced: (...args: Parameters<Array<T[number]>["toSpliced"]>) =>
      derive(() => baseArraySignal.value.toSpliced(...args)),
  };
};

export const getArraySignalCustomNonMutatingMethodsObject = <T extends any[]>(
  baseArraySignal: BaseSignal<T>,
): ArraySignalCustomNonMutatingMethodsObject<T> => {
  return {
    get lastItem() {
      return derive(() => {
        const updatedArr = newVal(baseArraySignal.value);
        const returnVal = updatedArr.pop();
        return returnVal;
      });
    },
    partition: (...args: Parameters<Array<T[number]>["filter"]>) => {
      const conditionPassArray = derive(
        () => baseArraySignal.value.filter(...args) as T,
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
 * Creates non-mutating array methods that work with any signal (source or derived).
 *
 * @template T - The array type
 * @param signal - Any signal with a .value property (source or derived)
 * @returns Non-mutating array methods that return derived signals
 *
 * @remarks
 * - All methods return new derived signals
 * - Works with both source and derived signals
 * - No mutating methods
 */
export const getArraySignalNonMutatingMethodsObject = <T extends any[]>(
  baseArraySignal: BaseSignal<T>,
): ArraySignalNonMutatingMethodsObject<T> => ({
  ...getArraySignalIntrinsicNonMutatingMethodsObject(baseArraySignal),
  ...getArraySignalCustomNonMutatingMethodsObject(baseArraySignal),
});

/**
 * Creates array mutation methods for array signals.
 *
 * Each mutation method copies the current array, applies the mutation, and
 * forwards the result to the caller-provided setter.
 *
 * @template T - The array type
 * @param valueSetter - Updates the signal value and triggers effects
 * @param baseArraySignal - The original base array signal object for accessing .value in derived methods
 * @returns Array signal with methods for either mutating the signal or getting derived signals
 *
 * @remarks
 * - Mutating methods create new arrays internally but expose a mutable-style API
 * - The `remove()` method deletes matching items rather than keeping them
 * - Non-mutating methods return derived signals
 * - `Array.from()` is used to create a shallow copy before mutation
 */
export const getArraySourceSignalMethodsObject = <T extends any[]>(
  valueSetter: (method: (oldValue: T) => T) => void,
  baseArraySignal: BaseSignal<T>,
): ArraySourceSignalMethodsObject<T> => ({
  ...getArraySignalMutatingMethodsObject(valueSetter),
  ...getArraySignalNonMutatingMethodsObject(baseArraySignal),
});
