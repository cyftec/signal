import { valueIsSignal } from "../../core.ts";
import type { MaybeSignal, Signal } from "../../types.ts";

/**
 * A shorthand method to get value of a maybesignal data.
 * @param value a value which not sure if it's plain or a signal
 * @see MaybeSignal
 * @returns the plain value
 */
export const val = <T>(value: MaybeSignal<T>): T =>
  valueIsSignal(value) ? (value as Signal<T>).value : (value as T);
