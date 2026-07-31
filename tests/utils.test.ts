import { describe, it, expect } from "bun:test";
import {
  value,
  valueIsMutableSignal,
  valueIsDerivedSignal,
  valueIsLiveSignal,
  valueIsDeadSignal,
  valueIsSignal,
  valueIsDeadSignalString,
  valueIsDeadSignalStringArray,
  valueIsMaybeSignalValueOfStringOrArray,
  derive,
  mutable,
  DeadSignal,
} from "../src";

describe("value utility", () => {
  it("should return plain value from source signal", () => {
    const count = mutable(43);
    expect(count).toMatchObject({ type: "mutable-signal" });
    expect(value(count)).toBe(43);
  });

  it("should return plain value from derived signal", () => {
    const count = mutable(42);
    const doubled = derive(() => count.value * 2);
    expect(doubled).toMatchObject({ type: "derived-signal" });
    expect(value(doubled)).toBe(84);
  });

  it("should return plain value from dead-signal", () => {
    const nonSig = new DeadSignal(() => 42);
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

describe("valueIsMutableSignal", () => {
  it("should return true for source signal", () => {
    const count = mutable(42);
    expect(valueIsMutableSignal(count)).toBe(true);
  });

  it("should return false for derived signal", () => {
    const count = mutable(42);
    const doubled = derive(() => count.value * 2);
    expect(valueIsMutableSignal(doubled)).toBe(false);
  });

  it("should return false for dead-signal", () => {
    const nonSig = new DeadSignal(() => 42);
    expect(valueIsMutableSignal(nonSig)).toBe(false);
  });

  it("should return false for plain value", () => {
    expect(valueIsMutableSignal(42)).toBe(false);
  });

  it("should return false for null", () => {
    expect(valueIsMutableSignal(null)).toBe(false);
  });

  it("should return false for undefined", () => {
    expect(valueIsMutableSignal(undefined)).toBe(false);
  });
});

describe("valueIsDerivedSignal", () => {
  it("should return true for derived signal", () => {
    const count = mutable(42);
    const doubled = derive(() => count.value * 2);
    expect(valueIsDerivedSignal(doubled)).toBe(true);
  });

  it("should return false for source signal", () => {
    const count = mutable(42);
    expect(valueIsDerivedSignal(count)).toBe(false);
  });

  it("should return false for dead-signal", () => {
    const nonSig = new DeadSignal(() => 42);
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

describe("valueIsLiveSignal", () => {
  it("should return true for source signal", () => {
    const count = mutable(42);
    expect(valueIsLiveSignal(count)).toBe(true);
  });

  it("should return true for derived signal", () => {
    const count = mutable(42);
    const doubled = derive(() => count.value * 2);
    expect(valueIsLiveSignal(doubled)).toBe(true);
  });

  it("should return false for dead-signal", () => {
    const nonSig = new DeadSignal(() => 42);
    expect(valueIsLiveSignal(nonSig)).toBe(false);
  });

  it("should return false for plain value", () => {
    expect(valueIsLiveSignal(42)).toBe(false);
  });

  it("should return false for null", () => {
    expect(valueIsLiveSignal(null)).toBe(false);
  });

  it("should return false for undefined", () => {
    expect(valueIsLiveSignal(undefined)).toBe(false);
  });
});

describe("valueIsDeadSignal", () => {
  it("should return true for dead-signal", () => {
    const nonSig = new DeadSignal(() => 42);
    expect(valueIsDeadSignal(nonSig)).toBe(true);
  });

  it("should return false for source signal", () => {
    const count = mutable(42);
    expect(valueIsDeadSignal(count)).toBe(false);
  });

  it("should return false for derived signal", () => {
    const count = mutable(42);
    const doubled = derive(() => count.value * 2);
    expect(valueIsDeadSignal(doubled)).toBe(false);
  });

  it("should return false for plain value", () => {
    expect(valueIsDeadSignal(42)).toBe(false);
  });

  it("should return false for null", () => {
    expect(valueIsDeadSignal(null)).toBe(false);
  });

  it("should return true for dead-signal with matching type", () => {
    const nonSig = new DeadSignal(() => 42);
    expect(valueIsDeadSignal(nonSig, ["number"])).toBe(true);
  });

  it("should return false for dead-signal with non-matching type", () => {
    const nonSig = new DeadSignal(() => 42);
    expect(valueIsDeadSignal(nonSig, ["string"])).toBe(false);
  });

  it("should return true for dead-signal with one of multiple matching types", () => {
    const nonSig = new DeadSignal(() => 42);
    expect(valueIsDeadSignal(nonSig, ["string", "number"])).toBe(true);
  });

  it("should handle empty types array", () => {
    const nonSig = new DeadSignal(() => 42);
    expect(valueIsDeadSignal(nonSig, [])).toBe(true);
  });
});

describe("valueIsSignal", () => {
  it("should return true for source signal", () => {
    const count = mutable(42);
    expect(valueIsSignal(count)).toBe(true);
  });

  it("should return true for derived signal", () => {
    const count = mutable(42);
    const doubled = derive(() => count.value * 2);
    expect(valueIsSignal(doubled)).toBe(true);
  });

  it("should return true for dead-signal", () => {
    const nonSig = new DeadSignal(() => 42);
    expect(valueIsSignal(nonSig)).toBe(true);
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

describe("valueIsDeadSignalString", () => {
  it("should return true for dead-signal string", () => {
    const nonSigStr = new DeadSignal(() => "hello");
    expect(valueIsDeadSignalString(nonSigStr)).toBe(true);
  });

  it("should return false for plain string", () => {
    expect(valueIsDeadSignalString("hello")).toBe(false);
  });

  it("should return false for dead-signal number", () => {
    const nonSigNum = new DeadSignal(() => 42);
    expect(valueIsDeadSignalString(nonSigNum)).toBe(false);
  });

  it("should return false for source signal string", () => {
    const text = mutable("hello");
    expect(valueIsDeadSignalString(text)).toBe(false);
  });
});

describe("valueIsDeadSignalStringArray", () => {
  it("should return true for dead-signal string array", () => {
    const nonSigStrArr = new DeadSignal(() => ["a", "b", "c"]);
    expect(valueIsDeadSignalStringArray(nonSigStrArr)).toBe(true);
  });

  it("should return false for dead-signal mixed array", () => {
    const nonSigMixed = new DeadSignal(() => ["a", 1, "b"]);
    expect(valueIsDeadSignalStringArray(nonSigMixed)).toBe(false);
  });

  it("should return true for empty array (vacuously true)", () => {
    const nonSigEmpty = new DeadSignal(() => []);
    expect(valueIsDeadSignalStringArray(nonSigEmpty)).toBe(true);
  });

  it("should return false for plain string array", () => {
    expect(valueIsDeadSignalStringArray(["a", "b"])).toBe(false);
  });

  it("should return false for dead-signal number array", () => {
    const nonSigNumArr = new DeadSignal(() => [1, 2, 3]);
    expect(valueIsDeadSignalStringArray(nonSigNumArr)).toBe(false);
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
    const text = mutable("hello");
    expect(valueIsMaybeSignalValueOfStringOrArray(text)).toBe(true);
  });

  it("should return true for signal array", () => {
    const arr = mutable([1, 2, 3]);
    expect(valueIsMaybeSignalValueOfStringOrArray(arr)).toBe(true);
  });

  it("should return true for dead-signal string", () => {
    const nonSig = new DeadSignal(() => "hello");
    expect(valueIsMaybeSignalValueOfStringOrArray(nonSig)).toBe(true);
  });

  it("should return true for dead-signal array", () => {
    const nonSig = new DeadSignal(() => [1, 2, 3]);
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

describe("DeadSignal", () => {
  it("should create dead-signal object", () => {
    const nonSig = new DeadSignal(() => 42);
    expect(nonSig.type).toBe("dead-signal");
    expect(nonSig.value).toBe(42);
  });

  it("should handle string", () => {
    const nonSig = new DeadSignal(() => "hello");
    expect(nonSig.type).toBe("dead-signal");
    expect(nonSig.value).toBe("hello");
  });

  it("should handle object", () => {
    const nonSig = new DeadSignal(() => ({ name: "test" }));
    expect(nonSig.type).toBe("dead-signal");
    expect(nonSig.value).toEqual({ name: "test" });
  });

  it("should handle array", () => {
    const nonSig = new DeadSignal(() => [1, 2, 3]);
    expect(nonSig.type).toBe("dead-signal");
    expect(nonSig.value).toEqual([1, 2, 3]);
  });

  it("should handle null", () => {
    const nonSig = new DeadSignal(() => null);
    expect(nonSig.type).toBe("dead-signal");
    expect(nonSig.value).toBe(null);
  });

  it("should handle undefined", () => {
    const nonSig = new DeadSignal(() => undefined);
    expect(nonSig.type).toBe("dead-signal");
    expect(nonSig.value).toBe(undefined);
  });
});
