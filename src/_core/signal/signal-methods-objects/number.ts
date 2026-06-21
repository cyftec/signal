import { derive } from "../../derive";
import {
  BaseSignal,
  NumberSignalCustomNonMutatingMethodsObject,
  NumberSignalIntrinsicNonMutatingMethodsObject,
  NumberSignalNonMutatingMethodsObject,
} from "../types";

/**
 * Creates intrinsic non-mutating methods for number signals.
 *
 * These methods mirror JavaScript Number non-mutating methods but return
 * derived signals instead of plain values.
 *
 * @param baseNumberSignal - The base number signal to access values from
 * @returns Intrinsic non-mutating methods for number signals
 *
 * @remarks
 * - All methods return derived signals
 * - Methods are reactive and update when the source number changes
 * - Works with both source and derived signals
 */
export const getNumberSignalIntrinsicNonMutatingMethodsObject = (
  baseNumberSignal: BaseSignal<number>,
): NumberSignalIntrinsicNonMutatingMethodsObject => {
  return {
    toExponential: (...args: Parameters<number["toExponential"]>) =>
      derive(() => baseNumberSignal.value.toExponential(...args)),
    toFixed: (...args: Parameters<number["toFixed"]>) =>
      derive(() => baseNumberSignal.value.toFixed(...args)),
    toPrecision: (...args: Parameters<number["toPrecision"]>) =>
      derive(() => baseNumberSignal.value.toPrecision(...args)),
    toLocaleString: (
      locales?: string | string[] | undefined,
      options?: Intl.NumberFormatOptions
    ) =>
      derive(() => baseNumberSignal.value.toLocaleString(locales, options)),
  };
};

/**
 * Creates custom non-mutating methods for number signals.
 *
 * These are library-specific methods that provide additional functionality
 * beyond JavaScript's intrinsic number methods.
 *
 * @param baseNumberSignal - The base number signal to access values from
 * @returns Custom non-mutating methods for number signals
 *
 * @remarks
 * - `toConfined` confines the number within a range [start, end]
 */
export const getNumberSignalCustomNonMutatingMethodsObject = (
  baseNumberSignal: BaseSignal<number>,
): NumberSignalCustomNonMutatingMethodsObject => {
  return {
    toConfined: (start: number, end: number) =>
      derive(() =>
        baseNumberSignal.value < start
          ? start
          : baseNumberSignal.value > end
            ? end
            : baseNumberSignal.value
      ),
  };
};

/**
 * Creates combined non-mutating methods for number signals.
 *
 * Combines intrinsic and custom non-mutating methods into a single object.
 *
 * @param baseNumberSignal - The base number signal to access values from
 * @returns Combined non-mutating methods for number signals
 *
 * @remarks
 * - All methods return derived signals
 * - Works with both source and derived signals
 * - Methods are reactive and update when the source number changes
 */
export const getNumberSignalMethodsObject = (
  baseNumberSignal: BaseSignal<number>,
): NumberSignalNonMutatingMethodsObject => ({
  ...getNumberSignalIntrinsicNonMutatingMethodsObject(baseNumberSignal),
  ...getNumberSignalCustomNonMutatingMethodsObject(baseNumberSignal),
});
