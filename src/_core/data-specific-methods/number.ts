import { getDesignalifiedMethodParams, value } from "../../utils";
import {
  type BaseSignalifiedObject,
  derive,
  MaybeSignal,
  MaybeSignalValues,
} from "../signals";
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
    toExponential: (
      ...args: MaybeSignalValues<Parameters<number["toExponential"]>>
    ) =>
      derive(() =>
        baseNumberSignalifiedObject.value.toExponential(
          ...getDesignalifiedMethodParams(...args),
        ),
      ),
    toFixed: (...args: MaybeSignalValues<Parameters<number["toFixed"]>>) =>
      derive(() =>
        baseNumberSignalifiedObject.value.toFixed(
          ...getDesignalifiedMethodParams(...args),
        ),
      ),
    toPrecision: (
      ...args: MaybeSignalValues<Parameters<number["toPrecision"]>>
    ) =>
      derive(() =>
        baseNumberSignalifiedObject.value.toPrecision(
          ...getDesignalifiedMethodParams(...args),
        ),
      ),
    toLocaleString: (
      locales?: MaybeSignal<string | string[] | undefined>,
      options?: MaybeSignal<Intl.NumberFormatOptions>,
    ) =>
      derive(() =>
        baseNumberSignalifiedObject.value.toLocaleString(
          value(locales),
          value(options),
        ),
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
    toConfined: (start: MaybeSignal<number>, end: MaybeSignal<number>) =>
      derive(() => {
        const startValue = value(start);
        const endValue = value(end);
        return baseNumberSignalifiedObject.value < startValue
          ? startValue
          : baseNumberSignalifiedObject.value > endValue
            ? endValue
            : baseNumberSignalifiedObject.value;
      }),
  };
};

/**
 * Creates combined non-mutating methods for number signals.
 *
 * Combines intrinsic, custom, and logical non-mutating methods into a single object.
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
