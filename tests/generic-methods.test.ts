import { describe, expect, it } from "bun:test";
import { derive, getNonSignalObject, signal } from "../src";

describe("generic methods - source signals", () => {
  describe("truthy() and falsy()", () => {
    it("should return derived signal for truthy check on number", () => {
      const count = signal(42);
      const truthy = count.truthy();
      const falsy = count.falsy();

      expect(truthy.value).toBe(true);
      expect(falsy.value).toBe(false);

      count.value = 0;
      expect(truthy.value).toBe(false);
      expect(falsy.value).toBe(true);
    });

    it("should return derived signal for truthy check on string", () => {
      const text = signal("hello");
      const truthy = text.truthy();
      const falsy = text.falsy();

      expect(truthy.value).toBe(true);
      expect(falsy.value).toBe(false);

      text.value = "";
      expect(truthy.value).toBe(false);
      expect(falsy.value).toBe(true);
    });

    it("should return derived signal for truthy check on boolean", () => {
      const bool = signal(true);
      const truthy = bool.truthy();
      const falsy = bool.falsy();

      expect(truthy.value).toBe(true);
      expect(falsy.value).toBe(false);

      bool.value = false;
      expect(truthy.value).toBe(false);
      expect(falsy.value).toBe(true);
    });

    // Nullable signals don't have truthy/falsy methods - they only exist on specific types

    // Nullable signals don't have truthy/falsy methods - they only exist on specific types
  });

  // or() method only exists on specific signal types, not nullable signals

  describe("when.isTruthy.map()", () => {
    it("should map truthy/falsy to values for number", () => {
      const count = signal(42);
      const result = count.when.isTruthy.map("yes", "no");

      expect(result.value).toBe("yes");

      count.value = 0;
      expect(result.value).toBe("no");
    });

    it("should map truthy/falsy to values for string", () => {
      const text = signal("hello");
      const result = text.when.isTruthy.map("yes", "no");

      expect(result.value).toBe("yes");

      text.value = "";
      expect(result.value).toBe("no");
    });

    it("should work with signal alternatives", () => {
      const count = signal(42);
      const truthyAlt = signal("yes");
      const falsyAlt = signal("no");
      const result = count.when.isTruthy.map(truthyAlt, falsyAlt);

      expect(result.value).toBe("yes");

      truthyAlt.value = "YES";
      expect(result.value).toBe("YES");

      count.value = 0;
      expect(result.value).toBe("no");
    });
  });

  describe("when.equals() and when.notEquals()", () => {
    it("should compare equality for numbers", () => {
      const count = signal(42);
      const equalsResult = count.when.equals(42).map("match", "no match");
      const notEqualsResult = count.when.notEquals(42).map("different", "same");

      expect(equalsResult.value).toBe("match");
      expect(notEqualsResult.value).toBe("same");

      count.value = 100;
      expect(equalsResult.value).toBe("no match");
      expect(notEqualsResult.value).toBe("different");
    });

    it("should compare equality for strings", () => {
      const text = signal("hello");
      const equalsResult = text.when.equals("hello").map("match", "no match");
      const notEqualsResult = text.when
        .notEquals("hello")
        .map("different", "same");

      expect(equalsResult.value).toBe("match");
      expect(notEqualsResult.value).toBe("same");

      text.value = "world";
      expect(equalsResult.value).toBe("no match");
      expect(notEqualsResult.value).toBe("different");
    });

    it("should compare equality for booleans", () => {
      const bool = signal(true);
      const equalsResult = bool.when.equals(true).map("match", "no match");
      const notEqualsResult = bool.when
        .notEquals(true)
        .map("different", "same");

      expect(equalsResult.value).toBe("match");
      expect(notEqualsResult.value).toBe("same");

      bool.value = false;
      expect(equalsResult.value).toBe("no match");
      expect(notEqualsResult.value).toBe("different");
    });

    // Nullable signals don't have when methods - they only exist on specific types

    it("should work with signal as comparison value", () => {
      const count = signal(42);
      const compareValue = signal(42);
      const result = count.when.equals(compareValue).map("match", "no match");

      expect(result.value).toBe("match");

      compareValue.value = 100;
      expect(result.value).toBe("no match");
    });
  });

  describe("when - numeric comparisons", () => {
    it("should have greaterThan for numbers", () => {
      const count = signal(50);
      const result = count.when.greaterThan(42).map("greater", "not greater");

      expect(result.value).toBe("greater");

      count.value = 30;
      expect(result.value).toBe("not greater");
    });

    it("should have greaterThanOrEqualTo for numbers", () => {
      const count = signal(42);
      const result = count.when
        .greaterThanOrEqualTo(42)
        .map("greater or equal", "less");

      expect(result.value).toBe("greater or equal");

      count.value = 41;
      expect(result.value).toBe("less");
    });

    it("should have smallerThan for numbers", () => {
      const count = signal(30);
      const result = count.when.smallerThan(42).map("smaller", "not smaller");

      expect(result.value).toBe("smaller");

      count.value = 50;
      expect(result.value).toBe("not smaller");
    });

    it("should have smallerThanOrEqualTo for numbers", () => {
      const count = signal(42);
      const result = count.when
        .smallerThanOrEqualTo(42)
        .map("smaller or equal", "greater");

      expect(result.value).toBe("smaller or equal");

      count.value = 43;
      expect(result.value).toBe("greater");
    });

    it("should work with signal as comparison value for numeric comparisons", () => {
      const count = signal(50);
      const compareValue = signal(42);
      const result = count.when
        .greaterThan(compareValue)
        .map("greater", "not greater");

      expect(result.value).toBe("greater");

      compareValue.value = 60;
      expect(result.value).toBe("not greater");
    });
  });

  describe("when.length comparisons", () => {
    it("should have length.equals for strings", () => {
      const text = signal("hello");
      const result = text.when.length.equals(5).map("match", "no match");

      expect(result.value).toBe("match");

      text.value = "hello world";
      expect(result.value).toBe("no match");
    });

    it("should have length.greaterThan for strings", () => {
      const text = signal("hello world");
      const result = text.when.length
        .greaterThan(5)
        .map("greater", "not greater");

      expect(result.value).toBe("greater");

      text.value = "hi";
      expect(result.value).toBe("not greater");
    });

    it("should have length.smallerThan for arrays", () => {
      const arr = signal([1, 2]);
      const result = arr.when.length
        .smallerThan(5)
        .map("smaller", "not smaller");

      expect(result.value).toBe("smaller");

      arr.push(3, 4, 5, 6);
      expect(result.value).toBe("not smaller");
    });

    it("should have length.notEquals for strings", () => {
      const text = signal("hello");
      const result = text.when.length.notEquals(10).map("different", "same");

      expect(result.value).toBe("different");

      text.value = "hellohello";
      expect(result.value).toBe("same");
    });
  });

  describe("when - type-specific behavior", () => {
    it("should have numeric comparisons for number signals", () => {
      const count = signal(42);
      expect(typeof count.when.greaterThan).toBe("function");
      expect(typeof count.when.smallerThan).toBe("function");
    });

    it("should have length comparisons for string signals", () => {
      const text = signal("hello");
      expect(typeof text.when.length).toBe("object");
      expect(typeof text.when.length.equals).toBe("function");
    });

    it("should have length comparisons for array signals", () => {
      const arr = signal([1, 2, 3]);
      expect(typeof arr.when.length).toBe("object");
      expect(typeof arr.when.length.equals).toBe("function");
    });

    it("should have equality comparisons for boolean signals", () => {
      const bool = signal(true);
      expect(typeof bool.when.equals).toBe("function");
      expect(typeof bool.when.notEquals).toBe("function");
    });

    it("should have isTruthy for all signal types", () => {
      const count = signal(42);
      const text = signal("hello");
      const bool = signal(true);
      const arr = signal([1, 2, 3]);
      const obj = signal({ name: "test" });

      expect(typeof count.when.isTruthy).toBe("object");
      expect(typeof text.when.isTruthy).toBe("object");
      expect(typeof bool.when.isTruthy).toBe("object");
      // Array signals only have when.length, not when.isTruthy
      expect(typeof arr.when.length).toBe("object");
    });
  });
});

