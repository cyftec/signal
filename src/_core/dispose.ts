import type { DerivedSignal } from "./derive";
import type { SignalsEffect } from "./signal";

/**
 * Disposes multiple derived signals and/or effects at once.
 *
 * This utility function calls `.dispose()` on each argument, stopping
 * dependency tracking for derived signals and marking effects for disposal.
 *
 * @param derivedSignalsOrEffects - Variable arguments of derived signals
 * and/or effects to dispose
 *
 * @example
 * ```typescript
 * const count = signal(0);
 * const doubled = derive(() => count.value * 2);
 * const eff = effect(() => console.log(count.value));
 *
 * // Dispose single
 * dispose(doubled);
 *
 * // Dispose multiple
 * dispose(doubled, eff);
 *
 * // Mixed disposal
 * dispose(doubled, eff);
 *
 * // Empty (no-op)
 * dispose();
 * ```
 *
 * @remarks
 * - Empty argument list is valid (no-op)
 * - Can mix derived signals and effects in the same call
 * - Disposing the same effect multiple times is safe (idempotent)
 * - For derived signals: stops dependency tracking
 * - For effects: marks for disposal (removed on next signal update)
 *
 * @see {@link DerivedSignal.dispose} - For disposing individual derived signals
 * @see {@link SignalsEffect.dispose} - For disposing individual effects
 */
export const dispose = (
  ...derivedSignalsOrEffects: (DerivedSignal<any> | SignalsEffect)[]
): void => {
  derivedSignalsOrEffects.forEach((dsigOrEff) => dsigOrEff.dispose());
};
