import { describe, expect, it } from "bun:test";
import { derive, dispose, effect, Signal, signal } from "../src/index";

describe("signal - primitive values", () => {
  it("should create a signal with initial value", () => {
    const count = signal(0);
    expect(count.value).toBe(0);
  });

  it("should update signal value", () => {
    const count = signal(0);
    count.value = 1;
    expect(count.value).toBe(1);
  });

  it("should not trigger effects if value is unchanged", () => {
    const count = signal(0);
    let effectRunCount = 0;

    effect(() => {
      effectRunCount++;
      count.value;
    });

    count.value = 1; // New value
    expect(effectRunCount).toBe(2); // Initial run + update

    count.value = 1; // Same value
    expect(effectRunCount).toBe(2); // no new run
  });

  it("should have type property", () => {
    const count = signal(0);
    expect(count.type).toBe("source-signal");
  });

  it("should handle null values", () => {
    const nullSignal = signal(null);
    expect(nullSignal.value).toBe(null);
  });

  it("should handle undefined values", () => {
    const undefinedSignal = signal(undefined);
    expect(undefinedSignal.value).toBe(undefined);
  });

  it("should handle string values", () => {
    const text = signal("hello");
    expect(text.value).toBe("hello");
    text.value = "world";
    expect(text.value).toBe("world");
  });

  it("should handle boolean values", () => {
    const bool = signal(true);
    expect(bool.value).toBe(true);
    bool.value = false;
    expect(bool.value).toBe(false);
  });
});

