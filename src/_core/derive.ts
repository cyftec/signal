import { effect } from "./effect";
import { signal } from "./signal";
import { getDerivedArraySignalBaseObject } from "./signal/array-signal";
import { getDerivedObjectSignalBaseObject } from "./signal/object-signal";
import { BaseDerivedArraySignal, BaseDerivedObjectSignal } from "./signal/types";

/**
 * A read-only derived signal computed from other signals.
 *
 * Derived signals automatically recompute their value whenever any of their
 * tracked dependencies change. Dependencies are established by accessing
 * `.value` on signals during the initial computation.
 *
 * @template T - The type of value the derived signal holds
 *
 * @remarks
 * - The value getter function receives the previous computed value (undefined on first run)
 * - Dependencies are only tracked for signals whose `.value` is accessed during execution
 * - If a signal is accessed conditionally and the condition is false on first run, it won't be tracked
 * - Calling `dispose()` stops the derived signal from tracking dependencies
 * - After disposal, the value remains accessible but won't update
 * - Array derived signals get non-mutating array methods (map, filter, etc.)
 * - Object derived signals get non-mutating object methods (get, withLiveProps, keys)
 *
 * @see {@link signal} - For creating mutable source signals
 * @see {@link effect} - For registering functions to run when signal values change
 */
export type DerivedSignal<T> = {
  /** Runtime type discriminator for derived signals */
  type: "derived-signal";
  /** The previous computed value (undefined on first computation) */
  get prevValue(): T | undefined;
  /** The current computed value */
  get value(): T;
  /**
   * Stops the derived signal from tracking its dependencies.
   *
   * After calling dispose(), the derived signal's value remains accessible
   * but will no longer update when its dependencies change.
   */
  dispose: () => void;
} & (T extends any[] ? BaseDerivedArraySignal<T> : T extends object ? BaseDerivedObjectSignal<T> : {});

/**
 * A function that computes a derived signal's value.
 *
 * This function receives the previous computed value and should access
 * `.value` on signals to establish dependencies. The function is called
 * whenever any tracked dependency changes.
 *
 * @template T - The type of value to return
 * @param oldValue - The previous computed value (undefined on first run)
 * @returns The new computed value
 *
 * @example
 * ```typescript
 * const count = signal(5);
 * const doubled = derive((prev) => {
 *   const current = count.value;
 *   return current * 2;
 * });
 * ```
 *
 * @remarks
 * - Always access signals via `.value` to establish dependencies
 * - If a signal is accessed conditionally and the condition is false on first run, it won't be tracked
 * - The previous value is the previous RETURN value, not the previous dependency values
 */
export type DerivedValueGetterWithSignals<T> = (oldValue: T | undefined) => T;

/**
 * Creates a read-only derived signal computed from other signals.
 *
 * The derived signal's value is computed by the provided function, which
 * should access `.value` on signals to establish dependencies. The value
 * is recomputed whenever any tracked dependency changes.
 *
 * @template T - The type of value the derived signal holds
 * @param valueGetterFn - A function that computes the derived value.
 * Receives the previous computed value (undefined on first run).
 * @returns A derived signal with `value`, `prevValue`, and `dispose()` methods
 *
 * @example
 * ```typescript
 * const count = signal(5);
 * const doubled = derive(() => count.value * 2);
 * console.log(doubled.value); // 10
 *
 * // Using previous value
 * const history = derive((prev) => {
 *   const current = count.value;
 *   return prev ? [...prev, current] : [current];
 * });
 * ```
 *
 * @remarks
 * - Dependencies are only tracked for signals whose `.value` is accessed during execution
 * - If a signal is accessed conditionally and the condition is false on first run, it won't be tracked
 * - The previous value is undefined on the first computation
 * - Derived signals can depend on other derived signals (chaining)
 *
 * @see {@link DerivedValueGetterWithSignals} - The type of the value getter function
 * @see {@link signal} - For creating mutable source signals
 * @see {@link effect} - For registering functions to run when signal values change
 */
export const derive = <T>(
  valueGetterFn: DerivedValueGetterWithSignals<T>,
): DerivedSignal<T> => {
  let oldValue: T | undefined;
  let currValue: T | undefined;
  const derivedSource = signal<T>(oldValue as T);
  const derivedSourceUpdator = effect(() => {
    oldValue = currValue;
    currValue = valueGetterFn(oldValue);
    derivedSource.value = currValue;
  });

  const baseDerivedSignal = {
    type: "derived-signal" as const,
    get prevValue() {
      return oldValue;
    },
    get value() {
      return derivedSource.value;
    },
    dispose() {
      derivedSourceUpdator.dispose();
    },
  };

  // Add non-mutating methods for array and object derived signals
  if (Array.isArray(derivedSource.value)) {
    return Object.assign(
      baseDerivedSignal,
      getDerivedArraySignalBaseObject(baseDerivedSignal as any),
    ) as any;
  }

  if (typeof derivedSource.value === "object" && derivedSource.value !== null) {
    return Object.assign(
      baseDerivedSignal,
      getDerivedObjectSignalBaseObject(baseDerivedSignal as any),
    ) as any;
  }

  return baseDerivedSignal as any;
};
