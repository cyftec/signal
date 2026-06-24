# LLM Guide for @cyftech/signal

This guide provides comprehensive instructions for AI coding agents to correctly use the @cyftech/signal library. It covers all APIs, edge cases, common pitfalls, and best practices based on the complete test suite and source code analysis.

## Library Overview

@cyftech/signal is a TypeScript implementation of reactive signals with three core primitives:

- **signal**: Creates mutable source signals from plain values
- **derive**: Creates read-only derived signals computed from other signals
- **effect**: Registers functions to run when dependent signals change

### Key Architectural Characteristics

**Critical Differences from Common Signal Libraries:**

1. **Global Variable Dependency Tracking**: Uses a module-level `_currentSignalEffect` variable instead of explicit dependency graphs
2. **No Batching**: All updates are synchronous and immediate - no deferred execution
3. **Derived Signal Implementation**: Wraps a source signal + effect pattern (not a dedicated node)
4. **Array Mutation Methods**: Provides mutating methods (push, pop, etc.) that create new arrays internally
5. **Custom Array Methods**: Includes `remove()` method (inverse of filter)
6. **No Scheduling**: No microtask scheduling - all propagation is synchronous
7. **Type Discrimination**: Uses `type` property on all signal objects for runtime type checking
8. **NonSignal Objects**: Explicit runtime type wrapper for plain values

### Dependency

- `@cyftec/immut` (v0.1.0) - Used for immutable value handling

---

## Core Primitives

### signal(input: T): SourceSignal<T>

Creates a mutable source signal from any JavaScript value.

**Signature:**

```typescript
signal<T>(input: T): SourceSignal<T>
```

**Returns:**

- `type: "source-signal"` - Runtime type discriminator
- `value: T` - Getter/setter for the signal's value
- For arrays: mutation methods (push, pop, splice, etc.)
- For objects: `set(partial)` method for partial updates

**Behavior:**

- Reading `signal.value` returns the current value (immutable copy via `@cyftec/immut`)
- Setting `signal.value = newValue` updates the value and triggers all registered effects
- If new value equals old value (strict equality), no update occurs and effects don't run
- Effects are triggered synchronously and immediately upon value change

**Edge Cases:**

- `null` and `undefined` are valid signal values
- Empty arrays and empty objects are valid
- Nested objects and arrays are supported
- Signal values are stored immutably

**Examples:**

```typescript
// Primitive values
const count = signal(0);
count.value = 1;
console.log(count.value); // 1

// Object values with partial updates
const user = signal({ name: "John", age: 30 });
user.set({ age: 31 }); // Shallow merge
console.log(user.value); // { name: "John", age: 31 }

// Array values with mutation methods
const items = signal([1, 2, 3]);
items.push(4);
items.pop();
items.splice(1, 2);
items.remove((item) => item % 2 === 0); // Custom method
```

**Critical Gotchas:**

- Setting the same value twice won't trigger effects (strict equality check)
- Object `set()` performs shallow merge, not deep merge
- Array mutation methods create new arrays internally but feel mutable

---

### derive(valueGetterFn: (oldValue: T | undefined) => T): DerivedSignal<T>

Creates a read-only derived signal computed from other signals.

**Signature:**

```typescript
derive<T>(valueGetterFn: (oldValue: T | undefined) => T): DerivedSignal<T>
```

**Returns:**

- `type: "derived-signal"` - Runtime type discriminator
- `value: T` - Getter for current computed value
- `prevValue: T | undefined` - Getter for previous computed value
- `dispose(): void` - Stops tracking dependencies

**Behavior:**

- Reads `derivedSignal.value` to get current computed value
- Recomputes whenever any accessed signal's value changes
- Recomputation happens synchronously when dependencies change
- Value getter function receives previous computed value (undefined on first run)
- Calling `dispose()` stops dependency tracking
- After disposal, value remains accessible but won't update

**Edge Cases:**

- If value getter function doesn't access any signal values, it runs only once
- If value getter function has conditional logic that skips signal access, those signals won't be tracked
- Previous value is undefined on first computation
- Derived signals can depend on other derived signals (chaining)
- If value getter function throws an error, the error propagates

**Examples:**

```typescript
// Simple derivation
const count = signal(5);
const doubled = derive(() => count.value * 2);
console.log(doubled.value); // 10

// Using previous value
const history = derive((prev) => {
  const current = count.value;
  return prev ? [...prev, current] : [current];
});

// Conditional dependency tracking
const showCount = signal(true);
const displayed = derive(() => {
  if (showCount.value) {
    return count.value; // Only tracks count when showCount is true
  }
  return 0;
});
```

**Critical Gotchas:**

- **Dependency tracking only happens for signals accessed during execution**
- If a signal is accessed conditionally and the condition is false on first run, it won't be tracked
- This is intentional but different from automatic dependency collection in other libraries
- The `prevValue` parameter is the previous RETURN value, not the previous dependency values