describe("signal - array values", () => {
  it("should create a signal with array value", () => {
    const arr = signal([1, 2, 3]);
    expect(arr.value).toEqual([1, 2, 3]);
  });

  // Array mutation methods
  it("should have 'push' method", () => {
    const arr = signal([1, 2, 3]);
    arr.push(4);
    expect(arr.value).toEqual([1, 2, 3, 4]);
  });

  it("should have 'pop' method", () => {
    const arr = signal([1, 2, 3]);
    arr.pop();
    expect(arr.value).toEqual([1, 2]);
  });

  it("should have 'shift' method", () => {
    const arr = signal([1, 2, 3]);
    arr.shift();
    expect(arr.value).toEqual([2, 3]);
  });

  it("should have 'unshift' method", () => {
    const arr = signal([1, 2, 3]);
    arr.unshift(0);
    expect(arr.value).toEqual([0, 1, 2, 3]);
  });

  it("should have 'splice' method", () => {
    const arr = signal([1, 2, 3, 4]);
    arr.splice(1, 2);
    expect(arr.value).toEqual([1, 4]);
  });

  it("should have 'reverse' method", () => {
    const arr = signal([1, 2, 3]);
    arr.reverse();
    expect(arr.value).toEqual([3, 2, 1]);
  });

  it("should have 'sort' method", () => {
    const arr = signal([3, 1, 2]);
    arr.sort();
    expect(arr.value).toEqual([1, 2, 3]);
  });

  it("should have 'fill' method", () => {
    const arr = signal([1, 2, 3]);
    arr.fill(0);
    expect(arr.value).toEqual([0, 0, 0]);
  });

  it("should have 'copyWithin' method", () => {
    const arr = signal([1, 2, 3, 4]);
    arr.copyWithin(0, 2);
    expect(arr.value).toEqual([3, 4, 3, 4]);
  });

  it("should have 'keep' method to keep items matching a condition", () => {
    const arr = signal([1, 2, 3, 4, 5]);
    arr.keep((item) => item % 2 === 0);
    expect(arr.value).toEqual([2, 4]);
  });

  it("should have 'remove' method to remove items matching a condition", () => {
    const arr = signal([1, 2, 3, 4, 5]);
    arr.remove((item) => item % 2 === 0);
    expect(arr.value).toEqual([1, 3, 5]);
  });

  it("should trigger effects on array mutations", () => {
    const arr = signal([1, 2, 3]);
    let effectRunCount = 0;

    effect(() => {
      effectRunCount++;
      arr.value;
    });

    arr.push(4);
    expect(effectRunCount).toBe(2); // Initial + update
  });

  it("should handle empty array", () => {
    const arr = signal([]);
    expect(arr.value).toEqual([]);
  });

  // Non-mutating methods returning derived signals
  it("should have 'at' method returning derived signal", () => {
    const arr = signal([1, 2, 3]);
    const item = arr.at(1);
    expect(item.value).toBe(2);
    arr.push(4);
    expect(item.value).toBe(2); // Derived signal doesn't change
  });

  it("should have 'concat' method returning derived signal", () => {
    const arr = signal([1, 2, 3]);
    const concatenated = arr.concat([4, 5]);
    expect(concatenated.value).toEqual([1, 2, 3, 4, 5]);
    arr.push(4);
    expect(concatenated.value).toEqual([1, 2, 3, 4, 4, 5]); // Derived signal updates
  });

  it("should have 'every' method returning derived signal", () => {
    const arr = signal([2, 4, 6]);
    const allEven = arr.every((item) => item % 2 === 0);
    expect(allEven.value).toBe(true);
    arr.push(7);
    expect(allEven.value).toBe(false);
  });

  it("should have 'filter' method returning derived signal", () => {
    const arr = signal([1, 2, 3, 4, 5]);
    const evens = arr.filter((item) => item % 2 === 0);
    expect(evens.value).toEqual([2, 4]);
    arr.push(6);
    expect(evens.value).toEqual([2, 4, 6]);
  });

  it("should have 'find' method returning derived signal", () => {
    const arr = signal([1, 2, 3, 4, 5]);
    const found = arr.find((item) => item > 5);
    expect(found.value).toBeUndefined();
    arr.push(6);
    expect(found.value).toBe(6);
  });

  it("should have 'findIndex' method returning derived signal", () => {
    const arr = signal([1, 2, 3, 4, 5]);
    const index = arr.findIndex((item) => item % 2 === 0 && item < 1);
    expect(index.value).toBe(-1);
    arr.unshift(0);
    expect(index.value).toBe(0);
  });

  it("should have 'findLast' method returning derived signal", () => {
    const arr = signal([1, 2, 3, 4, 5]);
    const found = arr.findLast((item) => item % 2 === 0);
    expect(found.value).toBe(4);
    arr.push(6);
    expect(found.value).toBe(6);
  });

  it("should have 'findLastIndex' method returning derived signal", () => {
    const arr = signal([1, 2, 3, 4, 5]);
    const index = arr.findLastIndex((item) => item % 2 === 0);
    expect(index.value).toBe(3);
    arr.push(6);
    expect(index.value).toBe(5);
  });

  it("should have 'lastItem' getter returning derived signal", () => {
    const arr = signal([1, 2, 3]);
    const last = arr.lastItem();
    expect(last.value).toBe(3);
    arr.push(4);
    expect(last.value).toBe(4);
  });

  it("should have 'length' getter returning derived signal", () => {
    const arr = signal([1, 2, 3]);
    const len = arr.length();
    expect(len.value).toBe(3);
    arr.push(4);
    expect(len.value).toBe(4);
  });

  it("should have 'map' method returning derived signal", () => {
    const arr = signal([1, 2, 3]);
    const doubled = arr.map((item) => item * 2);
    expect(doubled.value).toEqual([2, 4, 6]);
    arr.push(4);
    expect(doubled.value).toEqual([2, 4, 6, 8]);
  });

  it("should have 'partition' method returning derived signals", () => {
    const arr = signal([1, 2, 3, 4, 5]);
    const [evens, odds] = arr.partition((item) => item % 2 === 0);
    expect(evens.value).toEqual([2, 4]);
    expect(odds.value).toEqual([1, 3, 5]);
    arr.push(6);
    expect(evens.value).toEqual([2, 4, 6]);
    expect(odds.value).toEqual([1, 3, 5]);
    arr.push(7);
    expect(evens.value).toEqual([2, 4, 6]);
    expect(odds.value).toEqual([1, 3, 5, 7]);
  });

  it("should have 'reduce' method returning derived signal", () => {
    const arr = signal([1, 2, 3, 4]);
    const sum = arr.reduce((acc, item) => (acc as number) + item, 0);
    expect(sum.value).toBe(10);
    arr.push(5);
    expect(sum.value).toBe(15);
    arr.pop();
    expect(sum.value).toBe(10);
    arr.shift();
    expect(sum.value).toBe(9);
  });

  it("should have 'reduceRight' method returning derived signal", () => {
    const arr = signal([1, 2, 3]);
    const result = arr.reduceRight((acc, item) => (acc as string) + item, "");
    expect(result.value).toBe("321");
  });

  it("should have 'some' method returning derived signal", () => {
    const arr = signal([1, 2, 3]);
    const haveNumGreaterThan3 = arr.some((item) => item > 3);
    expect(haveNumGreaterThan3.value).toBe(false);
    arr.push(4);
    expect(haveNumGreaterThan3.value).toBe(true);
  });

  it("should have 'toReversed' method returning derived signal", () => {
    const array = signal([1, 2, 3]);
    const yarra = array.toReversed();
    expect(yarra.value).toEqual([3, 2, 1]);
    array.push(4);
    expect(yarra.value).toEqual([4, 3, 2, 1]);
  });

  it("should have 'toSorted' method returning derived signal", () => {
    const arr = signal([3, 1, 2]);
    const sorted = arr.toSorted();
    expect(sorted.value).toEqual([1, 2, 3]);
    expect(arr.value).toEqual([3, 1, 2]); // Original unchanged
  });

  it("should have 'toSpliced' method returning derived signal", () => {
    const arr = signal([1, 2, 3, 4]);
    const spliced = arr.toSpliced(1, 2);
    expect(spliced.value).toEqual([1, 4]);
    expect(arr.value).toEqual([1, 2, 3, 4]); // Original unchanged
  });
});

