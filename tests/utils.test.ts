import { describe, it, expect } from "bun:test";
import {
  value,
  valueIsSourceSignal,
  valueIsDerivedSignal,
  valueIsSignal,
  valueIsNonSignalObject,
  valueIsSignalifiedObject,
  valueIsNonSignalString,
  valueIsNonSignalStringArray,
  valueIsMaybeSignalValueOfStringOrArray,
  getNonSignalObject,
  signal,
  derive,
} from "../src/index";

describe("value utility", () => {
  it("should return plain value from source signal", () => {
    const count = signal(42);
    expect(count).toMatchObject({ type: "source-signal" });
    expect(value(count)).toBe(43);
  });

  it("should return plain value from derived signal", () => {
    const count = signal(42);
    const doubled = derive(() => count.value * 2);
    expect(doubled).toMatchObject({ type: "derived-signal" });
    expect(value(doubled)).toBe(84);
  });

  it("should return plain value from non-signal", () => {
    const nonSig = getNonSignalObject(42);
    expect(value(nonSig)).toBe(42);
  });

  it("should return plain value as-is", () => {
    expect(value(42)).toBe(42);
  });

  it("should handle null", () => {
    expect(value(null)).toBe(null);
  });

  it("should handle undefined", () => {
    expect(value(undefined)).toBe(undefined);
  });
});

describe("valueIsSourceSignal", () => {
  it("should return true for source signal", () => {
    const count = signal(42);
    expect(valueIsSourceSignal(count)).toBe(true);
  });

  it("should return false for derived signal", () => {
    const count = signal(42);
    const doubled = derive(() => count.value * 2);
    expect(valueIsSourceSignal(doubled)).toBe(false);
  });

  it("should return false for non-signal", () => {
    const nonSig = getNonSignalObject(42);
    expect(valueIsSourceSignal(nonSig)).toBe(false);
  });

  it("should return false for plain value", () => {
    expect(valueIsSourceSignal(42)).toBe(false);
  });

  it("should return false for null", () => {
    expect(valueIsSourceSignal(null)).toBe(false);
  });

  it("should return false for undefined", () => {
    expect(valueIsSourceSignal(undefined)).toBe(false);
  });
});

describe("valueIsDerivedSignal", () => {
  it("should return true for derived signal", () => {
    const count = signal(42);
    const doubled = derive(() => count.value * 2);
    expect(valueIsDerivedSignal(doubled)).toBe(true);
  });

  it("should return false for source signal", () => {
    const count = signal(42);
    expect(valueIsDerivedSignal(count)).toBe(false);
  });

  it("should return false for non-signal", () => {
    const nonSig = getNonSignalObject(42);
    expect(valueIsDerivedSignal(nonSig)).toBe(false);
  });

  it("should return false for plain value", () => {
    expect(valueIsDerivedSignal(42)).toBe(false);
  });

  it("should return false for null", () => {
    expect(valueIsDerivedSignal(null)).toBe(false);
  });

  it("should return false for undefined", () => {
    expect(valueIsDerivedSignal(undefined)).toBe(false);
  });
});

describe("valueIsSignal", () => {
  it("should return true for source signal", () => {
    const count = signal(42);
    expect(valueIsSignal(count)).toBe(true);
  });

  it("should return true for derived signal", () => {
    const count = signal(42);
    const doubled = derive(() => count.value * 2);
    expect(valueIsSignal(doubled)).toBe(true);
  });

  it("should return false for non-signal", () => {
    const nonSig = getNonSignalObject(42);
    expect(valueIsSignal(nonSig)).toBe(false);
  });

  it("should return false for plain value", () => {
    expect(valueIsSignal(42)).toBe(false);
  });

  it("should return false for null", () => {
    expect(valueIsSignal(null)).toBe(false);
  });

  it("should return false for undefined", () => {
    expect(valueIsSignal(undefined)).toBe(false);
  });
});

describe("valueIsNonSignalObject", () => {
  it("should return true for non-signal", () => {
    const nonSig = getNonSignalObject(42);
    expect(valueIsNonSignalObject(nonSig)).toBe(true);
  });

  it("should return false for source signal", () => {
    const count = signal(42);
    expect(valueIsNonSignalObject(count)).toBe(false);
  });

  it("should return false for derived signal", () => {
    const count = signal(42);
    const doubled = derive(() => count.value * 2);
    expect(valueIsNonSignalObject(doubled)).toBe(false);
  });

  it("should return false for plain value", () => {
    expect(valueIsNonSignalObject(42)).toBe(false);
  });

  it("should return false for null", () => {
    expect(valueIsNonSignalObject(null)).toBe(false);
  });

  it("should return true for non-signal with matching type", () => {
    const nonSig = getNonSignalObject(42);
    expect(valueIsNonSignalObject(nonSig, ["number"])).toBe(true);
  });

  it("should return false for non-signal with non-matching type", () => {
    const nonSig = getNonSignalObject(42);
    expect(valueIsNonSignalObject(nonSig, ["string"])).toBe(false);
  });

  it("should return true for non-signal with one of multiple matching types", () => {
    const nonSig = getNonSignalObject(42);
    expect(valueIsNonSignalObject(nonSig, ["string", "number"])).toBe(true);
  });

  it("should handle empty types array", () => {
    const nonSig = getNonSignalObject(42);
    expect(valueIsNonSignalObject(nonSig, [])).toBe(true);
  });
});