**Common Pitfall:**

```typescript
// WRONG - count won't be tracked if shouldShow is false initially
const shouldShow = signal(false);
const count = signal(5);
const displayed = derive(() => {
  if (shouldShow.value) {
    return count.value;
  }
  return 0;
});
// Changing count.value won't trigger recomputation!

// CORRECT - Always access the signal
const displayed = derive(() => {
  return shouldShow.value ? count.value : 0;
});
```

---

### effect(fn: () => void): SignalsEffect

Registers a function to run whenever its accessed signals change.

**Signature:**

```typescript
effect(fn: () => void): SignalsEffect
```

**Returns:**

- The input function augmented with:
  - `canDisposeNow: boolean` - Flag indicating disposal status
  - `dispose(): void` - Marks the effect for disposal

**Behavior:**

- Function runs immediately when `effect()` is called
- Function re-runs whenever any accessed signal's value changes
- Re-runs happen synchronously when dependencies change
- Only signals whose `.value` was accessed during execution trigger re-runs
- Calling `dispose()` sets `canDisposeNow = true`
- Disposed effects are removed from signals on the next signal update
- Disposed effects never run again

**Edge Cases:**

- If function doesn't access any signal values, it runs only once
- If function has conditional logic that skips signal access, those signals won't be tracked
- If function throws an error, the error propagates and may prevent subsequent runs
- Effects can be nested (effects within effects)

**Examples:**

```typescript
const count = signal(0);

// Simple effect
effect(() => {
  console.log("Count is:", count.value);
});

// Multiple signal tracking
const name = signal("John");
const age = signal(30);
effect(() => {
  console.log(`${name.value} is ${age.value} years old`);
});

// Disposal
const eff = effect(() => {
  console.log(count.value);
});
eff.dispose();
count.value = 5; // Effect won't run
```

**Critical Gotchas:**

- **Effects only register to signals if `.value` is accessed during execution**
- Same conditional dependency tracking issue as `derive()`
- Disposal is lazy - effects are removed on next signal update, not immediately

**Common Pitfall:**

```typescript
// WRONG - count won't be tracked if condition is false initially
const shouldLog = signal(false);
const count = signal(0);
effect(() => {
  if (shouldLog.value) {
    console.log(count.value);
  }
});
// Changing count.value won't trigger the effect!

// CORRECT - Always access the signal
effect(() => {
  if (shouldLog.value) {
    console.log(count.value);
  } else {
    count.value; // Access to track dependency
  }
});
```

---

### dispose(...derivedSignalsOrEffects): void

Disposes multiple derived signals and/or effects at once.

**Signature:**

```typescript
dispose(...derivedSignalsOrEffects: (DerivedSignal<any> | SignalsEffect)[]): void
```

**Behavior:**

- Calls `.dispose()` on each argument
- For derived signals: stops dependency tracking
- For effects: marks for disposal
- Disposal is synchronous

**Edge Cases:**

- Empty argument list is valid (no-op)
- Can mix derived signals and effects in the same call
- Disposing the same effect multiple times is safe (idempotent)

**Examples:**

```typescript
const count = signal(0);
const doubled = derive(() => count.value * 2);
const eff = effect(() => console.log(count.value));

// Dispose single
dispose(doubled);

// Dispose multiple
dispose(doubled, eff);

// Mixed disposal
dispose(doubled, eff);

// Empty (no-op)
dispose();
```

---

### getNonSignalObject(input: T): NonSignal<T>

Wraps a plain value in a NonSignal object for runtime type discrimination.

**Signature:**

```typescript
getNonSignalObject<T>(input: T): NonSignal<T>
```

**Returns:**

- `type: "non-signal"` - Runtime type discriminator
- `value: T` - The wrapped value

**Behavior:**

- Used for runtime type checking in complex type scenarios
- Enables distinguishing between plain values and signalified objects

**Examples:**

```typescript
const nonSig = getNonSignalObject(42);
console.log(nonSig.type); // "non-signal"
console.log(nonSig.value); // 42
```

---

## Type Checkers

### valueIsSourceSignal(input: MaybeSignal<any>): boolean

Checks if a value is a source signal.

**Behavior:**

- Returns true only if input has `type: "source-signal"`
- Returns false for derived signals, non-signals, and plain values
- Returns false for `null` and `undefined`

### valueIsDerivedSignal(input: MaybeSignal<any>): boolean

Checks if a value is a derived signal.

**Behavior:**

- Returns true only if input has `type: "derived-signal"`
- Returns false for source signals, non-signals, and plain values
- Returns false for `null` and `undefined`

### valueIsSignal(input: MaybeSignal<any>): boolean

Checks if a value is any signal (source or derived).

**Behavior:**

- Returns true for both source and derived signals
- Returns false for non-signals and plain values
- Returns false for `null` and `undefined`

