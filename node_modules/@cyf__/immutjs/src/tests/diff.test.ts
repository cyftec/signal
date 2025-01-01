import { getArrUpdateOperations } from "../diff.ts";
import { areArraysEqual } from "../equal.ts";
// Test 1: Empty arrays
const test1 = getArrUpdateOperations([], []);
console.log("test1", test1.length === 0 ? "Pass" : "Failed");
// Test 2: Arrays with the same items
const test2 = getArrUpdateOperations(
  [
    { _index: 0, value: "a" },
    { _index: 1, value: "b" },
    { _index: 2, value: "c" },
  ],
  [
    { _index: 0, value: "a" },
    { _index: 2, value: "c" },
    { _index: 1, value: "b" },
  ],
);
console.log(
  "test2",
  areArraysEqual(test2, [
      {
        type: "idle",
        value: {
          _index: 0,
          value: "a",
        },
        oldIndex: 0,
      },
      {
        type: "idle",
        value: {
          _index: 1,
          value: "c",
        },
        oldIndex: 2,
      },
      {
        type: "idle",
        value: {
          _index: 2,
          value: "b",
        },
        oldIndex: 1,
      },
    ])
    ? "Pass"
    : "Failed",
);
// Test 3: Arrays with different items
const test3 = getArrUpdateOperations(
  [
    { _index: 1, value: "a" },
    { _index: 2, value: "b" },
    { _index: 3, value: "c" },
  ],
  [
    { _index: 1, value: "x" },
    { _index: 2, value: "y" },
    { _index: 3, value: "z" },
  ],
);
console.log(
  "test3",
  areArraysEqual(test3, [
      {
        type: "update",
        value: {
          _index: 0,
          value: "x",
        },
        oldIndex: 1,
      },
      {
        type: "update",
        value: {
          _index: 1,
          value: "y",
        },
        oldIndex: 2,
      },
      {
        type: "update",
        value: {
          _index: 2,
          value: "z",
        },
        oldIndex: 3,
      },
    ])
    ? "Pass"
    : "Failed",
);
// Test 4: Array with added items
const test4 = getArrUpdateOperations(
  [
    { _index: 1, value: "a" },
    { _index: 2, value: "b" },
  ],
  [
    { _index: 1, value: "a" },
    { _index: 2, value: "b" },
    { _index: 3, value: "c" },
  ],
);
console.log(
  "test4",
  areArraysEqual(test4, [
      {
        type: "idle",
        value: {
          _index: 0,
          value: "a",
        },
        oldIndex: 1,
      },
      {
        type: "idle",
        value: {
          _index: 1,
          value: "b",
        },
        oldIndex: 2,
      },
      {
        type: "add",
        value: {
          _index: 2,
          value: "c",
        },
      },
    ])
    ? "Pass"
    : "Failed",
);
// Test 5: Array with deleted items
const test5 = getArrUpdateOperations(
  [
    { _index: 1, value: "a" },
    { _index: 2, value: "b" },
    { _index: 3, value: "c" },
  ],
  [
    { _index: 1, value: "a" },
    { _index: 3, value: "c" },
  ],
);
console.log(
  "test5",
  areArraysEqual(test5, [
      {
        type: "delete",
        value: {
          _index: -1,
          value: "b",
        },
        oldIndex: 2,
      },
      {
        type: "idle",
        value: {
          _index: 0,
          value: "a",
        },
        oldIndex: 1,
      },
      {
        type: "idle",
        value: {
          _index: 1,
          value: "c",
        },
        oldIndex: 3,
      },
    ])
    ? "Pass"
    : "Failed",
);
// Test 6: Array with updated and deleted items
const test6 = getArrUpdateOperations(
  [
    { _index: 1, value: "a" },
    { _index: 2, value: "b" },
    { _index: 3, value: "c" },
  ],
  [
    { _index: 1, value: "x" },
    { _index: 3, value: "c" },
  ],
);
console.log(
  "test6",
  areArraysEqual(test6, [
      {
        type: "delete",
        value: {
          _index: -1,
          value: "b",
        },
        oldIndex: 2,
      },
      {
        type: "update",
        value: {
          _index: 0,
          value: "x",
        },
        oldIndex: 1,
      },
      {
        type: "idle",
        value: {
          _index: 1,
          value: "c",
        },
        oldIndex: 3,
      },
    ])
    ? "Pass"
    : "Failed",
);
// Test 7: Array with updated and added items
const test7 = getArrUpdateOperations(
  [
    { _index: 1, value: "a" },
    { _index: 2, value: "b" },
  ],
  [
    { _index: 1, value: "x" },
    { _index: 2, value: "b" },
    { _index: 3, value: "c" },
  ],
);
console.log(
  "test7",
  areArraysEqual(test7, [
      {
        type: "update",
        value: {
          _index: 0,
          value: "x",
        },
        oldIndex: 1,
      },
      {
        type: "idle",
        value: {
          _index: 1,
          value: "b",
        },
        oldIndex: 2,
      },
      {
        type: "add",
        value: {
          _index: 2,
          value: "c",
        },
      },
    ])
    ? "Pass"
    : "Failed",
);
// Test 8: Array with deleted and added items
const test8 = getArrUpdateOperations(
  [
    { _index: 1, value: "a" },
    { _index: 2, value: "b" },
    { _index: 3, value: "c" },
  ],
  [
    { _index: 1, value: "a" },
    { _index: 3, value: "c" },
    { _index: 4, value: "d" },
  ],
);
console.log(
  "test8",
  areArraysEqual(test8, [
      {
        type: "delete",
        value: {
          _index: -1,
          value: "b",
        },
        oldIndex: 2,
      },
      {
        type: "idle",
        value: {
          _index: 0,
          value: "a",
        },
        oldIndex: 1,
      },
      {
        type: "idle",
        value: {
          _index: 1,
          value: "c",
        },
        oldIndex: 3,
      },
      {
        type: "add",
        value: {
          _index: 2,
          value: "d",
        },
      },
    ])
    ? "Pass"
    : "Failed",
);
// Test 9: Array with updated, deleted, and added items
const test9 = getArrUpdateOperations(
  [
    { _index: 1, value: "a" },
    { _index: 2, value: "b" },
    { _index: 3, value: "c" },
  ],
  [
    { _index: 1, value: "x" },
    { _index: 3, value: "c" },
    { _index: 4, value: "d" },
  ],
);
console.log(
  "test9",
  areArraysEqual(test9, [
      {
        type: "delete",
        value: {
          _index: -1,
          value: "b",
        },
        oldIndex: 2,
      },
      {
        type: "update",
        value: {
          _index: 0,
          value: "x",
        },
        oldIndex: 1,
      },
      {
        type: "idle",
        value: {
          _index: 1,
          value: "c",
        },
        oldIndex: 3,
      },
      {
        type: "add",
        value: {
          _index: 2,
          value: "d",
        },
      },
    ])
    ? "Pass"
    : "Failed",
);
// Test 10: Array with idle items
const test10 = getArrUpdateOperations(
  [
    { _index: 1, value: "a" },
    { _index: 2, value: "b" },
    { _index: 3, value: "c" },
  ],
  [
    { _index: 1, value: "a" },
    { _index: 2, value: "b" },
    { _index: 3, value: "c" },
  ],
);
console.log(
  "test10",
  areArraysEqual(test10, [
      {
        type: "idle",
        value: {
          _index: 0,
          value: "a",
        },
        oldIndex: 1,
      },
      {
        type: "idle",
        value: {
          _index: 1,
          value: "b",
        },
        oldIndex: 2,
      },
      {
        type: "idle",
        value: {
          _index: 2,
          value: "c",
        },
        oldIndex: 3,
      },
    ])
    ? "Pass"
    : "Failed",
);
// Test 11: Array with duplicate items
const test11 = getArrUpdateOperations(
  [
    { _index: 1, value: "a" },
    { _index: 2, value: "a" },
    { _index: 3, value: "b" },
  ],
  [
    { _index: 1, value: "a" },
    { _index: 2, value: "a" },
    { _index: 3, value: "b" },
  ],
);
console.log(
  "test11",
  areArraysEqual(test11, [
      {
        type: "idle",
        value: {
          _index: 0,
          value: "a",
        },
        oldIndex: 1,
      },
      {
        type: "idle",
        value: {
          _index: 1,
          value: "a",
        },
        oldIndex: 2,
      },
      {
        type: "idle",
        value: {
          _index: 2,
          value: "b",
        },
        oldIndex: 3,
      },
    ])
    ? "Pass"
    : "Failed",
);
// Test 12: Array with duplicate items and updates
const test12 = getArrUpdateOperations(
  [
    { _index: 1, value: "a" },
    { _index: 2, value: "a" },
    { _index: 3, value: "b" },
  ],
  [
    { _index: 1, value: "x" },
    { _index: 2, value: "x" },
    { _index: 3, value: "b" },
  ],
);
console.log(
  "test12",
  areArraysEqual(test12, [
      {
        type: "update",
        value: {
          _index: 0,
          value: "x",
        },
        oldIndex: 1,
      },
      {
        type: "update",
        value: {
          _index: 1,
          value: "x",
        },
        oldIndex: 2,
      },
      {
        type: "idle",
        value: {
          _index: 2,
          value: "b",
        },
        oldIndex: 3,
      },
    ])
    ? "Pass"
    : "Failed",
);
// Test 13: Array with duplicate items and deletions
const test13 = getArrUpdateOperations(
  [
    { _index: 1, value: "a" },
    { _index: 2, value: "a" },
    { _index: 3, value: "b" },
  ],
  [
    { _index: 1, value: "a" },
    { _index: 3, value: "b" },
  ],
);
console.log(
  "test13",
  areArraysEqual(test13, [
      {
        type: "delete",
        value: {
          _index: -1,
          value: "a",
        },
        oldIndex: 2,
      },
      {
        type: "idle",
        value: {
          _index: 0,
          value: "a",
        },
        oldIndex: 1,
      },
      {
        type: "idle",
        value: {
          _index: 1,
          value: "b",
        },
        oldIndex: 3,
      },
    ])
    ? "Pass"
    : "Failed",
);
// Test 14: Array with duplicate items and additions
const test14 = getArrUpdateOperations(
  [
    { _index: 1, value: "a" },
    { _index: 2, value: "a" },
    { _index: 3, value: "b" },
  ],
  [
    { _index: 1, value: "a" },
    { _index: 2, value: "a" },
    { _index: 3, value: "b" },
    { _index: 4, value: "c" },
  ],
);
console.log(
  "test14",
  areArraysEqual(test14, [
      {
        type: "idle",
        value: {
          _index: 0,
          value: "a",
        },
        oldIndex: 1,
      },
      {
        type: "idle",
        value: {
          _index: 1,
          value: "a",
        },
        oldIndex: 2,
      },
      {
        type: "idle",
        value: {
          _index: 2,
          value: "b",
        },
        oldIndex: 3,
      },
      {
        type: "add",
        value: {
          _index: 3,
          value: "c",
        },
      },
    ])
    ? "Pass"
    : "Failed",
);
// Test 16: Array with duplicate items, updates, and additions
const test16 = getArrUpdateOperations(
  [
    { _index: 1, value: "a" },
    { _index: 2, value: "a" },
    { _index: 3, value: "b" },
  ],
  [
    { _index: 1, value: "x" },
    { _index: 2, value: "x" },
    { _index: 3, value: "b" },
    { _index: 4, value: "c" },
  ],
);
console.log(
  "test16",
  areArraysEqual(test16, [
      {
        type: "update",
        value: {
          _index: 0,
          value: "x",
        },
        oldIndex: 1,
      },
      {
        type: "update",
        value: {
          _index: 1,
          value: "x",
        },
        oldIndex: 2,
      },
      {
        type: "idle",
        value: {
          _index: 2,
          value: "b",
        },
        oldIndex: 3,
      },
      {
        type: "add",
        value: {
          _index: 3,
          value: "c",
        },
      },
    ])
    ? "Pass"
    : "Failed",
);
// Test 17: Array with duplicate items, deletions, and additions
const test17 = getArrUpdateOperations(
  [
    { _index: 1, value: "a" },
    { _index: 2, value: "a" },
    { _index: 3, value: "b" },
  ],
  [
    { _index: 1, value: "a" },
    { _index: 3, value: "b" },
    { _index: 4, value: "c" },
  ],
);
console.log(
  "test17",
  areArraysEqual(test17, [
      {
        type: "delete",
        value: {
          _index: -1,
          value: "a",
        },
        oldIndex: 2,
      },
      {
        type: "idle",
        value: {
          _index: 0,
          value: "a",
        },
        oldIndex: 1,
      },
      {
        type: "idle",
        value: {
          _index: 1,
          value: "b",
        },
        oldIndex: 3,
      },
      {
        type: "add",
        value: {
          _index: 2,
          value: "c",
        },
      },
    ])
    ? "Pass"
    : "Failed",
);
// Test 19: Array with duplicate items, updates, deletions, additions, and idle items
const test19 = getArrUpdateOperations(
  [
    { _index: 1, value: "a" },
    { _index: 2, value: "a" },
    { _index: 3, value: "b" },
  ],
  [
    { _index: 1, value: "x" },
    { _index: 2, value: "x" },
    { _index: 3, value: "b" },
    { _index: 4, value: "c" },
    { _index: 5, value: "d" },
  ],
);
console.log(
  "test19",
  areArraysEqual(test19, [
      {
        type: "update",
        value: {
          _index: 0,
          value: "x",
        },
        oldIndex: 1,
      },
      {
        type: "update",
        value: {
          _index: 1,
          value: "x",
        },
        oldIndex: 2,
      },
      {
        type: "idle",
        value: {
          _index: 2,
          value: "b",
        },
        oldIndex: 3,
      },
      {
        type: "add",
        value: {
          _index: 3,
          value: "c",
        },
      },
      {
        type: "add",
        value: {
          _index: 4,
          value: "d",
        },
      },
    ])
    ? "Pass"
    : "Failed",
);

