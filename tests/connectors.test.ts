import { describe, expect, it } from "bun:test";
import { derive, antenna, receive, mutable, transmit } from "../src";

describe("receive", () => {
  it("should connect multiple transmitters to a receiver", () => {
    const transmitter1 = mutable("Hello");
    const transmitter2 = mutable("World");
    const receiver = mutable("");

    receive(receiver, transmitter1, transmitter2);

    transmitter1.value = "Hi";
    expect(receiver.value).toBe("Hi");

    transmitter2.value = "There";
    expect(receiver.value).toBe("There");
  });

  it("should return array of receivers for disposal", () => {
    const transmitter1 = mutable("Hello");
    const transmitter2 = mutable("World");
    const receiver = mutable("");

    const receivers = receive(receiver, transmitter1, transmitter2);

    expect(Array.isArray(receivers)).toBe(true);
    expect(receivers.length).toBe(2);
    expect(receivers[0].dispose).toBeInstanceOf(Function);
    expect(receivers[1].dispose).toBeInstanceOf(Function);
  });

  // TODO: should throw error if no transmitters are provided
  it("should handle empty transmitters array", () => {
    const receiver = mutable("");
    const receivers = receive(receiver);

    expect(receivers).toEqual([]);
  });

  it("should handle single transmitter", () => {
    const transmitter = mutable("Hello");
    const receiver = mutable("");

    const receivers = receive(receiver, transmitter);

    transmitter.value = "Hi";
    expect(receiver.value).toBe("Hi");

    expect(receivers.length).toBe(1);
  });

  it("should allow receiver to be updated independently", () => {
    const transmitter1 = mutable("Hello");
    const transmitter2 = mutable("World");
    const receiver = mutable("");

    receive(receiver, transmitter1, transmitter2);

    receiver.value = "Manual update";
    expect(receiver.value).toBe("Manual update");

    transmitter1.value = "Hi";
    expect(receiver.value).toBe("Hi");
  });

  it("should work with derived signals as transmitters", () => {
    const base1 = mutable(5);
    const base2 = mutable(3);
    const derived1 = derive(() => base1.value * 2);
    const derived2 = derive(() => base2.value * 3);
    const receiver = mutable(0);

    receive(receiver, derived1, derived2);

    base1.value = 10;
    expect(receiver.value).toBe(20);

    base2.value = 5;
    expect(receiver.value).toBe(15);
  });

  it("should dispose connections when receivers are disposed", () => {
    const transmitter1 = mutable("Hello");
    const transmitter2 = mutable("World");
    const receiver = mutable("");

    const receivers = receive(receiver, transmitter1, transmitter2);
    expect(receiver.value).toBe("World"); // Last transmitter value

    // Dispose all receivers
    receivers.forEach((receiver) => receiver.dispose());

    // Antennas run once more after disposal (lazy removal)
    transmitter1.value = "Hi";
    expect(receiver.value).toBe("World"); // Last transmitter value

    // Now receivers should be removed
    transmitter2.value = "There";
    expect(receiver.value).toBe("World"); // No longer updates
  });

  it("should handle number signals", () => {
    const temp1 = mutable(20);
    const temp2 = mutable(25);
    const currentTemp = mutable(0);

    receive(currentTemp, temp1, temp2);

    temp1.value = 22;
    expect(currentTemp.value).toBe(22);

    temp2.value = 30;
    expect(currentTemp.value).toBe(30);
  });

  it("should handle object signals", () => {
    const event1 = mutable({ type: "click", x: 10 });
    const event2 = mutable({ type: "hover", y: 20 });
    const currentEvent = mutable({});

    receive(currentEvent, event1, event2);

    event1.value = { type: "click", x: 15 };
    expect(currentEvent.value).toEqual({ type: "click", x: 15 });

    event2.value = { type: "hover", y: 25 };
    expect(currentEvent.value).toEqual({ type: "hover", y: 25 });
  });

  it("should handle plain value transmitters", () => {
    const receiver = mutable("");

    receive(receiver, "Hello", "World");

    expect(receiver.value).toBe("World"); // Last plain value
  });

  it("should handle plain number transmitters", () => {
    const receiver = mutable(0);

    receive(receiver, 42, 100);

    expect(receiver.value).toBe(100);
  });

  it("should handle plain object transmitters", () => {
    const receiver = mutable({});

    receive(receiver, { type: "click" }, { type: "hover" });

    expect(receiver.value).toEqual({ type: "hover" });
  });

  it("should handle mixed signal and plain value transmitters", () => {
    const signalTransmitter = mutable("Signal value");
    const receiver = mutable("");

    receive(receiver, signalTransmitter, "Plain value");

    expect(receiver.value).toBe("Plain value");

    signalTransmitter.value = "Updated signal";
    expect(receiver.value).toBe("Updated signal");
  });

  it("should handle null and undefined plain transmitters", () => {
    const receiver = mutable<string | null>("initial");

    receive(receiver, null, "undefined");

    expect(receiver.value).toBe("undefined");
  });
});

