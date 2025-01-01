import { effect } from "../core.ts";
import type { Signal, SourceSignal } from "../types.ts";

export const receive = <T>(
  receiver: SourceSignal<T>,
  ...transmittors: Signal<T>[]
): void =>
  transmittors.forEach((transmittor) =>
    effect(() => (receiver.value = transmittor.value))
  );

export const transmit = <T>(
  transmittor: Signal<T>,
  ...receivers: SourceSignal<T>[]
): void =>
  effect(() => {
    receivers.forEach((receiver) => (receiver.value = transmittor.value));
  });