describe("signal - object values", () => {
  it("should create a signal with object value", () => {
    const obj = signal({ name: "test", count: 0 });
    expect(obj.value).toEqual({ name: "test", count: 0 });
  });

  it("should have 'prop' method returning derived signal for the accessed property", () => {
    const obj = signal({ name: "test", count: 0 });
    const name = obj.prop("name");
    expect(name.value).toBe("test");
    obj.set({ name: "updated" });
    expect(name.value).toBe("updated");
  });

  it("should have 'props' method returning all properties as derived signals", () => {
    const obj = signal({ name: "test", count: 0 });
    const allProps = obj.props();
    expect(allProps.name.value).toBe("test");
    expect(allProps.count.value).toBe(0);
    obj.set({ name: "updated", count: 5 });
    expect(allProps.name.value).toBe("updated");
    expect(allProps.count.value).toBe(5);
  });

  it("should have 'keys' method returning derived signal", () => {
    const obj = signal({ name: "test", count: 0 } as {
      name: string;
      count: number;
      active?: boolean;
    });
    const keys = obj.keys();
    expect(keys.value).toEqual(["name", "count"]);
    obj.set({ name: "test", count: 0, active: true });
    expect(keys.value).toEqual(["name", "count", "active"]);
  });

  it("should have 'set' method for partial updates", () => {
    const obj = signal({ name: "test", count: 0 });
    obj.set({ count: 5 });
    expect(obj.value).toEqual({ name: "test", count: 5 });
  });

  it("should trigger effects on set", () => {
    const obj = signal({ name: "test", count: 0 });
    let effectRunCount = 0;

    effect(() => {
      effectRunCount++;
      obj.value;
    });

    obj.set({ count: 5 });
    expect(effectRunCount).toBe(2); // Initial + update
  });

  it("should handle empty object", () => {
    const obj = signal({});
    expect(obj.value).toEqual({});
  });
});

describe("effect", () => {
  it("should run immediately when created", () => {
    let runCount = 0;
    const count = signal(0);

    effect(() => {
      runCount++;
      count.value;
    });

    expect(runCount).toBe(1);
  });

  it("should re-run when accessed signal changes", () => {
    let runCount = 0;
    const count = signal(0);

    effect(() => {
      runCount++;
      count.value;
    });

    count.value = 1;
    expect(runCount).toBe(2);

    count.value = 2;
    expect(runCount).toBe(3);
  });

  it("should track multiple signals", () => {
    let runCount = 0;
    const count1 = signal(0);
    const count2 = signal(0);

    effect(() => {
      runCount++;
      count1.value + count2.value;
    });

    count1.value = 1;
    expect(runCount).toBe(2);

    count2.value = 1;
    expect(runCount).toBe(3);
  });

  it("should only re-run effect if signal value was accessed", () => {
    let runCount = 0;
    const count = signal(0);

    effect(() => {
      runCount++;
      // count.value not accessed
    });

    count.value = 1;
    expect(runCount).toBe(1); // Only initial run
  });

  it("should only re-run effect if signal value inside a conditional block was accessed in effect's first run", () => {
    let runCount = 0;
    const count = signal(0);
    const shouldAccess = signal(true);

    effect(() => {
      runCount++;
      if (shouldAccess.value) {
        count.value;
      }
    });

    count.value = 1;
    expect(runCount).toBe(2);

    shouldAccess.value = false;
    expect(runCount).toBe(3); // shouldAccess change triggered re-run

    count.value = 2;
    expect(runCount).toBe(4); // count change still triggers re-run (effect is still registered to count)
  });

  it("should skip running effect if signal value inside a conditional block was missed in effect's first run", () => {
    let runCount = 0;
    const count = signal(0);
    const shouldAccess = signal(false);

    effect(() => {
      runCount++;
      if (shouldAccess.value) {
        count.value;
      }
    });

    count.value = 1;
    expect(runCount).toBe(1); // Only initial run, count.value not accessed

    shouldAccess.value = true;
    expect(runCount).toBe(2); // shouldAccess change triggered re-run

    count.value = 2;
    expect(runCount).toBe(2); // count change doesn't triggers re-run
  });

  it("should have canDisposeNow property", () => {
    const count = signal(0);
    const eff = effect(() => {
      count.value;
    });

    expect(eff.canDisposeNow).toBe(false);
  });

  it("should have dispose method", () => {
    const count = signal(0);
    const eff = effect(() => {
      count.value;
    });

    eff.dispose();
    expect(eff.canDisposeNow).toBe(true);
  });

  it("should not run after disposal", () => {
    let runCount = 0;
    const count = signal(0);

    const eff = effect(() => {
      runCount++;
      count.value;
    });

    eff.dispose();
    count.value = 1;
    expect(runCount).toBe(1); // Only initial run
  });

  it("should be removed from signal on next update after disposal", () => {
    let runCount = 0;
    const count = signal(0);

    const eff = effect(() => {
      runCount++;
      count.value;
    });

    eff.dispose();
    count.value = 1; // This should remove the effect from the signal's effect set without running it
    count.value = 2; // This should not trigger the disposed effect
    expect(runCount).toBe(1); // Only initial run
  });
});

