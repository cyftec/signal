import { areValuesEqual } from "../equal.ts";

//TODO: Write tests for other equality functions

// Test 1-5: Number Equality
console.log("Test 1", areValuesEqual(1, 1) === true ? "Pass" : "Failed");
console.log("Test 2", areValuesEqual(0, 0) === true ? "Pass" : "Failed");
console.log("Test 3", areValuesEqual(-1, -1) === true ? "Pass" : "Failed");
console.log(
  "Test 4",
  areValuesEqual(Number.MAX_VALUE, Number.MAX_VALUE) === true
    ? "Pass"
    : "Failed",
);
console.log(
  "Test 5",
  areValuesEqual(Number.MIN_VALUE, Number.MIN_VALUE) === true
    ? "Pass"
    : "Failed",
);

// Test 6-10: Number Inequality
console.log("Test 6", areValuesEqual(1, 2) === false ? "Pass" : "Failed");
console.log("Test 7", areValuesEqual(-1, 1) === false ? "Pass" : "Failed");
console.log(
  "Test 8",
  areValuesEqual(Number.MAX_VALUE, Number.MIN_VALUE) === false
    ? "Pass"
    : "Failed",
);
console.log("Test 9", areValuesEqual(0, -0) === true ? "Pass" : "Failed"); // -0 and 0 should be considered equal
console.log(
  "Test 10",
  areValuesEqual(0.1 + 0.2, 0.3) === false ? "Pass" : "Failed",
); // Floating point precision issue

// Test 11-15: String Equality and Inequality
console.log(
  "Test 11",
  areValuesEqual("hello", "hello") === true ? "Pass" : "Failed",
);
console.log("Test 12", areValuesEqual("", "") === true ? "Pass" : "Failed");
console.log("Test 13", areValuesEqual("a", "A") === false ? "Pass" : "Failed");
console.log(
  "Test 14",
  areValuesEqual("JavaScript", "javascript") === false ? "Pass" : "Failed",
);
console.log(
  "Test 15",
  areValuesEqual("123", "123") === true ? "Pass" : "Failed",
);

// Test 16-20: Boolean Equality and Inequality
console.log("Test 16", areValuesEqual(true, true) === true ? "Pass" : "Failed");
console.log(
  "Test 17",
  areValuesEqual(false, false) === true ? "Pass" : "Failed",
);
console.log(
  "Test 18",
  areValuesEqual(true, false) === false ? "Pass" : "Failed",
);
console.log(
  "Test 19",
  areValuesEqual(false, true) === false ? "Pass" : "Failed",
);
console.log("Test 20", areValuesEqual(1, true) === false ? "Pass" : "Failed"); // Type mismatch

// Test 21-25: Array Equality and Inequality
console.log(
  "Test 21",
  areValuesEqual([1, 2, 3], [1, 2, 3]) === true ? "Pass" : "Failed",
);
console.log("Test 22", areValuesEqual([], []) === true ? "Pass" : "Failed");
console.log(
  "Test 23",
  areValuesEqual([1, 2], [1, 2, 3]) === false ? "Pass" : "Failed",
);
console.log(
  "Test 24",
  areValuesEqual(["a", "b"], ["a", "b"]) === true ? "Pass" : "Failed",
);
console.log(
  "Test 25",
  areValuesEqual([1, [2, 3]], [1, [2, 3]]) === true ? "Pass" : "Failed",
);

// Test 26-30: Object Equality and Inequality
console.log(
  "Test 26",
  areValuesEqual({ a: 1 }, { a: 1 }) === true ? "Pass" : "Failed",
);
console.log("Test 27", areValuesEqual({}, {}) === true ? "Pass" : "Failed");
console.log(
  "Test 28",
  areValuesEqual({ a: 1, b: 2 }, { a: 1 }) === false ? "Pass" : "Failed",
);
console.log(
  "Test 29",
  areValuesEqual({ a: { b: 2 } }, { a: { b: 2 } }) === true ? "Pass" : "Failed",
);
console.log(
  "Test 30",
  areValuesEqual({ a: 1 }, { b: 1 }) === false ? "Pass" : "Failed",
);

