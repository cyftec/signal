import { describe, it, expect } from "bun:test";
import { trap, signal } from "../src/index";
import { objectTrap } from "../src/api/traps/object-trap";

describe("trap - generic", () => {
  it("should create generic trap for non-special types", () => {
    const value = signal(true);
    expect(trap(value).string.value).toBe("true");
  });

  it("should handle null values", () => {
    const value = signal(null);
    expect(trap(value).string.value).toBe("");
  });

  it("should handle undefined values", () => {
    const value = signal(undefined);
    expect(trap(value).string.value).toBe("");
  });

  it("should provide or method", () => {
    const value = signal(null);
    expect(trap(value).or("default").value).toBe("default");
  });

  it("should update or when value changes", () => {
    const value = signal(null);
    const orSignal = trap(value).or("default");

    expect(orSignal.value).toBe("default");

    value.value = "actual" as any;
    expect(orSignal.value).toBe("actual");
  });
});

describe("trap - number", () => {
  it("should create number trap for number values", () => {
    const value = signal(42);
    // Number trap provides formatting methods
    expect(trap(value).toFixed(0).value).toBe("42");
  });

  it("should be unchanged if the value is within the confined window", () => {
    const value = signal(15);
    expect(trap(value).toConfined(10, 20).value).toBe(15);
  });

  it("should confine to lower bound", () => {
    const value = signal(5);
    expect(trap(value).toConfined(10, 20).value).toBe(10);
  });

  it("should confine to upper bound", () => {
    const value = signal(25);
    expect(trap(value).toConfined(10, 20).value).toBe(20);
  });

  it("should update confined when value changes", () => {
    const value = signal(1);
    const trapped = trap(value);
    const confined = trapped.toConfined(2, 4);
    expect(confined.value).toBe(2);

    value.value = 2;
    expect(confined.value).toBe(2);

    value.value = 3;
    expect(confined.value).toBe(3);

    value.value = 4;
    expect(confined.value).toBe(4);

    value.value = 5;
    expect(confined.value).toBe(4);
  });

  it("should provide toFixed method", () => {
    const value = signal(3.14159);
    expect(trap(value).toFixed(2).value).toBe("3.14");
  });

  it("should provide toExponential method", () => {
    const value = signal(1000);
    expect(trap(value).toExponential().value).toBe("1e+3");
  });

  it("should provide toPrecision method", () => {
    const value = signal(123.456);
    expect(trap(value).toPrecision(4).value).toBe("123.5");
  });

  it("should provide toLocaleString method", () => {
    const value = signal(1234.56);
    expect(trap(value).toLocaleString().value).toContain("1,234.56");
  });
});

describe("trap - string", () => {
  it("should create string trap for string values", () => {
    const value = signal("hello");
    const trapped = trap(value);
    expect(trapped.length.value).toBe(5);
    value.value = "hello world";
    expect(trapped.length.value).toBe(11);
  });

  it("should provide toUpperCase method", () => {
    const value = signal("hello");
    const trapped = trap(value);
    expect(trapped.UPPERCASE.value).toBe("HELLO");
    value.value = "world";
    expect(trapped.UPPERCASE.value).toBe("WORLD");
  });

  it("should provide toLowerCase method", () => {
    const value = signal("HELLO");
    const trapped = trap(value);
    expect(trapped.lowercase.value).toBe("hello");
    value.value = "WORLD";
    expect(trapped.lowercase.value).toBe("world");
  });

  it("should provide TitleCase method", () => {
    const value = signal("hello world");
    const trapped = trap(value);
    expect(trapped.TitleCase.value).toBe("Hello World");
    value.value = "this is a test";
    expect(trapped.TitleCase.value).toBe("This Is A Test");
  });

  it("should provide Sentencecase method", () => {
    const value = signal("hello world");
    const trapped = trap(value);
    expect(trapped.Sentencecase.value).toBe("Hello world");
    value.value = "this is a test";
    expect(trapped.Sentencecase.value).toBe("This is a test");
  });

  it("should provide standard string methods", () => {
    const value = signal("hello world");
    const trapped = trap(value);

    // String trap provides case conversion methods
    expect(trapped.lowercase.value).toBe("hello world");
    expect(trapped.UPPERCASE.value).toBe("HELLO WORLD");
  });

  it("should provide slice method", () => {
    const value = signal("hello world");
    const sliceSignal = trap(value).slice(0, 5);

    expect(sliceSignal.value).toBe("hello");

    value.value = "goodbye world";
    expect(sliceSignal.value).toBe("goodb");
  });

  it("should provide split method", () => {
    const value = signal("hello world");
    const splittedWords = trap(value).split(" ");

    expect(splittedWords.value).toEqual(["hello", "world"]);

    value.value = "foo bar baz";
    expect(splittedWords.value).toEqual(["foo", "bar", "baz"]);
  });

  it("should provide replace method", () => {
    const value = signal("hello world");
    const genZlingo = trap(value).replace("world", "wuld");

    expect(genZlingo.value).toBe("hello wuld");

    value.value = "goodbye world";
    expect(genZlingo.value).toBe("goodbye wuld");
  });

  it("should provide replaceAll method", () => {
    const value = signal("hello hello");
    const casualLingo = trap(value).replaceAll("hello", "hi");

    expect(casualLingo.value).toBe("hi hi");

    value.value = "hello world, hello universe";
    expect(casualLingo.value).toBe("hi world, hi universe");
  });

  it("should update derived signals when value changes", () => {
    const value = signal("hello");
    const trapped = trap(value);
    const upper = trapped.UPPERCASE;
    expect(upper.value).toBe("HELLO");

    value.value = "world";
    expect(upper.value).toBe("WORLD");
  });

  it("should provide localeCompare method", () => {
    const value = signal("apple");
    const trapped = trap(value);

    expect(trapped.localeCompare("banana").value).toBe(-1);
    expect(trapped.localeCompare("apple").value).toBe(0);
    expect(trapped.localeCompare("aardvark").value).toBe(1);
  });

  it("should provide normalize method", () => {
    const value = signal("café");
    const trapped = trap(value);

    expect(trapped.normalize("NFD").value).toBeDefined();
    expect(trapped.normalize("NFC").value).toBeDefined();
  });

  it("should provide toLocaleLowerCase method", () => {
    const value = signal("HELLO");
    const trapped = trap(value);

    expect(trapped.toLocaleLowerCase().value).toBe("hello");
  });

  it("should provide toLocaleUpperCase method", () => {
    const value = signal("hello");
    const trapped = trap(value);

    expect(trapped.toLocaleUpperCase().value).toBe("HELLO");
  });
});

