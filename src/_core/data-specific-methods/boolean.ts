import { type BaseSignalifiedObject } from "../signals";
import {
  BooleanSignalMutatingMethodsObject,
  BooleanSourceSignalMethodsObject,
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
 * const methods = getBooleanSignalMutatingMethodsObject((mutator) => {
 *   signal.value = mutator(signal.value);
 * });
 * methods.toggle(); // Flips the boolean value
 * ```
 */
export const getBooleanSignalMutatingMethodsObject = (
  valueSetter: (mutatorMethod: (oldValue: boolean) => boolean) => void,
): BooleanSignalMutatingMethodsObject => ({
  toggle: () => valueSetter((oldValue) => !oldValue),
});

/**
 * Creates combined methods for boolean source signals.
 *
 * Combines mutating methods for boolean source signals.
 *
 * @param valueSetter - Updates the signal value and triggers effects
 * @param baseSignalifiedObject - The base boolean signal to access values from
 * @returns Combined methods for boolean source signals
 *
 * @remarks
 * - Includes toggle method for flipping boolean values
 * - Triggers effects synchronously
 *
 * @example
 * ```typescript
 * const boolSignal = signal(true);
 * const methods = getBooleanSignalMethodsObject(
 *   (mutator) => { boolSignal.value = mutator(boolSignal.value); },
 *   boolSignal
 * );
 * methods.toggle(); // Flips from true to false
 * ```
 */
export const getBooleanSignalMethodsObject = (
  valueSetter: (mutatorMethod: (oldValue: boolean) => boolean) => void,
  baseSignalifiedObject: BaseSignalifiedObject<boolean>,
): BooleanSourceSignalMethodsObject => ({
  ...getBooleanSignalMutatingMethodsObject(valueSetter),
});
