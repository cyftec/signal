import { type BaseSignalifiedObject } from "../signals";
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
});
