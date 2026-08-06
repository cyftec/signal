import { BaseSignal, MaybeSignal, Signal } from "../_core/signals";
import { valueIsSignal } from "./type-checkers";

/**
 * Unwraps a signal-capable input to its plain value.
 *
 * Structurally recognized source, derived, and dead signals are read through
 * their `value` getter; every other input is returned unchanged.
 *
 * @template T - The unwrapped value type.
 * @param input - A plain value or any base/supported signal shape.
 * @returns The signal's current value or the original plain input.
 *
 * @remarks
 * - Reading a live signal through this helper participates in dependency collection.
 * - Signal getters return copied object and array values according to base-signal behavior.
 * - `null` and `undefined` pass through unchanged.
 * - Recognition relies only on the `type` discriminator.
 *
 * @example
 * ```typescript
 * const count = signal(42);
 * const snapshot = deadSignal("hello");
 * console.log(value(count)); // 42
 * console.log(value(snapshot)); // "hello"
 * console.log(value(null)); // null
 * ```
 *
 * @see {@link valueIsSignal} - Performs runtime recognition.
 * @see {@link MaybeSignal} - Describes the general accepted input.
 * @see {@link BaseSignal} - Describes the additional low-level input shape.
 */
export const value = <T>(input: MaybeSignal<T> | BaseSignal<T>): T =>
  valueIsSignal(input) ? ((input as BaseSignal<T>).value as T) : (input as T);
