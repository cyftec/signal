import { type BaseSignal } from "../signals";
import {
  BooleanMutatingMethods,
  BooleanMutatingAndNonMutatingMethods,
} from "./types";

/**
 * Creates mutating methods for boolean signals.
 *
 * @param valueSetter - Updates the signal value and triggers effects
 * @returns Mutating methods for boolean signals
 *
 * @remarks
 * - `toggle()` flips the boolean value
 * - Triggers effects synchronously
 *
 * @example
 * ```typescript
 * const methods = getBooleanMutatingMethods((mutator) => {
 *   signal.value = mutator(signal.value);
 * });
 * methods.toggle(); // Flips the boolean value
 * ```
 */
export const getBooleanMutatingMethods = (
  baseSignal: BaseSignal<boolean>,
): BooleanMutatingMethods => ({
  toggle: () => baseSignal.mutateWith((oldValue) => !oldValue),
});

/**
 * Creates combined methods for boolean source signals.
 *
 * Combines mutating methods for boolean source signals.
 *
 * @param valueSetter - Updates the signal value and triggers effects
 * @param baseSignal - The base boolean signal to access values from
 * @returns Combined methods for boolean source signals
 *
 * @remarks
 * - Includes toggle method for flipping boolean values
 * - Triggers effects synchronously
 *
 * @example
 * ```typescript
 * const boolSignal = signal(true);
 * const methods = getBooleanSignalMethods(
 *   (mutator) => { boolSignal.value = mutator(boolSignal.value); },
 *   boolSignal
 * );
 * methods.toggle(); // Flips from true to false
 * ```
 */
export const getBooleanSignalMethods = (
  baseSignal: BaseSignal<boolean>,
): BooleanMutatingAndNonMutatingMethods => ({
  mutate: { ...getBooleanMutatingMethods(baseSignal) },
});