### valueIsNonSignalObject(input: any, shouldMatchAnyOfTypes?: string[]): boolean

Checks if a value is a non-signal object, optionally matching specific types.

**Behavior:**

- Returns true only for non-signal objects
- If types provided, also checks if `typeof input.value` matches one of the types
- If types not provided or empty, only checks for non-signal type
- Empty types array is treated as no type restriction

**Examples:**

```typescript
const nonSig = getNonSignalObject(42);
valueIsNonSignalObject(nonSig); // true
valueIsNonSignalObject(nonSig, ["number"]); // true
valueIsNonSignalObject(nonSig, ["string"]); // false
```

### valueIsSignalifiedObject(input: any): boolean

Checks if a value is a signal or non-signal object.

**Behavior:**

- Returns true for source signals, derived signals, and non-signal objects
- Returns false for plain values
- Returns false for `null` and `undefined`

### valueIsNonSignalString(input: any): boolean

Checks if a value is a non-signal of type string.

**Behavior:**

- Returns true only for non-signal objects where `typeof value === "string"`
- Returns false for plain strings (not wrapped in non-signal)

### valueIsNonSignalStringArray(input: any): boolean

Checks if a value is a non-signal of type string array.

**Behavior:**

- Returns true only for non-signal objects where value is an array of strings
- Checks that all array elements are strings
- Returns false for empty arrays (vacuously true in implementation)
- Returns false for arrays with non-string elements

### valueIsMaybeSignalValueOfStringOrArray(input: any): boolean

Checks if a value (after unwrapping) is a string or array.

**Behavior:**

- Unwraps signals and non-signals to get the plain value
- Returns true if the plain value is a string or array
- Returns false for other types
- Returns false for `null` and `undefined`

---

## Value Getter

### value(input: MaybeSignalValue<T>): T

Extracts the plain value from a signal, non-signal, or plain value.

**Signature:**

```typescript
value<T>(input: MaybeSignalValue<T>): T
```

**Behavior:**

- If input is a signal or non-signal, returns `input.value`
- If input is a plain value, returns it as-is
- Does not trigger dependency tracking (use `.value` directly for that)

**Examples:**

```typescript
const count = signal(42);
const nonSig = getNonSignalObject("hello");

value(count); // 42
value(nonSig); // "hello"
value(100); // 100
```

---

## API Layer - Compute

### compute(computerFn: F, ...restArgs: MaybeSignalValues<Parameters<F>>): DerivedSignal<ReturnType<F>>

Creates a derived signal from a function with signalified arguments.

**Signature:**

```typescript
compute<F extends (...args: any[]) => any>(
  computerFn: F,
  ...restArgs: MaybeSignalValues<Parameters<F>>
): DerivedSignal<ReturnType<F>>
```

**Behavior:**

- Derived signal's value is the result of calling `computerFn` with unwrapped arguments
- Recomputes whenever any of the signalified arguments changes
- Arguments are unwrapped using the `value()` function
- Works with functions of any arity
- Can mix signals and plain values in arguments
- Plain value arguments don't trigger recomputation

**Examples:**

```typescript
const a = signal(5);
const b = signal(3);
const sum = compute((x: number, y: number) => x + y, a, b);
console.log(sum.value); // 8

// Mixed signals and plain values
const sum2 = compute((x: number, y: number) => x + y, a, 10);
console.log(sum2.value); // 15

// Complex computation
const base = signal(100);
const rate = signal(0.1);
const years = signal(5);
const interest = compute(
  (b: number, r: number, y: number) => b * Math.pow(1 + r, y),
  base,
  rate,
  years,
);
```

**Edge Cases:**

- If the function throws an error, the error propagates
- Setting a signal to the same value won't trigger recomputation

---

## API Layer - Connectors

### receive(receiver: SourceSignal<T>, ...transmittors: Signal<T>[]): SignalsEffect[]

Connects multiple transmitter signals to a receiver signal. The receiver gets the last updated transmitter's value.

**Signature:**

```typescript
receive<T>(
  receiver: SourceSignal<T>,
  ...transmittors: Signal<T>[]
): SignalsEffect[]
```

**Behavior:**

- When any transmitter's value changes, the receiver's value is updated to match
- If multiple transmitters change simultaneously, the receiver gets the last one's value
- The receiver can still be updated independently
- Each transmitter has its own effect that updates the receiver
- Returns array of effects for disposal

**Edge Cases:**

- Empty transmitters array returns empty effects array
- Transmitters can be source or derived signals
- Receiver must be a source signal (mutable)

**Examples:**

```typescript
const sportsEvent = signal("cricket @ 9am");
const mediaEvent = signal("movie @ 3pm");
const noticeBoard = signal("");

const effects = receive(noticeBoard, sportsEvent, mediaEvent);

sportsEvent.value = "football @ 1pm";
console.log(noticeBoard.value); // "football @ 1pm"

mediaEvent.value = "concert @ 8pm";
console.log(noticeBoard.value); // "concert @ 8pm"

// Manual update still works
noticeBoard.value = "No events";

// Dispose connections
effects.forEach((eff) => eff.dispose());
```