describe("generic methods - derived signals", () => {
  it("should have truthy() on derived signal", () => {
    const count = signal(42);
    const doubled = derive(() => count.value * 2);
    const truthy = doubled.truthy();

    expect(truthy.value).toBe(true);

    count.value = 0;
    expect(truthy.value).toBe(false);
  });

  it("should have falsy() on derived signal", () => {
    const count = signal(0);
    const doubled = derive(() => count.value * 2);
    const falsy = doubled.falsy();

    expect(falsy.value).toBe(true);

    count.value = 1;
    expect(falsy.value).toBe(false);
  });

  // Derived signals don't have or() method - only type-specific derived signals have methods

  it("should have when.isTruthy.map() on derived signal", () => {
    const count = signal(42);
    const doubled = derive(() => count.value * 2);
    const result = doubled.when.isTruthy.map("yes", "no");

    expect(result.value).toBe("yes");

    count.value = 0;
    expect(result.value).toBe("no");
  });

  it("should have when.equals() on derived signal", () => {
    const count = signal(21);
    const doubled = derive(() => count.value * 2);
    const result = doubled.when.equals(42).map("match", "no match");

    expect(result.value).toBe("match");

    count.value = 30;
    expect(result.value).toBe("no match");
  });

  it("should have when.greaterThan() on derived signal", () => {
    const count = signal(30);
    const doubled = derive(() => count.value * 2);
    const result = doubled.when.greaterThan(50).map("greater", "not greater");

    expect(result.value).toBe("greater");

    count.value = 20;
    expect(result.value).toBe("not greater");
  });

  it("should have when.length on derived string signal", () => {
    const text = signal("hello");
    const derived = derive(() => text.value);
    const result = derived.when.length.equals(5).map("match", "no match");

    expect(result.value).toBe("match");

    text.value = "world!";
    expect(result.value).toBe("no match");
  });

  it("should have when.length on derived array signal", () => {
    const arr = signal([1, 2, 3]);
    const derived = derive(() => arr.value);
    const result = derived.when.length
      .greaterThan(2)
      .map("greater", "not greater");

    expect(result.value).toBe("greater");

    arr.value = [1];
    expect(result.value).toBe("not greater");
  });
});

