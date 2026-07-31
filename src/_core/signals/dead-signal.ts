import { DerivedSignal } from "./derived-signal";
import { SignalType } from "./types";

export class DeadSignal<T> extends DerivedSignal<T> {
  readonly type: SignalType = "dead-signal";

  protected override _derive<R>(valueGetter: () => R): DeadSignal<R> {
    return new DeadSignal(valueGetter);
  }

  constructor(valueGetter: () => T) {
    super(valueGetter, true);
  }

  override get value(): T {
    return this._value;
  }
}
