# Semantics

This document defines the observable and guaranteed behavior of the @cyftech/signal library. It specifies what behaviors users can rely upon, what behaviors are not guaranteed, and which behaviors are validated by tests.

---

## Signal Value Updates

### Purpose

Define the contract for updating signal values and triggering dependent computations.

### Guarantees

- Setting a signal's value to a new value (strict inequality with current value) triggers all registered effects synchronously
- Setting a signal's value to the same value (strict equality with current value) does not trigger effects
- Effects are triggered in the order they were registered to the signal
- When an effect runs, it may access other signals' values, triggering their effects recursively
- All propagation is synchronous and immediate

### Non-Guarantees

- The order of effect execution across multiple signals is not guaranteed when a single update triggers effects on multiple signals
- No guarantee about the maximum depth of recursive effect triggering
- No guarantee about performance characteristics of effect execution

### Edge Cases

- Setting a signal's value to the same value multiple times does not trigger effects (verified by tests/signal.test.ts)
- Null and undefined are valid signal values and can be set like any other value (verified by tests/signal.test.ts)

### Examples

```typescript
const count = signal(0);
let runCount = 0;

effect(() => {
  runCount++;
  count.value;
});

count.value = 1; // runCount becomes 2 (initial + 1 update)
count.value = 1; // runCount remains 2 (no change, no effect run)
```

### Verified By

- tests/signal.test.ts: "should not trigger effects if value is unchanged"
- tests/signal.test.ts: "should handle null values"
- tests/signal.test.ts: "should handle undefined values"

---

## Dependency Tracking

### Purpose

Define how effects and derived signals establish dependencies on signals.

### Guarantees

- An effect or derived signal establishes a dependency on a signal only if the signal's `.value` getter is accessed during execution
- Dependencies are established during the initial execution of an effect or derived signal computation
- Once a dependency is established, the effect or derived signal will re-run whenever that signal's value changes
- Dependencies are not automatically re-evaluated on subsequent executions

### Non-Guarantees

- No automatic dependency collection beyond what is accessed during execution
- No guarantee that conditional dependencies will be tracked if the condition is false during initial execution
- No guarantee about the internal mechanism of dependency tracking

### Edge Cases

- If a signal's `.value` is accessed conditionally and the condition is false during initial execution, that signal will not be tracked as a dependency (verified by tests/signal.test.ts)
- If an effect or derived signal does not access any signal values during execution, it runs only once (verified by tests/signal.test.ts)

### Examples

```typescript
const shouldShow = signal(false);
const count = signal(5);

// WRONG: count won't be tracked if shouldShow is false initially
const displayed = derive(() => {
  if (shouldShow.value) {
    return count.value;
  }
  return 0;
});
// Changing count.value won't trigger recomputation

// CORRECT: Always access the signal
const displayed = derive(() => {
  return shouldShow.value ? count.value : 0;
});
```

### Verified By

- tests/signal.test.ts: "should only re-run effect if signal value was accessed"
- tests/signal.test.ts: "should only re-run effect if signal value inside a conditional block was accessed in effect's first run"
- tests/signal.test.ts: "should skip running effect if signal value inside a conditional block was missed in effect's first run"

---

## Effect Execution Timing

### Purpose

Define when effects run and how many times they run.

### Guarantees

- Effects run immediately when created via `effect()`
- Effects run synchronously when any tracked signal's value changes
- Effects run exactly once per signal value change (assuming the value actually changes)
- Effects do not run if the signal's value is set to the same value

### Non-Guarantees

- No guarantee about the timing of effect execution relative to other code in the same call stack
- No guarantee about the order of effect execution when multiple signals change in the same tick
- No batching or deferred execution is provided

### Edge Cases

- If an effect throws an error during execution, the error propagates immediately and may prevent subsequent runs (verified by BEHAVIORAL_INVENTORY.md)

### Examples

```typescript
const count = signal(0);
let runCount = 0;

effect(() => {
  runCount++;
  count.value;
});

// runCount is 1 immediately after effect() call
count.value = 1; // runCount becomes 2 synchronously
count.value = 2; // runCount becomes 3 synchronously
```

### Verified By

- tests/signal.test.ts: "should run immediately when created"
- tests/signal.test.ts: "should re-run when accessed signal changes"

---

## Disposal Behavior

### Purpose

