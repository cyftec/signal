import { value } from "../core";
import { MaybeSignalValues, PlainValues } from "../types";

export const getDesignalifiedMethodParams = <
  T extends MaybeSignalValues<any[]>
>(
  ...methodParams: T
) => methodParams.map((p) => value(p)) as PlainValues<T>;