// Test 31-35: Type Mismatch
console.log("Test 31", areValuesEqual("1", 1) === false ? "Pass" : "Failed");
console.log(
  "Test 32",
  areValuesEqual("true", true) === false ? "Pass" : "Failed",
);
console.log("Test 33", areValuesEqual([1], 1) === false ? "Pass" : "Failed");
console.log(
  "Test 34",
  areValuesEqual({ a: 1 }, [1]) === false ? "Pass" : "Failed",
);
console.log(
  "Test 35",
  areValuesEqual(null, "null") === false ? "Pass" : "Failed",
);

// Test 36-40: Null and Undefined
console.log("Test 36", areValuesEqual(null, null) === true ? "Pass" : "Failed");
console.log(
  "Test 37",
  areValuesEqual(undefined, undefined) === true ? "Pass" : "Failed",
);
console.log(
  "Test 38",
  areValuesEqual(null, undefined) === false ? "Pass" : "Failed",
);
console.log(
  "Test 39",
  areValuesEqual(undefined, null) === false ? "Pass" : "Failed",
);
console.log(
  "Test 40",
  areValuesEqual(null, "null") === false ? "Pass" : "Failed",
);

// Test 41-45: Function Equality
const func1 = () => {};
const func2 = () => {};
const func3 = function () {
  return true;
};
console.log(
  "Test 41",
  areValuesEqual(func1, func1) === true ? "Pass" : "Failed",
);
console.log(
  "Test 42",
  areValuesEqual(func1, func2) === false ? "Pass" : "Failed",
); // Different instances
console.log(
  "Test 43",
  areValuesEqual(func3, func3) === true ? "Pass" : "Failed",
);
console.log(
  "Test 44",
  areValuesEqual(
      () => 1,
      () => 1,
    ) === false
    ? "Pass"
    : "Failed",
); // Different instances
console.log(
  "Test 45",
  areValuesEqual(
      function () {},
      function () {},
    ) === false
    ? "Pass"
    : "Failed",
); // Different instances

// Test 46-50: Symbol Equality
const symbol1 = Symbol("a");
const symbol2 = Symbol("a");
const symbol3 = Symbol("b");
console.log(
  "Test 46",
  areValuesEqual(symbol1, symbol1) === true ? "Pass" : "Failed",
);
console.log(
  "Test 47",
  areValuesEqual(symbol1, symbol2) === false ? "Pass" : "Failed",
); // Unique symbols
console.log(
  "Test 48",
  areValuesEqual(symbol2, symbol3) === false ? "Pass" : "Failed",
);
console.log(
  "Test 49",
  areValuesEqual(Symbol.for("a"), Symbol.for("a")) === true ? "Pass" : "Failed",
); // Global symbols
console.log(
  "Test 50",
  areValuesEqual(Symbol.for("a"), Symbol.for("b")) === false
    ? "Pass"
    : "Failed",
); // Different global symbols

// Test 51-60: Object Equality and Inequality with Unordered Entries
console.log(
  "Test 51",
  areValuesEqual({ a: 1, b: 2 }, { b: 2, a: 1 }) === true ? "Pass" : "Failed",
); // Unordered keys but equal
console.log(
  "Test 52",
  areValuesEqual({ a: { c: 3, d: 4 }, b: 2 }, { b: 2, a: { d: 4, c: 3 } }) ===
      true
    ? "Pass"
    : "Failed",
); // Nested unordered keys
console.log(
  "Test 53",
  areValuesEqual({ a: 1, b: 2 }, { a: 1 }) === false ? "Pass" : "Failed",
); // Missing key in second object
console.log(
  "Test 54",
  areValuesEqual({ a: 1 }, { a: 1, b: 2 }) === false ? "Pass" : "Failed",
); // Extra key in second object
console.log(
  "Test 55",
  areValuesEqual({ a: 1, b: 2 }, { a: 2, b: 1 }) === false ? "Pass" : "Failed",
); // Different values for same keys
console.log(
  "Test 56",
  areValuesEqual({ a: [1, 2], b: [3, 4] }, { b: [3, 4], a: [1, 2] }) === true
    ? "Pass"
    : "Failed",
); // Arrays as values, unordered keys
console.log(
  "Test 57",
  areValuesEqual({ a: [2, 1], b: [4, 3] }, { b: [3, 4], a: [1, 2] }) === false
    ? "Pass"
    : "Failed",
); // Arrays with different order
console.log(
  "Test 58",
  areValuesEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 1 } } }) === true
    ? "Pass"
    : "Failed",
); // Deeply nested objects
console.log(
  "Test 59",
  areValuesEqual({ a: { b: { c: 1 } } }, { a: { b: { d: 1 } } }) === false
    ? "Pass"
    : "Failed",
); // Deeply nested objects with different keys
console.log(
  "Test 60",
  areValuesEqual(
      {
        a: function () {
          return true;
        },
      },
      {
        a: function () {
          return true;
        },
      },
    ) === false
    ? "Pass"
    : "Failed",
); // Functions as values
function someFn() {
  return true;
}
console.log(
  "Test 60",
  areValuesEqual(
      {
        a: someFn,
      },
      {
        a: someFn,
      },
    ) === true
    ? "Pass"
    : "Failed",
); // Functions as values

