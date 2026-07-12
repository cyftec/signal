import { MaybeSignal } from "../_core";
import {
  Falsyable,
  getNullableLogicalNonMutatingMethodsObject,
  NullableLogicalMethods,
} from "../_core/data-specific-methods";

export const falsyable = <T>(
  input: MaybeSignal<Extract<T, Falsyable> extends never ? never : T>,
): NullableLogicalMethods<T> =>
  getNullableLogicalNonMutatingMethodsObject(input as MaybeSignal<T>);