const test20 = getArrUpdateOperations(
  [
    { _index: 0, value: true },
    { _index: 1, value: false },
    { _index: 2, value: true },
    { _index: 3, value: true },
    { _index: 4, value: false },
    { _index: 5, value: false },
    { _index: 6, value: false },
    { _index: 7, value: true },
  ],
  [
    { _index: 1, value: false },
    { _index: 2, value: true },
    { _index: 3, value: true },
    { _index: 6, value: false },
    { _index: 7, value: true },
    { _index: -1, value: false },
    { _index: -1, value: true },
    { _index: -1, value: false },
  ],
);
console.log(
  "test20",
  areArraysEqual(test20, [
      {
        type: "delete",
        value: {
          _index: -3,
          value: true,
        },
        oldIndex: 0,
      },
      {
        type: "delete",
        value: {
          _index: -2,
          value: false,
        },
        oldIndex: 4,
      },
      {
        type: "delete",
        value: {
          _index: -1,
          value: false,
        },
        oldIndex: 5,
      },
      {
        type: "idle",
        value: {
          _index: 0,
          value: false,
        },
        oldIndex: 1,
      },
      {
        type: "idle",
        value: {
          _index: 1,
          value: true,
        },
        oldIndex: 2,
      },
      {
        type: "idle",
        value: {
          _index: 2,
          value: true,
        },
        oldIndex: 3,
      },
      {
        type: "idle",
        value: {
          _index: 3,
          value: false,
        },
        oldIndex: 6,
      },
      {
        type: "idle",
        value: {
          _index: 4,
          value: true,
        },
        oldIndex: 7,
      },
      {
        type: "add",
        value: {
          _index: 5,
          value: false,
        },
      },
      {
        type: "add",
        value: {
          _index: 6,
          value: true,
        },
      },
      {
        type: "add",
        value: {
          _index: 7,
          value: false,
        },
      },
    ])
    ? "Pass"
    : "Failed",
);