Define how disposal of effects and derived signals works.

### Guarantees

- Calling `dispose()` on an effect marks it for disposal by setting `canDisposeNow = true`
- Calling `dispose()` on a derived signal stops it from tracking dependencies
- Disposed effects are removed from signals on the next signal update
- Disposed effects never run again after being removed
- Disposal is synchronous

### Non-Guarantees

- Disposed effects are not removed immediately; removal happens on the next signal update
- No guarantee about when exactly the removal occurs if no signal update happens
- No guarantee about the performance of disposal

### Edge Cases

- Disposed effects may run one more time after disposal if a signal update occurs before cleanup (verified by tests/signal.test.ts)
- Disposing the same effect multiple times is safe (idempotent) (verified by tests/signal.test.ts)

### Examples

```typescript
const count = signal(0);
let runCount = 0;

const eff = effect(() => {
  runCount++;
  count.value;
});

eff.dispose();
count.value = 1; // Effect is removed here without running
count.value = 2; // Effect is already gone
// runCount remains 1
```

### Verified By

- tests/signal.test.ts: "should not run after disposal"
- tests/signal.test.ts: "should be removed from signal on next update after disposal"
- tests/signal.test.ts: "should be idempotent" (in dispose utility tests)

---

## Derived Signal Behavior

### Purpose

Define the behavior of derived signals computed from other signals.

### Guarantees

- Derived signals recompute whenever any tracked dependency's value changes
- Derived signals provide access to the previous computed value via `prevValue` getter
- Derived signals can depend on other derived signals (chaining)
- Calling `dispose()` on a derived signal stops it from updating
- After disposal, the derived signal's value remains accessible but won't update

### Non-Guarantees

- No guarantee about the order of recomputation when multiple dependencies change
- No guarantee about the performance of derived signal computation
- The `prevValue` is the previous return value, not the previous dependency values

### Edge Cases

- If the value getter function doesn't access any signal values, the derived signal runs only once (verified by tests/signal.test.ts)
- The `prevValue` is undefined on the first computation (verified by tests/signal.test.ts)

### Examples

```typescript
const count = signal(0);
const doubled = derive(() => count.value * 2);

console.log(doubled.value); // 0
console.log(doubled.prevValue); // undefined

count.value = 5;
console.log(doubled.value); // 10
console.log(doubled.prevValue); // 0
```

### Verified By

- tests/signal.test.ts: "should create derived signal"
- tests/signal.test.ts: "should update when dependency changes"
- tests/signal.test.ts: "should have prevValue getter"

---

## Array Signal Mutation

### Purpose

Define the behavior of array signal mutation methods.

### Guarantees

- Array signals provide mutation methods (push, pop, shift, unshift, splice, reverse, sort, fill, copyWithin, remove)
- Calling these methods updates the array and triggers all registered effects
- The `remove()` method removes items where the predicate returns true (inverse of filter)
- All mutation methods trigger effects synchronously

### Non-Guarantees

- No guarantee about the internal implementation of mutation methods
- No guarantee about the performance characteristics of array mutations

### Edge Cases

- Empty arrays are valid signal values (verified by tests/signal.test.ts)

### Examples

```typescript
const arr = signal([1, 2, 3]);
arr.push(4); // arr.value is [1, 2, 3, 4]
arr.remove((item) => item % 2 === 0); // arr.value is [1, 3]
```

### Verified By

- tests/signal.test.ts: "should have push method", "should have pop method", etc.
- tests/signal.test.ts: "should have remove method (inverse of filter)"
- tests/signal.test.ts: "should trigger effects on array mutations"

---

## Object Signal Partial Updates

### Purpose

Define the behavior of object signal partial updates.

### Guarantees

- Object signals provide a `set(partial)` method for partial updates
- The `set()` method performs a shallow merge with the current value
- Calling `set()` triggers all registered effects

### Non-Guarantees

- No deep merge is performed
- No guarantee about the behavior when partial contains nested objects

### Edge Cases

- Empty objects are valid signal values (verified by tests/signal.test.ts)

### Examples

```typescript
const user = signal({ name: "John", age: 30 });
user.set({ age: 31 }); // user.value is { name: "John", age: 31 }
```

### Verified By

- tests/signal.test.ts: "should have set method for partial updates"
- tests/signal.test.ts: "should trigger effects on set"

