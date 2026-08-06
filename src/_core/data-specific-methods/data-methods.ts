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
import { getStringSignalMethods } from "./string";
import { MutatingAndNonMutatingMethods, NonMutatingMethods } from "./types";

export const getNonMutatingDataMethods = <T>(
  baseSignal: BaseSignal<T>,
  nonNullableInitialValue?: NonNullable<T extends Record<string, any> ? {} : T>,
): NonMutatingMethods<T> => {
  const nonNullInitialValue =
    nonNullableInitialValue === undefined
      ? baseSignal.nonReactiveValue
      : nonNullableInitialValue;

  // ARRAY CHECK MUST BE BEFORE OBJECT CHECK
  if (Array.isArray(nonNullInitialValue)) {
    return getArrayNonMutatingMethods(
      baseSignal as any,
    ) as NonMutatingMethods<T>;
  }

  if (isPlainObject(nonNullInitialValue)) {
    return getObjectNonMutatingMethods(
      baseSignal as any,
    ) as NonMutatingMethods<T>;
  }

  if (typeof nonNullInitialValue === "string") {
    return getStringSignalMethods(baseSignal as any) as NonMutatingMethods<T>;
  }

  if (typeof nonNullInitialValue === "number") {
    return getNumberSignalMethods(baseSignal as any) as NonMutatingMethods<T>;
  }

  return {} as NonMutatingMethods<T>;
};

export const getMutatingAndNonMutatingDataMethods = <T>(
  baseSignal: BaseSignal<T>,
  nonNullableInitialValue?: NonNullable<T extends Record<string, any> ? {} : T>,
): MutatingAndNonMutatingMethods<T> => {
  const nonNullInitialValue =
    nonNullableInitialValue === undefined
      ? baseSignal.nonReactiveValue
      : nonNullableInitialValue;

  // ARRAY CHECK MUST BE BEFORE OBJECT CHECK
  if (Array.isArray(nonNullInitialValue)) {
    return getArrayMutatingAndNonMutatingMethods(
      baseSignal as any,
    ) as MutatingAndNonMutatingMethods<T>;
  }

  if (isPlainObject(nonNullInitialValue)) {
    return getObjectMutatingAndNonMutatingMethods(
      baseSignal as any,
    ) as MutatingAndNonMutatingMethods<T>;
  }

  if (typeof nonNullInitialValue === "string") {
    return getStringSignalMethods(
      baseSignal as any,
    ) as MutatingAndNonMutatingMethods<T>;
  }

  if (typeof nonNullInitialValue === "number") {
    return getNumberSignalMethods(
      baseSignal as any,
    ) as MutatingAndNonMutatingMethods<T>;
  }

  if (typeof nonNullInitialValue === "boolean") {
    return getBooleanSignalMethods(
      baseSignal as any,
    ) as MutatingAndNonMutatingMethods<T>;
  }

  return {} as MutatingAndNonMutatingMethods<T>;
};
