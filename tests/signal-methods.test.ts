import { describe, expect, it } from "bun:test";
import { derive, nullable, mutable, DeadSignal } from "../src";

describe("generic methods - source signals", () => {
  describe("truthy() and falsy()", () => {
    it("should return derived signal for truthy check on number", () => {
      const count = mutable(42);
      const truthy = count.isTruthy;
      const falsy = count.isFalsy;

      expect(truthy.value).toBe(true);
      expect(falsy.value).toBe(false);

      count.value = 0;
      expect(truthy.value).toBe(false);
      expect(falsy.value).toBe(true);
    });

    it("should return derived signal for truthy check on string", () => {
      const text = mutable("hello");
      const truthy = text.isTruthy;
      const falsy = text.isFalsy;

      expect(truthy.value).toBe(true);
      expect(falsy.value).toBe(false);

      text.value = "";
      expect(truthy.value).toBe(false);
      expect(falsy.value).toBe(true);
    });

    it("should return derived signal for truthy check on boolean", () => {
      const bool = mutable(true);
      const truthy = bool.isTruthy;
      const falsy = bool.isFalsy;

      expect(truthy.value).toBe(true);
      expect(falsy.value).toBe(false);

      bool.value = false;
      expect(truthy.value).toBe(false);
      expect(falsy.value).toBe(true);
    });

    // Nullable signals don't have truthy/falsy methods - they only exist on specific types

    // Nullable signals don't have truthy/falsy methods - they only exist on specific types
  });

  describe("or()", () => {
    it("should return alternative when value is null", () => {
      const nullSignal = mutable<number | null>(null);
      const orValue = nullSignal.or(100);

      expect(orValue.value).toBe(100);

      nullSignal.value = 42;
      expect(orValue.value).toBe(42);
    });

    it("should return alternative when value is undefined", () => {
      const undefinedSignal = mutable<number | undefined>(undefined);
      const orValue = undefinedSignal.or(100);

      expect(orValue.value).toBe(100);

      undefinedSignal.value = 42;
      expect(orValue.value).toBe(42);
    });

    it("should work with signal as alternative", () => {
      const nullSignal = mutable<number | null>(null);
      const alternative = mutable(100);
      const orValue = nullSignal.or(alternative);

      expect(orValue.value).toBe(100);

      alternative.value = 200;
      expect(orValue.value).toBe(200);

      nullSignal.value = 42;
      expect(orValue.value).toBe(42);
    });

    it("should work with string values", () => {
      const text = mutable<string | null>(null);
      const orValue = text.or("default");

      expect(orValue.value).toBe("default");

      text.value = "hello";
      expect(orValue.value).toBe("hello");
    });
  });

  describe("when.isTruthy.then()", () => {
    it("should map truthy/falsy to values for number", () => {
      const count = mutable(42);
      const result = count.when.isTruthy.then("yes", "no");

      expect(result.value).toBe("yes");

      count.value = 0;
      expect(result.value).toBe("no");
    });

    it("should map truthy/falsy to values for string", () => {
      const text = mutable("hello");
      const result = text.when.isTruthy.then("yes", "no");

      expect(result.value).toBe("yes");

      text.value = "";
      expect(result.value).toBe("no");
    });

    it("should work with signal alternatives", () => {
      const count = mutable(42);
      const truthyAlt = mutable("yes");
      const falsyAlt = mutable("no");
      const result = count.when.isTruthy.then(truthyAlt, falsyAlt);

      expect(result.value).toBe("yes");

      truthyAlt.value = "YES";
      expect(result.value).toBe("YES");

      count.value = 0;
      expect(result.value).toBe("no");
    });
  });

  describe("is.isEqualTo() and is.isNotEqualTo()", () => {
    it("should compare equality for numbers", () => {
      const count = mutable(42);
      const equalsResult = count.isEqualTo(42);
      const notEqualsResult = count.isNotEqualTo(42);

      expect(equalsResult.value).toBe(true);
      expect(notEqualsResult.value).toBe(false);

      count.value = 100;
      expect(equalsResult.value).toBe(false);
      expect(notEqualsResult.value).toBe(true);
    });

    it("should compare equality for strings", () => {
      const text = mutable("hello");
      const equalsResult = text.isEqualTo("hello");
      const notEqualsResult = text.isNotEqualTo("hello");

      expect(equalsResult.value).toBe(true);
      expect(notEqualsResult.value).toBe(false);

      text.value = "world";
      expect(equalsResult.value).toBe(false);
      expect(notEqualsResult.value).toBe(true);
    });

    it("should compare equality for booleans", () => {
      const bool = mutable(true);
      const equalsResult = bool.isEqualTo(true);
      const notEqualsResult = bool.isNotEqualTo(true);

      expect(equalsResult.value).toBe(true);
      expect(notEqualsResult.value).toBe(false);

      bool.value = false;
      expect(equalsResult.value).toBe(false);
      expect(notEqualsResult.value).toBe(true);
    });

    it("should work with signal as comparison value", () => {
      const count = mutable(42);
      const compareValue = mutable(42);
      const result = count.isEqualTo(compareValue);

      expect(result.value).toBe(true);

      compareValue.value = 100;
      expect(result.value).toBe(false);
    });
  });

  describe("when.isEqualTo.then() and when.isNotEqualTo.then()", () => {
    it("should compare equality for numbers with ternary", () => {
      const count = mutable(42);
      const equalsResult = count.when.isEqualTo(42).then("match", "no match");
      const notEqualsResult = count.when
        .isNotEqualTo(42)
        .then("different", "same");

      expect(equalsResult.value).toBe("match");
      expect(notEqualsResult.value).toBe("same");

      count.value = 100;
      expect(equalsResult.value).toBe("no match");
      expect(notEqualsResult.value).toBe("different");
    });
  });

  describe("when - numeric comparisons", () => {
    it("should have greaterThan for numbers", () => {
      const count = mutable(50);
      const result = count.when
        .isGreaterThan(42)
        .then("greater", "not greater");

      expect(result.value).toBe("greater");

      count.value = 30;
      expect(result.value).toBe("not greater");
    });

    it("should have greaterThanOrEqualTo for numbers", () => {
      const count = mutable(42);
      const result = count.when
        .isGreaterThanOrEqualTo(42)
        .then("greater or equal", "less");

      expect(result.value).toBe("greater or equal");

      count.value = 41;
      expect(result.value).toBe("less");
    });

    it("should have smallerThan for numbers", () => {
      const count = mutable(30);
      const result = count.when
        .isSmallerThan(42)
        .then("smaller", "not smaller");

      expect(result.value).toBe("smaller");

      count.value = 50;
      expect(result.value).toBe("not smaller");
    });

    it("should have smallerThanOrEqualTo for numbers", () => {
      const count = mutable(42);
      const result = count.when
        .isSmallerThanOrEqualTo(42)
        .then("smaller or equal", "greater");

      expect(result.value).toBe("smaller or equal");

      count.value = 43;
      expect(result.value).toBe("greater");
    });

    it("should work with signal as comparison value for numeric comparisons", () => {
      const count = mutable(50);
      const compareValue = mutable(42);
      const result = count.when
        .isGreaterThan(compareValue)
        .then("greater", "not greater");

      expect(result.value).toBe("greater");

      compareValue.value = 60;
      expect(result.value).toBe("not greater");
    });
  });

  describe("is.length comparisons", () => {
    it("should have length.isEqualTo for strings", () => {
      const text = mutable("hello");
      const result = text.length.isEqualTo(5);

      expect(result.value).toBe(true);

      text.value = "hello world";
      expect(result.value).toBe(false);
    });

    it("should have length.isGreaterThan for strings", () => {
      const text = mutable("hello world");
      const result = text.length.isGreaterThan(5);

      expect(result.value).toBe(true);

      text.value = "hi";
      expect(result.value).toBe(false);
    });

    it("should have length.isSmallerThan for arrays", () => {
      const arr = mutable([1, 2]);
      const result = arr.length.isSmallerThan(5);

      expect(result.value).toBe(true);

      arr.push(3, 4, 5, 6);
      expect(result.value).toBe(false);
    });

    it("should have length.isNotEqualTo for strings", () => {
      const text = mutable("hello");
      const result = text.length.isNotEqualTo(10);

      expect(result.value).toBe(true);

      text.value = "hellohello";
      expect(result.value).toBe(false);
    });
  });

  describe("when - type-specific behavior", () => {
    it("should have numeric comparisons for number signals", () => {
      const count = mutable(42);
      expect(typeof count.when.isGreaterThan).toBe("function");
      expect(typeof count.when.isSmallerThan).toBe("function");
    });

    it("should have length comparisons for string signals", () => {
      const text = mutable("hello");
      expect(typeof text.when.length).toBe("object");
      expect(typeof text.when.length.isEqualTo).toBe("function");
    });

    it("should have length comparisons for array signals", () => {
      const arr = mutable([1, 2, 3]);
      expect(typeof arr.when.length).toBe("object");
      expect(typeof arr.when.length.isEqualTo).toBe("function");
    });

    it("should have equality comparisons for boolean signals", () => {
      const bool = mutable(true);
      expect(typeof bool.when.isEqualTo).toBe("function");
      expect(typeof bool.when.isNotEqualTo).toBe("function");
    });

    it("should have truthy for primitive signal types", () => {
      const count = mutable(42);
      const text = mutable("hello");
      const bool = mutable(true);

      expect(typeof count.isTruthy).toBe("function");
      expect(typeof text.isTruthy).toBe("function");
      expect(typeof bool.isTruthy).toBe("function");
    });

    it("should have length for array and string signals", () => {
      const arr = mutable([1, 2, 3]);
      const text = mutable("hello");

      expect(typeof arr.length).toBe("object");
      expect(typeof text.length).toBe("object");
    });
  });
});