---

### transmit(transmittor: Signal<T>, ...receivers: SourceSignal<T>[]): SignalsEffect

Broadcasts changes from one transmitter signal to multiple receiver signals.

**Signature:**

```typescript
transmit<T>(
  transmittor: Signal<T>,
  ...receivers: SourceSignal<T>[]
): SignalsEffect
```

**Behavior:**

- When the transmitter's value changes, all receivers are updated to match
- All receivers are updated synchronously
- Each receiver can still be updated independently
- A single effect manages all receiver updates
- Returns single effect for disposal

**Edge Cases:**

- Empty receivers array creates an effect that does nothing
- Transmitter can be source or derived signal
- Receivers must be source signals (mutable)

**Examples:**

```typescript
const temperature = signal(22);
const display1 = signal(0);
const display2 = signal(0);
const display3 = signal(0);

const effect = transmit(temperature, display1, display2, display3);

temperature.value = 25;
console.log(display1.value); // 25
console.log(display2.value); // 25
console.log(display3.value); // 25

// Manual updates still work
display1.value = 30;

// Dispose connection
effect.dispose();
```

---

## API Layer - Promise States

### promstates<R, Args extends Array<any>, I>(promiseFn, initialValue?, ultimately?): readonly [runPromise, result, error, isRunning]

Creates promise state signals for async operations.

**Signature:**

```typescript
promstates<R, Args extends Array<any>, I>(
  promiseFn: (...args: Args) => Promise<R>,
  initialValue?: I,
  ultimately?: () => void
): readonly [
  runPromise: (...args: Args) => Promise<void>,
  result: DerivedSignal<R | I | undefined>,
  error: DerivedSignal<Error | undefined>,
  isRunning: DerivedSignal<boolean>
]
```

**Behavior:**

- Calling `runPromise(...args)` executes the promise function
- `isRunning` becomes `true` when promise starts, `false` when it completes
- On success: `result` is updated, `error` is set to `undefined`
- On failure: `error` is updated, `result` preserves the previous successful result
- The `ultimately` callback runs in the finally block
- States are derived signals that update automatically

**Critical Behavior:**

- **Result is preserved on error**: If promise fails, the last successful result is kept
- **Error is reset on success**: On successful completion, error is set to undefined
- **Promise can be run multiple times**

**Edge Cases:**

- If no initial value provided, result signal starts as `undefined`
- If the promise fails multiple times, the last successful result is preserved
- The promise can be run multiple times
- If the promise function throws synchronously, the error propagates
- If the ultimately callback throws, the error propagates

**Examples:**

```typescript
const promiseFn = async (value: number) => value * 2;
const [runPromise, result, error, isRunning] = promstates(promiseFn, 0);

await runPromise(5);
console.log(result.value); // 10
console.log(error.value); // undefined

await runPromise(-1); // Assume this throws
console.log(result.value); // 10 (preserved)
console.log(error.value); // Error instance

await runPromise(3);
console.log(result.value); // 6
console.log(error.value); // undefined (reset)
```

**Best Practice:**
Always check error first while using promstates:

```typescript
if (error.value) {
  // Handle error
  console.error(error.value);
} else {
  // Use result.value
  console.log(result.value);
}
```

---

## API Layer - Template

### tmpl(strings: TemplateStringsArray, ...tlExpressions): DerivedSignal<string>

Tagged template function for string interpolation with signals.

**Signature:**

```typescript
tmpl(
  strings: TemplateStringsArray,
  ...tlExpressions: StringSignalDeriverTemplateExpressions
): DerivedSignal<string>
```

**Behavior:**

- Derived signal's value is the interpolated string
- Recomputes whenever any signal in the expressions changes
- Expressions can be:
  - Signals (accessed via `.value`)
  - Deriver functions (called to get value)
  - Plain values (used as-is)
- Null/undefined values are converted to empty strings
- All values are converted to strings via `.toString()`

**Edge Cases:**

- Works with any combination of signals, functions, and plain values
- Null/undefined expressions become empty strings
- If `.toString()` throws on a value, the error propagates

**Examples:**

```typescript
const name = signal("World");
const greeting = tmpl`Hello ${name}`;
console.log(greeting.value); // "Hello World"

name.value = "Alice";
console.log(greeting.value); // "Hello Alice"

// Multiple expressions
const firstName = signal("John");
const lastName = signal("Doe");
const fullName = tmpl`${firstName} ${lastName}`;

// Mixed expressions
const count = signal(5);
const message = tmpl`Count: ${count}`;

// Function expressions
const doubled = tmpl`Double is ${() => count.value * 2}`;
```

---

## API Layer - Traps

### trap(input: MaybeSignalValue<T>): SignalTrap<T>

