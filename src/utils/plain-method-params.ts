import { MaybeSignalValues, PlainValues } from "../_core/signals/types";
import { value } from "./value-getter";

/**
 * Converts signal method parameters to plain values.
 *
 * This helper function is used by trap methods to unwrap parameters that may be
 * signals, plain values, or dead-signals into their plain values before passing
 * them to the underlying JavaScript methods (e.g., string methods, array methods).
 *
 * This allows trap methods to accept signal parameters while still being
 * able to call standard JavaScript methods that expect plain values.
 *
 * @param methodParams - Signal parameters (signals, plain values, or dead-signals)
 * @returns Array of plain values extracted from the signal parameters
 *
 * @example
 * // Calling string.includes with a signal search term
 * const search = signal("world");
 * const text = signal("hello world");
 * const params = getPlainMethodParams(search);
 * // params is ["world"], which can be passed to text.includes("world")
 *
 * @remarks
 * - Used internally by trap methods for data-specific operations
 * - Unwraps each parameter using the `value()` helper
 * - Returns an array of plain values matching the input parameter order
 *
 * @see {@link value} - For unwrapping individual signals
 * @see {@link MaybeSignalValues} - For the input type
 * @see {@link PlainValues} - For the output type
 */
export const getPlainMethodParams = <T extends MaybeSignalValues<any[]>>(
  ...methodParams: T
) => methodParams.map((p) => value(p)) as PlainValues<T>;
