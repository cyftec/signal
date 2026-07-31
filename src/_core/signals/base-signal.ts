import { SignalsReceiver } from "../antenna";
import { LiveSignal } from "./types";

export class BaseSignal<T> {
  protected _value: T;
  private _prevValue: T | undefined;
  private _isDisposed: boolean;
  private _receivers: Set<SignalsReceiver>;

  constructor(initialValue: T) {
    this._value = initialValue;
    this._prevValue = undefined;
    this._isDisposed = false;
    this._receivers = new Set();
  }

  protected _setValueAndCallReceivers(newValue: T) {
    if (this._value === newValue)
      console.log(`Unnecessary value change - ${newValue}`);

    this._prevValue = this._value;
    this._value = newValue;
    this._callReceivers();
  }

  protected _catchNewReceiverIfAny(): void {
    const newReceiver = SignalsReceiver.getCurrentReceiver();
    if (newReceiver) {
      // receiver registration only happens for live-signals
      newReceiver.registerSourceSignal(this as unknown as LiveSignal<T>);
      this._receivers.add(newReceiver);
    }
  }

  protected _callReceivers(): void {
    this._receivers.forEach((receiver) => receiver.call());
  }

  get isDisposed(): boolean {
    return this._isDisposed;
  }

  get prevValue(): T | undefined {
    return this._prevValue;
  }

  get value(): T {
    this._catchNewReceiverIfAny();
    return this._value;
  }

  removeReceiver(receiver: SignalsReceiver): void {
    if (!this._receivers.has(receiver))
      throw `Receiver doesn't exist in current signal.`;

    this._receivers.delete(receiver);
  }

  dispose() {
    if (this._isDisposed) throw `Signal is already destoryed`;
    this._receivers.clear();
    this._isDisposed = true;
  }
}