Creates a type-specific trap object with convenient derived signal methods.

**Signature:**

```typescript
trap<T>(input: MaybeSignalValue<T>): SignalTrap<T>
```

**Behavior:**

- Trap type is determined by the runtime type of the unwrapped value
- For numbers: returns NumberSignalTrap with numeric operations
- For strings: returns StringSignalTrap with string operations
- For arrays: returns ArraySignalTrap with array operations
- For plain objects: returns RecordSignalTrap with object operations
- For other types: returns GenericTrap with basic operations
- All methods return derived signals that update when the input changes

**Edge Cases:**

- The trap type is determined by the initial value's type
- If the input is a signal, the trap type is based on its current value
- Type changes in the signal are not reflected in the trap type
- For object trap: throws if the value is not a plain object

**Critical Gotcha:**
The trap type is determined at creation time and doesn't change if the signal's value type changes:

```typescript
const value = signal(5);
const trapped = trap(value); // NumberSignalTrap
value.value = "hello"; // Type change not reflected
// trapped still has number methods, not string methods
```

---

#### GenericTrap Methods

**get string(): DerivedSignal<string>**

- Converts the value to a string signal
- Returns `undefined` if value is `null` or undefined

**or<OV>(orValue: MaybeSignalValue<OV>): DerivedSignal<NonNullable<T> | OV>**

- Returns the value if truthy, otherwise the fallback value
- Recomputes when either value changes

---

#### NumberSignalTrap Methods

**toConfined(start, end): DerivedSignal<number>**

- Confines the number to a range
- If value < start, returns start
- If value > end, returns end
- Otherwise returns value

**toExponential(fractionDigits?): DerivedSignal<string>**

- Converts to exponential notation string

**toLocaleString(locales?, options?): DerivedSignal<string>**

- Converts to locale-specific string

**toFixed(fractionDigits?): DerivedSignal<string>**

- Converts to fixed-point notation string

**toPrecision(precision?): DerivedSignal<string>**

- Converts to precision notation string

---

#### StringSignalTrap Methods

All standard string methods (charAt, concat, includes, etc.) are available as derived signal methods.

**get length(): DerivedSignal<number>**

- Returns the string length as a derived signal

**get lowercase(): DerivedSignal<string>**

- Returns the lowercase version of the string

**get Sentencecase(): DerivedSignal<string>**

- Returns the string with first letter capitalized, rest lowercase

**get TitleCase(): DerivedSignal<string>**

- Returns the string with each word's first letter capitalized

**get UPPERCASE(): DerivedSignal<string>**

- Returns the uppercase version of the string

**localeCompare(that, locales?, options?): DerivedSignal<number>**

- Compares strings according to locale

**normalize(form): DerivedSignal<string>**

- Normalizes the string to the specified Unicode form

**replace(searchValue, replaceValue): DerivedSignal<string>**

- Replaces the first match of searchValue with replaceValue

**replaceAll(searchValue, replaceValue): DerivedSignal<string>**

- Replaces all matches of searchValue with replaceValue

**search(regexp): DerivedSignal<number>**

- Searches for a match and returns the index

**split(separator, limit?): DerivedSignal<string[]>**

- Splits the string into an array

---

#### ArraySignalTrap Methods

All standard array methods (at, concat, slice, etc.) are available as derived signal methods.

**get length(): DerivedSignal<number>**

- Returns the array length as a derived signal

**get lastItem(): DerivedSignal<T | undefined>**

- Returns the last item of the array as a derived signal

**get reversed(): DerivedSignal<T[]>**

- Returns a reversed copy of the array as a derived signal

**partition(where): readonly [DerivedSignal<T[]>, DerivedSignal<T[]>]**

- Splits the array into two derived signals based on a predicate
- First signal contains items where predicate returns true
- Second signal contains items where predicate returns false

**Additional methods:**

- map, filter, find, findIndex, findLast, findLastIndex
- reduce, reduceRight
- some, every
- toSorted, toSpliced
- concat, includes, indexOf, lastIndexOf, join, slice, with

---

#### RecordSignalTrap Methods

**get<K extends keyof T>(key: K): DerivedSignal<T[K]>**

- Returns a derived signal for a specific property
- Recomputes when the object or the property changes

**get withLiveProps(): { [key in keyof T]: DerivedSignal<T[key]> }**

- Returns an object with all properties as derived signals
- Each property signal recomputes when the object changes

**get keys(): DerivedSignal<string[]>**

- Returns the object's keys as a derived signal

**Critical Gotcha:**
Throws error if the value is not a plain object:

```typescript
const date = signal(new Date());
trap(date).get("getTime"); // Throws error
// Use generic trap instead
trap(date).string.value; // Works
```

---

## API Layer - Operations

### op(input: MaybeSignalValue<T> | (() => T)): Operation<T>

Creates an operation object for composing logical and mathematical operations on signals.

