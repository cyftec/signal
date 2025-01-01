/**
 * V1 of array update method types
 */
export type IndexedArrObjItem<T extends object> = { _index: number } & T;
export type IndexedArrItem<T extends object> = IndexedArrObjItem<T>;
export type IndexedArrItemWoIndex<T extends object> = T & { _index: undefined };
export type IndexedArr<T extends object> = IndexedArrItem<T>[];
export type StringKeyObject = { [key: string]: unknown };

export type ArrItemOperation<T extends object> = {
  type: "add" | "update" | "delete" | "idle";
  value: IndexedArrObjItem<T>;
  oldIndex?: number;
};

/**
 * V2 of array update method types
 */
export type PartiallyIndexedItem<T> = {
  index?: number;
  value: T;
};
export type IndexedItem<T> = {
  index: number;
  value: T;
};
export type ItemOperation<T> = {
  type: "add" | "update" | "delete" | "idle";
  value: IndexedItem<T>;
  oldIndex?: number;
};

/**
 * V3 of array update method types
 */
export type MutationType = "add" | "update" | "idle" | "shuffle";
export type ArrItemMutation<T> = {
  type: MutationType;
  value: T;
  oldIndex: number;
};
