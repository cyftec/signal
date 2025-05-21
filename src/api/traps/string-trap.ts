import {
  MaybeSignalValue,
  SignalifiedFunction,
  StringSignalTrap,
} from "../../types";
import { value } from "../../utils";
import { derive, signal } from "../_core";
import { getDesignalifiedMethodParams } from "../common-utils";
import { stringAndArrayTrap } from "./string-and-array-trap";

/**
 * A method which traps a MaybeSignalValue and returns handy derived signals
 * of most-frequently required transforms
 *
 * @param input any value for which transformed derived signal is required
 * @see MaybeSignalValue
 * @returns an object of handy transform methods as its properties, which return
 * derived signal
 */
export const stringTrap = (
  input: MaybeSignalValue<string>
): StringSignalTrap => {
  const SIMPLE_STRING_METHODS = [
    "at",
    "charAt",
    "charCodeAt",
    "codePointAt",
    "concat",
    "endsWith",
    "includes",
    "indexOf",
    "lastIndexOf",
    "padEnd",
    "padStart",
    "repeat",
    "slice",
    "startsWith",
    "substring",
    "trim",
    "trimEnd",
    "trimStart",
  ] as const;
  type StringMethodName = (typeof SIMPLE_STRING_METHODS)[number];
  type SimpleStringMethods = Pick<StringSignalTrap, StringMethodName>;

  const simpleMethodsTrapObject = SIMPLE_STRING_METHODS.reduce(
    (map: SimpleStringMethods, stringMethod) => {
      const method: SignalifiedFunction<string[typeof stringMethod]> = (
        ...params
      ) => {
        return derive(() => {
          const prms = getDesignalifiedMethodParams(...params);
          // @ts-ignore: A spread argument must either have a tuple type or be passed to a rest parameter.
          return (value(input) as string)[stringMethod](...prms);
        });
      };
      map[stringMethod] = method;
      return map;
    },
    {} as SimpleStringMethods
  );

  return {
    ...stringAndArrayTrap(input),
    ...simpleMethodsTrapObject,
    get lowerCase() {
      return derive(() => (value(input) as string).toLowerCase());
    },
    get upperCase() {
      return derive(() => (value(input) as string).toUpperCase());
    },
    localeCompare: (
      that: MaybeSignalValue<string>,
      locales?: MaybeSignalValue<string | string[] | undefined>,
      options?: Intl.CollatorOptions
    ) =>
      derive(() =>
        value(input).localeCompare(value(that), value(locales), options)
      ),
    normalize: (form: MaybeSignalValue<"NFC" | "NFD" | "NFKC" | "NFKD">) =>
      derive(() => value(input).normalize(value(form))),
    replace: (
      searchValue: MaybeSignalValue<string> | RegExp,
      replaceValue: MaybeSignalValue<string>
    ) =>
      derive(() =>
        value(input).replace(value(searchValue), value(replaceValue))
      ),
    replaceAll: (
      searchValue: MaybeSignalValue<string> | RegExp,
      replaceValue: MaybeSignalValue<string>
    ) =>
      derive(() =>
        value(input).replaceAll(value(searchValue), value(replaceValue))
      ),
    search: (regexp: RegExp) => derive(() => value(input).search(regexp)),
    split: (
      separator: MaybeSignalValue<string> | RegExp,
      limit?: MaybeSignalValue<number | undefined>
    ) =>
      derive(() => {
        const separatorVal =
          separator instanceof RegExp ? separator : value(separator);
        return value(input).split(separatorVal, value(limit));
      }),
    toLocaleLowerCase: (
      locales?: MaybeSignalValue<string | string[] | undefined>
    ) => derive(() => value(input).toLocaleLowerCase(value(locales))),
    toLocaleUpperCase: (
      locales?: MaybeSignalValue<string | string[] | undefined>
    ) => derive(() => value(input).toLocaleUpperCase(value(locales))),
  };
};

const sig = signal("dksjfbksjnd");
const result = stringTrap(sig).split("");
