import {
  derive,
  value,
  type DerivedSignal,
  type MaybeSignalValues,
  type PlainValues,
} from "../_core";

export const compute = <F extends (...args: any[]) => any>(
  computerFn: F,
  ...restArgs: MaybeSignalValues<Parameters<F>>
): DerivedSignal<ReturnType<F>> => {
  return derive(() => {
    const plainArgs = restArgs.map((arg) => value(arg)) as PlainValues<
      typeof restArgs
    >;
    return computerFn(...plainArgs);
  });
};
