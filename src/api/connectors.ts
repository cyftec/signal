import {
  effect,
  type Signal,
  type SignalsEffect,
  type SourceSignal,
} from "../_core";

/**
 * Connects multiple transmitter signals to a receiver signal.
 *
 * When any transmitter's value changes, the receiver's value is updated to match.
 * If multiple transmitters change simultaneously, the receiver gets the last one's value.
 * The receiver can still be updated independently.
 *
 * @template T - The type of value the signals hold
 * @param receiver - A source signal that will receive updates
 * @param transmittors - Multiple signals (source or derived) of the same type
 * @returns Array of effects for disposing the connections
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
 * - Each transmitter has its own effect that updates the receiver
 * - If multiple transmitters change simultaneously, which value the receiver gets is not guaranteed (last one wins based on execution order)
 * - Empty transmitters array returns empty effects array
 * - Transmitters can be source or derived signals
 * - Receiver must be a source signal (mutable)
 *
 * @see {@link transmit} - For broadcasting from one transmitter to multiple receivers
 * @see {@link effect} - For the underlying effect primitive
 */
export const receive = <T>(
  receiver: SourceSignal<T>,
  ...transmittors: Signal<T>[]
): SignalsEffect[] => {
  const effects = transmittors.map((transmittor) =>
    effect(() => (receiver.value = transmittor.value))
  );
  return effects;
};

/**
 * Broadcasts changes from one transmitter signal to multiple receiver signals.
 *
 * When the transmitter's value changes, all receivers are updated to match.
 * All receivers are updated synchronously. Each receiver can still be updated independently.
 *
 * @template T - The type of value the signals hold
 * @param transmittor - A signal (source or derived) that broadcasts changes
 * @param receivers - Multiple source signals that will receive updates
 * @returns A single effect for disposing the connection
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
 * - Empty receivers array creates an effect that does nothing
 * - Transmitter can be source or derived signal
 * - Receivers must be source signals (mutable)
 * - No guarantee about the order of receiver updates
 *
 * @see {@link receive} - For connecting multiple transmitters to a receiver
 * @see {@link effect} - For the underlying effect primitive
 */
export const transmit = <T>(
  transmittor: Signal<T>,
  ...receivers: SourceSignal<T>[]
): SignalsEffect =>
  effect(() => {
    receivers.forEach((receiver) => (receiver.value = transmittor.value));
  });
