import { derive } from "../../../core/main";
import { value } from "../../../core/value-extractor";
import {
  MaybeSignalValue,
  NumberSignalTrap,
  SignalifiedFunction,
} from "../../../types";
import { getDesignalifiedMethodParams } from "../../common";

/**
 * A method which traps a MaybeSignalValue and returns handy derived signals
 * of most-frequently required transforms
 *
 * @param input any value for which transformed derived signal is required
 * @see MaybeSignalValue
 * @returns an object of handy transform methods as its properties, which return
 * derived signal
 */
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
    isLT: (compareValue: MaybeSignalValue<number>) => {
      return {
        get truthy() {
          return derive(() => value(input) < value(compareValue));
        },
        get falsy() {
          return derive(() => value(input) >= value(compareValue));
        },
        resolvesTo: <Tr, Fl>(
          valueIfTruthy: MaybeSignalValue<Tr>,
          valueIfFalsy: MaybeSignalValue<Fl>
        ) =>
          derive(() =>
            value(input) < value(compareValue)
              ? value(valueIfTruthy)
              : value(valueIfFalsy)
          ),
      };
    },
    isGT: (compareValue: MaybeSignalValue<number>) => {
      return {
        get truthy() {
          return derive(() => value(input) > value(compareValue));
        },
        get falsy() {
          return derive(() => value(input) <= value(compareValue));
        },
        resolvesTo: <Tr, Fl>(
          valueIfTruthy: MaybeSignalValue<Tr>,
          valueIfFalsy: MaybeSignalValue<Fl>
        ) =>
          derive(() =>
            value(input) > value(compareValue)
              ? value(valueIfTruthy)
              : value(valueIfFalsy)
          ),
      };
    },
    equals: (compareValue: MaybeSignalValue<number>) => {
      return {
        get truthy() {
          return derive(() => value(input) === value(compareValue));
        },
        get falsy() {
          return derive(() => value(input) !== value(compareValue));
        },
        resolvesTo: <Tr, Fl>(
          valueIfTruthy: MaybeSignalValue<Tr>,
          valueIfFalsy: MaybeSignalValue<Fl>
        ) =>
          derive(() =>
            value(input) === value(compareValue)
              ? value(valueIfTruthy)
              : value(valueIfFalsy)
          ),
      };
    },
    notEquals: (compareValue: MaybeSignalValue<number>) => {
      return {
        get truthy() {
          return derive(() => value(input) !== value(compareValue));
        },
        get falsy() {
          return derive(() => value(input) === value(compareValue));
        },
        resolvesTo: <Tr, Fl>(
          valueIfTruthy: MaybeSignalValue<Tr>,
          valueIfFalsy: MaybeSignalValue<Fl>
        ) =>
          derive(() =>
            value(input) !== value(compareValue)
              ? value(valueIfTruthy)
              : value(valueIfFalsy)
          ),
      };
    },
    isLTE: (compareValue: MaybeSignalValue<number>) => {
      return {
        get truthy() {
          return derive(() => value(input) <= value(compareValue));
        },
        get falsy() {
          return derive(() => value(input) > value(compareValue));
        },
        resolvesTo: <Tr, Fl>(
          valueIfTruthy: MaybeSignalValue<Tr>,
          valueIfFalsy: MaybeSignalValue<Fl>
        ) =>
          derive(() =>
            value(input) <= value(compareValue)
              ? value(valueIfTruthy)
              : value(valueIfFalsy)
          ),
      };
    },
    isGTE: (compareValue: MaybeSignalValue<number>) => {
      return {
        get truthy() {
          return derive(() => value(input) >= value(compareValue));
        },
        get falsy() {
          return derive(() => value(input) < value(compareValue));
        },
        resolvesTo: <Tr, Fl>(
          valueIfTruthy: MaybeSignalValue<Tr>,
          valueIfFalsy: MaybeSignalValue<Fl>
        ) =>
          derive(() =>
            value(input) >= value(compareValue)
              ? value(valueIfTruthy)
              : value(valueIfFalsy)
          ),
      };
    },
  };
};
