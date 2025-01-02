import {
  derived,
  DerivedValueGetterWithSignals,
  valueIsSignal,
} from "../../core.ts";
import type { DerivedSignal, Signal } from "../../types.ts";

/**
 * The expressions required inside ${} of the tagged template function @see dstring
 *
 * Types
 * @type {Signal<any>} need to be passed when you have the signal handy and entire
 * template literal along with this signal is used to derive the final string signal
 *
 * @type {DerivedValueGetterWithSignals} need to passed when you want to derive a signal (from one or may other signals)
 * before passing it to the tagged template literal method -  'dstring'.
 * This is same as using derived(() => someOtherSignal.value)
 *
 * @type {any} is used when you don't know what is the type of the passed variable
 * particularly helpful in some cases when it may or maynot be a signal
 */
export type StringSignalDeriverTemplateExpressions = (
  | Signal<any>
  | DerivedValueGetterWithSignals<any>
  | any
)[];

/**
 * A tagged template function to derive string signal from any expression
 * @param plain-string content outside ${} in template literal
 * @param expressions inside ${} in template literal
 * @returns Derived string signal
 */
export const dstring = (
  strings: TemplateStringsArray,
  ...tlExpressions: StringSignalDeriverTemplateExpressions
): DerivedSignal<string> =>
  derived(() => {
    return strings.reduce((acc, fragment, i) => {
      let expValue;
      const expression = tlExpressions[i];

      if (typeof expression === "function") {
        expValue = expression() ?? "";
      } else if (valueIsSignal(expression)) {
        expValue = (expression as Signal<any>).value ?? "";
      } else {
        expValue = (expression as any) ?? "";
      }

      return `${acc}${fragment}${expValue.toString()}`;
    }, "");
  });