const test21 = getArrUpdateOperations(
  [
    { _index: 0, text: "woke up @7 already", isDone: false },
    {
      _index: 1,
      text: "was about to bathe, but skipped it",
      isDone: false,
    },
    { _index: 2, text: "devoured a lot of food", isDone: false },
    {
      _index: 3,
      text: "I swear, won't eat that much again",
      isDone: false,
    },
  ],
  [
    { _index: 0, text: "woke up @7 already", isDone: true },
    { _index: 2, text: "devoured a lot of foods", isDone: false },
    {
      _index: 3,
      text: "I swear, won't eat that much again",
      isDone: false,
    },
    {
      _index: -1,
      text: "was about to bathe, but skipped it",
      isDone: false,
    },
    { _index: -1, text: "szdfawdfgasd", isDone: false },
  ],
);
console.log(
  "test21",
  areArraysEqual(test21, [
      {
        type: "delete",
        value: {
          _index: -1,
          text: "was about to bathe, but skipped it",
          isDone: false,
        },
        oldIndex: 1,
      },
      {
        type: "update",
        value: {
          _index: 0,
          text: "woke up @7 already",
          isDone: true,
        },
        oldIndex: 0,
      },
      {
        type: "update",
        value: {
          _index: 1,
          text: "devoured a lot of foods",
          isDone: false,
        },
        oldIndex: 2,
      },
      {
        type: "idle",
        value: {
          _index: 2,
          text: "I swear, won't eat that much again",
          isDone: false,
        },
        oldIndex: 3,
      },
      {
        type: "add",
        value: {
          _index: 3,
          text: "was about to bathe, but skipped it",
          isDone: false,
        },
      },
      {
        type: "add",
        value: {
          _index: 4,
          text: "szdfawdfgasd",
          isDone: false,
        },
      },
    ])
    ? "Pass"
    : "Failed",
);
