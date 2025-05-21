import { Operation, MaybeSignalValue } from "../types";
import { value } from "../utils";
import { derive, signal } from "./_core";

/**
 * Acronym for 'Operation'.
 * A method to accumulate all operations on signal(s), to ultimately resolve
 * into a final singal signal. Without this utility, one needs to create
 * n number of derived signals for doing n operations, unnecessarily.
 *
 * @param input any value for which transformed derived signal is required
 * @see MaybeSignalValue
 * @returns an object of handy transform methods as its properties, which return
 * derived signal
 */
export const op = <T, ER>(
  input: MaybeSignalValue<T>,
  evaluator?: (samePassedInput: MaybeSignalValue<T>) => ER
): Operation<T | ER> => {
  return {
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
    orNonNullable: <OV>(orValue: MaybeSignalValue<OV>) =>
      op(orValue, (orVal) => {
        const val = evaluator ? evaluator(input) : value(input);
        return (val ?? value(orVal)) as NonNullable<T | ER> | OV;
      }),
    or: <OV>(orValue: MaybeSignalValue<OV>) =>
      op(orValue, (orVal) => {
        const val = evaluator ? evaluator(input) : value(input);
        return (val || value(orVal)) as NonNullable<T | ER> | OV;
      }),
    orNot: (orNotValue: MaybeSignalValue<any>) =>
      op(orNotValue, (orNotVal) => {
        const val = evaluator ? evaluator(input) : value(input);
        return (val || !value(orNotVal)) as NonNullable<T | ER> | boolean;
      }),
    orLT: (
      andSubjectValue: MaybeSignalValue<number>,
      compareValue: MaybeSignalValue<number>
    ) =>
      op(true, () => {
        const val = evaluator ? evaluator(input) : value(input);
        const comparisonResult = value(andSubjectValue) < value(compareValue);
        return (val || comparisonResult) as NonNullable<T | ER> | boolean;
      }),
    orLTE: (
      andSubjectValue: MaybeSignalValue<number>,
      compareValue: MaybeSignalValue<number>
    ) =>
      op(true, () => {
        const val = evaluator ? evaluator(input) : value(input);
        const comparisonResult = value(andSubjectValue) <= value(compareValue);
        return (val || comparisonResult) as NonNullable<T | ER> | boolean;
      }),
    orEquals: (
      andSubjectValue: MaybeSignalValue<number>,
      compareValue: MaybeSignalValue<number>
    ) =>
      op(true, () => {
        const val = evaluator ? evaluator(input) : value(input);
        const comparisonResult = value(andSubjectValue) === value(compareValue);
        return (val || comparisonResult) as NonNullable<T | ER> | boolean;
      }),
    orNotEquals: (
      andSubjectValue: MaybeSignalValue<number>,
      compareValue: MaybeSignalValue<number>
    ) =>
      op(true, () => {
        const val = evaluator ? evaluator(input) : value(input);
        const comparisonResult = value(andSubjectValue) !== value(compareValue);
        return (val || comparisonResult) as NonNullable<T | ER> | boolean;
      }),
    orGT: (
      andSubjectValue: MaybeSignalValue<number>,
      compareValue: MaybeSignalValue<number>
    ) =>
      op(true, () => {
        const val = evaluator ? evaluator(input) : value(input);
        const comparisonResult = value(andSubjectValue) > value(compareValue);
        return (val || comparisonResult) as NonNullable<T | ER> | boolean;
      }),
    orGTE: (
      andSubjectValue: MaybeSignalValue<number>,
      compareValue: MaybeSignalValue<number>
    ) =>
      op(true, () => {
        const val = evaluator ? evaluator(input) : value(input);
        const comparisonResult = value(andSubjectValue) >= value(compareValue);
        return (val || comparisonResult) as NonNullable<T | ER> | boolean;
      }),
    and: <AV>(andValue: MaybeSignalValue<AV>) =>
      op(andValue, (andVal) => {
        const val = evaluator ? evaluator(input) : value(input);
        return (val && value(andVal)) as T | ER | AV;
      }),
    andNot: (andNotValue: MaybeSignalValue<any>) =>
      op(andNotValue, (andNotVal) => {
        const val = evaluator ? evaluator(input) : value(input);
        return (val && !value(andNotVal)) as T | ER | boolean;
      }),
    andLT: (
      andSubjectValue: MaybeSignalValue<number>,
      compareValue: MaybeSignalValue<number>
    ) =>
      op(true, () => {
        const val = evaluator ? evaluator(input) : value(input);
        const comparisonResult = value(andSubjectValue) < value(compareValue);
        return (val && comparisonResult) as T | ER | boolean;
      }),
    andLTE: (
      andSubjectValue: MaybeSignalValue<number>,
      compareValue: MaybeSignalValue<number>
    ) =>
      op(true, () => {
        const val = evaluator ? evaluator(input) : value(input);
        const comparisonResult = value(andSubjectValue) <= value(compareValue);
        return (val && comparisonResult) as T | ER | boolean;
      }),
    andEquals: (
      andSubjectValue: MaybeSignalValue<number>,
      compareValue: MaybeSignalValue<number>
    ) =>
      op(true, () => {
        const val = evaluator ? evaluator(input) : value(input);
        const comparisonResult = value(andSubjectValue) === value(compareValue);
        return (val && comparisonResult) as T | ER | boolean;
      }),
    andNotEquals: (
      andSubjectValue: MaybeSignalValue<number>,
      compareValue: MaybeSignalValue<number>
    ) =>
      op(true, () => {
        const val = evaluator ? evaluator(input) : value(input);
        const comparisonResult = value(andSubjectValue) !== value(compareValue);
        return (val && comparisonResult) as T | ER | boolean;
      }),
    andGT: (
      andSubjectValue: MaybeSignalValue<number>,
      compareValue: MaybeSignalValue<number>
    ) =>
      op(true, () => {
        const val = evaluator ? evaluator(input) : value(input);
        const comparisonResult = value(andSubjectValue) > value(compareValue);
        return (val && comparisonResult) as T | ER | boolean;
      }),
    andGTE: (
      andSubjectValue: MaybeSignalValue<number>,
      compareValue: MaybeSignalValue<number>
    ) =>
      op(true, () => {
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
  };
};

const tudu = signal(true);
const folas = op(tudu).falsy;
const bull1 = op(tudu).or(folas).result;
const bull2 = op(tudu).or(folas).or(tudu).result;
const bull3 = op(tudu).or(folas).or(tudu).or(folas).result;
