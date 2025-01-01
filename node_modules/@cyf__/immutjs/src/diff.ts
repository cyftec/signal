// deno-lint-ignore-file no-explicit-any
import { areValuesEqual } from "./equal.ts";
import { indexedArray, newVal } from "./misc.ts";
import type {
  ArrItemMutation,
  ArrItemOperation,
  IndexedArr,
  IndexedItem,
  ItemOperation,
  MutationType,
  PartiallyIndexedItem,
  StringKeyObject,
} from "./types.ts";

/**
 * V1 - need to be deprecated when V2 is released
 * This method calculates and returns the mutations in an array if any
 * @param oldArray old value of array going to be mutated
 * @param newArray new mutated value of the old array
 * @returns the list mutations in the old array
 */

export const getArrUpdateOperations = (
  oldArray: IndexedArr<any>,
  newArray: IndexedArr<any>,
): ArrItemOperation<any>[] => {
  const oldIndexedArr = newVal(oldArray);
  const newIndexedArr = newVal(newArray);
  const operations: ArrItemOperation<any>[] = [];

  newIndexedArr.forEach((newItem, newIndex) => {
    const newItemValue = { ...newItem, _index: undefined };
    const foundMatch = oldIndexedArr.some((oldItem, oldIndex) => {
      const oldItemValue = { ...oldItem, _index: undefined };
      if (newItem._index === oldItem._index) {
        if (areValuesEqual(oldItemValue, newItemValue)) {
          operations.push({
            type: "idle",
            value: { ...newItemValue, _index: newIndex },
            oldIndex: oldItem._index,
          });
        } else {
          operations.push({
            type: "update",
            value: { ...newItemValue, _index: newIndex },
            oldIndex: oldItem._index,
          });
        }
        oldIndexedArr.splice(oldIndex, 1);
        return true;
      }
      return false;
    });
    if (!foundMatch) {
      operations.push({
        type: "add",
        value: { ...newItemValue, _index: newIndex },
      });
    }
  });

  oldIndexedArr.forEach((oldItem, oldIndex) =>
    operations.push({
      type: "delete",
      value: { ...oldItem, _index: 0 - oldIndexedArr.length + oldIndex },
      oldIndex: oldItem._index,
    })
  );

  return operations.sort((a, b) => a.value._index - b.value._index);
};

/**
 * V2
 * This method calculates and returns the mutations in an array if any
 * @param oldArray old value of array going to be mutated
 * @param newArray new mutated value of the old array
 * @returns the list mutations in the old array
 */

export const getArrUpdateOps = <T>(
  oldArray: IndexedItem<T>[],
  newArray: PartiallyIndexedItem<T>[],
): ItemOperation<T>[] => {
  const oldIndexedArr = newVal(oldArray);
  const newIndexedArr = newVal(newArray);
  const operations: ItemOperation<T>[] = [];

  newIndexedArr.forEach((newItem, newIndex) => {
    const foundOldMatch = oldIndexedArr.some((oldItem, oldIndex) => {
      if (newItem.index === oldItem.index) {
        operations.push({
          type: areValuesEqual(oldItem.value, newItem.value)
            ? "idle"
            : "update",
          value: { ...newItem, index: newIndex },
          oldIndex: oldItem.index,
        });
        oldIndexedArr.splice(oldIndex, 1);
        return true;
      }
      return false;
    });
    if (!foundOldMatch) {
      operations.push({
        type: "add",
        value: { ...newItem, index: newIndex },
      });
    }
  });

  oldIndexedArr.forEach((oldItem, oldIndex) =>
    operations.push({
      type: "delete",
      value: { ...oldItem, index: 0 - oldIndexedArr.length + oldIndex },
      oldIndex: oldItem.index,
    })
  );

  return operations.sort((a, b) => a.value.index - b.value.index);
};

/**
 * V3
 * This method calculates and returns the mutations in an array if any
 * @param oldDsitinctItemsArray old array with non-duplicate items
 * @param newDsitinctItemsArray new (updated) array with non-duplicate items
 * @returns a list which is a map of [newDsitinctItemsArray] to mutation data of each item
 */

export const getArrayMutations = <T extends object>(
  oldDsitinctItemsArray: T[],
  newDsitinctItemsArray: T[],
  idKey?: string,
): ArrItemMutation<T>[] => {
  const indexKey = "index";
  const oldIndexedArr = indexedArray(newVal(oldDsitinctItemsArray), indexKey);
  const newIndexedArr = indexedArray(newVal(newDsitinctItemsArray), indexKey);

  return newIndexedArr.map((newIndexedItem) => {
    let type: MutationType = "add";
    let oldIndex = -1;
    const value = newIndexedItem.value;

    oldIndexedArr.some((oldIndexedItem, i) => {
      type = areValuesEqual(oldIndexedItem.value, newIndexedItem.value)
        ? oldIndexedItem[indexKey] === newIndexedItem[indexKey]
          ? "idle"
          : "shuffle"
        : idKey &&
            (oldIndexedItem.value as StringKeyObject)[idKey] !== undefined &&
            (oldIndexedItem.value as StringKeyObject)[idKey] ===
              (newIndexedItem.value as StringKeyObject)[idKey]
        ? "update"
        : "add";

      if (type !== "add") {
        oldIndex = oldIndexedItem[indexKey] as number;
        oldIndexedArr.splice(i, 1);
        return true;
      }

      return false;
    });

    return {
      type,
      oldIndex,
      value,
    };
  });
};
