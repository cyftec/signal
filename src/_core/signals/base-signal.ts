import { newVal } from "@cyftec/immut";
import { Effect, EffectHook } from "../effect";

export const getBaseSignal = <T>(initialValue: T) => {
  let _prevValue: T | undefined = undefined;
  let _value: T = newVal(initialValue);
  const _effects = new Set<Effect>();

  const _catchNewReceiverIfAny = (): void => {
    const newEffect = EffectHook.getCurrentEffect();
    if (newEffect) {
      newEffect.registerStimulusSignal(base);
      _effects.add(newEffect);
    }
  };

  const base = {
    get prevValue(): T | undefined {
      return _prevValue;
    },

    get nonReactiveValue(): T {
      return _value;
    },

    get value(): T {
      _catchNewReceiverIfAny();
      return newVal(_value);
    },

    set value(newValue: T) {
      if (_value === newValue) {
        console.log(`Unnecessary value change - ${newValue}`);
        return;
      }

      _prevValue = _value;
      _value = newValue;
      _effects.forEach((effect) => effect.run());
    },

    mutateWith(mutatedValueEvaluator: (oldValue: T) => T) {
      const updatedValue = mutatedValueEvaluator(_value);
      this.value = updatedValue;
    },

    removeEffect(effect: Effect): void {
      if (!_effects.has(effect))
        throw `Receiver doesn't exist in current signal.`;
      _effects.delete(effect);
    },

    dispose(): void {
      _effects.clear();
    },
  } as const;

  return base;
};
