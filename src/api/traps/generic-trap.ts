import { derive, signal } from "../_core";
import { value } from "../../utils";
import { Operation, MaybeSignalValue } from "../../types";

/**
 * A method which traps a MaybeSignalValue and returns handy derived signals
 * of most-frequently required transforms
 *
 * @param input any value for which transformed derived signal is required
 * @see MaybeSignalValue
 * @returns an object of handy transform methods as its properties, which return
 * derived signal
 */
export const genericTrap = <T, ER>(
  input: MaybeSignalValue<T>,
  evaluator?: (samePassedInput: MaybeSignalValue<T>) => ER
): Operation<T | ER> => {
  return {
    orNonNullable: <OV>(orValue: MaybeSignalValue<OV>) =>
      genericTrap(orValue, (orVal) => {
        const val = evaluator ? evaluator(input) : value(input);
        return (val ?? value(orVal)) as NonNullable<T | ER> | OV;
      }),
    or: <OV>(orValue: MaybeSignalValue<OV>) =>
      genericTrap(orValue, (orVal) => {
        const val = evaluator ? evaluator(input) : value(input);
        return (val || value(orVal)) as NonNullable<T | ER> | OV;
      }),
    orNot: (orNotValue: MaybeSignalValue<any>) =>
      genericTrap(orNotValue, (orNotVal) => {
        const val = evaluator ? evaluator(input) : value(input);
        return (val || !value(orNotVal)) as NonNullable<T | ER> | boolean;
      }),
    orLT: (
      andSubjectValue: MaybeSignalValue<number>,
      compareValue: MaybeSignalValue<number>
    ) =>
      genericTrap(true, () => {
        const val = evaluator ? evaluator(input) : value(input);
        const comparisonResult = value(andSubjectValue) < value(compareValue);
        return (val || comparisonResult) as NonNullable<T | ER> | boolean;
      }),
    orLTE: (
      andSubjectValue: MaybeSignalValue<number>,
      compareValue: MaybeSignalValue<number>
    ) =>
      genericTrap(true, () => {
        const val = evaluator ? evaluator(input) : value(input);
        const comparisonResult = value(andSubjectValue) <= value(compareValue);
        return (val || comparisonResult) as NonNullable<T | ER> | boolean;
      }),
    orEquals: (
      andSubjectValue: MaybeSignalValue<number>,
      compareValue: MaybeSignalValue<number>
    ) =>
      genericTrap(true, () => {
        const val = evaluator ? evaluator(input) : value(input);
        const comparisonResult = value(andSubjectValue) === value(compareValue);
        return (val || comparisonResult) as NonNullable<T | ER> | boolean;
      }),
    orNotEquals: (
      andSubjectValue: MaybeSignalValue<number>,
      compareValue: MaybeSignalValue<number>
    ) =>
      genericTrap(true, () => {
        const val = evaluator ? evaluator(input) : value(input);
        const comparisonResult = value(andSubjectValue) !== value(compareValue);
        return (val || comparisonResult) as NonNullable<T | ER> | boolean;
      }),
    orGT: (
      andSubjectValue: MaybeSignalValue<number>,
      compareValue: MaybeSignalValue<number>
    ) =>
      genericTrap(true, () => {
        const val = evaluator ? evaluator(input) : value(input);
        const comparisonResult = value(andSubjectValue) > value(compareValue);
        return (val || comparisonResult) as NonNullable<T | ER> | boolean;
      }),
    orGTE: (
      andSubjectValue: MaybeSignalValue<number>,
      compareValue: MaybeSignalValue<number>
    ) =>
      genericTrap(true, () => {
        const val = evaluator ? evaluator(input) : value(input);
        const comparisonResult = value(andSubjectValue) >= value(compareValue);
        return (val || comparisonResult) as NonNullable<T | ER> | boolean;
      }),
    and: <AV>(andValue: MaybeSignalValue<AV>) =>
      genericTrap(andValue, (andVal) => {
        const val = evaluator ? evaluator(input) : value(input);
        return (val && value(andVal)) as T | ER | AV;
      }),
    andNot: (andNotValue: MaybeSignalValue<any>) =>
      genericTrap(andNotValue, (andNotVal) => {
        const val = evaluator ? evaluator(input) : value(input);
        return (val && !value(andNotVal)) as T | ER | boolean;
      }),
    andLT: (
      andSubjectValue: MaybeSignalValue<number>,
      compareValue: MaybeSignalValue<number>
    ) =>
      genericTrap(true, () => {
        const val = evaluator ? evaluator(input) : value(input);
        const comparisonResult = value(andSubjectValue) < value(compareValue);
        return (val && comparisonResult) as T | ER | boolean;
      }),
    andLTE: (
      andSubjectValue: MaybeSignalValue<number>,
      compareValue: MaybeSignalValue<number>
    ) =>
      genericTrap(true, () => {
        const val = evaluator ? evaluator(input) : value(input);
        const comparisonResult = value(andSubjectValue) <= value(compareValue);
        return (val && comparisonResult) as T | ER | boolean;
      }),
    andEquals: (
      andSubjectValue: MaybeSignalValue<number>,
      compareValue: MaybeSignalValue<number>
    ) =>
      genericTrap(true, () => {
        const val = evaluator ? evaluator(input) : value(input);
        const comparisonResult = value(andSubjectValue) === value(compareValue);
        return (val && comparisonResult) as T | ER | boolean;
      }),
    andNotEquals: (
      andSubjectValue: MaybeSignalValue<number>,
      compareValue: MaybeSignalValue<number>
    ) =>
      genericTrap(true, () => {
        const val = evaluator ? evaluator(input) : value(input);
        const comparisonResult = value(andSubjectValue) !== value(compareValue);
        return (val && comparisonResult) as T | ER | boolean;
      }),
    andGT: (
      andSubjectValue: MaybeSignalValue<number>,
      compareValue: MaybeSignalValue<number>
    ) =>
      genericTrap(true, () => {
        const val = evaluator ? evaluator(input) : value(input);
        const comparisonResult = value(andSubjectValue) > value(compareValue);
        return (val && comparisonResult) as T | ER | boolean;
      }),
    andGTE: (
      andSubjectValue: MaybeSignalValue<number>,
      compareValue: MaybeSignalValue<number>
    ) =>
      genericTrap(true, () => {
        const val = evaluator ? evaluator(input) : value(input);
        const comparisonResult = value(andSubjectValue) >= value(compareValue);
        return (val && comparisonResult) as T | ER | boolean;
      }),
    resolvesTo: <Tr, Fl>(
      valueIfTruthy: MaybeSignalValue<Tr>,
      valueIfFalsy: MaybeSignalValue<Fl>
    ) =>
      derive(() => {
        const val = evaluator ? evaluator(input) : value(input);
        return !!val ? value(valueIfTruthy) : value(valueIfFalsy);
      }),
    get stringified() {
      return derive(() => {
        const res = evaluator ? evaluator(input) : value(input);
        const str = (
          res === undefined || res === null ? undefined : res.toString()
        ) as T | ER extends null | undefined ? undefined : string;
        return str;
      });
    },
    get result() {
      return derive(() => (evaluator ? evaluator(input) : value(input)));
    },
    get truthy() {
      return derive(() => !!(evaluator ? evaluator(input) : value(input)));
    },
    get falsy() {
      return derive(() => !(evaluator ? evaluator(input) : value(input)));
    },
    get truthyFalsyPair() {
      return derive(() => {
        const truthyVal = !!(evaluator ? evaluator(input) : value(input));
        const pair = [truthyVal, !truthyVal] as const;
        return pair;
      });
    },
  };
};

const tudu = signal(true);
const folas = genericTrap(tudu).falsy;
const bull1 = genericTrap(tudu).or(folas).result;
const bull2 = genericTrap(tudu).or(folas).or(tudu).result;
const bull3 = genericTrap(tudu).or(folas).or(tudu).or(folas).result;
