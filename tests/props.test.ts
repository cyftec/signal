import { describe, expect, it } from "bun:test";
import { signal } from "../src/index";
import { props } from "../src/api/props";

describe("props (for object signals)", () => {
  it("should have 'get' method returning derived signal for the accessed property", () => {
    const obj = signal({ name: "test", count: 0 });
    const name = props(obj).get("name");
    expect(name.value).toBe("test");
    obj.set({ name: "updated" });
    expect(name.value).toBe("updated");
  });

  it("should have 'allLive' getter returning all properties as derived signals", () => {
    const obj = signal({ name: "test", count: 0 });
    const allLive = props(obj).allLive;
    expect(allLive.name.value).toBe("test");
    expect(allLive.count.value).toBe(0);
    obj.set({ name: "updated", count: 5 });
    expect(allLive.name.value).toBe("updated");
    expect(allLive.count.value).toBe(5);
  });

  it("should have 'keys' getter returning derived signal", () => {
    const obj = signal({ name: "test", count: 0 } as {
      name: string;
      count: number;
      active?: boolean;
    });
    const keys = props(obj).keys;
    expect(keys.value).toEqual(["name", "count"]);
    obj.set({ name: "test", count: 0, active: true });
    expect(keys.value).toEqual(["name", "count", "active"]);
  });
});
