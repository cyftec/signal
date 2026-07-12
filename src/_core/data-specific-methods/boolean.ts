import { type BaseSignalifiedObject } from "../signals";
import {
  getBooleanLogicalMethods,
  getNullableLogicalNonMutatingMethodsObject,
} from "./generic";
import {
  BooleanSignalMutatingMethodsObject,
  BooleanSourceSignalMethodsObject,
} from "./types";

export const getBooleanSignalMutatingMethodsObject = (
  valueSetter: (mutatorMethod: (oldValue: boolean) => boolean) => void,
): BooleanSignalMutatingMethodsObject => ({
  toggle: () => valueSetter((oldValue) => !oldValue),
});

export const getBooleanSignalMethodsObject = (
  valueSetter: (mutatorMethod: (oldValue: boolean) => boolean) => void,
  baseSignalifiedObject: BaseSignalifiedObject<boolean>,
): BooleanSourceSignalMethodsObject => ({
  ...getBooleanSignalMutatingMethodsObject(valueSetter),
  ...getBooleanLogicalMethods(baseSignalifiedObject),
  ...getNullableLogicalNonMutatingMethodsObject(baseSignalifiedObject),
});