**Signature:**

```typescript
op<T>(input: MaybeSignalValue<T> | (() => T)): Operation<T>
```

**Behavior:**

- Operation type is determined by the runtime type of the evaluated value
- For numbers: returns NumberOperation with math operations
- For strings/arrays: returns StringAndArrayOperation with length operations
- For other types: returns GenericOperation with logical operations
- All methods return new operation objects (chaining)
- Final result is obtained via getters (truthy, falsy, result, etc.)

**Edge Cases:**

- If input is a function, it's called to get the value
- The operation type is determined by the initial evaluated value
- Type changes in the signal are not reflected in the operation type

---

#### GenericOperation Methods

**get truthy(): DerivedSignal<boolean>**

- Returns a derived signal of whether the value is truthy

**get falsy(): DerivedSignal<boolean>**

- Returns a derived signal of whether the value is falsy

**get truthyFalsyPair(): DerivedSignal<readonly [boolean, boolean]>**

- Returns a derived signal of [isTruthy, isFalsy] pair

**ternary<Tr, Fl>(valueIfTruthy, valueIfFalsy): DerivedSignal<Tr | Fl>**

- Returns valueIfTruthy if truthy, otherwise valueIfFalsy

**or(checkValue): GenericOperation**

- Chains an OR operation. Returns new operation for further chaining

**orNot(checkValue): GenericOperation**

- Chains an OR-NOT operation

**and(checkValue): GenericOperation**

- Chains an AND operation

**andNot(checkValue): GenericOperation**

- Chains an AND-NOT operation

**equals(compareValue): GenericOperation**

- Chains an equality comparison

**notEquals(compareValue): GenericOperation**

- Chains an inequality comparison

**orBothEqual(subjectValue, compareValue): GenericOperation**

- Chains an OR operation with an equality check on two other values

**orBothUnequal(subjectValue, compareValue): GenericOperation**

- Chains an OR operation with an inequality check on two other values

**andBothEqual(subjectValue, compareValue): GenericOperation**

- Chains an AND operation with an equality check on two other values

**andBothUnequal(subjectValue, compareValue): GenericOperation**

- Chains an AND operation with an inequality check on two other values

**orThisIsLT/ThisIsLTE/ThisIsGT/ThisIsGTE(subjectValue, compareValue): GenericOperation**

- Chains an OR operation with a comparison check on two other values

**andThisIsLT/ThisIsLTE/ThisIsGT/ThisIsGTE(subjectValue, compareValue): GenericOperation**

- Chains an AND operation with a comparison check on two other values

---

#### NumberOperation Methods

Extends GenericOperation with:

**get result(): DerivedSignal<number>**

- Returns the numeric value as a derived signal

**add(num): NumberOperation**

- Chains an addition operation

**sub(num): NumberOperation**

- Chains a subtraction operation

**mul(num): NumberOperation**

- Chains a multiplication operation

**div(num): NumberOperation**

- Chains a division operation

**mod(num): NumberOperation**

- Chains a modulo operation

**pow(num): NumberOperation**

- Chains an exponentiation operation

**isBetween(lowerValue, upperValue, touchingLower?, touchingUpper?): GenericOperation**

- Checks if the value is between lower and upper (inclusive by default)

**isLT/isLTE/isGT/isGTE(compareValue): GenericOperation**

- Chains a comparison operation

---

#### StringAndArrayOperation Methods

Extends GenericOperation with:

**lengthBetween(lowerValue, upperValue, touchingLower?, touchingUpper?): GenericOperation**

- Checks if the length is between lower and upper (inclusive by default)

**lengthEquals/lengthNotEquals/lengthLT/lengthLTE/lengthGT/lengthGTE(compareValue): GenericOperation**

- Chains a length comparison operation

---

## Critical Implementation Details

### Dependency Tracking Mechanism

The library uses a **global variable-based dependency tracking system**:

1. When `effect()` is called, it sets `_currentSignalEffect` before executing the function
2. When a signal's `.value` getter is called, it checks if `_currentSignalEffect` exists
3. If it exists, the effect is added to the signal's internal `_effects` Set
4. After effect execution, `_currentSignalEffect` is set back to `null`

**Critical Implications:**

- Effects must access `.value` during execution to establish dependencies
- No explicit dependency graph - each signal maintains a Set of registered effects
- Dependencies are tracked implicitly through the global variable during execution

### Effect Execution Flow

1. Signal value is set via setter
2. Signal checks if new value equals old value (short-circuits if equal)
3. Signal updates internal value using `immut()`
4. Signal iterates through its `_effects` Set
5. For each effect: if `canDisposeNow` is true, remove it; otherwise, execute it
6. Effects may access other signals' `.value`, triggering their effects recursively

### Disposal Cleanup Timing

**Lazy Cleanup Strategy:**

- Disposed effects are not removed immediately
- They are removed on the next signal update
- This means disposed effects might run one more time after disposal

