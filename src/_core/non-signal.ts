/**
 * A runtime type wrapper for plain values.
 *
 * NonSignal objects are used for runtime type discrimination in complex
 * type scenarios where TypeScript's compile-time types are insufficient.
 * They enable distinguishing between plain values and signalified objects
 * at runtime.
 *
 * @template T - The type of value wrapped
 *
 * @remarks
 * - Used with `MaybeSignal` types to resolve ambiguity at runtime
 * - Has a `type: "non-signal"` property for runtime type checking
 * - The `value` property holds the wrapped plain value
 *
 * @see {@link Signal} - For signal objects
 * @see {@link MaybeSignal} - For union types that include signals
 * @see {@link getNonSignalObject} - For creating NonSignal objects
 */
export type NonSignal<T> = {
  /** Runtime type discriminator for non-signal objects */
  type: "non-signal";
  /** The wrapped plain value */
  get value(): T;
};

/**
 * Wraps a plain value in a NonSignal object for runtime type discrimination.
 *
 * This function is useful when you need to explicitly mark a value as a
 * non-signal for runtime type checking in complex type scenarios.
 *
 * @template T - The type of value to wrap
 * @param input - Any JavaScript value to wrap
 * @returns A NonSignal object with the wrapped value
 *
 * @example
 * ```typescript
 * const nonSig = getNonSignalObject(42);
 * console.log(nonSig.type); // "non-signal"
 * console.log(nonSig.value); // 42
 * ```
 *
 * @remarks
 * - Used for runtime type checking in complex type scenarios
 * - Enables distinguishing between plain values and signalified objects
 * - The wrapped value can be any JavaScript type
 *
 * @see {@link NonSignal} - The NonSignal type
 * @see {@link valueIsNonSignalObject} - For checking if a value is a NonSignal
 */
export const getNonSignalObject = <T>(input: T): NonSignal<T> => {
  return {
    type: "non-signal",
    value: input,
  };
};
