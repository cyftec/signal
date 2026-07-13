import { effect, MaybeSignal, SignalsEffect, SourceSignal } from "../_core";
import { value } from "../utils";

/**
 * Connects multiple transmitter signals to a single receiver signal.
 *
 * Whenever any transmitter changes, the receiver is updated to match that
 * transmitter's current value. If more than one transmitter changes in the same
 * propagation chain, the final receiver value follows effect execution order.
 *
 * @template T - The type of value the signals hold
 * @param receiver - A source signal that will receive updates
 * @param transmittors - Multiple signals (source or derived) of the same type
 * @returns Array of effects that can be disposed to disconnect the bindings
 *
 * @example
 * ```typescript
 * const sportsEvent = signal("cricket @ 9am");
 * const mediaEvent = signal("movie @ 3pm");
 * const noticeBoard = signal("");
 *
 * const effects = receive(noticeBoard, sportsEvent, mediaEvent);
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
 * effects.forEach(eff => eff.dispose());
 * ```
 *
 * @remarks
 * - Each transmitter gets its own effect that updates the receiver
 * - Transmitters can be source or derived signals
 * - Receiver must be a source signal
 * - Passing no transmitters returns an empty effects array
 * - The receiver remains independently mutable
 *
 * @see {@link transmit} - For broadcasting from one transmitter to multiple receivers
 * @see {@link effect} - For the underlying effect primitive
 */
export const receive = <T>(
  receiver: SourceSignal<T>,
  ...transmittors: MaybeSignal<T>[]
): SignalsEffect[] => {
  const effects = transmittors.map((transmittor) =>
    effect(() => (receiver.value = value(transmittor))),
  );
  return effects;
};

/**
 * Broadcasts changes from one transmitter signal to multiple receiver signals.
 *
 * When the transmitter changes, all receivers are updated synchronously to the
 * same value. Each receiver remains independently mutable.
 *
 * @template T - The type of value the signals hold
 * @param transmittor - A signal (source or derived) that broadcasts changes
 * @param receivers - Multiple source signals that will receive updates
 * @returns A single effect that can be disposed to disconnect the broadcast
 *
 * @example
 * ```typescript
 * const temperature = signal(22);
 * const display1 = signal(0);
 * const display2 = signal(0);
 * const display3 = signal(0);
 *
 * const effect = transmit(temperature, display1, display2, display3);
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
 * effect.dispose();
 * ```
 *
 * @remarks
 * - A single effect manages all receiver updates
 * - Transmitter can be source or derived signal
 * - Receivers must be source signals
 * - Passing no receivers creates a no-op effect
 * - The order of receiver updates is not guaranteed
 *
 * @see {@link receive} - For connecting multiple transmitters to a receiver
 * @see {@link effect} - For the underlying effect primitive
 */
export const transmit = <T>(
  transmittor: MaybeSignal<T>,
  ...receivers: SourceSignal<T>[]
): SignalsEffect =>
  effect(() => {
    receivers.forEach((receiver) => (receiver.value = value(transmittor)));
  });