**Example:**

```typescript
const count = signal(0);
const eff = effect(() => console.log(count.value));

eff.dispose();
count.value = 1; // Effect is removed here without running
count.value = 2; // Effect is already gone
```

### No Batching

**All updates are synchronous and immediate:**

- No automatic batching of multiple signal updates
- No manual batch API provided
- Each signal update triggers all dependent effects immediately

**Example:**

```typescript
const a = signal(0);
const b = signal(0);
const c = signal(0);

effect(() => {
  console.log(a.value + b.value + c.value);
});

a.value = 1; // Effect runs
b.value = 2; // Effect runs again
c.value = 3; // Effect runs again
// Total: 3 effect runs
```

### Array Signal Implementation

Array mutation methods create new arrays internally but the API feels mutable:

```typescript
const arr = signal([1, 2, 3]);
arr.push(4); // Creates new array [1, 2, 3, 4] internally
console.log(arr.value); // [1, 2, 3, 4]
```

**Custom method:**

- `remove(predicate)` - Inverse of filter (removes items where predicate returns true)

### Object Signal Partial Updates

Object signals have `set(partial)` method for shallow merge:

```typescript
const obj = signal({ name: "John", age: 30 });
obj.set({ age: 31 }); // Shallow merge
console.log(obj.value); // { name: "John", age: 31 }
```

**Critical:** This is a shallow merge, not a deep merge.

### Derived Signal Previous Value

Derived signals expose `prevValue` getter:

- This is uncommon in other signal libraries
- Useful for diffing or change detection
- The value is the previous RETURN value, not previous dependency values

```typescript
const count = signal(0);
const doubled = derive((prev) => {
  const current = count.value * 2;
  console.log("Previous:", prev);
  return current;
});

count.value = 5; // Logs: Previous: undefined
count.value = 10; // Logs: Previous: 10
```

---

## Common Pitfalls and Solutions

### Pitfall 1: Conditional Dependency Tracking

**Problem:**

```typescript
const shouldShow = signal(false);
const count = signal(5);
const displayed = derive(() => {
  if (shouldShow.value) {
    return count.value;
  }
  return 0;
});
// Changing count.value won't trigger recomputation!
```

**Solution:**
Always access the signal, even if conditionally:

```typescript
const displayed = derive(() => {
  return shouldShow.value ? count.value : 0;
});
```

### Pitfall 2: Not Accessing .value in Effects

**Problem:**

```typescript
const count = signal(0);
effect(() => {
  console.log(count); // Wrong! Not accessing .value
});
```

**Solution:**

```typescript
effect(() => {
  console.log(count.value); // Correct
});
```

### Pitfall 3: Forgetting to Dispose

**Problem:**

```typescript
const count = signal(0);
const doubled = derive(() => count.value * 2);
// If this derived signal is no longer needed, it will keep running
```

**Solution:**

```typescript
const doubled = derive(() => count.value * 2);
// When done:
doubled.dispose();
```

### Pitfall 4: Assuming Deep Merge on Objects

**Problem:**

```typescript
const obj = signal({ user: { name: "John" } });
obj.set({ user: { age: 30 } });
// Expected: { user: { name: "John", age: 30 } }
// Actual: { user: { age: 30 } }
```

**Solution:**

```typescript
obj.set({ user: { ...obj.value.user, age: 30 } });
```

### Pitfall 5: Type Changes Not Reflected in Traps/Operations

**Problem:**

```typescript
const value = signal(5);
const trapped = trap(value); // NumberSignalTrap
value.value = "hello"; // Type change not reflected
trapped.toFixed(2); // Error!
```

**Solution:**
Create a new trap when type changes, or use generic operations.

### Pitfall 6: Not Checking Error in promstates

**Problem:**

```typescript
const [runPromise, result] = promstates(promiseFn);
await runPromise();
console.log(result.value); // Might be stale if promise failed
```

**Solution:**

```typescript
const [runPromise, result, error] = promstates(promiseFn);
await runPromise();
if (error.value) {
  console.error(error.value);
} else {
  console.log(result.value);
}
```

### Pitfall 7: Assuming Batching

**Problem:**

```typescript
const a = signal(0);
const b = signal(0);
effect(() => console.log(a.value + b.value));

a.value = 1;
b.value = 2;
// Expected: One effect run with result 3
// Actual: Two effect runs (1 and 3)
```

**Solution:**
This is expected behavior. There is no batching in this library.

---

## Best Practices

### 1. Always Access .value for Dependency Tracking

```typescript
// Good
const doubled = derive(() => count.value * 2);

// Bad
const doubled = derive(() => count * 2); // Won't track dependency
```

### 2. Dispose When No Longer Needed

```typescript
const derived = derive(() => source.value * 2);
// Use derived...

// When done:
derived.dispose();
```

### 3. Use dispose() for Bulk Disposal

