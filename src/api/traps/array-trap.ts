import { newVal } from "@cyftech/immutjs";
import { derive, type MaybeSignalValue, value } from "../../_core";
import { getDesignalifiedMethodParams } from "./transforms";
import { genericTrap } from "./generic-trap";
import type { ArraySignalTrap, SignalifiedFunction } from "./types";

/**
 * A method which traps a MaybeSignalValue and returns handy derived signals
 * of most-frequently required transforms
 *
 * @param input any value for which transformed derived signal is required
 * @see MaybeSignalValue
 * @returns an object of handy transform methods as its properties, which return
 * derived signal
 */
export const arrayTrap = <T>(
  input: MaybeSignalValue<T[]>
): ArraySignalTrap<T> => {
  const SIMPLE_ARRAY_METHODS = [
    "at",
    "copyWithin",
    "fill",
    "includes",
    "indexOf",
    "join",
    "lastIndexOf",
    "slice",
    "with",
  ] as const;
  type ArrayMethodName = (typeof SIMPLE_ARRAY_METHODS)[number];
  type SimpleArrayMethods = Pick<ArraySignalTrap<T>, ArrayMethodName>;

  const simpleMethodsTrapObject = SIMPLE_ARRAY_METHODS.reduce(
    (map: SimpleArrayMethods, arrayMethod) => {
      const method: SignalifiedFunction<Array<T>[typeof arrayMethod]> = (
        ...params
      ) => {
        return derive(() => {
          const prms = getDesignalifiedMethodParams(...params);
          // @ts-ignore: A spread argument must either have a tuple type or be passed to a rest parameter.
          return value(input)[arrayMethod](...prms);
        });
      };
      map[arrayMethod] = method;
      return map;
    },
    {} as SimpleArrayMethods
  );

  return {
    ...genericTrap(input as NonNullable<T>),
    ...simpleMethodsTrapObject,
    concat: (items: MaybeSignalValue<T[]>) =>
      derive(() => value(input).concat(value(items))),
    every: (
      itemSatifiesCondition: (item: T, index: number, array: T[]) => boolean
    ) => derive(() => value(input).every(itemSatifiesCondition)),
    filter: (where: (item: T, index: number, array: T[]) => boolean) =>
      derive(() => value(input).filter(where)),
    find: (where: (item: T, index: number, array: T[]) => boolean) =>
      derive(() => value(input).find(where)),
    findIndex: (where: (item: T, index: number, array: T[]) => boolean) =>
      derive(() => value(input).findIndex(where)),
    findLast: (where: (item: T, index: number, array: T[]) => boolean) =>
      derive(() => value(input).findLast(where)),
    findLastIndex: (where: (item: T, index: number, array: T[]) => boolean) =>
      derive(() => value(input).findLastIndex(where)),
    get lastItem() {
      return derive(() => {
        const updatedArr = newVal(value(input));
        const returnVal = updatedArr.pop();
        return returnVal;
      });
    },
    get length() {
      return derive(() => value(input).length);
    },
    map: <U>(mapFn: (item: T, index: number, array: T[]) => U) =>
      derive(() => value(input).map(mapFn)),
    partition: (where: (item: T, index: number, array: T[]) => boolean) => {
      const conditionPassArray = derive(() => value(input).filter(where));
      const conditionFailArray = derive(() =>
        value(input).filter((item, index, array) => !where(item, index, array))
      );
      return [conditionPassArray, conditionFailArray];
    },
    reduce: <U>(
      reducerFn: (
        previousValue: U,
        currentValue: T,
        currentIndex: number,
        array: T[]
      ) => U,
      initialValue: U
    ) => derive(() => value(input).reduce(reducerFn, initialValue)),
    reduceRight: <U>(
      reducerFn: (
        previousValue: U,
        currentValue: T,
        currentIndex: number,
        array: T[]
      ) => U,
      initialValue: U
    ) => derive(() => value(input).reduceRight(reducerFn, initialValue)),
    get reversed() {
      return derive(() => value(input).toReversed());
    },
    some: (
      itemSatifiesCondition: (item: T, index: number, array: T[]) => boolean
    ) => derive(() => value(input).every(itemSatifiesCondition)),
    toSorted: (compareFn?: (a: T, b: T) => number) =>
      derive(() => value(input).toSorted(compareFn)),
    toSpliced: (
      start: MaybeSignalValue<number>,
      deleteCount: MaybeSignalValue<number>,
      ...newItems: T[]
    ) =>
      derive(() =>
        value(input).toSpliced(value(start), value(deleteCount), ...newItems)
      ),
  };
};
