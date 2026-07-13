import { describe, expect, it } from "bun:test";
import { derive, getNonSignalObject, nullable, signal } from "../src";

describe("generic methods - source signals", () => {
  describe("truthy() and falsy()", () => {
    it("should return derived signal for truthy check on number", () => {
      const count = signal(42);
      const truthy = count.is.truthy();
      const falsy = count.is.falsy();

      expect(truthy.value).toBe(true);
      expect(falsy.value).toBe(false);

      count.value = 0;
      expect(truthy.value).toBe(false);
      expect(falsy.value).toBe(true);
    });

    it("should return derived signal for truthy check on string", () => {
      const text = signal("hello");
      const truthy = text.is.truthy();
      const falsy = text.is.falsy();

      expect(truthy.value).toBe(true);
      expect(falsy.value).toBe(false);

      text.value = "";
      expect(truthy.value).toBe(false);
      expect(falsy.value).toBe(true);
    });

    it("should return derived signal for truthy check on boolean", () => {
      const bool = signal(true);
      const truthy = bool.is.truthy();
      const falsy = bool.is.falsy();

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
      const nullSignal = signal<number | null>(null);
      const orValue = nullSignal.or(100);

      expect(orValue.value).toBe(100);

      nullSignal.value = 42;
      expect(orValue.value).toBe(42);
    });

    it("should return alternative when value is undefined", () => {
      const undefinedSignal = signal<number | undefined>(undefined);
      const orValue = undefinedSignal.or(100);

      expect(orValue.value).toBe(100);

      undefinedSignal.value = 42;
      expect(orValue.value).toBe(42);
    });

    it("should work with signal as alternative", () => {
      const nullSignal = signal<number | null>(null);
      const alternative = signal(100);
      const orValue = nullSignal.or(alternative);

      expect(orValue.value).toBe(100);

      alternative.value = 200;
      expect(orValue.value).toBe(200);

      nullSignal.value = 42;
      expect(orValue.value).toBe(42);
    });

    it("should work with string values", () => {
      const text = signal<string | null>(null);
      const orValue = text.or("default");

      expect(orValue.value).toBe("default");

      text.value = "hello";
      expect(orValue.value).toBe("hello");
    });
  });

  describe("when.truthy().then()", () => {
    it("should map truthy/falsy to values for number", () => {
      const count = signal(42);
      const result = count.when.truthy().then("yes", "no");

      expect(result.value).toBe("yes");

      count.value = 0;
      expect(result.value).toBe("no");
    });

    it("should map truthy/falsy to values for string", () => {
      const text = signal("hello");
      const result = text.when.truthy().then("yes", "no");

      expect(result.value).toBe("yes");

      text.value = "";
      expect(result.value).toBe("no");
    });

    it("should work with signal alternatives", () => {
      const count = signal(42);
      const truthyAlt = signal("yes");
      const falsyAlt = signal("no");
      const result = count.when.truthy().then(truthyAlt, falsyAlt);

      expect(result.value).toBe("yes");

      truthyAlt.value = "YES";
      expect(result.value).toBe("YES");

      count.value = 0;
      expect(result.value).toBe("no");
    });
  });

  describe("is.equalTo() and is.notEqualTo()", () => {
    it("should compare equality for numbers", () => {
      const count = signal(42);
      const equalsResult = count.is.equalTo(42);
      const notEqualsResult = count.is.notEqualTo(42);

      expect(equalsResult.value).toBe(true);
      expect(notEqualsResult.value).toBe(false);

      count.value = 100;
      expect(equalsResult.value).toBe(false);
      expect(notEqualsResult.value).toBe(true);
    });

    it("should compare equality for strings", () => {
      const text = signal("hello");
      const equalsResult = text.is.equalTo("hello");
      const notEqualsResult = text.is.notEqualTo("hello");

      expect(equalsResult.value).toBe(true);
      expect(notEqualsResult.value).toBe(false);

      text.value = "world";
      expect(equalsResult.value).toBe(false);
      expect(notEqualsResult.value).toBe(true);
    });

    it("should compare equality for booleans", () => {
      const bool = signal(true);
      const equalsResult = bool.is.equalTo(true);
      const notEqualsResult = bool.is.notEqualTo(true);

      expect(equalsResult.value).toBe(true);
      expect(notEqualsResult.value).toBe(false);

      bool.value = false;
      expect(equalsResult.value).toBe(false);
      expect(notEqualsResult.value).toBe(true);
    });

    it("should work with signal as comparison value", () => {
      const count = signal(42);
      const compareValue = signal(42);
      const result = count.is.equalTo(compareValue);

      expect(result.value).toBe(true);

      compareValue.value = 100;
      expect(result.value).toBe(false);
    });
  });

  describe("when.equalTo.then() and when.notEqualTo.then()", () => {
    it("should compare equality for numbers with ternary", () => {
      const count = signal(42);
      const equalsResult = count.when.equalTo(42).then("match", "no match");
      const notEqualsResult = count.when
        .notEqualTo(42)
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
      const count = signal(50);
      const result = count.when.greaterThan(42).then("greater", "not greater");

      expect(result.value).toBe("greater");

      count.value = 30;
      expect(result.value).toBe("not greater");
    });

    it("should have greaterThanOrEqualTo for numbers", () => {
      const count = signal(42);
      const result = count.when
        .greaterThanOrEqualTo(42)
        .then("greater or equal", "less");

      expect(result.value).toBe("greater or equal");

      count.value = 41;
      expect(result.value).toBe("less");
    });

    it("should have smallerThan for numbers", () => {
      const count = signal(30);
      const result = count.when.smallerThan(42).then("smaller", "not smaller");

      expect(result.value).toBe("smaller");

      count.value = 50;
      expect(result.value).toBe("not smaller");
    });

    it("should have smallerThanOrEqualTo for numbers", () => {
      const count = signal(42);
      const result = count.when
        .smallerThanOrEqualTo(42)
        .then("smaller or equal", "greater");

      expect(result.value).toBe("smaller or equal");

      count.value = 43;
      expect(result.value).toBe("greater");
    });

    it("should work with signal as comparison value for numeric comparisons", () => {
      const count = signal(50);
      const compareValue = signal(42);
      const result = count.when
        .greaterThan(compareValue)
        .then("greater", "not greater");

      expect(result.value).toBe("greater");

      compareValue.value = 60;
      expect(result.value).toBe("not greater");
    });
  });

  describe("is.length comparisons", () => {
    it("should have length.equalTo for strings", () => {
      const text = signal("hello");
      const result = text.is.length.equalTo(5);

      expect(result.value).toBe(true);

      text.value = "hello world";
      expect(result.value).toBe(false);
    });

    it("should have length.greaterThan for strings", () => {
      const text = signal("hello world");
      const result = text.is.length.greaterThan(5);

      expect(result.value).toBe(true);

      text.value = "hi";
      expect(result.value).toBe(false);
    });

    it("should have length.smallerThan for arrays", () => {
      const arr = signal([1, 2]);
      const result = arr.is.length.smallerThan(5);

      expect(result.value).toBe(true);

      arr.push(3, 4, 5, 6);
      expect(result.value).toBe(false);
    });

    it("should have length.notEqualTo for strings", () => {
      const text = signal("hello");
      const result = text.is.length.notEqualTo(10);

      expect(result.value).toBe(true);

      text.value = "hellohello";
      expect(result.value).toBe(false);
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
      expect(typeof text.when.length.equalTo).toBe("function");
    });

    it("should have length comparisons for array signals", () => {
      const arr = signal([1, 2, 3]);
      expect(typeof arr.when.length).toBe("object");
      expect(typeof arr.when.length.equalTo).toBe("function");
    });

    it("should have equality comparisons for boolean signals", () => {
      const bool = signal(true);
      expect(typeof bool.when.equalTo).toBe("function");
      expect(typeof bool.when.notEqualTo).toBe("function");
    });

    it("should have truthy for primitive signal types", () => {
      const count = signal(42);
      const text = signal("hello");
      const bool = signal(true);

      expect(typeof count.is.truthy).toBe("function");
      expect(typeof text.is.truthy).toBe("function");
      expect(typeof bool.is.truthy).toBe("function");
    });

    it("should have length for array and string signals", () => {
      const arr = signal([1, 2, 3]);
      const text = signal("hello");

      expect(typeof arr.is.length).toBe("object");
      expect(typeof text.is.length).toBe("object");
    });
  });
});