describe("generic methods - derived signals", () => {
  // Derived signals don't have logical methods directly
  // They need to be wrapped with nullable() to get logical methods

  it("should have when.isTruthy.then() on derived signal via nullable", () => {
    const count = mutable(42);
    const doubled = derive(() => count.value * 2);
    const withLogical = nullable(doubled);
    const result = withLogical.when.isTruthy.then("yes", "no");

    expect(result.value).toBe("yes");

    count.value = 0;
    expect(result.value).toBe("no");
  });

  it("should have when.isEqualTo() on derived signal via nullable", () => {
    const count = mutable(21);
    const doubled = derive(() => count.value * 2);
    const withLogical = nullable(doubled);
    const result = withLogical.when.isEqualTo(42).then("match", "no match");

    expect(result.value).toBe("match");

    count.value = 30;
    expect(result.value).toBe("no match");
  });

  it("should have when.isGreaterThan() on derived signal via nullable", () => {
    const count = mutable(30);
    const doubled = derive(() => count.value * 2);
    const withLogical = nullable(doubled);
    const result = withLogical.when
      .isGreaterThan(50)
      .then("greater", "not greater");

    expect(result.value).toBe("greater");

    count.value = 20;
    expect(result.value).toBe("not greater");
  });

  it("should have is.length on derived string signal via nullable", () => {
    const text = mutable("hello");
    const derived = derive(() => text.value);
    const withLogical = nullable(derived);
    const result = withLogical.length.isEqualTo(5);

    expect(result.value).toBe(true);

    text.value = "world!";
    expect(result.value).toBe(false);
  });

  // Arrays are not primitives, so nullable doesn't work with them
  // Array derived signals have logical methods directly
});

