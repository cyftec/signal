import { MaybeSignal, MutableSignal } from "../_core";
import { antenna, SignalsReceiver } from "../_core/antenna";
import { value } from "../utils";

/**
 * Connects multiple source signals to a single signal-transmittor signal.
 *
 * Whenever any source changes, the signal-transmittor is updated to match that
 * source's current value. If more than one source changes in the same
 * propagation chain, the final signal-transmittor value follows signal-transmittor execution order.
 *
 * @template T - The type of value the signals hold
 * @param transmittor - A source signal that will receive updates
 * @param sources - Multiple signals (source or derived) of the same type
 * @returns Array of signal-transmittors that can be disposed to disconnect the bindings
 *
 * @example
 * ```typescript
 * const sportsEvent = mutable("cricket @ 9am");
 * const mediaEvent = mutable("movie @ 3pm");
 * const noticeBoard = mutable("");
 *
 * const receivers = receive(noticeBoard, sportsEvent, mediaEvent);
 *
 * sportsEvent.value = "football @ 1pm";
 * console.log(noticeBoard.value); // "football @ 1pm"
 *
 * mediaEvent.value = "concert @ 8pm";
 * console.log(noticeBoard.value); // "concert @ 8pm"
 *
 * // Manual update still works
 * noticeBoard.value = "No events";
 *
 * // Dispose connections
 * transmittors.forEach(eff => eff.dispose());
 * ```
 *
 * @remarks
 * - Each source gets its own signal-transmittor that updates the signal-transmittor
 * - Transmitters can be source or derived signals
 * - Receiver must be a source signal
 * - Passing no sources returns an empty signal-transmittors array
 * - The signal-transmittor remains independently mutable
 *
 * @see {@link transmit} - For broadcasting from one source to multiple signal-transmittors
 * @see {@link signal-transmittor} - For the underlying signal-transmittor primitive
 */
export const receive = <T>(
  transmittor: MutableSignal<T>,
  ...sources: MaybeSignal<T>[]
): SignalsReceiver[] => {
  const receivers = sources.map((source) =>
    antenna(() => (transmittor.value = value(source))),
  );
  return receivers;
};

/**
 * Broadcasts changes from one source signal to multiple signal-transmittor signals.
 *
 * When the source changes, all signal-transmittors are updated synchronously to the
 * same value. Each signal-transmittor remains independently mutable.
 *
 * @template T - The type of value the signals hold
 * @param source - A signal (source or derived) that broadcasts changes
 * @param transmittors - Multiple source signals that will receive updates
 * @returns A single antenna that can be disposed to disconnect the broadcast
 *
 * @example
 * ```typescript
 * const temperature = mutable(22);
 * const display1 = mutable(0);
 * const display2 = mutable(0);
 * const display3 = mutable(0);
 *
 * const antenna = transmit(temperature, display1, display2, display3);
 *
 * temperature.value = 25;
 * console.log(display1.value); // 25
 * console.log(display2.value); // 25
 * console.log(display3.value); // 25
 *
 * // Manual updates still work
 * display1.value = 30;
 *
 * // Dispose connection
 * antenna.dispose();
 * ```
 *
 * @remarks
 * - A single signal-transmittor manages all signal-transmittor updates
 * - Transmitter can be source or derived signal
 * - Receivers must be source signals
 * - Passing no signal-transmittors creates a no-op signal-transmittor
 * - The order of signal-transmittor updates is not guaranteed
 *
 * @see {@link receive} - For connecting multiple sources to a signal-transmittor
 * @see {@link antenna} - For the underlying antenna primitive
 */
export const transmit = <T>(
  source: MaybeSignal<T>,
  ...transmittors: MutableSignal<T>[]
): SignalsReceiver =>
  antenna(() => {
    transmittors.forEach((transmittor) => (transmittor.value = value(source)));
  });
