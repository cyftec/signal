import {
  derive,
  type DerivedSignal,
  type DerivedValueGetterWithSignals,
  type MaybeSignalObject,
  type Signal,
  valueIsMaybeSignalObject,
} from "../_core";

/**
 * The expressions required inside ${} of the tagged template function @see tmpl
 *
 * Types
 * @type {Signal<any>} need to be passed when you have the signal handy and entire
 * template literal along with this signal is used to derive the final string signal
 *
 * @type {DerivedValueGetterWithSignals} need to passed when you want to derive a signal (from one or may other signals)
 * before passing it to the tagged template literal method -  'tmpl'.
 * This is same as using derive(() => someOtherSignal.value)
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
export const tmpl = (
  strings: TemplateStringsArray,
  ...tlExpressions: StringSignalDeriverTemplateExpressions
): DerivedSignal<string> =>
  derive(() => {
    return strings.reduce((acc, fragment, i) => {
      let expValue;
      const expression = tlExpressions[i];

      if (typeof expression === "function") {
        expValue = expression() ?? "";
      } else if (valueIsMaybeSignalObject(expression)) {
        expValue = (expression as MaybeSignalObject<any>).value ?? "";
      } else {
        expValue = (expression as any) ?? "";
      }

      return `${acc}${fragment}${expValue.toString()}`;
    }, "");
  });