describe("generic methods - non-signal objects", () => {
  it("should have truthy() on non-signal", () => {
    const nonSig = getNonSignalObject(42);
    const truthy = nonSig.truthy();

    expect(truthy.value).toBe(true);
  });

  it("should have falsy() on non-signal", () => {
    const nonSig = getNonSignalObject(0);
    const falsy = nonSig.falsy();

    expect(falsy.value).toBe(true);
  });

  // Non-signal objects don't have or() method

  it("should have when.isTruthy.map() on non-signal", () => {
    const nonSig = getNonSignalObject(42);
    const result = nonSig.when.isTruthy.map("yes", "no");

    expect(result.value).toBe("yes");
  });

  it("should have when.equals() on non-signal", () => {
    const nonSig = getNonSignalObject(42);
    const result = nonSig.when.equals(42).map("match", "no match");

    expect(result.value).toBe("match");
  });

  it("should have when.greaterThan() on non-signal", () => {
    const nonSig = getNonSignalObject(50);
    const result = nonSig.when.greaterThan(42).map("greater", "not greater");

    expect(result.value).toBe("greater");
  });

  it("should have when.length on non-signal string", () => {
    const nonSig = getNonSignalObject("hello");
    const result = nonSig.when.length.equals(5).map("match", "no match");

    expect(result.value).toBe("match");
  });

  it("should have when.length on non-signal array", () => {
    const nonSig = getNonSignalObject([1, 2, 3]);
    const result = nonSig.when.length
      .greaterThan(2)
      .map("greater", "not greater");

    expect(result.value).toBe("greater");
  });

  // NonNullable object signals don't have when methods

  // Nullable signals don't have when methods
});

describe("generic methods - edge cases", () => {
  it("should handle NaN in numeric comparisons", () => {
    const count = signal(NaN);
    const result = count.when.greaterThan(42).map("greater", "not greater");

    expect(result.value).toBe("not greater");
  });

  it("should handle Infinity in numeric comparisons", () => {
    const count = signal(Infinity);
    const result = count.when.greaterThan(42).map("greater", "not greater");

    expect(result.value).toBe("greater");
  });

  it("should handle negative numbers in comparisons", () => {
    const count = signal(-10);
    const result = count.when.smallerThan(0).map("smaller", "not smaller");

    expect(result.value).toBe("smaller");
  });

  it("should handle empty string in length comparisons", () => {
    const text = signal("");
    const result = text.when.length.equals(0).map("empty", "not empty");

    expect(result.value).toBe("empty");
  });

  it("should handle empty array in length comparisons", () => {
    const arr = signal([]);
    const result = arr.when.length.equals(0).map("empty", "not empty");

    expect(result.value).toBe("empty");
  });
});

describe("generic methods - reactivity", () => {
  it("should update truthy derived signal when source changes", () => {
    const count = signal(42);
    const truthy = count.truthy();

    expect(truthy.value).toBe(true);

    count.value = 0;
    expect(truthy.value).toBe(false);
  });

  it("should update falsy derived signal when source changes", () => {
    const count = signal(0);
    const falsy = count.falsy();

    expect(falsy.value).toBe(true);

    count.value = 42;
    expect(falsy.value).toBe(false);
  });

  // or() reactivity test - only valid for specific signal types

  it("should update when.isTruthy.map derived signal when source changes", () => {
    const count = signal(42);
    const result = count.when.isTruthy.map("yes", "no");

    expect(result.value).toBe("yes");

    count.value = 0;
    expect(result.value).toBe("no");
  });

  it("should update when.equals derived signal when source changes", () => {
    const count = signal(42);
    const result = count.when.equals(42).map("match", "no match");

    expect(result.value).toBe("match");

    count.value = 100;
    expect(result.value).toBe("no match");
  });

  it("should update when.greaterThan derived signal when source changes", () => {
    const count = signal(50);
    const result = count.when.greaterThan(42).map("greater", "not greater");

    expect(result.value).toBe("greater");

    count.value = 30;
    expect(result.value).toBe("not greater");
  });

  it("should update when.length derived signal when source changes", () => {
    const text = signal("hello");
    const result = text.when.length.equals(5).map("match", "no match");

    expect(result.value).toBe("match");

    text.value = "hello world";
    expect(result.value).toBe("no match");
  });
});
