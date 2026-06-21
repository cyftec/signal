import { type DerivedSignal, signal } from "../_core";
import { props } from "./props";

/**
 * Creates promise state signals for async operations.
 *
 * This function returns a tuple containing a promise runner function and three
 * derived signals that track the promise's state: result, error, and running status.
 *
 * @template R - The type of the promise result
 * @template Args - The type of the promise function's arguments
 * @template I - The type of the initial value
 * @param promiseFn - A promise-returning function
 * @param initialValue - Optional initial value for the result signal
 * @param ultimately - Optional callback to run in the promise's finally block
 * @returns A tuple of:
 * - `runPromise`: Function to run the promise
 * - `result`: Derived signal of the promise result
 * - `error`: Derived signal of the promise error
 * - `isRunning`: Derived signal of whether the promise is running
 *
 * @example
 * ```typescript
 * const promiseFn = async (value: number) => value * 2;
 * const [runPromise, result, error, isRunning] = promstates(promiseFn, 0);
 *
 * await runPromise(5);
 * console.log(result.value); // 10
 * console.log(error.value); // undefined
 *
 * await runPromise(-1); // Assume this throws
 * console.log(result.value); // 10 (preserved)
 * console.log(error.value); // Error instance
 *
 * // Best practice: always check error first
 * if (error.value) {
 *   console.error(error.value);
 * } else {
 *   console.log(result.value);
 * }
 * ```
 *
 * @remarks
 * - On success: `result` is updated and `error` is cleared
 * - On failure: `error` is updated and `result` preserves the previous successful result
 * - The `ultimately` callback runs in the finally block
 * - The promise can be run multiple times
 * - If no initial value is provided, the result signal starts as `undefined`
 * - If the promise fails multiple times, the last successful result is preserved
 *
 * @see {@link DerivedSignal} - For the derived signal type
 */
export const promstates = <R, Args extends Array<any>, I>(
  promiseFn: (...args: Args) => Promise<R>,
  initialValue?: I,
  ultimately?: () => void,
): readonly [
  /**
   * Promise runner method which takes the same arguments as the original promise
   * but returns `Promise<void>`.
   */
  (...args: Args) => Promise<void>,
  /** Derived signal of result of the promise. */
  DerivedSignal<unknown extends I ? R | undefined : R | I>,
  /** Derived signal of promise error. */
  DerivedSignal<Error | undefined>,
  /** Derived signal of whether promise is currently running or not */
  DerivedSignal<boolean>,
] => {
  type PromState = {
    isRunning: boolean;
    result: unknown extends I ? R | undefined : R | I;
    error: Error | undefined;
  };
  const state = signal<PromState>({
    isRunning: false,
    result: (initialValue || undefined) as unknown extends I
      ? R | undefined
      : R | I,
    error: undefined,
  });

  const runPromise = (...args: Args) =>
    promiseFn(...args)
      .then((res) => {
        state.value = {
          isRunning: false,
          result: res,
          error: undefined,
        };
      })
      .catch((e) => {
        const prevResult = state.value.result;
        /**
         * Result preservation on error:
         *
         * The result is NOT set to undefined or initialValue when an error occurs.
         * This design choice ensures that if the promise is run multiple times and
         * fails on the nth run, the result from the (n-1)th successful run is preserved.
         *
         * Best practice: Always check error first while using promstates.
         * Rationale: If the promise fails on a subsequent run, the previous successful
         * result remains intact and accessible, while the error signal is updated with
         * the current error.
         *
         * Note: The error signal is always reset to undefined on success. There is no
         * value in preserving the error from the last run when a new success occurs.
         */
        state.value = {
          isRunning: false,
          result: prevResult,
          error: e,
        };
      })
      .finally(ultimately);

  const { isRunning, result, error } = props(state).allAlive();
  return [runPromise, result, error, isRunning] as const;
};
