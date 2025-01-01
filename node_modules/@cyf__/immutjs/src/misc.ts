// deno-lint-ignore-file no-explicit-any
/**
 * @param obj Object with keys in unsorted order
 * @returns the new Object with same value but sorted keys
 */
export const sortObjectByKeys = (obj: object): object => {
  const sortedEntries = Object.entries(obj).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  sortedEntries.forEach(([key, value], index: number) => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      sortedEntries[index] = [key, sortObjectByKeys(value)];
    }
  });
  return Object.fromEntries(sortedEntries);
};

/**
 * @param value which needs to be checked if it's a plain object or not
 * @returns a boolean denoting if the value is really an object (but not 'null' or 'set')
 */
export const isPlainObject = (value: any): boolean => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  return Object.prototype.toString.call(value) === "[object Object]";
};

/**
 * @param value which need to be freezed to prevent mutation
 * @returns a new immuatble copy of input value
 */
export const immut = <T>(value: T): T => {
  if (Array.isArray(value)) {
    const copiedArr = [...value];
    const newArr: any[] = [];
    copiedArr.forEach((item) => {
      newArr.push(immut(item));
    });
    return newArr as T;
  }

  if (isPlainObject(value)) {
    const copiedObj = { ...value } as object;
    const newObj: object = {};
    Object.keys(copiedObj).forEach((key) => {
      (newObj as any)[key] = immut((copiedObj as any)[key]);
    });
    return Object.freeze(newObj) as T;
  }

  return value;
};

/**
 * @param oldVal from which a new copy will be created
 * @returns a new (non-mutated) copy of the (input) oldValue
 */
export const newVal = <T>(oldVal: T): T => {
  if (Array.isArray(oldVal)) {
    const copiedArr = [...oldVal];
    const newArr: any[] = [];
    copiedArr.forEach((item) => {
      newArr.push(newVal(item));
    });
    return newArr as T;
  }

  if (isPlainObject(oldVal)) {
    const copiedObj = { ...oldVal } as Record<string, any>;
    const newObj: Record<string, any> = {};
    Object.keys(copiedObj).forEach((key) => {
      newObj[key] = newVal(copiedObj[key]);
    });
    return newObj as T;
  }

  const value = oldVal;
  return value as T;
};

/**
 * @param list of items
 * @param uniqueKey index key name
 * @returns indexed items list
 */
export const indexedArray = <T>(
  list: T[],
  uniqueKey: string = "index",
): {
  [x: string]: number | T;
  value: T;
}[] =>
  list.map((item, i) => ({
    [uniqueKey]: i,
    value: item,
  }));
