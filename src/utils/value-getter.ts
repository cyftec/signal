import { valueIsSignalifiedObject } from "./type-checkers";
import { MaybeSignal, SignalifiedObject } from "../_core/signals";

/**
 * Extracts the plain value from a signal, non-signal, or plain value.
 *
 * This utility function unwraps signalified objects to get their underlying
 * plain values. If the input is already a plain value, it returns it as-is.
 *
 * @template T - The type of the plain value
 * @param input - A signal, non-signal, or plain value
 * @returns The unwrapped plain value
 *
 * @example
 * ```typescript
 * const count = signal(42);
 * const nonSig = getNonSignalObject("hello");
 *
 * value(count); // 42
 * value(nonSig); // "hello"
 * value(100); // 100
 * ```
 *
 * @remarks
 * - Does not trigger dependency tracking
 * - Works with `null` and `undefined`
 * - Works with nested structures
 *
 * @see {@link MaybeSignal} - For the input type
 * @see {@link SignalifiedObject} - For signalified object types
 */
export const value = <T>(input: MaybeSignal<T>): T =>
  valueIsSignalifiedObject(input)
    ? ((input as SignalifiedObject<T>).value as T)
    : (input as T);
