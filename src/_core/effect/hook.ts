import { Effect } from "./effect";

const _effectHookFactory = () => {
  let _currentSignalsCatcherEffect: Effect | null = null;

  return {
    getCurrentEffect(): Effect | null {
      return _currentSignalsCatcherEffect;
    },
    setCurrentEffect(effect: Effect | null): void {
      _currentSignalsCatcherEffect = effect;
    },
  };
};

export const EffectHook = _effectHookFactory();
