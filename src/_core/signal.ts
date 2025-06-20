import { immut, newVal } from "@cyftech/immutjs";

/**
 * A function which should contain one or many signals along with
 * their values in its definition. It is executed every time the value
 * of any of the signals (which is used inside function's definition) is changed.
 */
export type SignalsEffect = {
  (): void;
  canDisposeNow: boolean;
  dispose(): void;
};

/**
 * It executes the subscriber functions when a new ```value``` is set.
 *
 * It can be used to derive a read-only version of the signal.
 * @see DerivedSignal
 */
export type SourceSignal<T> = {
  type: "source-signal";
  value: T;
};

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

  return {
    type: "source-signal",
    get value() {
      if (_currentSignalEffect) _effects.add(_currentSignalEffect);
      return newVal(_value);
    },
    set value(newValue: T) {
      if (newValue === _value) return;
      _value = immut(newValue);
      _effects.forEach((effect) => {
        if (effect.canDisposeNow) {
          _effects.delete(effect);
          return;
        }
        effect();
      });
    },
  };
};
