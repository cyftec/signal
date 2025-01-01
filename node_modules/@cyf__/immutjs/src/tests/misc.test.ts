import { isPlainObject } from "../misc.ts";

// TODO: add test cases for other misc functions

// Example usage:
console.log("Test 1", isPlainObject({}) === true ? "Pass" : "Failed");
console.log("Test 2", isPlainObject([]) === false ? "Pass" : "Failed");
console.log("Test 3", isPlainObject(new Set()) === false ? "Pass" : "Failed");
console.log("Test 4", isPlainObject(null) === false ? "Pass" : "Failed");
