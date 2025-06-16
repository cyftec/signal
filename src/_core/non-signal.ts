/**
 * It is the object format, similar to that Signal object.
 *
 * Using MaybeSignal adds a level of ambiguity to the incoming variable. During
 * compile time TypeScript is smart enough to differentiate between type T
 * and Signal<T> for a given MaybeSignal<T>. But at runtime it becomes more cumbersome.
 * For such scenarios, this object is useful.
 *
 * @see Signal
 * @see MaybeSignal
 *
 */
export type NonSignal<T> = {
  type: "non-signal";
  get value(): T;
};

/**
 * A handy method to convert a plain value to non-signal object of
 * that value
 *
 * @param input any value of valid type
 * @returns non-signal object
 */
export const getNonSignalObject = <T>(input: T): NonSignal<T> => {
  return {
    type: "non-signal",
    value: input,
  };
};
