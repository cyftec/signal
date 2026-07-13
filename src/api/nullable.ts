import { MaybeSignal } from "../_core";
import {
  getLogicalMethods,
  LogicalMethods,
  Primitive,
} from "../_core/data-specific-methods";

/**
 * Adds logical methods to nullable primitive values.
 *
 * This function enables logical operations (truthy/falsy checks, comparisons,
 * ternary operations) on nullable primitive values by wrapping them with
 * the logical methods interface.
 *
 * @template T - The type of value to add logical methods to
 * @param input - A signalified primitive value (string, number, boolean, null, or undefined)
 * @returns An object with logical methods for the input value
 *
 * @example
 * ```typescript
 * const count: undefined | SourceSignal<number> = signal(5);
 * const logical = nullable(count);
 * logical.is.truthy; // DerivedSignal<boolean>
 * logical.or(0); // DerivedSignal<number>
 * ```
 *
 * @remarks
 * - Specially helpful if the input value is not even a signal or signalified object and may even be nullable
 * - Only works with primitive types (string, number, boolean, null, undefined)
 * - Returns an empty object for non-primitive types
 * - Enables fluent logical operation chaining
 * - Useful for conditional logic in reactive contexts
 *
 * @see {@link LogicalMethods} - For the logical methods interface
 * @see {@link MaybeSignal} - For the input type
 */
export const nullable = <T>(
  input: MaybeSignal<Extract<T, Primitive> extends never ? never : T>,
): LogicalMethods<T> => getLogicalMethods(input as MaybeSignal<T>);
