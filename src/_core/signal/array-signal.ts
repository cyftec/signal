import { BaseArraySignal } from "./types";

/**
 * Creates array mutation methods for array signals.
 *
 * Each mutation method copies the current array, applies the mutation, and
 * forwards the result to the caller-provided setter.
 *
 * @template T - The array type
 * @param valueSetter - Updates the signal value and triggers effects
 * @returns Array mutation methods for the signal value
 *
 * @remarks
 * - Methods create new arrays internally but expose a mutable-style API
 * - The `remove()` method deletes matching items rather than keeping them
 * - `Array.from()` is used to create a shallow copy before mutation
 */
export const getArraySignalBaseObject = <T extends any[]>(
  valueSetter: (method: (oldValue: T) => T) => void
): BaseArraySignal<T> => {
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
  };
};
