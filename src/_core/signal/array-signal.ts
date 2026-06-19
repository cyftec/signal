import { BaseArraySignal } from "./types";

/**
 * Creates array mutation methods for array signals.
 *
 * This function implements a mutator pattern that wraps standard array methods
 * to work with immutable values. Each mutation method:
 * 1. Creates a copy of the current array (to maintain immutability)
 * 2. Applies the mutation to the copy
 * 3. Calls valueSetter with the new array
 * 4. Triggers effects via valueSetter
 *
 * The `remove()` method is custom - it's the inverse of filter, removing items
 * where the predicate returns true (rather than keeping them).
 *
 * @template T - The array type
 * @param valueSetter - A function that updates the signal's value and triggers effects
 * @returns An object with array mutation methods
 *
 * @remarks
 * - All methods create new arrays internally but feel mutable to the user
 * - The `remove()` method inverts the predicate logic to remove matching items
 * - Methods use Array.from() to create shallow copies before mutation
 */
export const getArraySignalBaseObject = <T extends any[]>(
  valueSetter: (method: (oldValue: T) => T) => void
): BaseArraySignal<T> => {
  /**
   * Mutator wrapper that creates a copy, applies mutation, and updates the signal.
   *
   * This pattern ensures immutability while providing a mutable-style API.
   * The mutator function receives a copy of the array, mutates it, and the
   * result is passed to valueSetter which triggers effects.
   */
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
    /**
     * Custom method: removes items where the predicate returns true.
     *
     * This is the inverse of filter - it removes matching items rather than keeping them.
     * The predicate is inverted internally to achieve this behavior.
     */
    remove: (...args: Parameters<Array<T[number]>["filter"]>) => {
      const predicate = args[0];
      // Invert the predicate logic: remove items where original predicate returns true
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