describe("generic methods - derived signals", () => {
  // Derived signals don't have logical methods directly
  // They need to be wrapped with nullable() to get logical methods

  it("should have when.truthy().then() on derived signal via nullable", () => {
    const count = signal(42);
    const doubled = derive(() => count.value * 2);
    const withLogical = nullable(doubled);
    const result = withLogical.when.truthy().then("yes", "no");

    expect(result.value).toBe("yes");

    count.value = 0;
    expect(result.value).toBe("no");
  });

  it("should have when.equalTo() on derived signal via nullable", () => {
    const count = signal(21);
    const doubled = derive(() => count.value * 2);
    const withLogical = nullable(doubled);
    const result = withLogical.when.equalTo(42).then("match", "no match");

    expect(result.value).toBe("match");

    count.value = 30;
    expect(result.value).toBe("no match");
  });

  it("should have when.greaterThan() on derived signal via nullable", () => {
    const count = signal(30);
    const doubled = derive(() => count.value * 2);
    const withLogical = nullable(doubled);
    const result = withLogical.when.greaterThan(50).then("greater", "not greater");

    expect(result.value).toBe("greater");

    count.value = 20;
    expect(result.value).toBe("not greater");
  });

  it("should have is.length on derived string signal via nullable", () => {
    const text = signal("hello");
    const derived = derive(() => text.value);
    const withLogical = nullable(derived);
    const result = withLogical.is.length.equalTo(5);

    expect(result.value).toBe(true);

    text.value = "world!";
    expect(result.value).toBe(false);
  });

  // Arrays are not primitives, so nullable doesn't work with them
  // Array derived signals have logical methods directly
});

