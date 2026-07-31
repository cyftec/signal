import { DerivedSignal, LiveSignal } from "./signals";

export class SignalsReceiver {
  private static _currentReceiver: SignalsReceiver | undefined = undefined;

  static getCurrentReceiver(): SignalsReceiver | undefined {
    return this._currentReceiver;
  }

  static setCurrentReceiver(reciever: SignalsReceiver | undefined): void {
    this._currentReceiver = reciever;
  }

  private _signalsReceiverFunction: () => void;
  private _isDisposed: boolean;
  private _sourceSignals: Set<LiveSignal<any>>;
  private _dependentSignals: Set<DerivedSignal<any>>;

  constructor(signalsReceiverFunction: () => void) {
    this._signalsReceiverFunction = signalsReceiverFunction;
    this._isDisposed = false;
    this._sourceSignals = new Set();
    this._dependentSignals = new Set();
  }

  private _removeAllSignals() {
    this._sourceSignals.forEach((signal) => {
      signal.removeReceiver(this);
    });
    this._sourceSignals.clear();
    this._dependentSignals.clear();
  }

  get isDisposed(): boolean {
    return this._isDisposed;
  }

  call() {
    if (this._isDisposed)
      throw `Receiver call failed. This receiver is already destroyed.`;
    this._signalsReceiverFunction();
  }

  registerSourceSignal(signal: LiveSignal<any>): void {
    if (this._isDisposed)
      throw `Register source signal failed. This receiver is already destroyed.`;
    this._sourceSignals.add(signal);
  }

  registerDependentSignal(signal: DerivedSignal<any>): void {
    if (this._isDisposed)
      throw `Register dependent signal failed. This receiver is already destroyed.`;
    this._dependentSignals.add(signal);
  }

  dispose(): void {
    if (this._isDisposed) throw `This receiver is already destroyed.`;
    this._removeAllSignals();
    this._isDisposed = true;
  }
}

export const antenna = (
  signalsReceiverFunction: () => void,
): SignalsReceiver => {
  const receiver = new SignalsReceiver(signalsReceiverFunction);

  SignalsReceiver.setCurrentReceiver(receiver);
  receiver.call();
  SignalsReceiver.setCurrentReceiver(undefined);

  return receiver;
};
