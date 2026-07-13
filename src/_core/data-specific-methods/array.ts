import { newVal } from "@cyftec/immut";
import { getDesignalifiedMethodParams, value } from "../../utils";
import {
  derive,
  MaybeSignal,
  MaybeSignalValues,
  type BaseSignalifiedObject,
} from "../signals";
import {
  ArraySignalCustomMutatingMethodsObject,
  ArraySignalCustomNonMutatingMethodsObject,
  ArraySignalIntrinsicMutatingMethodsObject,
  ArraySignalIntrinsicNonMutatingMethodsObject,
  ArraySignalMutatingMethodsObject,
  ArraySignalNonMutatingMethodsObject,
  ArraySourceSignalMethodsObject,
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
export const getArraySignalIntrinsicMutatingMethodsObject = <T extends any[]>(
  valueSetter: (mutatorMethod: (oldValue: T) => T) => void,
): ArraySignalIntrinsicMutatingMethodsObject<T> => {
  const signalUpdator = (mutatorMethod: (newVal: T) => void): void =>
    valueSetter((oldValue: T) => {
      const newValue = Array.from(oldValue) as T;
      mutatorMethod(newValue);
      return newValue;
    });

  return {
    copyWithin: (
      ...args: MaybeSignalValues<Parameters<Array<T[number]>["copyWithin"]>>
    ) =>
      signalUpdator((newValue) =>
        newValue.copyWithin(...getDesignalifiedMethodParams(...args)),
      ),
    fill: (...args: MaybeSignalValues<Parameters<Array<T[number]>["fill"]>>) =>
      signalUpdator((newValue) =>
        newValue.fill(...getDesignalifiedMethodParams(...args)),
      ),
    pop: (...args: MaybeSignalValues<Parameters<Array<T[number]>["pop"]>>) =>
      signalUpdator((newValue) =>
        newValue.pop(...getDesignalifiedMethodParams(...args)),
      ),
    push: (...args: MaybeSignalValues<Parameters<Array<T[number]>["push"]>>) =>
      signalUpdator((newValue) =>
        newValue.push(...getDesignalifiedMethodParams(...args)),
      ),
    reverse: (
      ...args: MaybeSignalValues<Parameters<Array<T[number]>["reverse"]>>
    ) =>
      signalUpdator((newValue) =>
        newValue.reverse(...getDesignalifiedMethodParams(...args)),
      ),
    shift: (
      ...args: MaybeSignalValues<Parameters<Array<T[number]>["shift"]>>
    ) =>
      signalUpdator((newValue) =>
        newValue.shift(...getDesignalifiedMethodParams(...args)),
      ),
    sort: (...args: MaybeSignalValues<Parameters<Array<T[number]>["sort"]>>) =>
      signalUpdator((newValue) =>
        newValue.sort(...getDesignalifiedMethodParams(...args)),
      ),
    splice: (
      ...args: MaybeSignalValues<Parameters<Array<T[number]>["splice"]>>
    ) =>
      signalUpdator((newValue) =>
        newValue.splice(...getDesignalifiedMethodParams(...args)),
      ),
    unshift: (
      ...args: MaybeSignalValues<Parameters<Array<T[number]>["unshift"]>>
    ) =>
      signalUpdator((newValue) =>
        newValue.unshift(...getDesignalifiedMethodParams(...args)),
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
export const getArraySignalCustomMutatingMethodsObject = <T extends any[]>(
  valueSetter: (mutatorMethod: (oldValue: T) => T) => void,
): ArraySignalCustomMutatingMethodsObject<T> => ({
  /** Keeps items where the predicate returns true. */
  keep: (...args: MaybeSignalValues<Parameters<Array<T[number]>["filter"]>>) =>
    valueSetter((oldValue: T) => {
      return oldValue.filter(...getDesignalifiedMethodParams(...args)) as T;
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
    valueSetter((oldValue: T) => {
      return oldValue.filter(...getDesignalifiedMethodParams(...args)) as T;
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
  valueSetter: (mutatorMethod: (oldValue: T) => T) => void,
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
 * @param baseSignalifiedArrayObject - The base array signal to access values from
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
  baseSignalifiedArrayObject: BaseSignalifiedObject<T>,
): ArraySignalIntrinsicNonMutatingMethodsObject<T> => {
  return {
    at: (...args: MaybeSignalValues<Parameters<Array<T[number]>["at"]>>) =>
      derive(
        () =>
          baseSignalifiedArrayObject.value.at(
            ...getDesignalifiedMethodParams(...args),
          ) as T[number] | undefined,
      ),
    concat: (
      ...args: MaybeSignalValues<Parameters<Array<T[number]>["concat"]>>
    ) =>
      derive(
        () =>
          baseSignalifiedArrayObject.value.concat(
            ...getDesignalifiedMethodParams(...args),
          ) as T[number][],
      ),
    every: (
      ...args: MaybeSignalValues<Parameters<Array<T[number]>["every"]>>
    ) =>
      derive(() =>
        baseSignalifiedArrayObject.value.every(
          ...getDesignalifiedMethodParams(...args),
        ),
      ),
    filter: (
      ...args: MaybeSignalValues<Parameters<Array<T[number]>["filter"]>>
    ) =>
      derive(
        () =>
          baseSignalifiedArrayObject.value.filter(
            ...getDesignalifiedMethodParams(...args),
          ) as T[number][],
      ),
    find: (...args: MaybeSignalValues<Parameters<Array<T[number]>["find"]>>) =>
      derive(
        () =>
          baseSignalifiedArrayObject.value.find(
            ...getDesignalifiedMethodParams(...args),
          ) as T[number] | undefined,
      ),
    findIndex: (
      ...args: MaybeSignalValues<Parameters<Array<T[number]>["findIndex"]>>
    ) =>
      derive(() =>
        baseSignalifiedArrayObject.value.findIndex(
          ...getDesignalifiedMethodParams(...args),
        ),
      ),
    findLast: (
      ...args: MaybeSignalValues<Parameters<Array<T[number]>["findLast"]>>
    ) =>
      derive(
        () =>
          baseSignalifiedArrayObject.value.findLast(
            ...getDesignalifiedMethodParams(...args),
          ) as T[number] | undefined,
      ),
    findLastIndex: (
      ...args: MaybeSignalValues<Parameters<Array<T[number]>["findLastIndex"]>>
    ) =>
      derive(() =>
        baseSignalifiedArrayObject.value.findLastIndex(
          ...getDesignalifiedMethodParams(...args),
        ),
      ),
    length: () => derive(() => baseSignalifiedArrayObject.value.length),
    map: <U>(mapFn: (item: T[number], index: number, array: T) => U) =>
      derive(() => baseSignalifiedArrayObject.value.map(mapFn as any) as U[]),
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
          baseSignalifiedArrayObject.value.reduce(
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
          baseSignalifiedArrayObject.value.reduceRight(
            reducerFn as any,
            value(initialValue),
          ) as U,
      ),
    some: (...args: MaybeSignalValues<Parameters<Array<T[number]>["some"]>>) =>
      derive(() =>
        baseSignalifiedArrayObject.value.some(
          ...getDesignalifiedMethodParams(...args),
        ),
      ),
    toReversed: (
      ...args: MaybeSignalValues<Parameters<Array<T[number]>["toReversed"]>>
    ) =>
      derive(
        () =>
          baseSignalifiedArrayObject.value.toReversed(
            ...getDesignalifiedMethodParams(...args),
          ) as T[number][],
      ),
    toSorted: (
      ...args: MaybeSignalValues<Parameters<Array<T[number]>["toSorted"]>>
    ) =>
      derive(
        () =>
          baseSignalifiedArrayObject.value.toSorted(
            ...getDesignalifiedMethodParams(...args),
          ) as T[number][],
      ),
    toSpliced: (
      ...args: MaybeSignalValues<Parameters<Array<T[number]>["toSpliced"]>>
    ) =>
      derive(
        () =>
          baseSignalifiedArrayObject.value.toSpliced(
            ...getDesignalifiedMethodParams(...args),
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
 * @param baseSignalifiedArrayObject - The base array signal to access values from
 * @returns Custom non-mutating methods for array signals
 *
 * @remarks
 * - `lastItem` returns a derived signal for the last array element
 * - `partition` splits an array into two derived signals based on a predicate
 */
export const getArraySignalCustomNonMutatingMethodsObject = <T extends any[]>(
  baseSignalifiedArrayObject: BaseSignalifiedObject<T>,
): ArraySignalCustomNonMutatingMethodsObject<T> => {
  return {
    lastItem: () => {
      return derive(() => {
        const updatedArr = newVal(baseSignalifiedArrayObject.value);
        const returnVal = updatedArr.pop() as T[number] | undefined;
        return returnVal;
      });
    },
    partition: (
      ...args: MaybeSignalValues<Parameters<Array<T[number]>["filter"]>>
    ) => {
      const conditionPassArray = derive(
        () =>
          baseSignalifiedArrayObject.value.filter(
            ...getDesignalifiedMethodParams(...args),
          ) as T,
      );
      const conditionFailArray = derive(
        () =>
          baseSignalifiedArrayObject.value.filter(
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
 * @param baseSignalifiedArrayObject - The base array signal to access values from
 * @returns Combined non-mutating methods for array signals
 *
 * @remarks
 * - All methods return derived signals
 * - Works with both source and derived signals
 * - Methods are reactive and update when the source array changes
 */
export const getArraySignalNonMutatingMethodsObject = <T extends any[]>(
  baseSignalifiedArrayObject: BaseSignalifiedObject<T>,
): ArraySignalNonMutatingMethodsObject<T> => ({
  ...getArraySignalIntrinsicNonMutatingMethodsObject(
    baseSignalifiedArrayObject,
  ),
  ...getArraySignalCustomNonMutatingMethodsObject(baseSignalifiedArrayObject),
});

/**
 * Creates combined methods for array source signals.
 *
 * Combines mutating and non-mutating methods for array source signals.
 *
 * @template T - The array type
 * @param valueSetter - Updates the signal value and triggers effects
 * @param baseSignalifiedArrayObject - The base array signal to access values from
 * @returns Combined methods for array source signals
 *
 * @remarks
 * - Non-mutating methods return derived signals
 * - Mutating methods create new arrays internally but feel mutable
 */
export const getArraySourceSignalMethodsObject = <T extends any[]>(
  valueSetter: (method: (oldValue: T) => T) => void,
  baseArraySifiedignalObject: BaseSignalifiedObject<T>,
): ArraySourceSignalMethodsObject<T> => ({
  ...getArraySignalMutatingMethodsObject(valueSetter),
  ...getArraySignalNonMutatingMethodsObject(baseArraySifiedignalObject),
});
