import type { DerivedSignal } from "./derive";
import type { SignalsEffect } from "./signal";

/**
 * A function which takes one or multiple arguments of either a
 * DerivedSignal type or a SignalsEffect type. And it disposes each
 * of those effects or derived signals.
 *
 * When an 'effect' or 'derive' is run, their argument input function
 * gets registered as effect methods in all of the root signals (whose
 * values are used in that argument function). Whenever any of the root
 * signals are changed the 'effect' or 'derive' method are run every time.
 *
 * There are scenarios when a particular 'effect' or 'derive'(d) signal is
 * not required any more. But even in this case, their registered methods
 * in every root signals run every time any of those root signals change.
 * To unregister those 'effect' or 'derive'(d) signal methods from all the
 * root signals, this method simply changes the disposable status of those
 * methods.
 *
 * @param derivedSignalsOrEffects one or multiple arguments of either a
 * DerivedSignal type or a SignalsEffect type
 */
export const dispose = (
  ...derivedSignalsOrEffects: (DerivedSignal<any> | SignalsEffect)[]
): void => {
  derivedSignalsOrEffects.forEach((dsigOrEff) => dsigOrEff.dispose());
};
