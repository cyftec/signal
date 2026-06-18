import { describe, it, expect } from "bun:test";
import {
  signal,
  effect,
  derive,
  dispose,
  type SourceSignal,
  type DerivedSignal,
} from "../src/index";

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

describe("signal - object values", () => {
  it("should create a signal with object value", () => {
    const obj = signal({ name: "test", count: 0 });
    expect(obj.value).toEqual({ name: "test", count: 0 });
  });

  it("should have set method for partial updates", () => {
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

describe("signal - array values", () => {
  it("should create a signal with array value", () => {
    const arr = signal([1, 2, 3]);
    expect(arr.value).toEqual([1, 2, 3]);
  });

  it("should have push method", () => {
    const arr = signal([1, 2, 3]);
    arr.push(4);
    expect(arr.value).toEqual([1, 2, 3, 4]);
  });

  it("should have pop method", () => {
    const arr = signal([1, 2, 3]);
    arr.pop();
    expect(arr.value).toEqual([1, 2]);
  });

  it("should have shift method", () => {
    const arr = signal([1, 2, 3]);
    arr.shift();
    expect(arr.value).toEqual([2, 3]);
  });

  it("should have unshift method", () => {
    const arr = signal([1, 2, 3]);
    arr.unshift(0);
    expect(arr.value).toEqual([0, 1, 2, 3]);
  });

  it("should have splice method", () => {
    const arr = signal([1, 2, 3, 4]);
    arr.splice(1, 2);
    expect(arr.value).toEqual([1, 4]);
  });

  it("should have reverse method", () => {
    const arr = signal([1, 2, 3]);
    arr.reverse();
    expect(arr.value).toEqual([3, 2, 1]);
  });

  it("should have sort method", () => {
    const arr = signal([3, 1, 2]);
    arr.sort();
    expect(arr.value).toEqual([1, 2, 3]);
  });

  it("should have fill method", () => {
    const arr = signal([1, 2, 3]);
    arr.fill(0);
    expect(arr.value).toEqual([0, 0, 0]);
  });

  it("should have copyWithin method", () => {
    const arr = signal([1, 2, 3, 4]);
    arr.copyWithin(0, 2);
    expect(arr.value).toEqual([3, 4, 3, 4]);
  });

  it("should have remove method (inverse of filter)", () => {
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
