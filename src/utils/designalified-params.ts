import { MaybeSignalValues, PlainValues } from "../_core/signals/types";
import { value } from "./value-getter";

/**
 * Converts signalified method parameters to plain values.
 *
 * This helper function is used by trap methods to unwrap parameters that may be
 * signals, plain values, or non-signals into their plain values before passing
 * them to the underlying JavaScript methods (e.g., string methods, array methods).
 *
 * This allows trap methods to accept signalified parameters while still being
 * able to call standard JavaScript methods that expect plain values.
 *
 * @param methodParams - Signalified parameters (signals, plain values, or non-signals)
 * @returns Array of plain values extracted from the signalified parameters
 *
 * @example
 * // Calling string.includes with a signalified search term
 * const search = signal("world");
 * const text = signal("hello world");
 * const params = getDesignalifiedMethodParams(search);
 * // params is ["world"], which can be passed to text.includes("world")
 *
 * @remarks
 * - Used internally by trap methods for data-specific operations
 * - Unwraps each parameter using the `value()` helper
 * - Returns an array of plain values matching the input parameter order
 *
 * @see {@link value} - For unwrapping individual signalified values
 * @see {@link MaybeSignalValues} - For the input type
 * @see {@link PlainValues} - For the output type
 */
export const getDesignalifiedMethodParams = <
  T extends MaybeSignalValues<any[]>,
>(
  ...methodParams: T
) => methodParams.map((p) => value(p)) as PlainValues<T>;