describe("trap - array", () => {
  it("should create array trap for array values", () => {
    const value = signal([1, 2, 3]);
    expect(trap(value).length.value).toBe(3);
  });

  it("should provide lastItem getter", () => {
    const value = signal([1, 2, 3]);
    expect(trap(value).lastItem.value).toBe(3);
  });

  it("should provide reversed getter", () => {
    const value = signal([1, 2, 3]);
    expect(trap(value).reversed.value).toEqual([3, 2, 1]);
  });

  it("should provide map method", () => {
    const value = signal([1, 2, 3]);
    expect(trap(value).map((x) => x * 2).value).toEqual([2, 4, 6]);
  });

  it("should provide filter method", () => {
    const value = signal([1, 2, 3, 4, 5]);
    expect(trap(value).filter((x) => x % 2 === 0).value).toEqual([2, 4]);
  });

  it("should provide find method", () => {
    const value = signal([1, 2, 3, 4, 5]);
    expect(trap(value).find((x) => x > 3).value).toBe(4);
  });

  it("should provide reduce method", () => {
    const value = signal([1, 2, 3]);
    expect(trap(value).reduce((acc, x) => acc + x, 0).value).toBe(6);
  });

  it("should provide some method (buggy - implemented as every)", () => {
    const value = signal([2, 4, 6]);
    expect(trap(value).some((x) => x % 2 === 0).value).toBe(true);

    value.value = [2, 3, 4];
    expect(trap(value).some((x) => x % 2 === 0).value).toBe(true);

    value.value = [1, 3, 4];
    expect(trap(value).some((x) => x % 2 === 0).value).toBe(true);

    value.value = [1, 3, 5];
    expect(trap(value).some((x) => x % 2 === 0).value).toBe(false);
  });

  it("should provide every method", () => {
    const value = signal([2, 4, 6]);
    expect(trap(value).every((x) => x % 2 === 0).value).toBe(true);

    value.value = [2, 3, 4];
    expect(trap(value).every((x) => x % 2 === 0).value).toBe(false);
  });

  it("should provide partition method", () => {
    const value = signal([1, 2, 3, 4, 5]);
    const [even, odd] = trap(value).partition((x) => x % 2 === 0);
    expect(even.value).toEqual([2, 4]);
    expect(odd.value).toEqual([1, 3, 5]);
  });

  it("should provide includes method", () => {
    const value = signal([1, 2, 3]);
    const trapped = trap(value);
    expect(trapped.includes(2).value).toBe(true);
    expect(trapped.includes(5).value).toBe(false);
  });

  it("should provide indexOf method", () => {
    const value = signal([1, 2, 3]);
    expect(trap(value).indexOf(2).value).toBe(1);
  });

  it("should provide slice method", () => {
    const value = signal([1, 2, 3, 4, 5]);
    expect(trap(value).slice(1, 3).value).toEqual([2, 3]);
  });

  it("should provide concat method", () => {
    const value = signal([1, 2, 3]);
    expect(trap(value).concat([4, 5]).value).toEqual([1, 2, 3, 4, 5]);
  });

  it("should provide findIndex method", () => {
    const value = signal([1, 2, 3, 4, 5]);
    expect(trap(value).findIndex((x) => x > 3).value).toBe(3);
  });

  it("should provide findLast method", () => {
    const value = signal([1, 2, 3, 4, 5]);
    expect(trap(value).findLast((x) => x > 2).value).toBe(5);
  });

  it("should provide findLastIndex method", () => {
    const value = signal([1, 2, 3, 4, 5]);
    expect(trap(value).findLastIndex((x) => x > 2).value).toBe(4);
  });

  it("should provide reduceRight method", () => {
    const value = signal([1, 2, 3]);
    expect(trap(value).reduceRight((acc, x) => acc + x, 0).value).toBe(6);
  });

  it("should provide toSorted method", () => {
    const value = signal([3, 1, 2]);
    expect(trap(value).toSorted().value).toEqual([1, 2, 3]);
  });

  it("should provide toSorted with compare function", () => {
    const value = signal([3, 1, 2]);
    expect(trap(value).toSorted((a, b) => b - a).value).toEqual([3, 2, 1]);
  });

  it("should provide toSpliced method", () => {
    const value = signal([1, 2, 3, 4, 5]);
    expect(trap(value).toSpliced(1, 2, 10, 20).value).toEqual([
      1, 10, 20, 4, 5,
    ]);
  });

  it("should update derived signals when value changes", () => {
    const value = signal([1, 2, 3]);
    const doubled = trap(value).map((x) => x * 2);
    expect(doubled.value).toEqual([2, 4, 6]);
    value.value = [4, 5, 6];
    expect(doubled.value).toEqual([8, 10, 12]);
  });
});