describe("derive", () => {
  it("should create derived signal", () => {
    const count = signal(42);
    const doubled = derive(() => count.value * 2);

    expect(doubled.value).toBe(84);
  });

  it("should update when dependency changes", () => {
    const count = signal(0);
    const doubled = derive(() => count.value * 2);

    expect(doubled.value).toBe(0);
    count.value = 5;
    expect(doubled.value).toBe(10);
  });

  it("should have prevValue getter", () => {
    const count = signal(0);
    const doubled = derive(() => count.value * 2);

    // prevValue is set during initial effect run
    expect(doubled.prevValue).toBe(undefined);
    expect(doubled.value).toBe(0);

    count.value = 5;
    expect(doubled.prevValue).toBe(0); // prevValue updates to previous computed value
    expect(doubled.value).toBe(10); // prevValue updates to previous computed value
  });

  it("should have type property", () => {
    const count = signal(0);
    const doubled = derive(() => count.value * 2);

    expect(doubled.type).toBe("derived-signal");
  });

  it("should have dispose method", () => {
    const count = signal(0);
    const doubled = derive(() => count.value * 2);

    doubled.dispose();
    count.value = 5;
    expect(doubled.value).toBe(0); // Should not update
  });

  it("should track multiple dependencies", () => {
    const count1 = signal(0);
    const count2 = signal(0);
    const sum = derive(() => count1.value + count2.value);

    expect(sum.value).toBe(0);

    count1.value = 5;
    expect(sum.value).toBe(5);

    count2.value = 3;
    expect(sum.value).toBe(8);
  });

  it("should support chaining derived signals", () => {
    const count = signal(0);
    const doubled = derive(() => count.value * 2);
    const quadrupled = derive(() => doubled.value * 2);

    count.value = 5;
    expect(doubled.value).toBe(10);
    expect(quadrupled.value).toBe(20);
  });

  it("should have access to previous value in deriver function", () => {
    const count = signal(0);
    let derivedValuesHistory: (number | undefined)[] = [];

    const doubled = derive((prevValue: number | undefined) => {
      derivedValuesHistory.push(prevValue);
      return count.value * 2;
    });

    count.value = 5;
    count.value = 10;

    expect(derivedValuesHistory).toEqual([undefined, 0, 10]);
  });
});

describe("derive - array signals", () => {
  it("should have 'map' method on derived array signal", () => {
    const arr = signal([1, 2, 3]);
    const doubled = arr.map((item) => item * 2);
    expect(doubled.value).toEqual([2, 4, 6]);
    const quadrupled = doubled.map((item) => item * 2);
    expect(quadrupled.value).toEqual([4, 8, 12]);
    arr.push(4);
    expect(doubled.value).toEqual([2, 4, 6, 8]);
    expect(quadrupled.value).toEqual([4, 8, 12, 16]);
  });

  it("should have 'filter' method on derived array signal", () => {
    const arr = signal([1, 2, 3, 4, 5]);
    const derived = arr.map((item) => item + 1);
    const odds = derived.filter((item) => item % 2 !== 0);
    expect(odds.value).toEqual([3, 5]);
    arr.push(6);
    expect(odds.value).toEqual([3, 5, 7]);
  });

  it("should have 'length' getter on derived array signal", () => {
    const arr = signal([1, 2, 3]);
    const derived = derive(() => arr.value);
    const len = derived.length();
    expect(len.value).toBe(3);
    arr.push(4);
    expect(len.value).toBe(4);
  });

  it("should have 'find' method on derived array signal", () => {
    const arr = signal([1, 2, 3, 4, 5]);
    const derived = derive(() => arr.value);
    const found = derived.find((item) => item > 5);
    expect(found.value).toBeUndefined();
    arr.push(6);
    expect(found.value).toBe(6);
  });
});

describe("derive - object signals", () => {
  it("should have 'prop' method on derived object signal", () => {
    const obj = signal({ name: "test", count: 0 });
    const derived = derive(() => obj.value);
    const name = derived.prop("name");
    expect(name.value).toBe("test");
    obj.set({ name: "updated" });
    expect(name.value).toBe("updated");
  });

  it("should have 'props' method returning all properties as derived signals", () => {
    const obj = signal({ name: "test", count: 0 });
    const derived = derive(() => obj.value);
    const allProps = derived.props();
    expect(allProps.name.value).toBe("test");
    expect(allProps.count.value).toBe(0);
    obj.set({ name: "updated", count: 5 });
    expect(allProps.name.value).toBe("updated");
    expect(allProps.count.value).toBe(5);
  });

  it("should have 'keys' method returning derived signal", () => {
    const obj = signal({ name: "test", count: 0 } as {
      name: string;
      count: number;
      active?: boolean;
    });
    const derived = derive(() => obj.value);
    const keys = derived.keys();
    expect(keys.value).toEqual(["name", "count"]);
    obj.set({ name: "test", count: 0, active: true });
    expect(keys.value).toEqual(["name", "count", "active"]);
  });
});

