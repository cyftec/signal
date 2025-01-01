import { valueIsSignal } from "../../core.ts";
import type { MaybeSignal, Signal } from "../../types.ts";

/**
 * SHorthand method to get value of a maybesignal
 * @param value
 * @returns
 */
export const val = <T>(value: MaybeSignal<T>): T =>
  valueIsSignal(value) ? (value as Signal<T>).value : (value as T);
