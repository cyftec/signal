import {
  type MaybeSignalValues,
  type PlainValues,
  value,
} from "../../../_core";

/**
 * A method to get signalified method params to plain params.
 * @param methodParams signalified parmaeters of a method
 * @see SignalifiedFunction
 * @see MaybeSignalValues
 * @see PlainValues
 * @returns converted plain values
 */
export const getDesignalifiedMethodParams = <
  T extends MaybeSignalValues<any[]>
>(
  ...methodParams: T
) => methodParams.map((p) => value(p)) as PlainValues<T>;
