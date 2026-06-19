import {
  derive,
  value,
  type DerivedSignal,
  type MaybeSignalValues,
  type PlainValues,
} from "../_core";

/**
 * Creates a derived signal from a function with signalified arguments.
 *
 * This is a convenience wrapper around `derive` that automatically unwraps
 * signal arguments before passing them to the function. The derived signal
 * recomputes whenever any of the signalified arguments changes.
 *
 * @template F - The function type
 * @param computerFn - A function that receives plain values and returns a value
 * @param restArgs - Signalified arguments matching the function parameters
 * @returns A derived signal of the function's return type
 *
 * @example
 * ```typescript
 * const a = signal(5);
 * const b = signal(3);
 * const sum = compute((x: number, y: number) => x + y, a, b);
 * console.log(sum.value); // 8
 *
 * // Mixed signals and plain values
 * const sum2 = compute((x: number, y: number) => x + y, a, 10);
 * console.log(sum2.value); // 15
 *
 * // Complex computation
 * const base = signal(100);
 * const rate = signal(0.1);
 * const years = signal(5);
 * const interest = compute(
 *   (b: number, r: number, y: number) => b * Math.pow(1 + r, y),
 *   base, rate, years
 * );
 * ```
 *
 * @remarks
 * - Works with functions of any arity
 * - Can mix signals and plain values in arguments
 * - Plain value arguments do not trigger recomputation
 * - Arguments are unwrapped using the `value()` helper
 *
 * @see {@link derive} - For the underlying derived signal primitive
 * @see {@link value} - For unwrapping signalified values
 */
export const compute = <F extends (...args: any[]) => any>(
  computerFn: F,
  ...restArgs: MaybeSignalValues<Parameters<F>>
): DerivedSignal<ReturnType<F>> => {
  return derive(() => {
    const plainArgs = restArgs.map((arg) => value(arg)) as PlainValues<
      typeof restArgs
    >;
    return computerFn(...plainArgs);
  });
};
