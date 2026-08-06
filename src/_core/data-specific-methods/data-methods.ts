import { isPlainObject } from "@cyftec/immut";
import { BaseSignal } from "../signals";
import {
  getArrayMutatingAndNonMutatingMethods,
  getArrayNonMutatingMethods,
} from "./array";
import { getBooleanSignalMethods } from "./boolean";
import { getNumberSignalMethods } from "./number";
import {
  getObjectMutatingAndNonMutatingMethods,
  getObjectNonMutatingMethods,
} from "./object";
import {
  getStringSignalMethods,
  getStringSignalNonMutatingMethods,
} from "./string";
import {
  InputSignalType,
  MutatingAndNonMutatingMethods,
  NonMutatingMethods,
} from "./types";

export const getNonMutatingDataMethods = <
  InputSignal extends InputSignalType,
  T,
>(
  baseSignal: BaseSignal<T>,
  nonNullableInitialValue?: NonNullable<T extends Record<string, any> ? {} : T>,
): NonMutatingMethods<InputSignal, T> => {
  const nonNullInitialValue =
    nonNullableInitialValue === undefined
      ? baseSignal.nonReactiveValue
      : nonNullableInitialValue;

  // ARRAY CHECK MUST BE BEFORE OBJECT CHECK
  if (Array.isArray(nonNullInitialValue)) {
    return getArrayNonMutatingMethods<InputSignal, Extract<T, any[]>>(
      baseSignal as any,
    ) as NonMutatingMethods<InputSignal, T>;
  }

  if (isPlainObject(nonNullInitialValue)) {
    return getObjectNonMutatingMethods<
      InputSignal,
      Extract<T, Record<string, any>>
    >(
      baseSignal as any,
    ) as NonMutatingMethods<InputSignal, T>;
  }

  if (typeof nonNullInitialValue === "string") {
    return getStringSignalNonMutatingMethods<InputSignal>(
      baseSignal as any,
    ) as unknown as NonMutatingMethods<InputSignal, T>;
  }

  if (typeof nonNullInitialValue === "number") {
    return getNumberSignalMethods<InputSignal>(
      baseSignal as any,
    ) as NonMutatingMethods<InputSignal, T>;
  }

  return {} as NonMutatingMethods<InputSignal, T>;
};

export const getMutatingAndNonMutatingDataMethods = <
  InputSignal extends InputSignalType,
  T,
>(
  baseSignal: BaseSignal<T>,
  nonNullableInitialValue?: NonNullable<T extends Record<string, any> ? {} : T>,
): MutatingAndNonMutatingMethods<InputSignal, T> => {
  const nonNullInitialValue =
    nonNullableInitialValue === undefined
      ? baseSignal.nonReactiveValue
      : nonNullableInitialValue;

  // ARRAY CHECK MUST BE BEFORE OBJECT CHECK
  if (Array.isArray(nonNullInitialValue)) {
    return getArrayMutatingAndNonMutatingMethods<
      InputSignal,
      Extract<T, any[]>
    >(
      baseSignal as any,
    ) as MutatingAndNonMutatingMethods<InputSignal, T>;
  }

  if (isPlainObject(nonNullInitialValue)) {
    return getObjectMutatingAndNonMutatingMethods<
      InputSignal,
      Extract<T, Record<string, any>>
    >(
      baseSignal as any,
    ) as MutatingAndNonMutatingMethods<InputSignal, T>;
  }

  if (typeof nonNullInitialValue === "string") {
    return getStringSignalMethods<InputSignal>(
      baseSignal as any,
    ) as MutatingAndNonMutatingMethods<InputSignal, T>;
  }

  if (typeof nonNullInitialValue === "number") {
    return getNumberSignalMethods<InputSignal>(
      baseSignal as any,
    ) as MutatingAndNonMutatingMethods<InputSignal, T>;
  }

  if (typeof nonNullInitialValue === "boolean") {
    return getBooleanSignalMethods(
      baseSignal as any,
    ) as MutatingAndNonMutatingMethods<InputSignal, T>;
  }

  return {} as MutatingAndNonMutatingMethods<InputSignal, T>;
};