describe("generic methods - dead-signal objects", () => {
  // Non-signal objects need to be wrapped with nullable() to get logical methods

  it("should have is.isTruthy on dead-signal via nullable", () => {
    const nonSig = new DeadSignal(() => 42);
    const withLogical = nullable(nonSig);
    const truthy = withLogical.isTruthy;

    expect(truthy.value).toBe(true);
  });

  it("should have is.isFalsy on dead-signal via nullable", () => {
    const nonSig = new DeadSignal(() => 0);
    const withLogical = nullable(nonSig);
    const falsy = withLogical.isFalsy;

    expect(falsy.value).toBe(true);
  });

  it("should have or() on dead-signal via nullable", () => {
    const nonSig = new DeadSignal<number | null>(() => null);
    const withLogical = nullable(nonSig);
    const orValue = withLogical.or(100);

    expect(orValue.value).toBe(100);
  });

  it("should have when.isTruthy.then() on dead-signal via nullable", () => {
    const nonSig = new DeadSignal(() => 42);
    const withLogical = nullable(nonSig);
    const result = withLogical.when.isTruthy.then("yes", "no");

    expect(result.value).toBe("yes");
  });

  it("should have when.isEqualTo() on dead-signal via nullable", () => {
    const nonSig = new DeadSignal(() => 42);
    const withLogical = nullable(nonSig);
    const result = withLogical.when.isEqualTo(42).then("match", "no match");

    expect(result.value).toBe("match");
  });

  it("should have when.isGreaterThan() on dead-signal via nullable", () => {
    const nonSig = new DeadSignal(() => 50);
    const withLogical = nullable(nonSig);
    const result = withLogical.when
      .isGreaterThan(42)
      .then("greater", "not greater");

    expect(result.value).toBe("greater");
  });

  it("should have is.length on dead-signal string via nullable", () => {
    const nonSig = new DeadSignal(() => "hello");
    const withLogical = nullable(nonSig);
    const result = withLogical.length.isEqualTo(5);

    expect(result.value).toBe(true);
  });

  // Arrays are not primitives, so nullable doesn't work with them
});