describe("derive - string signals", () => {
  it("should have 'length' method on derived string signal", () => {
    const text = signal("hello");
    const derived = derive(() => text.value);
    const len = derived.length();
    expect(len.value).toBe(5);
    text.value = "hello world";
    expect(len.value).toBe(11);
  });

  it("should have 'lowercase' method on derived string signal", () => {
    const text = signal("HELLO");
    const derived = derive(() => text.value);
    const lowercase = derived.lowercase();
    expect(lowercase.value).toBe("hello");
    text.value = "WORLD";
    expect(lowercase.value).toBe("world");
  });

  it("should have 'UPPERCASE' method on derived string signal", () => {
    const text = signal("hello");
    const derived = derive(() => text.value);
    const uppercase = derived.UPPERCASE();
    expect(uppercase.value).toBe("HELLO");
    text.value = "world";
    expect(uppercase.value).toBe("WORLD");
  });
});

describe("derive - number signals", () => {
  it("should have 'toFixed' method on derived number signal", () => {
    const num = signal(3.14159);
    const derived = derive(() => num.value);
    const fixed = derived.toFixed(2);
    expect(fixed.value).toBe("3.14");
    num.value = 2.71828;
    expect(fixed.value).toBe("2.72");
  });

  it("should have 'toPrecision' method on derived number signal", () => {
    const num = signal(123.456);
    const derived = derive(() => num.value);
    const precision = derived.toPrecision(4);
    expect(precision.value).toBe("123.5");
    num.value = 789.012;
    expect(precision.value).toBe("789.0");
  });
});

describe("derive - boolean signals", () => {
  it("should have 'negated' method on derived boolean signal", () => {
    const bool = signal(true);
    const derived = derive(() => bool.value);
    const neg = derived.negated();
    expect(neg.value).toBe(false);
    bool.value = false;
    expect(neg.value).toBe(true);
  });
});

describe("dispose utility", () => {
  it("should dispose single derived signal", () => {
    const count = signal(1);
    const doubled = derive(() => count.value * 2);

    expect(doubled.value).toBe(2);
    dispose(doubled);
    count.value = 5;
    expect(doubled.value).toBe(2);
  });

  it("should dispose single effect", () => {
    let runCount = 0;
    const count = signal(0);

    const eff = effect(() => {
      runCount++;
      count.value;
    });

    dispose(eff);
    count.value = 5;
    expect(runCount).toBe(1); // Only initial run
  });

  it("should dispose multiple derived signals", () => {
    const count = signal(0);
    const doubled = derive(() => count.value * 2);
    const tripled = derive(() => count.value * 3);

    dispose(doubled, tripled);
    count.value = 5;
    expect(doubled.value).toBe(0);
    expect(tripled.value).toBe(0);
  });

  it("should dispose multiple effects", () => {
    let runCount1 = 0;
    let runCount2 = 0;
    const count = signal(0);

    const eff1 = effect(() => {
      runCount1++;
      count.value;
    });

    const eff2 = effect(() => {
      runCount2++;
      count.value;
    });

    dispose(eff1, eff2);
    count.value = 5;
    expect(runCount1).toBe(1);
    expect(runCount2).toBe(1);
  });

  it("should dispose mixed signals and effects", () => {
    let runCount = 0;
    const count = signal(0);
    const doubled = derive(() => count.value * 2);

    const eff = effect(() => {
      runCount++;
      count.value;
    });

    dispose(doubled, eff);
    count.value = 5;
    expect(doubled.value).toBe(0);
    expect(runCount).toBe(1);
  });

  it("should handle empty arguments", () => {
    dispose(); // Should not throw
  });

  it("should be idempotent", () => {
    const count = signal(0);
    const doubled = derive(() => count.value * 2);

    dispose(doubled);
    dispose(doubled); // Should not throw
    count.value = 5;
    expect(doubled.value).toBe(0);
  });
});

