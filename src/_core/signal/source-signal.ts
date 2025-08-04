import { immut, newVal } from "@cyftech/immutjs";
import { getArraySignalBaseObject } from "./array-signal";
import { getObjectSignalBaseObject } from "./object-signal";
import { BaseSourceSignal, SignalsEffect, SourceSignal } from "./types";

let _currentSignalEffect: SignalsEffect | null = null;
export const setCurrentEffect = (effect: SignalsEffect | null) =>
  (_currentSignalEffect = effect);

/**
 * A function which converts plain javascript data into a signal.
 *
 * A signal is a basic data unit that can automatically alert functions or
 * computations when the data it holds changes.
 *
 * The automatic alert of the changed value occurs with the help of an effect
 * method. See the 'effect' method implementation in this project for details
 * about how it enables a signal to propagate changes
 *
 * @param input any javascript data type which need to be changed into a signal
 * @returns a signalified version of plain javascript data
 */
export const signal = <T>(input: T): SourceSignal<T> => {
  let _value = immut(input);
  const _effects = new Set<SignalsEffect>();

  const runEffects = () => {
    _effects.forEach((effect) => {
      if (effect.canDisposeNow) {
        _effects.delete(effect);
        return;
      }
      effect();
    });
  };

  const setValueAndRunEffects = (newValue: T): void => {
    _value = newValue;
    runEffects();
  };

  const baseObject: BaseSourceSignal<T> = {
    type: "source-signal",
    get value() {
      if (_currentSignalEffect) _effects.add(_currentSignalEffect);
      return newVal(_value);
    },
    set value(newValue: T) {
      if (newValue === _value) return;
      setValueAndRunEffects(immut(newValue));
    },
  };

  return (
    Array.isArray(input)
      ? Object.assign(
          baseObject,
          getArraySignalBaseObject((method) =>
            setValueAndRunEffects(method(_value as unknown[]) as T)
          )
        )
      : typeof input === "object" && input !== null
      ? Object.assign(
          baseObject,
          getObjectSignalBaseObject((method) =>
            setValueAndRunEffects(method(_value as unknown[]) as T)
          )
        )
      : baseObject
  ) as SourceSignal<typeof input>;
};