describe("generic methods - edge cases", () => {
  it("should handle NaN in numeric comparisons", () => {
    const count = mutable(NaN);
    const result = count.isGreaterThan(42);

    expect(result.value).toBe(false);
  });

  it("should handle Infinity in numeric comparisons", () => {
    const count = mutable(Infinity);
    const result = count.isGreaterThan(42);

    expect(result.value).toBe(true);
  });

  it("should handle negative numbers in comparisons", () => {
    const count = mutable(-10);
    const result = count.isSmallerThan(0);

    expect(result.value).toBe(true);
  });

  it("should handle empty string in length comparisons", () => {
    const text = mutable("");
    const result = text.length.isEqualTo(0);

    expect(result.value).toBe(true);
  });

  it("should handle empty array in length comparisons", () => {
    const arr = mutable([]);
    const result = arr.length.isEqualTo(0);

    expect(result.value).toBe(true);
  });
});

describe("generic methods - reactivity", () => {
  it("should update truthy derived signal when source changes", () => {
    const count = mutable(42);
    const truthy = count.isTruthy;

    expect(truthy.value).toBe(true);

    count.value = 0;
    expect(truthy.value).toBe(false);
  });

  it("should update falsy derived signal when source changes", () => {
    const count = mutable(0);
    const falsy = count.isFalsy;

    expect(falsy.value).toBe(true);

    count.value = 42;
    expect(falsy.value).toBe(false);
  });

  it("should update or derived signal when source changes", () => {
    const nullSignal = mutable<number | null>(null);
    const orValue = nullSignal.or(100);

    expect(orValue.value).toBe(100);

    nullSignal.value = 42;
    expect(orValue.value).toBe(42);
  });

  it("should update when.isTruthy.then derived signal when source changes", () => {
    const count = mutable(42);
    const result = count.when.isTruthy.then("yes", "no");

    expect(result.value).toBe("yes");

    count.value = 0;
    expect(result.value).toBe("no");
  });

  it("should update when.isEqualTo derived signal when source changes", () => {
    const count = mutable(42);
    const result = count.when.isEqualTo(42).then("match", "no match");

    expect(result.value).toBe("match");

    count.value = 100;
    expect(result.value).toBe("no match");
  });

  it("should update when.isGreaterThan derived signal when source changes", () => {
    const count = mutable(50);
    const result = count.when.isGreaterThan(42).then("greater", "not greater");

    expect(result.value).toBe("greater");

    count.value = 30;
    expect(result.value).toBe("not greater");
  });

  it("should update is.length derived signal when source changes", () => {
    const text = mutable("hello");
    const result = text.length.isEqualTo(5);

    expect(result.value).toBe(true);

    text.value = "hello world";
    expect(result.value).toBe(false);
  });
});