describe("signal - string values", () => {
  it("should create a string signal with initial value", () => {
    const text = signal("hello");
    expect(text.value).toBe("hello");
  });

  it("should update string signal value", () => {
    const text = signal("hello");
    text.value = "world";
    expect(text.value).toBe("world");
  });

  // Intrinsic non-mutating methods
  it("should have 'length' getter returning derived signal", () => {
    const text = signal("hello");
    const length = text.length();
    expect(length.value).toBe(5);
    text.value = "hello world";
    expect(length.value).toBe(11);
  });

  it("should have 'toLowerCase' method returning derived signal", () => {
    const text = signal("HELLO");
    const lowercase = text.lowercase();
    expect(lowercase.value).toBe("hello");
    text.value = "WORLD";
    expect(lowercase.value).toBe("world");
  });

  it("should have 'toUpperCase' method returning derived signal", () => {
    const text = signal("hello");
    const uppercase = text.UPPERCASE();
    expect(uppercase.value).toBe("HELLO");
    text.value = "world";
    expect(uppercase.value).toBe("WORLD");
  });

  it("should have 'charAt' method returning derived signal", () => {
    const text = signal("hello");
    const char = text.charAt(1);
    expect(char.value).toBe("e");
    text.value = "world";
    expect(char.value).toBe("o");
  });

  it("should have 'slice' method returning derived signal", () => {
    const text = signal("hello");
    const sliced = text.slice(1, 4);
    expect(sliced.value).toBe("ell");
    text.value = "world";
    expect(sliced.value).toBe("orl");
  });

  it("should have 'includes' method returning derived signal", () => {
    const text = signal("hello");
    const includes = text.includes("ell");
    expect(includes.value).toBe(true);
    text.value = "world";
    expect(includes.value).toBe(false);
  });

  it("should have 'at' method returning derived signal", () => {
    const text = signal("hello");
    const char = text.at(1);
    expect(char.value).toBe("e");
    text.value = "world";
    expect(char.value).toBe("o");
  });

  it("should have 'charCodeAt' method returning derived signal", () => {
    const text = signal("hello");
    const code = text.charCodeAt(0);
    expect(code.value).toBe(104); // 'h'
    text.value = "world";
    expect(code.value).toBe(119); // 'w'
  });

  it("should have 'codePointAt' method returning derived signal", () => {
    const text = signal("hello");
    const code = text.codePointAt(0);
    expect(code.value).toBe(104); // 'h'
    text.value = "world";
    expect(code.value).toBe(119); // 'w'
  });

  it("should have 'concat' method returning derived signal", () => {
    const text = signal("hello");
    const concatenated = text.concat(" world");
    expect(concatenated.value).toBe("hello world");
    text.value = "hi";
    expect(concatenated.value).toBe("hi world");
  });

  it("should have 'endsWith' method returning derived signal", () => {
    const text = signal("hello");
    const ends = text.endsWith("lo");
    expect(ends.value).toBe(true);
    text.value = "world";
    expect(ends.value).toBe(false);
  });

  it("should have 'indexOf' method returning derived signal", () => {
    const text = signal("hello");
    const index = text.indexOf("l");
    expect(index.value).toBe(2);
    text.value = "world";
    expect(index.value).toBe(3);
  });

  it("should have 'lastIndexOf' method returning derived signal", () => {
    const text = signal("hello");
    const index = text.lastIndexOf("l");
    expect(index.value).toBe(3);
    text.value = "world";
    expect(index.value).toBe(3);
  });

  it("should have 'padEnd' method returning derived signal", () => {
    const text = signal("hello");
    const padded = text.padEnd(10, "-");
    expect(padded.value).toBe("hello-----");
    text.value = "hi";
    expect(padded.value).toBe("hi--------");
  });

  it("should have 'padStart' method returning derived signal", () => {
    const text = signal("hello");
    const padded = text.padStart(10, "-");
    expect(padded.value).toBe("-----hello");
    text.value = "hi";
    expect(padded.value).toBe("--------hi");
  });

  it("should have 'repeat' method returning derived signal", () => {
    const text = signal("hello");
    const repeated = text.repeat(2);
    expect(repeated.value).toBe("hellohello");
    text.value = "hi";
    expect(repeated.value).toBe("hihi");
  });

  it("should have 'startsWith' method returning derived signal", () => {
    const text = signal("hello");
    const starts = text.startsWith("he");
    expect(starts.value).toBe(true);
    text.value = "world";
    expect(starts.value).toBe(false);
  });

  it("should have 'substring' method returning derived signal", () => {
    const text = signal("hello");
    const sub = text.substring(1, 4);
    expect(sub.value).toBe("ell");
    text.value = "world";
    expect(sub.value).toBe("orl");
  });

  it("should have 'trim' method returning derived signal", () => {
    const text = signal("  hello  ");
    const trimmed = text.trim();
    expect(trimmed.value).toBe("hello");
    text.value = "  world  ";
    expect(trimmed.value).toBe("world");
  });

  it("should have 'trimEnd' method returning derived signal", () => {
    const text = signal("  hello  ");
    const trimmed = text.trimEnd();
    expect(trimmed.value).toBe("  hello");
    text.value = "  world  ";
    expect(trimmed.value).toBe("  world");
  });

  it("should have 'trimStart' method returning derived signal", () => {
    const text = signal("  hello  ");
    const trimmed = text.trimStart();
    expect(trimmed.value).toBe("hello  ");
    text.value = "  world  ";
    expect(trimmed.value).toBe("world  ");
  });

  it("should have 'localeCompare' method returning derived signal", () => {
    const text = signal("a");
    const compared = text.localeCompare("b");
    expect(compared.value).toBe(-1);
    text.value = "c";
    expect(compared.value).toBe(1);
  });

  it("should have 'normalize' method returning derived signal", () => {
    const text = signal("\u00E9"); // é
    const normalized = text.normalize("NFC");
    expect(normalized.value).toBe("\u00E9");
    text.value = "\u0065\u0301"; // e + combining acute
    expect(normalized.value).toBe("\u00E9");
  });

  it("should have 'replace' method returning derived signal", () => {
    const text = signal("hello world");
    const replaced = text.replace("world", "there");
    expect(replaced.value).toBe("hello there");
    text.value = "hi world";
    expect(replaced.value).toBe("hi there");
  });

  it("should have 'replaceAll' method returning derived signal", () => {
    const text = signal("hello hello");
    const replaced = text.replaceAll("hello", "hi");
    expect(replaced.value).toBe("hi hi");
    text.value = "world world";
    expect(replaced.value).toBe("world world");
  });

  it("should have 'search' method returning derived signal", () => {
    const text = signal("hello world");
    const index = text.search(/world/);
    expect(index.value).toBe(6);
    text.value = "hi there";
    expect(index.value).toBe(-1);
  });

  it("should have 'split' method returning derived signal", () => {
    const text = signal("hello world");
    const split = text.split(" ");
    expect(split.value).toEqual(["hello", "world"]);
    text.value = "hi there";
    expect(split.value).toEqual(["hi", "there"]);
  });

  it("should have 'toLocaleLowerCase' method returning derived signal", () => {
    const text = signal("HELLO");
    const lowercase = text.toLocaleLowerCase();
    expect(lowercase.value).toBe("hello");
    text.value = "WORLD";
    expect(lowercase.value).toBe("world");
  });

  it("should have 'toLocaleUpperCase' method returning derived signal", () => {
    const text = signal("hello");
    const uppercase = text.toLocaleUpperCase();
    expect(uppercase.value).toBe("HELLO");
    text.value = "world";
    expect(uppercase.value).toBe("WORLD");
  });

  // Custom non-mutating methods
  it("should have 'Sentencecase' getter returning derived signal", () => {
    const text = signal("hello world");
    const sentence = text.Sentencecase();
    expect(sentence.value).toBe("Hello world");
    text.value = "hi there";
    expect(sentence.value).toBe("Hi there");
  });

  it("should have 'TitleCase' getter returning derived signal", () => {
    const text = signal("hello world");
    const title = text.TitleCase();
    expect(title.value).toBe("Hello World");
    text.value = "hi there";
    expect(title.value).toBe("Hi There");
  });
});

