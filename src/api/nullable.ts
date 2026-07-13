import { MaybeSignal } from "../_core";
import {
  getLogicalMethods,
  LogicalMethods,
  Primitive,
} from "../_core/data-specific-methods";

export const nullable = <T>(
  input: MaybeSignal<Extract<T, Primitive> extends never ? never : T>,
): LogicalMethods<T> => getLogicalMethods(input as MaybeSignal<T>);
