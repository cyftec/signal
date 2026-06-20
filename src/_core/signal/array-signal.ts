import { derive, type DerivedSignal } from "../derive";
import { newVal } from "@cyftech/immutjs";
import { BaseArraySignal, BaseSourceSignal, BaseDerivedArraySignal } from "./types";

/**
 * Creates non-mutating methods for derived array signals.
 *
 * @template T - The array type
 * @param derivedSignal - The derived signal to extend with array methods
 * @returns Derived signal with array methods
 *
 * @remarks
 * - All methods return new derived signals
 * - No mutating methods (derived signals are read-only)
 */
export const getDerivedArraySignalBaseObject = <T extends any[]>(
  derivedSignal: DerivedSignal<T>
): BaseDerivedArraySignal<T> => {
  return {
    // Non-mutating methods returning derived signals
    at: (...args: Parameters<Array<T[number]>["at"]>) =>
      derive(() => derivedSignal.value.at(...args)),
    concat: (...args: Parameters<Array<T[number]>["concat"]>) =>
      derive(() => derivedSignal.value.concat(...args)),
    every: (...args: Parameters<Array<T[number]>["every"]>) =>
      derive(() => derivedSignal.value.every(...args)),
    filter: (...args: Parameters<Array<T[number]>["filter"]>) =>
      derive(() => derivedSignal.value.filter(...args)),
    find: (...args: Parameters<Array<T[number]>["find"]>) =>
      derive(() => derivedSignal.value.find(...args)),
    findIndex: (...args: Parameters<Array<T[number]>["findIndex"]>) =>
      derive(() => derivedSignal.value.findIndex(...args)),
    findLast: (...args: Parameters<Array<T[number]>["findLast"]>) =>
      derive(() => derivedSignal.value.findLast(...args)),
    findLastIndex: (...args: Parameters<Array<T[number]>["findLastIndex"]>) =>
      derive(() => derivedSignal.value.findLastIndex(...args)),
    get lastItem() {
      return derive(() => {
        const updatedArr = newVal(derivedSignal.value);
        const returnVal = updatedArr.pop();
        return returnVal;
      });
    },
    get length() {
      return derive(() => derivedSignal.value.length);
    },
    map: (...args: Parameters<Array<T[number]>["map"]>) =>
      derive(() => derivedSignal.value.map(...args)),
    partition: (...args: Parameters<Array<T[number]>["filter"]>) => {
      const conditionPassArray = derive(
        () => derivedSignal.value.filter(...args) as T,
      );
      const conditionFailArray = derive(
        () =>
          derivedSignal.value.filter(
            (item, index, array) => !args[0](item, index, array),
          ) as T,
      );
      return [conditionPassArray, conditionFailArray];
    },
    reduce: (...args: Parameters<Array<T[number]>["reduce"]>) =>
      derive(() => derivedSignal.value.reduce(...args)),
    reduceRight: (...args: Parameters<Array<T[number]>["reduceRight"]>) =>
      derive(() => derivedSignal.value.reduceRight(...args)),
    some: (...args: Parameters<Array<T[number]>["some"]>) =>
      derive(() => derivedSignal.value.some(...args)),
    toReversed: (...args: Parameters<Array<T[number]>["toReversed"]>) =>
      derive(() => derivedSignal.value.toReversed(...args)),
    toSorted: (...args: Parameters<Array<T[number]>["toSorted"]>) =>
      derive(() => derivedSignal.value.toSorted(...args)),
    toSpliced: (...args: Parameters<Array<T[number]>["toSpliced"]>) =>
      derive(() => derivedSignal.value.toSpliced(...args)),
  };
};

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
export const getArraySignalBaseObject = <T extends any[]>(
  valueSetter: (method: (oldValue: T) => T) => void,
  baseArraySignal: BaseSourceSignal<T>,
): BaseArraySignal<T> => {
  const mutator = (mutate: (newVal: T) => void): void =>
    valueSetter((oldValue: T) => {
      const newValue = Array.from(oldValue) as T;
      mutate(newValue);
      return newValue;
    });

  return {
    // Mutating methods
    copyWithin: (...args: Parameters<Array<T[number]>["copyWithin"]>) =>
      mutator((newValue) => newValue.copyWithin(...args)),
    fill: (...args: Parameters<Array<T[number]>["fill"]>) =>
      mutator((newValue) => newValue.fill(...args)),
    keep: (...args: Parameters<Array<T[number]>["filter"]>) =>
      valueSetter((oldValue: T) => {
        return oldValue.filter(...args) as T;
      }),
    pop: (...args: Parameters<Array<T[number]>["pop"]>) =>
      mutator((newValue) => newValue.pop(...args)),
    push: (...args: Parameters<Array<T[number]>["push"]>) =>
      mutator((newValue) => newValue.push(...args)),
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

    // Non-mutating methods returning derived signals
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
    get lastItem() {
      return derive(() => {
        const updatedArr = newVal(baseArraySignal.value);
        const returnVal = updatedArr.pop();
        return returnVal;
      });
    },
    get length() {
      return derive(() => baseArraySignal.value.length);
    },
    map: (...args: Parameters<Array<T[number]>["map"]>) =>
      derive(() => baseArraySignal.value.map(...args)),
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
    reduce: (...args: Parameters<Array<T[number]>["reduce"]>) =>
      derive(() => baseArraySignal.value.reduce(...args)),
    reduceRight: (...args: Parameters<Array<T[number]>["reduceRight"]>) =>
      derive(() => baseArraySignal.value.reduceRight(...args)),
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