describe("generic methods - non-signal objects", () => {
  // Non-signal objects need to be wrapped with nullable() to get logical methods

  it("should have is.truthy() on non-signal via nullable", () => {
    const nonSig = getNonSignalObject(42);
    const withLogical = nullable(nonSig);
    const truthy = withLogical.is.truthy();

    expect(truthy.value).toBe(true);
  });

  it("should have is.falsy() on non-signal via nullable", () => {
    const nonSig = getNonSignalObject(0);
    const withLogical = nullable(nonSig);
    const falsy = withLogical.is.falsy();

    expect(falsy.value).toBe(true);
  });

  it("should have or() on non-signal via nullable", () => {
    const nonSig = getNonSignalObject<number | null>(null);
    const withLogical = nullable(nonSig);
    const orValue = withLogical.or(100);

    expect(orValue.value).toBe(100);
  });

  it("should have when.truthy().then() on non-signal via nullable", () => {
    const nonSig = getNonSignalObject(42);
    const withLogical = nullable(nonSig);
    const result = withLogical.when.truthy().then("yes", "no");

    expect(result.value).toBe("yes");
  });

  it("should have when.equalTo() on non-signal via nullable", () => {
    const nonSig = getNonSignalObject(42);
    const withLogical = nullable(nonSig);
    const result = withLogical.when.equalTo(42).then("match", "no match");

    expect(result.value).toBe("match");
  });

  it("should have when.greaterThan() on non-signal via nullable", () => {
    const nonSig = getNonSignalObject(50);
    const withLogical = nullable(nonSig);
    const result = withLogical.when.greaterThan(42).then("greater", "not greater");

    expect(result.value).toBe("greater");
  });

  it("should have is.length on non-signal string via nullable", () => {
    const nonSig = getNonSignalObject("hello");
    const withLogical = nullable(nonSig);
    const result = withLogical.is.length.equalTo(5);

    expect(result.value).toBe(true);
  });

  // Arrays are not primitives, so nullable doesn't work with them
});

describe("generic methods - edge cases", () => {
  it("should handle NaN in numeric comparisons", () => {
    const count = signal(NaN);
    const result = count.is.greaterThan(42);

    expect(result.value).toBe(false);
  });

  it("should handle Infinity in numeric comparisons", () => {
    const count = signal(Infinity);
    const result = count.is.greaterThan(42);

    expect(result.value).toBe(true);
  });

  it("should handle negative numbers in comparisons", () => {
    const count = signal(-10);
    const result = count.is.smallerThan(0);

    expect(result.value).toBe(true);
  });

  it("should handle empty string in length comparisons", () => {
    const text = signal("");
    const result = text.is.length.equalTo(0);

    expect(result.value).toBe(true);
  });

  it("should handle empty array in length comparisons", () => {
    const arr = signal([]);
    const result = arr.is.length.equalTo(0);

    expect(result.value).toBe(true);
  });
});

describe("generic methods - reactivity", () => {
  it("should update truthy derived signal when source changes", () => {
    const count = signal(42);
    const truthy = count.is.truthy();

    expect(truthy.value).toBe(true);

    count.value = 0;
    expect(truthy.value).toBe(false);
  });

  it("should update falsy derived signal when source changes", () => {
    const count = signal(0);
    const falsy = count.is.falsy();

    expect(falsy.value).toBe(true);

    count.value = 42;
    expect(falsy.value).toBe(false);
  });

  it("should update or derived signal when source changes", () => {
    const nullSignal = signal<number | null>(null);
    const orValue = nullSignal.or(100);

    expect(orValue.value).toBe(100);

    nullSignal.value = 42;
    expect(orValue.value).toBe(42);
  });

  it("should update when.truthy().then derived signal when source changes", () => {
    const count = signal(42);
    const result = count.when.truthy().then("yes", "no");

    expect(result.value).toBe("yes");

    count.value = 0;
    expect(result.value).toBe("no");
  });

  it("should update when.equalTo derived signal when source changes", () => {
    const count = signal(42);
    const result = count.when.equalTo(42).then("match", "no match");

    expect(result.value).toBe("match");

    count.value = 100;
    expect(result.value).toBe("no match");
  });

  it("should update when.greaterThan derived signal when source changes", () => {
    const count = signal(50);
    const result = count.when.greaterThan(42).then("greater", "not greater");

    expect(result.value).toBe("greater");

    count.value = 30;
    expect(result.value).toBe("not greater");
  });

  it("should update is.length derived signal when source changes", () => {
    const text = signal("hello");
    const result = text.is.length.equalTo(5);

    expect(result.value).toBe(true);

    text.value = "hello world";
    expect(result.value).toBe(false);
  });
});