---

## Type Discrimination

### Purpose

Define the runtime type discrimination mechanism.

### Guarantees

- All signal objects have a `type` property with value `"source-signal"` or `"derived-signal"`
- All non-signal objects have a `type` property with value `"non-signal"`
- Type checkers use the `type` property for runtime type discrimination

### Non-Guarantees

- No guarantee about additional properties on signal objects beyond those documented
- No guarantee about the internal structure of signal objects

### Edge Cases

- Type checkers return false for `null` and `undefined` (verified by tests/utils.test.ts)

### Examples

```typescript
const count = signal(0);
console.log(count.type); // "source-signal"

const doubled = derive(() => count.value * 2);
console.log(doubled.type); // "derived-signal"

const nonSig = getNonSignalObject(42);
console.log(nonSig.type); // "non-signal"
```

### Verified By

- tests/utils.test.ts: All type checker tests

---

## Trap Type Determination

### Purpose

Define how trap types are determined and their limitations.

### Guarantees

- The trap type is determined by the runtime type of the unwrapped value at creation time
- Type-specific traps provide methods appropriate to their type (number, string, array, object)
- All trap methods return derived signals that update when the input changes

### Non-Guarantees

- Type changes in the input signal are not reflected in the trap type
- No guarantee about the behavior if the input signal's value type changes after trap creation
- Object trap throws an error if the value is not a plain object

### Edge Cases

- If a signal's value type changes after trap creation, the trap type does not change (verified by tests/traps.test.ts)

### Examples

```typescript
const value = signal(5);
const trapped = trap(value); // NumberSignalTrap
value.value = "hello"; // Type change not reflected
// trapped still has number methods, not string methods
```

### Verified By

- tests/traps.test.ts: "should dispatch to number trap for numbers", etc.

---

## Operation Type Determination

### Purpose

Define how operation types are determined and their limitations.

### Guarantees

- The operation type is determined by the runtime type of the evaluated value
- Type-specific operations provide methods appropriate to their type (number, string/array, generic)
- All operation methods return new operation objects for chaining
- Final results are obtained via getters (truthy, falsy, result, etc.)

### Non-Guarantees

- Type changes in the input signal are not reflected in the operation type
- No guarantee about the behavior if the input signal's value type changes after operation creation

### Edge Cases

- If a signal's value type changes after operation creation, the operation type does not change

### Examples

```typescript
const value = signal(5);
const operation = op(value); // NumberOperation
value.value = "hello"; // Type change not reflected
// operation still has number methods, not string methods
```

### Verified By

- tests/operations.test.ts: "should create operation for number values", etc.

---

## Promise States

### Purpose

Define the behavior of promise state signals.

### Guarantees

- Calling `runPromise(...args)` executes the promise function
- On success: `result` is updated, `error` is set to `undefined`
- On failure: `error` is updated, `result` preserves the previous successful result
- The `ultimately` callback runs in the finally block
- The promise can be run multiple times

### Non-Guarantees

- No guarantee about the timing of state updates relative to promise resolution
- No guarantee about the behavior if the promise function throws synchronously

### Edge Cases

- If no initial value is provided, result signal starts as `undefined` (verified by tests/promstates.test.ts)
- If the promise fails multiple times, the last successful result is preserved (verified by tests/promstates.test.ts)

### Examples

```typescript
const promiseFn = async (value: number) => value * 2;
const [runPromise, result, error] = promstates(promiseFn, 0);

await runPromise(5);
console.log(result.value); // 10
console.log(error.value); // undefined

await runPromise(-1); // Assume this throws
console.log(result.value); // 10 (preserved)
console.log(error.value); // Error instance
```

### Verified By

- tests/promstates.test.ts: "should update result on successful promise completion"
- tests/promstates.test.ts: "should update error on promise failure"
- tests/promstates.test.ts: "should preserve previous result on error"

---

## Template Interpolation

### Purpose

Define the behavior of template string interpolation with signals.

### Guarantees

- The derived signal's value is the interpolated string
- Recomputes whenever any signal in the expressions changes
- Null/undefined values are converted to empty strings
- All values are converted to strings via `.toString()`

### Non-Guarantees

- No guarantee about the performance of template recomputation
- No guarantee about the behavior if `.toString()` throws on a value

### Edge Cases

