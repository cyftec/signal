import { signal } from "../../core";
import type { DerivedSignal } from "../../types.ts";
import { dobject } from "./object.ts";

/**
 * A function to derive signalled promise states
 * @param promiseFn A promise returning function from which prmoise states will be derived
 * @param initialValue to make sure that return of promise is initialized with some value
 * @param ultimately Callback to run in 'finally' block of the promise
 * @returns promise runner function along with the derived signal states of the promise
 */
export const dpromise = <R, Args extends Array<any>, I>(
  promiseFn: (...args: Args) => Promise<R>,
  initialValue?: I,
  ultimately?: () => void
): readonly [
  /**
   * Promise runner method which takes same arguments as the original promise
   * but doesn't return the result. Instead it updates the signals of resulting
   * states of the promise, i.e. result, error or is promise currently running or not.
   */
  (...args: Args) => Promise<void>,
  /** Derived signal of result of the promise. */
  DerivedSignal<unknown extends I ? R | undefined : R | I>,
  /** Derived signal of promise error. */
  DerivedSignal<Error | undefined>,
  /** Derived signal of whether promise is currently running or not */
  DerivedSignal<boolean>
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
         * result.value is not set to undefined or 'intialValue' because, if the promise
         * is run multiple times, ideally last result.value should not be
         * overriden due to current error.
         *
         * Best Practise: Always check error first while using this method.
         * Explanation: There's a chance that promiseFn errors out when run
         * at nth time. In that case, the result of (n-1)th time is still intact
         * and not overriden. While error has some value due to promise failure
         * at the nth time.
         *
         * Notice in catch block that error.value is always reset whenever
         * there is a success. There is no point of preserving the error
         * of the last run.
         */
        state.value = {
          isRunning: false,
          result: prevResult,
          error: e,
        };
      })
      .finally(ultimately);

  const { isRunning, result, error } = dobject(state).props;
  return [runPromise, result, error, isRunning] as const;
};
