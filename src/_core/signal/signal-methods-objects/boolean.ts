import { derive } from "../../derive";
import {
  BaseSignal,
  BooleanSignalMethodsObject,
  BooleanSignalMutatingMethodsObject,
  BooleanSignalNonMutatingMethodsObject,
} from "../types";

export const getBooleanSignalMutatingMethodsObject = (
  valueSetter: (mutatorMethod: (oldValue: boolean) => boolean) => void,
): BooleanSignalMutatingMethodsObject => ({
  toggle: () => valueSetter((oldValue) => !oldValue),
});

/**
 * Creates non-mutating methods for boolean signals.
 *
 * These are library-specific methods that provide additional functionality
 * for boolean values.
 *
 * @param baseBooleanSignal - The base boolean signal to access values from
 * @returns Non-mutating methods for boolean signals
 *
 * @remarks
 * - `not` returns the negated boolean value
 * - `toString` returns the string representation
 * - All methods return derived signals
 * - Methods are reactive and update when the source boolean changes
 * - Works with both source and derived signals
 */
export const getBooleanSignalNonMutatingMethodsObject = (
  baseBooleanSignal: BaseSignal<boolean>,
): BooleanSignalNonMutatingMethodsObject => ({
  negated: () => derive(() => !baseBooleanSignal.value),
});

export const getBooleanSignalMethodsObject = (
  valueSetter: (mutatorMethod: (oldValue: boolean) => boolean) => void,
  baseBooleanSignal: BaseSignal<boolean>,
): BooleanSignalMethodsObject => ({
  ...getBooleanSignalMutatingMethodsObject(valueSetter),
  ...getBooleanSignalNonMutatingMethodsObject(baseBooleanSignal),
});
