import { MaybeBaseSignal, MaybeSignal, Signal } from "../_core/signals";
import { valueIsSignal } from "./type-checkers";

/**
 * Extracts the plain value from a signal, dead-signal, or plain value.
 *
 * This utility function unwraps signals to get their underlying
 * plain values. If the input is already a plain value, it returns it as-is.
 *
 * @template T - The type of the plain value
 * @param input - A signal, dead-signal, or plain value
 * @returns The unwrapped plain value
 *
 * @example
 * ```typescript
 * const count = signal(42);
 * const nonSig = deadSIgnal("hello");
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
 * @see {@link Signal} - For signal types
 */
export const value = <T>(input: MaybeBaseSignal<T>): T =>
  valueIsSignal(input) ? ((input as Signal<T>).value as T) : (input as T);
