import { isPlainObject } from "@cyftec/immut";
import { BaseSignal } from "../signals";
import {
  getArrayMutatingAndNonMutatingMethods,
  getArrayNonMutatingMethods,
} from "./array";
import { getNumberSignalMethods } from "./number";
import {
  getObjectMutatingAndNonMutatingMethods,
  getObjectNonMutatingMethods,
} from "./object";
import { getStringSignalMethods } from "./string";
import { getBooleanSignalMethods } from "./boolean";

export const getNonMutatingDataMethods = <T>(
  baseSignal: BaseSignal<T>,
  nonNullableInitialValue?: NonNullable<T extends Record<string, any> ? {} : T>,
) => {
  const nonNullInitialValue =
    nonNullableInitialValue === undefined
      ? baseSignal.nonReactiveValue
      : nonNullableInitialValue;

  // ARRAY CHECK MUST BE BEFORE OBJECT CHECK
  if (Array.isArray(nonNullInitialValue)) {
    return getArrayNonMutatingMethods(baseSignal as any);
  }

  if (isPlainObject(nonNullInitialValue)) {
    return getObjectNonMutatingMethods(baseSignal as any);
  }

  if (typeof nonNullInitialValue === "string") {
    return getStringSignalMethods(baseSignal as any);
  }

  if (typeof nonNullInitialValue === "number") {
    return getNumberSignalMethods(baseSignal as any);
  }
};

export const getMutatingAndNonMutatingDataMethods = <T>(
  baseSignal: BaseSignal<T>,
  nonNullableInitialValue?: NonNullable<T extends Record<string, any> ? {} : T>,
) => {
  const nonNullInitialValue =
    nonNullableInitialValue === undefined
      ? baseSignal.nonReactiveValue
      : nonNullableInitialValue;

  // ARRAY CHECK MUST BE BEFORE OBJECT CHECK
  if (Array.isArray(nonNullInitialValue)) {
    return getArrayMutatingAndNonMutatingMethods(
      (mutatorMethod) =>
        baseSignal.mutate(mutatorMethod as unknown as (oldValue: T) => T),
      baseSignal as any,
    );
  }

  if (isPlainObject(nonNullInitialValue)) {
    return getObjectMutatingAndNonMutatingMethods(
      (mutatorMethod) =>
        baseSignal.mutate(mutatorMethod as unknown as (oldValue: T) => T),
      baseSignal as any,
    );
  }

  if (typeof nonNullInitialValue === "string") {
    return getStringSignalMethods(baseSignal as any);
  }

  if (typeof nonNullInitialValue === "number") {
    return getNumberSignalMethods(baseSignal as any);
  }

  if (typeof nonNullInitialValue === "boolean") {
    return getBooleanSignalMethods(
      (mutatorMethod) =>
        baseSignal.mutate(mutatorMethod as unknown as (oldValue: T) => T),
      baseSignal as any,
    );
  }
};