// Test 61-70: Object Equality and Inequality with Nested Objects
console.log(
  "Test 61",
  areValuesEqual({ a: { b: 1 } }, { a: { b: 1 } }) === true ? "Pass" : "Failed",
);
console.log(
  "Test 62",
  areValuesEqual({ a: { b: 1 } }, { a: { b: 2 } }) === false
    ? "Pass"
    : "Failed",
);
console.log(
  "Test 63",
  areValuesEqual({ a: { b: 1 } }, { a: { c: 1 } }) === false
    ? "Pass"
    : "Failed",
);
console.log(
  "Test 64",
  areValuesEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 1 } } }) === true
    ? "Pass"
    : "Failed",
);
console.log(
  "Test 65",
  areValuesEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 2 } } }) === false
    ? "Pass"
    : "Failed",
);
console.log(
  "Test 66",
  areValuesEqual({ a: { b: { c: 1 } } }, { a: { b: { d: 1 } } }) === false
    ? "Pass"
    : "Failed",
);
console.log(
  "Test 67",
  areValuesEqual({ a: { b: { c: 1 } } }, { a: { c: { c: 1 } } }) === false
    ? "Pass"
    : "Failed",
);
console.log(
  "Test 68",
  areValuesEqual({ a: { b: { c: 1 } } }, { a: { b: { c: { d: 1 } } } }) ===
      false
    ? "Pass"
    : "Failed",
);
console.log(
  "Test 69",
  areValuesEqual({ a: { b: { c: 1 } } }, { a: { b: { c: { d: 1 } } } }) ===
      false
    ? "Pass"
    : "Failed",
);
console.log(
  "Test 70",
  areValuesEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 1 }, c: 1 } }) === false
    ? "Pass"
    : "Failed",
);

// Test 71-80: Equality of Objects with Various Data Types as Values
console.log(
  "Test 71",
  areValuesEqual({ a: 1 }, { a: 1 }) === true ? "Pass" : "Failed",
); // Number
console.log(
  "Test 72",
  areValuesEqual({ a: "string" }, { a: "string" }) === true ? "Pass" : "Failed",
); // String
console.log(
  "Test 73",
  areValuesEqual({ a: true }, { a: true }) === true ? "Pass" : "Failed",
); // Boolean
console.log(
  "Test 74",
  areValuesEqual({ a: [1, 2, 3] }, { a: [1, 2, 3] }) === true
    ? "Pass"
    : "Failed",
); // Array
console.log(
  "Test 75",
  areValuesEqual({ a: { b: 2 } }, { a: { b: 2 } }) === true ? "Pass" : "Failed",
); // Object
console.log(
  "Test 76",
  areValuesEqual({ a: undefined }, { a: undefined }) === true
    ? "Pass"
    : "Failed",
); // Undefined
console.log(
  "Test 77",
  areValuesEqual({ a: null }, { a: null }) === true ? "Pass" : "Failed",
); // Null
console.log(
  "Test 78",
  areValuesEqual({ a: Symbol("sym") }, { a: Symbol("sym") }) === false
    ? "Pass"
    : "Failed",
); // Symbol, symbols are unique
console.log(
  "Test 79",
  areValuesEqual({ a: BigInt(10) }, { a: BigInt(10) }) === true
    ? "Pass"
    : "Failed",
); // BigInt
console.log(
  "Test 80",
  areValuesEqual({ a: () => 5 }, { a: () => 5 }) === false ? "Pass" : "Failed",
); // Function