describe("valueIsSignalifiedObject", () => {
  it("should return true for source signal", () => {
    const count = signal(42);
    expect(valueIsSignalifiedObject(count)).toBe(true);
  });

  it("should return true for derived signal", () => {
    const count = signal(42);
    const doubled = derive(() => count.value * 2);
    expect(valueIsSignalifiedObject(doubled)).toBe(true);
  });

  it("should return true for non-signal", () => {
    const nonSig = getNonSignalObject(42);
    expect(valueIsSignalifiedObject(nonSig)).toBe(true);
  });

  it("should return false for plain value", () => {
    expect(valueIsSignalifiedObject(42)).toBe(false);
  });

  it("should return false for null", () => {
    expect(valueIsSignalifiedObject(null)).toBe(false);
  });

  it("should return false for undefined", () => {
    expect(valueIsSignalifiedObject(undefined)).toBe(false);
  });
});

describe("valueIsNonSignalString", () => {
  it("should return true for non-signal string", () => {
    const nonSigStr = getNonSignalObject("hello");
    expect(valueIsNonSignalString(nonSigStr)).toBe(true);
  });

  it("should return false for plain string", () => {
    expect(valueIsNonSignalString("hello")).toBe(false);
  });

  it("should return false for non-signal number", () => {
    const nonSigNum = getNonSignalObject(42);
    expect(valueIsNonSignalString(nonSigNum)).toBe(false);
  });

  it("should return false for source signal string", () => {
    const text = signal("hello");
    expect(valueIsNonSignalString(text)).toBe(false);
  });
});

describe("valueIsNonSignalStringArray", () => {
  it("should return true for non-signal string array", () => {
    const nonSigStrArr = getNonSignalObject(["a", "b", "c"]);
    expect(valueIsNonSignalStringArray(nonSigStrArr)).toBe(true);
  });

  it("should return false for non-signal mixed array", () => {
    const nonSigMixed = getNonSignalObject(["a", 1, "b"]);
    expect(valueIsNonSignalStringArray(nonSigMixed)).toBe(false);
  });

  it("should return true for empty array (vacuously true)", () => {
    const nonSigEmpty = getNonSignalObject([]);
    expect(valueIsNonSignalStringArray(nonSigEmpty)).toBe(true);
  });

  it("should return false for plain string array", () => {
    expect(valueIsNonSignalStringArray(["a", "b"])).toBe(false);
  });

  it("should return false for non-signal number array", () => {
    const nonSigNumArr = getNonSignalObject([1, 2, 3]);
    expect(valueIsNonSignalStringArray(nonSigNumArr)).toBe(false);
  });
});

describe("valueIsMaybeSignalValueOfStringOrArray", () => {
  it("should return true for string", () => {
    expect(valueIsMaybeSignalValueOfStringOrArray("hello")).toBe(true);
  });

  it("should return true for array", () => {
    expect(valueIsMaybeSignalValueOfStringOrArray([1, 2, 3])).toBe(true);
  });

  it("should return true for signal string", () => {
    const text = signal("hello");
    expect(valueIsMaybeSignalValueOfStringOrArray(text)).toBe(true);
  });

  it("should return true for signal array", () => {
    const arr = signal([1, 2, 3]);
    expect(valueIsMaybeSignalValueOfStringOrArray(arr)).toBe(true);
  });

  it("should return true for non-signal string", () => {
    const nonSig = getNonSignalObject("hello");
    expect(valueIsMaybeSignalValueOfStringOrArray(nonSig)).toBe(true);
  });

  it("should return true for non-signal array", () => {
    const nonSig = getNonSignalObject([1, 2, 3]);
    expect(valueIsMaybeSignalValueOfStringOrArray(nonSig)).toBe(true);
  });

  it("should return false for number", () => {
    expect(valueIsMaybeSignalValueOfStringOrArray(42)).toBe(false);
  });

  it("should return false for boolean", () => {
    expect(valueIsMaybeSignalValueOfStringOrArray(true)).toBe(false);
  });

  it("should return false for object", () => {
    expect(valueIsMaybeSignalValueOfStringOrArray({})).toBe(false);
  });

  it("should return false for null", () => {
    expect(valueIsMaybeSignalValueOfStringOrArray(null)).toBe(false);
  });

  it("should return false for undefined", () => {
    expect(valueIsMaybeSignalValueOfStringOrArray(undefined)).toBe(false);
  });
});

describe("getNonSignalObject", () => {
  it("should create non-signal object", () => {
    const nonSig = getNonSignalObject(42);
    expect(nonSig.type).toBe("non-signal");
    expect(nonSig.value).toBe(42);
  });

  it("should handle string", () => {
    const nonSig = getNonSignalObject("hello");
    expect(nonSig.type).toBe("non-signal");
    expect(nonSig.value).toBe("hello");
  });

  it("should handle object", () => {
    const nonSig = getNonSignalObject({ name: "test" });
    expect(nonSig.type).toBe("non-signal");
    expect(nonSig.value).toEqual({ name: "test" });
  });

  it("should handle array", () => {
    const nonSig = getNonSignalObject([1, 2, 3]);
    expect(nonSig.type).toBe("non-signal");
    expect(nonSig.value).toEqual([1, 2, 3]);
  });

  it("should handle null", () => {
    const nonSig = getNonSignalObject(null);
    expect(nonSig.type).toBe("non-signal");
    expect(nonSig.value).toBe(null);
  });

  it("should handle undefined", () => {
    const nonSig = getNonSignalObject(undefined);
    expect(nonSig.type).toBe("non-signal");
    expect(nonSig.value).toBe(undefined);
  });
});
