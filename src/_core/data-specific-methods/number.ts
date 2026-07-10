import { type BaseSignalifiedObject, derive } from "../signals";
import {
  NumberSignalCustomNonMutatingMethodsObject,
  NumberSignalIntrinsicNonMutatingMethodsObject,
  NumberSignalNonMutatingMethodsObject,
} from "./types";

/**
 * Creates intrinsic non-mutating methods for number signals.
 *
 * These methods mirror JavaScript Number non-mutating methods but return
 * derived signals instead of plain values.
 *
 * @param baseNumberSignalifiedObject - The base number signal to access values from
 * @returns Intrinsic non-mutating methods for number signals
 *
 * @remarks
 * - All methods return derived signals
 * - Methods are reactive and update when the source number changes
 * - Works with both source and derived signals
 */
export const getNumberSignalIntrinsicNonMutatingMethodsObject = (
  baseNumberSignalifiedObject: BaseSignalifiedObject<number>,
): NumberSignalIntrinsicNonMutatingMethodsObject => {
  return {
    toExponential: (...args: Parameters<number["toExponential"]>) =>
      derive(() => baseNumberSignalifiedObject.value.toExponential(...args)),
    toFixed: (...args: Parameters<number["toFixed"]>) =>
      derive(() => baseNumberSignalifiedObject.value.toFixed(...args)),
    toPrecision: (...args: Parameters<number["toPrecision"]>) =>
      derive(() => baseNumberSignalifiedObject.value.toPrecision(...args)),
    toLocaleString: (
      locales?: string | string[] | undefined,
      options?: Intl.NumberFormatOptions,
    ) =>
      derive(() =>
        baseNumberSignalifiedObject.value.toLocaleString(locales, options),
      ),
  };
};

/**
 * Creates custom non-mutating methods for number signals.
 *
 * These are library-specific methods that provide additional functionality
 * beyond JavaScript's intrinsic number methods.
 *
 * @param baseNumberSignalifiedObject - The base number signal to access values from
 * @returns Custom non-mutating methods for number signals
 *
 * @remarks
 * - `toConfined` confines the number within a range [start, end]
 */
export const getNumberSignalCustomNonMutatingMethodsObject = (
  baseNumberSignalifiedObject: BaseSignalifiedObject<number>,
): NumberSignalCustomNonMutatingMethodsObject => {
  return {
    toConfined: (start: number, end: number) =>
      derive(() =>
        baseNumberSignalifiedObject.value < start
          ? start
          : baseNumberSignalifiedObject.value > end
            ? end
            : baseNumberSignalifiedObject.value,
      ),
  };
};

/**
 * Creates combined non-mutating methods for number signals.
 *
 * Combines intrinsic and custom non-mutating methods into a single object.
 *
 * @param baseNumberSignalifiedObject - The base number signal to access values from
 * @returns Combined non-mutating methods for number signals
 *
 * @remarks
 * - All methods return derived signals
 * - Works with both source and derived signals
 * - Methods are reactive and update when the source number changes
 */
export const getNumberSignalMethodsObject = (
  baseNumberSignalifiedObject: BaseSignalifiedObject<number>,
): NumberSignalNonMutatingMethodsObject => ({
  ...getNumberSignalIntrinsicNonMutatingMethodsObject(
    baseNumberSignalifiedObject,
  ),
  ...getNumberSignalCustomNonMutatingMethodsObject(baseNumberSignalifiedObject),
});
