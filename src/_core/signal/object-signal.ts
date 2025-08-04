import { BaseObjectSignal } from "./types";

export const getObjectSignalBaseObject = <T extends object>(
  valueSetter: (method: (oldValue: T) => T) => void
): BaseObjectSignal<T> => {
  return {
    set: (partiallyNewObjectValue: Partial<T>) =>
      valueSetter((oldValue: T) => ({
        ...oldValue,
        ...partiallyNewObjectValue,
      })),
  };
};
