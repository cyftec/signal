import { getPlainMethodParams, value, valueIsLiveSignal } from "../../utils";
import {
  type BaseSignal,
  deadSignal,
  derive,
  MaybeSignal,
  MaybeSignalValues,
} from "../signals";
import {
  DeriverReturnType,
  InputSignalType,
  NumberCustomNonMutatingMethods,
  NumberIntrinsicNonMutatingMethods,
  NumberNonMutatingMethods,
} from "./types";

const getNumberMethodDeriver = <InputSignal extends InputSignalType>(
  baseNumberSignal: BaseSignal<number>,
) => {
  const inputIsLiveSignal = valueIsLiveSignal(baseNumberSignal as any);

  return <T>(deriver: () => T): DeriverReturnType<InputSignal, T> =>
    (inputIsLiveSignal
      ? derive(deriver)
      : deadSignal(deriver())) as DeriverReturnType<InputSignal, T>;
};

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
 * - Live bases return reactive derived signals
 * - Dead bases return dead-signal snapshots
 */
export const getNumberIntrinsicNonMutatingMethods = <
  InputSignal extends InputSignalType,
>(
  baseNumberSignal: BaseSignal<number>,
): NumberIntrinsicNonMutatingMethods<InputSignal> => {
  const deriveFromBase =
    getNumberMethodDeriver<InputSignal>(baseNumberSignal);

  return {
    toExponential: (
      ...args: MaybeSignalValues<Parameters<number["toExponential"]>>
    ) =>
      deriveFromBase(() =>
        baseNumberSignal.value.toExponential(...getPlainMethodParams(...args)),
      ),
    toFixed: (...args: MaybeSignalValues<Parameters<number["toFixed"]>>) =>
      deriveFromBase(() =>
        baseNumberSignal.value.toFixed(...getPlainMethodParams(...args)),
      ),
    toPrecision: (
      ...args: MaybeSignalValues<Parameters<number["toPrecision"]>>
    ) =>
      deriveFromBase(() =>
        baseNumberSignal.value.toPrecision(...getPlainMethodParams(...args)),
      ),
    toLocaleString: (
      locales?: MaybeSignal<string | string[] | undefined>,
      options?: MaybeSignal<Intl.NumberFormatOptions | undefined>,
    ) =>
      deriveFromBase(() =>
        baseNumberSignal.value.toLocaleString(value(locales), value(options)),
      ),
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
export const getNumberCustomNonMutatingMethods = <
  InputSignal extends InputSignalType,
>(
  baseNumberSignal: BaseSignal<number>,
): NumberCustomNonMutatingMethods<InputSignal> => {
  const deriveFromBase =
    getNumberMethodDeriver<InputSignal>(baseNumberSignal);

  return {
    toConfined: (start: MaybeSignal<number>, end: MaybeSignal<number>) =>
      deriveFromBase(() => {
        const startValue = value(start);
        const endValue = value(end);
        return baseNumberSignal.value < startValue
          ? startValue
          : baseNumberSignal.value > endValue
            ? endValue
            : baseNumberSignal.value;
      }),
  };
};

/**
 * Creates combined non-mutating methods for number signals.
 *
 * Combines intrinsic, custom, and logical non-mutating methods into a single object.
 *
 * @param baseNumberSignal - The base number signal to access values from
 * @returns Combined non-mutating methods for number signals
 *
 * @remarks
 * - Live bases return reactive derived signals
 * - Dead bases return dead-signal snapshots
 */
export const getNumberSignalMethods = <InputSignal extends InputSignalType>(
  baseNumberSignal: BaseSignal<number>,
): NumberNonMutatingMethods<InputSignal> => ({
  ...getNumberIntrinsicNonMutatingMethods<InputSignal>(baseNumberSignal),
  ...getNumberCustomNonMutatingMethods<InputSignal>(baseNumberSignal),
});
