import {
  derive,
  type DerivedSignal,
  type DerivedValueGetterWithSignals,
  type SignalifiedObject,
  type Signal,
  valueIsSignalifiedObject,
} from "../_core";

/**
 * The expressions allowed inside ${} of the tagged template function.
 *
 * @remarks
 * - `Signal<any>`: Use when you have a signal handy
 * - `DerivedValueGetterWithSignals<any>`: Use to derive a signal before passing to tmpl
 * - `any`: Use when the type is unknown or may/may not be a signal
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
 * any signal in the expressions changes.
 *
 * @param strings - The static string parts of the template literal
 * @param tlExpressions - The dynamic expressions inside ${}
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
 * - Expressions can be signals (accessed via `.value`), deriver functions, or plain values
 * - Null/undefined values are converted to empty strings
 * - All values are converted to strings via `.toString()`
 * - Works with any combination of signals, functions, and plain values
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