- Works with signals, deriver functions, and plain values (verified by tests/tmpl.test.ts)

### Examples

```typescript
const name = signal("World");
const greeting = tmpl`Hello ${name}`;
console.log(greeting.value); // "Hello World"

name.value = "Alice";
console.log(greeting.value); // "Hello Alice"
```

### Verified By

- tests/tmpl.test.ts: "should create derived signal from template literal"
- tests/tmpl.test.ts: "should update when signal expressions change"

---

## Connectors

### Purpose

Define the behavior of signal-to-signal connections.

### Guarantees

- `receive()`: When any transmitter's value changes, the receiver's value is updated to match
- `transmit()`: When the transmitter's value changes, all receivers are updated to match
- All updates are synchronous
- Receivers can still be updated independently
- Returned effects can be disposed to stop the connections

### Non-Guarantees

- For `receive()`: If multiple transmitters change simultaneously, which value the receiver gets is not guaranteed (last one wins based on execution order)
- No guarantee about the order of receiver updates in `transmit()`

### Edge Cases

- Empty transmitters array in `receive()` returns empty effects array (verified by tests/connectors.test.ts)
- Empty receivers array in `transmit()` creates an effect that does nothing (verified by tests/connectors.test.ts)

### Examples

```typescript
const transmitter = signal("Hello");
const receiver1 = signal("");
const receiver2 = signal("");

transmit(transmitter, receiver1, receiver2);
transmitter.value = "Hi";
// Both receivers are updated to "Hi"
```

### Verified By

- tests/connectors.test.ts: "should broadcast from transmitter to multiple receivers"
- tests/connectors.test.ts: "should connect multiple transmitters to a receiver"

---

## Compute

### Purpose

Define the behavior of function-based derived signals.

### Guarantees

- The derived signal's value is the result of calling the function with unwrapped arguments
- Recomputes whenever any of the signalified arguments changes
- Plain value arguments don't trigger recomputation
- Works with functions of any arity

### Non-Guarantees

- No guarantee about the performance of function execution
- No guarantee about the order of recomputation when multiple arguments change

### Edge Cases

- If the function throws an error, the error propagates (verified by BEHAVIORAL_INVENTORY.md)

### Examples

```typescript
const a = signal(5);
const b = signal(3);
const sum = compute((x: number, y: number) => x + y, a, b);
console.log(sum.value); // 8
```

### Verified By

- tests/compute.test.ts: "should create derived signal from function with signal arguments"
- tests/compute.test.ts: "should recompute when signal arguments change"

---

## Value Getter

### Purpose

Define the behavior of the `value()` utility function.

### Guarantees

- If input is a signal or non-signal, returns `input.value`
- If input is a plain value, returns it as-is
- Does not trigger dependency tracking

### Non-Guarantees

- No guarantee about the performance of value extraction

### Edge Cases

- Works with `null` and `undefined` (verified by tests/utils.test.ts)

### Examples

```typescript
const count = signal(42);
value(count); // 42
value(100); // 100
```

### Verified By

- tests/utils.test.ts: "should return plain value from source signal"

---

## Ambiguities and Inferred Behaviors

### Effect Execution Order Across Multiple Signals

When a single signal update triggers effects on multiple signals (through recursive effect triggering), the order of effect execution across those signals is not specified by tests. This behavior should not be relied upon.

**Status:** Not verified by tests - implementation detail

### Maximum Recursion Depth

There is no specified limit on the depth of recursive effect triggering. This behavior should not be relied upon for correctness.

**Status:** Not verified by tests - implementation detail

### Performance Characteristics

No performance guarantees are provided for any operation. Performance may vary based on the number of signals, effects, and complexity of computations.

**Status:** Not verified by tests - implementation characteristic

### Concurrent Signal Updates

If multiple signals are updated in sequence without yielding control, all effects will run synchronously for each update. There is no batching mechanism to coalesce these updates.

**Status:** Verified by ARCHITECTURE_NOTES.md - "No Batching Mechanism"

### Error Recovery in Effects

If an effect throws an error during execution, the error propagates immediately. There is no automatic error recovery or retry mechanism. Subsequent signal changes may or may not trigger the effect again depending on whether the error prevented dependency tracking.

**Status:** Partially verified by BEHAVIORAL_INVENTORY.md - "If the function throws an error, the error propagates and may prevent subsequent runs"
