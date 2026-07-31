import { SignalsReceiver } from "./antenna";
import type { DerivedSignal } from "./signals";

/**
 * Disposes multiple derived signals and/or antennas at once.
 *
 * This utility function calls `.dispose()` on each argument, stopping
 * dependency tracking for derived signals and marking antennas for disposal.
 *
 * @param derivedSignalsOrReceivers - Variable arguments of derived signals
 * and/or antennas to dispose
 *
 * @example
 * ```typescript
 * const count = mutable(0);
 * const doubled = derive(() => count.value * 2);
 * const antenna = antenna(() => console.log(count.value));
 *
 * // Dispose single
 * dispose(doubled);
 *
 * // Dispose multiple
 * dispose(doubled, antenna);
 *
 * // Mixed disposal
 * dispose(doubled, antenna);
 *
 * // Empty (no-op)
 * dispose();
 * ```
 *
 * @remarks
 * - Empty argument list is valid (no-op)
 * - Can mix derived signals and antennas in the same call
 * - Disposing the same antenna multiple times is safe (idempotent)
 * - For derived signals: stops dependency tracking
 * - For antennas: marks for disposal (removed on next signal update)
 *
 * @see {@link DerivedSignal.dispose} - For disposing individual derived signals
 * @see {@link SignalsReceiver.dispose} - For disposing individual antennas
 */
export const dispose = (
  ...derivedSignalsOrReceivers: (DerivedSignal<any> | SignalsReceiver)[]
): void => {
  derivedSignalsOrReceivers.forEach((dsigOrReceiver) =>
    dsigOrReceiver.dispose(),
  );
};