describe("signal - number values", () => {
  it("should create a number signal with initial value", () => {
    const count = signal(42);
    expect(count.value).toBe(42);
  });

  it("should update number signal value", () => {
    const count = signal(42);
    count.value = 100;
    expect(count.value).toBe(100);
  });

  // Intrinsic non-mutating methods
  it("should have 'toFixed' method returning derived signal", () => {
    const num = signal(3.14159);
    const fixed = num.toFixed(2);
    expect(fixed.value).toBe("3.14");
    num.value = 2.71828;
    expect(fixed.value).toBe("2.72");
  });

  it("should have 'toPrecision' method returning derived signal", () => {
    const num = signal(123.456);
    const precision = num.toPrecision(4);
    expect(precision.value).toBe("123.5");
    num.value = 789.012;
    expect(precision.value).toBe("789.0");
  });

  it("should have 'toExponential' method returning derived signal", () => {
    const num = signal(1000);
    const exp = num.toExponential();
    expect(exp.value).toBe("1e+3");
    num.value = 2000;
    expect(exp.value).toBe("2e+3");
  });

  it("should have 'toLocaleString' method returning derived signal", () => {
    const num = signal(1234567.89);
    const localized = num.toLocaleString();
    expect(localized.value).toBe("1,234,567.89");
    num.value = 9876543.21;
    expect(localized.value).toBe("9,876,543.21");
  });

  // Custom non-mutating methods
  it("should have 'toConfined' method returning derived signal", () => {
    const num = signal(50);
    const confined = num.toConfined(0, 100);
    expect(confined.value).toBe(50);
    num.value = 150;
    expect(confined.value).toBe(100);
    num.value = -10;
    expect(confined.value).toBe(0);
  });
});

describe("signal - boolean values", () => {
  it("should create a boolean signal with initial value", () => {
    const bool = signal(true);
    expect(bool.value).toBe(true);
  });

  it("should update boolean signal value", () => {
    const bool = signal(true);
    bool.value = false;
    expect(bool.value).toBe(false);
  });

  // Custom mutating methods
  it("should have 'toggle' method", () => {
    const bool = signal(true);
    bool.toggle();
    expect(bool.value).toBe(false);
    bool.toggle();
    expect(bool.value).toBe(true);
  });

  // Custom non-mutating methods
  it("should have 'negated' getter returning derived signal", () => {
    const bool = signal(true);
    const neg = bool.negated();
    expect(neg.value).toBe(false);
    bool.value = false;
    expect(neg.value).toBe(true);
  });
});

