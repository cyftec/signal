import { describe, it, expect } from "bun:test";
import { trap, signal } from "../src/index";

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

  it("should dispatch to generic trap for other types", () => {
    const value = signal(true);
    const trapped = trap(value);

    expect(trapped.string.value).toBe("true");
  });
});
