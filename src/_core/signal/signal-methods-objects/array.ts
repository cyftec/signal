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

/**
 * Creates combined mutating methods for array signals.
 *
 * Combines intrinsic and custom mutating methods into a single object.
 *
 * @template T - The array type
 * @param valueSetter - Updates the signal value and triggers effects
 * @returns Combined mutating methods for array signals
 */
export const getArraySignalMutatingMethodsObject = <T extends any[]>(
  valueSetter: (method: (oldValue: T) => T) => void,
): ArraySignalMutatingMethodsObject<T> => ({
  ...getArraySignalIntrinsicMutatingMethodsObject(valueSetter),
  ...getArraySignalCustomMutatingMethodsObject(valueSetter),
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
 * Creates combined non-mutating methods for array signals.
 *
 * Combines intrinsic and custom non-mutating methods into a single object.
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
export const getArraySignalNonMutatingMethodsObject = <T extends any[]>(
  baseArraySignal: BaseSignal<T>,
): ArraySignalNonMutatingMethodsObject<T> => ({
  ...getArraySignalIntrinsicNonMutatingMethodsObject(baseArraySignal),
  ...getArraySignalCustomNonMutatingMethodsObject(baseArraySignal),
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
export const getArraySourceSignalMethodsObject = <T extends any[]>(
  valueSetter: (method: (oldValue: T) => T) => void,
  baseArraySignal: BaseSignal<T>,
): ArraySourceSignalMethodsObject<T> => ({
  ...getArraySignalMutatingMethodsObject(valueSetter),
  ...getArraySignalNonMutatingMethodsObject(baseArraySignal),
});
