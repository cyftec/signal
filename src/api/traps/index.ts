import { isPlainObject } from "@cyftech/immutjs";
import { type MaybeSignalValue, value } from "../../_core";
import { arrayTrap } from "./array-trap";
import { genericTrap } from "./generic-trap";
import { numberTrap } from "./number-trap";
import { objectTrap } from "./object-trap";
import { stringTrap } from "./string-trap";
import type { SignalTrap } from "./types";

/**
 * Creates a type-specific trap object with derived signal methods.
 *
 * This function uses runtime type checking to dispatch to the appropriate
 * type-specific trap implementation. The dispatch order is:
 * 1. Number values → numberTrap (provides math operations, formatting)
 * 2. String values → stringTrap (provides string manipulation methods)
 * 3. Array values → arrayTrap (provides array transformation methods)
 * 4. Plain objects → objectTrap (provides property access methods)
 * 5. Other types → genericTrap (provides basic string and fallback methods)
 *
 * @template T - The type of value to trap
 * @param input - A signal or plain value to inspect
 * @returns A type-specific trap object whose methods return derived signals
 *
 * @example
 * ```typescript
 * const count = signal(5);
 * const trapped = trap(count); // NumberSignalTrap
 * const doubled = trapped.add(5).result;
 *
 * const name = signal("hello");
 * const nameTrap = trap(name); // StringSignalTrap
 * const upper = nameTrap.UPPERCASE;
 *
 * const items = signal([1, 2, 3]);
 * const itemsTrap = trap(items); // ArraySignalTrap
 * const filtered = itemsTrap.filter(x => x > 1);
 * ```
 *
 * @remarks
 * - The trap type is determined by the runtime type of the unwrapped value at creation time
 * - Type changes in the input signal are not reflected in the trap type
 * - Methods return derived signals that update when the input changes
 * - The object trap throws if the value is not a plain object
 *
 * @see {@link SignalTrap} - For the trap type union
 * @see {@link MaybeSignalValue} - For the input type
 */
export const trap = <T>(input: MaybeSignalValue<T>) => {
  return (
    typeof value(input) === "number"
      ? numberTrap(input as MaybeSignalValue<number>)
      : typeof value(input) === "string"
      ? stringTrap(input as MaybeSignalValue<string>)
      : Array.isArray(value(input))
      ? arrayTrap(input as MaybeSignalValue<unknown[]>)
      : isPlainObject(value(input))
      ? objectTrap(input as MaybeSignalValue<Record<string, unknown>>)
      : genericTrap(input)
  ) as SignalTrap<T>;
};
