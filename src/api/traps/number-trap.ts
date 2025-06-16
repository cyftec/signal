import { derive, type MaybeSignalValue, value } from "../../_core";
import { getDesignalifiedMethodParams } from "./transforms";
import { genericTrap } from "./generic-trap";
import type { NumberSignalTrap, SignalifiedFunction } from "./types";

export const numberTrap = (
  input: MaybeSignalValue<number>
): NumberSignalTrap => {
  const SIMPLE_NUMBER_METHODS = [
    "toExponential",
    "toFixed",
    "toPrecision",
  ] as const;
  type NumberMethodName = (typeof SIMPLE_NUMBER_METHODS)[number];
  type SimpleNumberMethods = Pick<NumberSignalTrap, NumberMethodName>;

  const simpleMethodsTrapObject = SIMPLE_NUMBER_METHODS.reduce(
    (map: SimpleNumberMethods, numMethod) => {
      const method: SignalifiedFunction<number[typeof numMethod]> = (
        ...params
      ) => {
        return derive(() => {
          const prms = getDesignalifiedMethodParams(...params);
          // @ts-ignore: A spread argument must either have a tuple type or be passed to a rest parameter.
          return (value(input) as number)[numMethod](...prms);
        });
      };
      map[numMethod] = method;
      return map;
    },
    {} as SimpleNumberMethods
  );

  return {
    ...genericTrap(input),
    ...simpleMethodsTrapObject,
    toConfined: (
      start: MaybeSignalValue<number>,
      end: MaybeSignalValue<number>
    ) =>
      derive(() =>
        value(input) < value(start)
          ? value(start)
          : value(input) > value(end)
          ? value(end)
          : value(input)
      ),
    toLocaleString: (
      locales?: MaybeSignalValue<string | string[] | undefined>,
      options?: Intl.NumberFormatOptions
    ) => derive(() => value(input).toLocaleString(value(locales), options)),
  };
};