```typescript
const d1 = derive(() => s1.value * 2);
const d2 = derive(() => s2.value * 2);
const eff = effect(() => console.log(s1.value));

dispose(d1, d2, eff);
```

### 4. Check Error First in promstates

```typescript
const [runPromise, result, error] = promstates(promiseFn);
await runPromise();

if (error.value) {
  // Handle error
} else {
  // Use result.value
}
```

### 5. Use trap for Type-Specific Operations

```typescript
// Good
const length = trap(textSignal).length;

// Verbose
const length = derive(() => textSignal.value.length);
```

### 6. Use op for Chained Operations

```typescript
// Good
const result = op(count).add(5).mul(2).result.value;

// Verbose
const result = derive(() => (count.value + 5) * 2);
```

### 7. Use compute for Function-Based Derived Signals

```typescript
// Good
const sum = compute((a, b) => a + b, signalA, signalB);

// Verbose
const sum = derive(() => signalA.value + signalB.value);
```

### 8. Use tmpl for String Interpolation

```typescript
// Good
const greeting = tmpl`Hello ${nameSignal}`;

// Verbose
const greeting = derive(() => `Hello ${nameSignal.value}`);
```

### 9. Use connectors for Signal-to-Signal Connections

```typescript
// Good
receive(receiver, transmitter1, transmitter2);

// Verbose
effect(() => (receiver.value = transmitter1.value));
effect(() => (receiver.value = transmitter2.value));
```

---

## Type System Reference

### Core Types

```typescript
// Signal types
type SourceSignal<T> = {
  type: "source-signal";
  value: T;
  // For arrays: mutation methods
  // For objects: set(partial) method
};

type DerivedSignal<T> = {
  type: "derived-signal";
  get value(): T;
  get prevValue(): T | undefined;
  dispose(): void;
};

type Signal<T> = SourceSignal<T> | DerivedSignal<T>;

// Non-signal type
type NonSignal<T> = {
  type: "non-signal";
  get value(): T;
};

// Union types
type MaybeSignal<T> = T | Signal<T>;
type MaybeSignalValue<T> = T | NonSignal<T> | Signal<T>;
type MaybeNonSignal<T> = T | NonSignal<T>;
```

### Effect Type

```typescript
type SignalsEffect = {
  (): void;
  canDisposeNow: boolean;
  dispose(): void;
};
```

---

## Testing Patterns

The test suite covers 100% of the codebase. Key testing patterns:

### Signal Tests

- Primitive values (number, string, boolean, null, undefined)
- Object values with partial updates
- Array values with all mutation methods
- Effect triggering on value changes
- No effect triggering on unchanged values

### Effect Tests

- Immediate execution on creation
- Re-running on signal changes
- Multiple signal tracking
- Conditional dependency tracking
- Disposal behavior
- Nested effects

### Derive Tests

- Basic derivation
- Multiple dependencies
- Chaining derived signals
- Previous value access
- Disposal behavior

### Compute Tests

- Signal and plain value arguments
- Mixed arguments
- Recomputation on signal changes
- No recomputation on plain value changes
- Different function arities

### Connector Tests

- Multiple transmitters to one receiver
- One transmitter to multiple receivers
- Independent updates
- Derived signal support
- Disposal behavior

### promstates Tests

- Success and error handling
- Result preservation on error
- Error reset on success
- Multiple runs
- Finally callback

### Template Tests

- Signal, function, and plain value expressions
- Multiple expressions
- Null/undefined handling
- Derived signal expressions

### Trap Tests

- Type dispatch (number, string, array, object, generic)
- Type-specific methods
- Property access for objects
- Partition for arrays
- Error on non-plain objects

### Operation Tests

- Generic operations (logical, comparison)
- Number operations (math, range)
- String/array operations (length)
- Chaining
- Function input support

### Utils Tests

- Value extraction from all types
- Type checking for all types
- Non-signal object creation

---

## Summary Checklist for LLMs

When working with @cyftech/signal, always:

1. **Access .value** to establish dependency tracking in effects and derives
2. **Dispose** derived signals and effects when no longer needed
3. **Check error first** when using promstates
4. **Use type-specific APIs** (trap, op) for cleaner code
5. **Remember no batching** - all updates are synchronous
6. **Handle conditional dependencies** carefully - always access signals
7. **Use shallow merge** for object.set() - not deep merge
8. **Create new traps** when signal value type changes
9. **Use compute** for function-based derived signals
10. **Use tmpl** for string interpolation with signals

Avoid:

1. Not accessing .value in effects/derives
2. Forgetting to dispose
3. Assuming deep merge on objects
4. Assuming batching exists
5. Not checking error in promstates
6. Using wrong trap type after value type change
7. Conditional dependency tracking pitfalls

This library prioritizes simplicity and explicitness over automatic behavior. Understanding the global variable-based dependency tracking and synchronous execution model is essential for correct usage.