describe("transmit", () => {
  it("should broadcast from transmitter to multiple receivers", () => {
    const transmitter = mutable("Hello");
    const receiver1 = mutable("");
    const receiver2 = mutable("");
    const receiver3 = mutable("");

    const antenna = transmit(transmitter, receiver1, receiver2, receiver3);

    transmitter.value = "Hi";

    expect(receiver1.value).toBe("Hi");
    expect(receiver2.value).toBe("Hi");
    expect(receiver3.value).toBe("Hi");
  });

  it("should return antenna for disposal", () => {
    const transmitter = mutable("Hello");
    const receiver1 = mutable("");
    const receiver2 = mutable("");

    const antenna = transmit(transmitter, receiver1, receiver2);

    expect(antenna.dispose).toBeInstanceOf(Function);
  });

  // TODO: should throw error if no receivers are provided
  it("should handle empty receivers array", () => {
    const transmitter = mutable("Hello");
    const antenna = transmit(transmitter);

    transmitter.value = "Hi"; // Should not throw
  });

  it("should handle single receiver", () => {
    const transmitter = mutable("Hello");
    const receiver = mutable("");

    const antenna = transmit(transmitter, receiver);

    transmitter.value = "Hi";
    expect(receiver.value).toBe("Hi");
  });

  it("should allow receivers to be updated independently", () => {
    const transmitter = mutable("Hello");
    const receiver1 = mutable("");
    const receiver2 = mutable("");

    transmit(transmitter, receiver1, receiver2);
    expect(receiver1.value).toBe("Hello");
    expect(receiver2.value).toBe("Hello");

    receiver1.value = "Manual update 1";
    receiver2.value = "Manual update 2";

    expect(receiver1.value).toBe("Manual update 1");
    expect(receiver2.value).toBe("Manual update 2");

    transmitter.value = "Hi";
    expect(receiver1.value).toBe("Hi");
    expect(receiver2.value).toBe("Hi");
  });

  it("should work with derived signal as transmitter", () => {
    const base = mutable(5);
    const derived = derive(() => base.value * 2);
    const receiver1 = mutable(0);
    const receiver2 = mutable(0);

    transmit(derived, receiver1, receiver2);

    base.value = 10;
    expect(receiver1.value).toBe(20);
    expect(receiver2.value).toBe(20);
  });

  it("should dispose connection when antenna is disposed", () => {
    const transmitter = mutable("Hello");
    const receiver1 = mutable("");
    const receiver2 = mutable("");

    const antenna = transmit(transmitter, receiver1, receiver2);

    // Antenna runs once to set initial values
    expect(receiver1.value).toBe("Hello");
    expect(receiver2.value).toBe("Hello");

    antenna.dispose();

    // After disposal, antenna doesn't run, receivers keep their values
    transmitter.value = "Hi";
    expect(receiver1.value).toBe("Hello"); // Still "Hello", no updates
    expect(receiver2.value).toBe("Hello"); // Still "Hello", no updates
  });

  it("should handle number signals", () => {
    const temperature = mutable(22);
    const display1 = mutable(0);
    const display2 = mutable(0);

    transmit(temperature, display1, display2);

    temperature.value = 25;
    expect(display1.value).toBe(25);
    expect(display2.value).toBe(25);
  });

  it("should handle object signals", () => {
    const user = mutable({ name: "John", age: 30 });
    const profile1 = mutable({});
    const profile2 = mutable({});

    transmit(user, profile1, profile2);

    user.value = { name: "Jane", age: 25 };
    expect(profile1.value).toEqual({ name: "Jane", age: 25 });
    expect(profile2.value).toEqual({ name: "Jane", age: 25 });
  });

  it("should update all receivers synchronously", () => {
    const transmitter = mutable(0);
    const updateOrder: number[] = [];
    const receiver1 = mutable(0);
    const receiver2 = mutable(0);

    antenna(() => {
      if (receiver1.value !== 0) updateOrder.push(1);
    });

    antenna(() => {
      if (receiver2.value !== 0) updateOrder.push(2);
    });

    transmit(transmitter, receiver1, receiver2);

    transmitter.value = 1;

    // Both receivers should be updated
    expect(receiver1.value).toBe(1);
    expect(receiver2.value).toBe(1);

    // The order of updates should be consistent
    expect(updateOrder).toEqual([1, 2]);

    transmitter.value = 2;
    expect(receiver1.value).toBe(2);
    expect(receiver2.value).toBe(2);
    expect(updateOrder).toEqual([1, 2, 1, 2]);
  });

  it("should handle plain value transmitter", () => {
    const receiver1 = mutable("");
    const receiver2 = mutable("");

    transmit("Hello", receiver1, receiver2);

    expect(receiver1.value).toBe("Hello");
    expect(receiver2.value).toBe("Hello");
  });

  it("should handle plain number transmitter", () => {
    const receiver1 = mutable(0);
    const receiver2 = mutable(0);

    transmit(42, receiver1, receiver2);

    expect(receiver1.value).toBe(42);
    expect(receiver2.value).toBe(42);
  });

  it("should handle plain object transmitter", () => {
    const receiver1 = mutable({});
    const receiver2 = mutable({});

    transmit({ type: "click", x: 10 }, receiver1, receiver2);

    expect(receiver1.value).toEqual({ type: "click", x: 10 });
    expect(receiver2.value).toEqual({ type: "click", x: 10 });
  });

  it("should handle null and undefined plain transmitter", () => {
    const receiver1 = mutable<string | null>("initial");
    const receiver2 = mutable<string | undefined>("initial");

    transmit(null, receiver1);
    expect(receiver1.value).toBe(null);

    transmit(undefined, receiver2);
    expect(receiver2.value).toBe(undefined);
  });
});
