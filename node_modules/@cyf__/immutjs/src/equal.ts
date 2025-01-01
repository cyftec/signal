// deno-lint-ignore-file no-explicit-any
import { sortObjectByKeys } from "./misc.ts";

/**
 * This method only check equality of values of both input objects
 * The input object don't necessarily need to hold the same reference
 * @param obj1
 * @param obj2
 * @returns boolean, if both obj1 and obj2 have same values to the deepest level or not
 */
export const areObjectsEqual = (obj1: object, obj2: object): boolean => {
  const sortedObj1 = sortObjectByKeys(obj1);
  const sortedObj2 = sortObjectByKeys(obj2);

  const keys1 = Object.keys(sortedObj1);
  const keys2 = Object.keys(sortedObj2);

  // Check if both objects have the same number of keys
  if (keys1.length !== keys2.length) return false;

  // Check if all keys in sortedObj1 exist in sortedObj2 and have equal values
  for (const key of keys1) {
    if (
      !keys2.includes(key) ||
      !areValuesEqual((sortedObj1 as any)[key], (sortedObj2 as any)[key])
    ) {
      return false;
    }
  }

  return true;
};

/**
 * @param array1
 * @param array2
 * @returns boolean, if the values in both input arrays are equal or not
 */
export const areArraysEqual = <T>(array1: T[], array2: T[]): boolean => {
  if (array1.length !== array2.length) return false;

  if (array1.length === 0) return true;

  for (let i = 0; i < array1.length; i++) {
    if (!areValuesEqual(array1[i], array2[i])) return false;
  }

  return true;
};

/**
 * @param value1
 * @param value2
 * @returns  boolean, if the values in both input values are equal or not, even if datatype of values are mutable
 */
export const areValuesEqual = (value1: any, value2: any): boolean => {
  if (typeof value1 !== typeof value2) return false;
  if (Array.isArray(value1)) {
    return areArraysEqual(value1, value2);
  }
  if (value1 === null || value2 === null) {
    return value1 === value2;
  }

  if (typeof value1 === "object" && !(value1 instanceof Set)) {
    return areObjectsEqual(value1, value2);
  }

  if (
    typeof value1 === "bigint" ||
    typeof value1 === "number" ||
    typeof value1 === "string" ||
    typeof value1 === "boolean"
  ) {
    return value1 === value2;
  }

  return value1 === value2;
};
