import {
  derive,
  type DerivedSignal,
  type DerivedValueGetterWithSignals,
  type Signal,
  type SignalifiedObject,
} from "../_core";
import { valueIsSignalifiedObject } from "../utils";

/**
 * The expressions allowed inside the template placeholders.
 *
 * @remarks
 * - `Signal<any>` is accepted directly
 * - `DerivedValueGetterWithSignals<any>` is accepted as a deferred expression
 * - Plain values are accepted as-is
 */
export type StringSignalDeriverTemplateExpressions = (
  | Signal<any>
  | DerivedValueGetterWithSignals<any>
  | any
)[];

/**
 * Tagged template function for string interpolation with signals.
 *
 * Creates a derived signal of the interpolated string that recomputes whenever
 * any tracked expression changes.
 *
 * @param strings - The static string parts of the template literal
 * @param tlExpressions - The dynamic expressions inside the placeholders
 * @returns A derived signal of the interpolated string
 *
 * @example
 * ```typescript
 * const name = signal("World");
 * const greeting = tmpl`Hello ${name}`;
 * console.log(greeting.value); // "Hello World"
 *
 * name.value = "Alice";
 * console.log(greeting.value); // "Hello Alice"
 *
 * // Multiple expressions
 * const firstName = signal("John");
 * const lastName = signal("Doe");
 * const fullName = tmpl`${firstName} ${lastName}`;
 *
 * // Mixed expressions
 * const count = signal(5);
 * const message = tmpl`Count: ${count}`;
 *
 * // Function expressions
 * const doubled = tmpl`Double is ${() => count.value * 2}`;
 * ```
 *
 * @remarks
 * - Expressions can be signals, derived expression functions, or plain values
 * - `null` and `undefined` become empty strings
 * - Values are converted to strings via `.toString()`
 * - Works with any combination of supported expression types
 *
 * @see {@link DerivedSignal} - For the derived signal type
 * @see {@link derive} - For the underlying derived signal primitive
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
      } else if (valueIsSignalifiedObject(expression)) {
        expValue = (expression as SignalifiedObject<any>).value ?? "";
      } else {
        expValue = (expression as any) ?? "";
      }

      return `${acc}${fragment}${expValue.toString()}`;
    }, "");
  });