describe("trap - object", () => {
  it("should create object trap for plain objects", () => {
    const value = signal({ name: "John", age: 30 });
    expect(trap(value).get("name").value).toBe("John");
  });

  it("should provide get method", () => {
    const value = signal({ name: "John", age: 30 });
    expect(trap(value).get("name").value).toBe("John");
    expect(trap(value).get("age").value).toBe(30);
  });

  it("should provide withLiveProps getter", () => {
    const value = signal({ name: "John", age: 30 });
    const { name, age } = trap(value).withLiveProps;
    expect(name.value).toBe("John");
    expect(age.value).toBe(30);
  });

  it("should provide keys getter", () => {
    const value = signal({ name: "John", age: 30 } as Record<string, unknown>);
    expect(trap(value).keys.value).toEqual(["name", "age"]);
  });

  it("should update get when value changes", () => {
    const value = signal({ name: "John", age: 30 });
    const nameProp = trap(value).get("name");

    value.value = { name: "Jane", age: 25 };
    expect(nameProp.value).toBe("Jane");
  });

  it("should update withLiveProps when value changes", () => {
    const value = signal({ name: "John", age: 30 });
    const { name, age } = trap(value).withLiveProps;

    value.value = { name: "Jane", age: 25 };
    expect(name.value).toBe("Jane");
    expect(age.value).toBe(25);
  });

  it("should update keys when value changes", () => {
    const value = signal({ name: "John", age: 30 } as Record<string, unknown>);
    const trapped = trap(value);

    value.value = { name: "Jane", city: "NYC" };
    expect(trapped.keys.value).toEqual(["name", "city"]);
  });

  it("should handle non-plain objects with generic trap", () => {
    const value = signal(new Date());
    expect(trap(value).string.value).toBeDefined();
  });

  it("should throw error when directly calling objectTrap with non-plain object", () => {
    const dateSignal = signal(new Date());

    expect(() => objectTrap(dateSignal)).toThrow(
      "The argument should be a plain object or a signal of plain object",
    );
  });
});

describe("trap - dispatch logic", () => {
  it("should dispatch to number trap for numbers", () => {
    const value = signal(42);
    const trapped = trap(value);

    expect(trapped.toFixed(0).value).toBe("42");
  });

  it("should dispatch to string trap for strings", () => {
    const value = signal("hello");
    const trapped = trap(value);

    expect(trapped.length.value).toBe(5);
  });

  it("should dispatch to array trap for arrays", () => {
    const value = signal([1, 2, 3]);
    const trapped = trap(value);

    expect(trapped.length.value).toBe(3);
  });

  it("should dispatch to object trap for plain objects", () => {
    const value = signal({ name: "John" });
    const trapped = trap(value);

    expect(trapped.get("name").value).toBe("John");
  });

  it("should dispatch to generic trap for other types", () => {
    const value = signal(true);
    const trapped = trap(value);

    expect(trapped.string.value).toBe("true");
  });
});