describe("signal - nullable types", () => {
  it("should handle string | undefined with undefined initial value", () => {
    const text = signal<string | undefined>(undefined, "");
    expect(text.value).toBeUndefined();
    // Check if methods are available even when value is undefined
    expect(typeof (text as Signal<string>).length).toBe("function");
    expect(typeof (text as Signal<string>).lowercase).toBe("function");
    expect(typeof (text as Signal<string>).UPPERCASE).toBe("function");
  });

  it("should handle string | null with null initial value", () => {
    const text = signal<string | null>(null, "");
    expect(text.value).toBeNull();
    // Check if methods are available even when value is null
    expect(typeof (text as Signal<string>).length).toBe("function");
    expect(typeof (text as Signal<string>).lowercase).toBe("function");
    expect(typeof (text as Signal<string>).UPPERCASE).toBe("function");
  });

  it("should handle number | undefined with undefined initial value", () => {
    const num = signal<number | undefined>(undefined, 0);
    expect(num.value).toBeUndefined();
    // Check if methods are available even when value is undefined
    expect(typeof (num as Signal<number>).toFixed).toBe("function");
    expect(typeof (num as Signal<number>).toPrecision).toBe("function");
    expect(typeof (num as Signal<number>).toExponential).toBe("function");
  });

  it("should handle number | null with null initial value", () => {
    const num = signal<number | null>(null, 0);
    expect(num.value).toBeNull();
    // Check if methods are available even when value is null
    expect(typeof (num as Signal<number>).toFixed).toBe("function");
    expect(typeof (num as Signal<number>).toPrecision).toBe("function");
    expect(typeof (num as Signal<number>).toExponential).toBe("function");
  });

  it("should handle boolean | undefined with undefined initial value", () => {
    const bool = signal<boolean | undefined>(undefined, false);
    expect(bool.value).toBeUndefined();
    // Check if methods are available even when value is undefined
    expect(typeof (bool as Signal<boolean>).negated).toBe("function");
  });

  it("should handle boolean | null with null initial value", () => {
    const bool = signal<boolean | null>(null, false);
    expect(bool.value).toBeNull();
    // Check if methods are available even when value is null
    expect(typeof (bool as Signal<boolean>).negated).toBe("function");
  });

  it("should handle array | undefined with undefined initial value", () => {
    const arr = signal<number[] | undefined>(undefined, []);
    expect(arr.value).toBeUndefined();
    // Check if methods are available even when value is undefined
    expect(typeof (arr as Signal<number[]>).map).toBe("function");
    expect(typeof (arr as Signal<number[]>).reduce).toBe("function");
    expect(typeof (arr as Signal<number[]>).filter).toBe("function");
  });

  it("should handle array | null with null initial value", () => {
    const arr = signal<number[] | null>(null, []);
    expect(arr.value).toBeNull();
    // Check if methods are available even when value is null
    expect(typeof (arr as Signal<number[]>).map).toBe("function");
    expect(typeof (arr as Signal<number[]>).reduce).toBe("function");
    expect(typeof (arr as Signal<number[]>).filter).toBe("function");
  });

  it("should handle object | undefined with undefined initial value", () => {
    const obj = signal<{ name: string } | undefined>(undefined, {});
    expect(obj.value).toBeUndefined();
    // Check if methods are available even when value is undefined
    expect(typeof (obj as Signal<Record<string, any>>).keys).toBe("function");
    expect(typeof (obj as Signal<Record<string, any>>).prop).toBe("function");
    expect(typeof (obj as Signal<Record<string, any>>).props).toBe("function");
  });

  it("should handle object | null with null initial value", () => {
    const obj = signal<{ name: string } | null>(null, {});
    expect(obj.value).toBeNull();
    // Check if methods are available even when value is null
    expect(typeof (obj as Signal<Record<string, any>>).keys).toBe("function");
    expect(typeof (obj as Signal<Record<string, any>>).prop).toBe("function");
    expect(typeof (obj as Signal<Record<string, any>>).props).toBe("function");
  });

  it("should handle string | undefined transitioning from undefined to string", () => {
    const text = signal<string | undefined>(undefined, "");
    expect(text.value).toBeUndefined();
    text.value = "hello";
    const length = (text as Signal<string>).length();
    expect(text.value).toBe("hello");
    expect(length.value).toBe(5);
  });

  it("should handle number | undefined transitioning from undefined to number", () => {
    const num = signal<number | undefined>(undefined, 0);
    expect(num.value).toBeUndefined();
    num.value = 3.14159;
    const fixed = (num as Signal<number>).toFixed(2);
    expect(num.value).toBe(3.14159);
    expect(fixed.value).toBe("3.14");
  });

  it("should handle boolean | undefined transitioning from undefined to boolean", () => {
    const bool = signal<boolean | undefined>(undefined, false);
    expect(bool.value).toBeUndefined();
    const neg = (bool as Signal<boolean>).negated();
    expect(neg.value).toBe(true);
    bool.value = true;
    expect(bool.value).toBe(true);
    expect(neg.value).toBe(false);
  });
});
