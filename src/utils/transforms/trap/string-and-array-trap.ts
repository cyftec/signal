import { derive } from "../../../core/main";
import { value } from "../../../core/value-extractor";
import { MaybeSignalValue, StringAndArraySignalTrap } from "../../../types";

export const stringAndArrayTrap = <T extends Array<any> | string>(
  input: MaybeSignalValue<T>
): StringAndArraySignalTrap => {
  return {
    get length() {
      return derive(() => value(input).length);
    },
    lengthLT: (compareValue: MaybeSignalValue<number>) => {
      return {
        get truthy() {
          return derive(() => value(input).length < value(compareValue));
        },
        get falsy() {
          return derive(() => value(input).length >= value(compareValue));
        },
        resolvesTo: <Tr, Fl>(
          valueIfTruthy: MaybeSignalValue<Tr>,
          valueIfFalsy: MaybeSignalValue<Fl>
        ) =>
          derive(() =>
            value(input).length < value(compareValue)
              ? value(valueIfTruthy)
              : value(valueIfFalsy)
          ),
      };
    },
    lengthGT: (compareValue: MaybeSignalValue<number>) => {
      return {
        get truthy() {
          return derive(() => value(input).length > value(compareValue));
        },
        get falsy() {
          return derive(() => value(input).length <= value(compareValue));
        },
        resolvesTo: <Tr, Fl>(
          valueIfTruthy: MaybeSignalValue<Tr>,
          valueIfFalsy: MaybeSignalValue<Fl>
        ) =>
          derive(() =>
            value(input).length > value(compareValue)
              ? value(valueIfTruthy)
              : value(valueIfFalsy)
          ),
      };
    },
    lengthE: (compareValue: MaybeSignalValue<number>) => {
      return {
        get truthy() {
          return derive(() => value(input).length === value(compareValue));
        },
        get falsy() {
          return derive(() => value(input).length !== value(compareValue));
        },
        resolvesTo: <Tr, Fl>(
          valueIfTruthy: MaybeSignalValue<Tr>,
          valueIfFalsy: MaybeSignalValue<Fl>
        ) =>
          derive(() =>
            value(input).length === value(compareValue)
              ? value(valueIfTruthy)
              : value(valueIfFalsy)
          ),
      };
    },
    lengthNE: (compareValue: MaybeSignalValue<number>) => {
      return {
        get truthy() {
          return derive(() => value(input).length !== value(compareValue));
        },
        get falsy() {
          return derive(() => value(input).length === value(compareValue));
        },
        resolvesTo: <Tr, Fl>(
          valueIfTruthy: MaybeSignalValue<Tr>,
          valueIfFalsy: MaybeSignalValue<Fl>
        ) =>
          derive(() =>
            value(input).length !== value(compareValue)
              ? value(valueIfTruthy)
              : value(valueIfFalsy)
          ),
      };
    },
    lengthLTE: (compareValue: MaybeSignalValue<number>) => {
      return {
        get truthy() {
          return derive(() => value(input).length <= value(compareValue));
        },
        get falsy() {
          return derive(() => value(input).length > value(compareValue));
        },
        resolvesTo: <Tr, Fl>(
          valueIfTruthy: MaybeSignalValue<Tr>,
          valueIfFalsy: MaybeSignalValue<Fl>
        ) =>
          derive(() =>
            value(input).length <= value(compareValue)
              ? value(valueIfTruthy)
              : value(valueIfFalsy)
          ),
      };
    },
    lengthGTE: (compareValue: MaybeSignalValue<number>) => {
      return {
        get truthy() {
          return derive(() => value(input).length >= value(compareValue));
        },
        get falsy() {
          return derive(() => value(input).length < value(compareValue));
        },
        resolvesTo: <Tr, Fl>(
          valueIfTruthy: MaybeSignalValue<Tr>,
          valueIfFalsy: MaybeSignalValue<Fl>
        ) =>
          derive(() =>
            value(input).length >= value(compareValue)
              ? value(valueIfTruthy)
              : value(valueIfFalsy)
          ),
      };
    },
  };
};
