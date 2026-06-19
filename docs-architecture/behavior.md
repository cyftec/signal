# Behavioral Inventory

This document catalogs all public APIs and their observable behavior.

## Core Primitives

### signal(input: T): SourceSignal<T>

**What it does**
Converts plain JavaScript data into a reactive signal that can notify subscribers when changed.

**Inputs**

- `input: T` - Any JavaScript value (primitive, object, array)

**Outputs**

- `SourceSignal<T>` - A signal object with:
  - `type: "source-signal"` - Runtime type discriminator
  - `value: T` - Getter/setter for the signal's value
  - For arrays: array mutation methods (push, pop, splice, etc.)
  - For objects: `set(partial)` method for partial updates

**Observable behavior**

- Reading `signal.value` returns the current value
- Setting `signal.value = newValue` updates the value and triggers all registered effects
- If the new value equals the old value (strict equality), no update occurs and effects don't run
- For array signals, mutation methods (push, pop, etc.) update the array and trigger effects
- For object signals, `set(partial)` merges the partial object with the current value and triggers effects
- Effects are triggered synchronously and immediately upon value change

**Edge cases**

- `null` and `undefined` are valid signal values
- Empty arrays and empty objects are valid
- Nested objects and arrays are supported
- Signal values are stored immutably via `@cyftech/immutjs`

**Failure cases**

- None - all inputs are valid

---

### derive(valueGetterFn: (oldValue: T | undefined) => T): DerivedSignal<T>

**What it does**
Creates a read-only derived signal that computes its value from other signals.

**Inputs**

- `valueGetterFn: (oldValue: T | undefined) => T` - A function that:
  - Receives the previous computed value (undefined on first run)
  - Should access `.value` on signals to establish dependencies
  - Returns the new computed value

**Outputs**

- `DerivedSignal<T>` - A derived signal object with:
  - `type: "derived-signal"` - Runtime type discriminator
  - `value: T` - Getter for the current computed value
  - `prevValue: T | undefined` - Getter for the previous computed value
  - `dispose(): void` - Stops tracking dependencies

**Observable behavior**

- Reading `derivedSignal.value` returns the current computed value
- The value is recomputed whenever any accessed signal's value changes
- Recomputation happens synchronously when dependencies change
- The value getter function receives the previous computed value
- Calling `dispose()` stops the derived signal from tracking dependencies
- After disposal, the value remains accessible but won't update

**Edge cases**

- If the value getter function doesn't access any signal values, it runs only once
- If the value getter function has conditional logic that skips signal access, those signals won't be tracked
- The previous value is undefined on the first computation
- Derived signals can depend on other derived signals (chaining)

**Failure cases**

- If the value getter function throws an error, the error propagates
- No validation of the value getter function's return type

---

### effect(fn: () => void): SignalsEffect

**What it does**
Registers a function to run whenever its accessed signals change.

**Inputs**

- `fn: () => void` - A function that:
  - Should access `.value` on signals to establish dependencies
  - Contains side effects (logging, DOM updates, etc.)

**Outputs**

- `SignalsEffect` - The input function augmented with:
  - `canDisposeNow: boolean` - Flag indicating disposal status
  - `dispose(): void` - Marks the effect for disposal

**Observable behavior**

- The function runs immediately when `effect()` is called
- The function re-runs whenever any accessed signal's value changes
- Re-runs happen synchronously when dependencies change
- Only signals whose `.value` was accessed during execution trigger re-runs
- Calling `dispose()` sets `canDisposeNow = true`
- Disposed effects are removed from signals on the next signal update
- Disposed effects never run again

**Edge cases**

- If the function doesn't access any signal values, it runs only once
- If the function has conditional logic that skips signal access, those signals won't be tracked
- If the function throws an error, the error propagates and may prevent subsequent runs
- Effects can be nested (effects within effects)

**Failure cases**

- If the function throws an error, the error propagates immediately

---

### dispose(...derivedSignalsOrEffects: (DerivedSignal<any> | SignalsEffect)[]): void

**What it does**
Disposes multiple derived signals and/or effects at once.

**Inputs**

- `...derivedSignalsOrEffects` - Variable arguments of:
  - `DerivedSignal<any>` - Derived signals to dispose
  - `SignalsEffect` - Effects to dispose

**Outputs**

- `void`

**Observable behavior**

- Calls `.dispose()` on each argument
- For derived signals: stops dependency tracking
- For effects: marks for disposal
- Disposal is synchronous

**Edge cases**

- Empty argument list is valid (no-op)
- Can mix derived signals and effects in the same call
- Disposing the same effect multiple times is safe (idempotent)

**Failure cases**

- None - all inputs are validated by TypeScript

---

### getNonSignalObject(input: T): NonSignal<T>

**What it does**
Wraps a plain value in a NonSignal object for runtime type discrimination.

**Inputs**

- `input: T` - Any JavaScript value

**Outputs**

- `NonSignal<T>` - An object with:
  - `type: "non-signal"` - Runtime type discriminator
  - `value: T` - The wrapped value

**Observable behavior**

- Reading `nonSignal.value` returns the wrapped value
- Used for runtime type checking in complex type scenarios

**Edge cases**

- `null` and `undefined` are valid inputs
- Can wrap signals (though not recommended)

**Failure cases**

- None - all inputs are valid

---

## Type Checkers

### valueIsSourceSignal(input: MaybeSignal<any>): boolean

**What it does**
Checks if a value is a source signal.

**Inputs**

- `input: MaybeSignal<any>` - Any value to check

**Outputs**

- `boolean` - True if input has `type: "source-signal"`

**Observable behavior**

- Returns true only for source signals
- Returns false for derived signals, non-signals, and plain values

**Edge cases**

- Returns false for `null` and `undefined`
- Returns false for objects without a `type` property

**Failure cases**

- None

---

### valueIsDerivedSignal(input: MaybeSignal<any>): boolean

**What it does**
Checks if a value is a derived signal.

**Inputs**

- `input: MaybeSignal<any>` - Any value to check

**Outputs**

- `boolean` - True if input has `type: "derived-signal"`

**Observable behavior**

- Returns true only for derived signals
- Returns false for source signals, non-signals, and plain values

**Edge cases**

- Returns false for `null` and `undefined`
- Returns false for objects without a `type` property

**Failure cases**

- None

---

### valueIsSignal(input: MaybeSignal<any>): boolean

**What it does**
Checks if a value is any signal (source or derived).

**Inputs**

- `input: MaybeSignal<any>` - Any value to check

**Outputs**

- `boolean` - True if input has `type: "source-signal"` or `type: "derived-signal"`

**Observable behavior**

- Returns true for both source and derived signals
- Returns false for non-signals and plain values

**Edge cases**

- Returns false for `null` and `undefined`
- Returns false for objects without a `type` property

**Failure cases**

- None

---

### valueIsNonSignalObject(input: any, shouldMatchAnyOfTypes?: string[]): boolean

**What it does**
Checks if a value is a non-signal object, optionally matching specific types.

**Inputs**

- `input: any` - Any value to check
- `shouldMatchAnyOfTypes?: string[]` - Optional array of type names to match (e.g., ["string", "number"])

**Outputs**

- `boolean` - True if input has `type: "non-signal"` and (if types provided) the value matches one of the types

**Observable behavior**

- Returns true only for non-signal objects
- If types provided, also checks if `typeof input.value` matches one of the types
- If types not provided or empty, only checks for non-signal type

**Edge cases**

- Empty types array is treated as no type restriction
- Returns false for `null` and `undefined`

**Failure cases**

- None

---

### valueIsSignalifiedObject(input: any): boolean

**What it does**
Checks if a value is a signal or non-signal object.

**Inputs**

- `input: any` - Any value to check

**Outputs**

- `boolean` - True if input is a signal or non-signal object

**Observable behavior**

- Returns true for source signals, derived signals, and non-signal objects
- Returns false for plain values

**Edge cases**

- Returns false for `null` and `undefined`

**Failure cases**

- None

---

### valueIsNonSignalString(input: any): boolean

**What it does**
Checks if a value is a non-signal of type string.

**Inputs**

- `input: any` - Any value to check

**Outputs**

- `boolean` - True if input is a non-signal with a string value

**Observable behavior**

- Returns true only for non-signal objects where `typeof value === "string"`

**Edge cases**

- Returns false for plain strings (not wrapped in non-signal)

**Failure cases**

- None

---

### valueIsNonSignalStringArray(input: any): boolean

**What it does**
Checks if a value is a non-signal of type string array.

**Inputs**

- `input: any` - Any value to check

**Outputs**

- `boolean` - True if input is a non-signal with a string array value

**Observable behavior**

- Returns true only for non-signal objects where value is an array of strings
- Checks that all array elements are strings

**Edge cases**

- Returns false for empty arrays
- Returns false for arrays with non-string elements

**Failure cases**

- None

---

### valueIsMaybeSignalValueOfStringOrArray(input: any): boolean

**What it does**
Checks if a value (after unwrapping) is a string or array.

**Inputs**

- `input: any` - Any value to check

**Outputs**

- `boolean` - True if the unwrapped value is a string or array

**Observable behavior**

- Unwraps signals and non-signals to get the plain value
- Returns true if the plain value is a string or array
- Returns false for other types

**Edge cases**

- Returns false for `null` and `undefined`
- Returns false for empty arrays (still returns true - arrays are arrays)

**Failure cases**

- None

---

## Value Getter

### value(input: MaybeSignalValue<T>): T

**What it does**
Extracts the plain value from a signal, non-signal, or plain value.

**Inputs**

- `input: MaybeSignalValue<T>` - A signal, non-signal, or plain value

**Outputs**

- `T` - The plain value

**Observable behavior**

- If input is a signal or non-signal, returns `input.value`
- If input is a plain value, returns it as-is
- Does not trigger dependency tracking (use `.value` directly for that)

**Edge cases**

- Works with `null` and `undefined`
- Works with nested structures

**Failure cases**

- None

---

## API Layer - Compute

### compute(computerFn: F, ...restArgs: MaybeSignalValues<Parameters<F>>): DerivedSignal<ReturnType<F>>

**What it does**
Creates a derived signal from a function with signalified arguments.

**Inputs**

- `computerFn: F` - A function that takes plain values and returns a value
- `...restArgs: MaybeSignalValues<Parameters<F>>` - Signalified arguments (signals or plain values)

**Outputs**

- `DerivedSignal<ReturnType<F>>` - A derived signal of the function's return type

**Observable behavior**

- The derived signal's value is the result of calling `computerFn` with unwrapped arguments
- Recomputes whenever any of the signalified arguments changes
- Arguments are unwrapped using the `value()` function

**Edge cases**

- Works with functions of any arity
- Can mix signals and plain values in arguments
- Plain value arguments don't trigger recomputation

**Failure cases**

- If the function throws an error, the error propagates

---

## API Layer - Connectors

### receive(receiver: SourceSignal<T>, ...transmittors: Signal<T>[]): SignalsEffect[]

**What it does**
Connects multiple transmitter signals to a receiver signal. The receiver gets the last updated transmitter's value.

**Inputs**

- `receiver: SourceSignal<T>` - A source signal that will receive updates
- `...transmittors: Signal<T>[]` - Multiple signals (source or derived) of the same type

**Outputs**

- `SignalsEffect[]` - Array of effects for disposing the connections

**Observable behavior**

- When any transmitter's value changes, the receiver's value is updated to match
- If multiple transmitters change simultaneously, the receiver gets the last one's value
- The receiver can still be updated independently
- Each transmitter has its own effect that updates the receiver

**Edge cases**

- Empty transmitters array returns empty effects array
- Transmitters can be source or derived signals
- Receiver must be a source signal (mutable)

**Failure cases**

- None - TypeScript enforces type compatibility

---

### transmit(transmittor: Signal<T>, ...receivers: SourceSignal<T>[]): SignalsEffect

**What it does**
Broadcasts changes from one transmitter signal to multiple receiver signals.

**Inputs**

- `transmittor: Signal<T>` - A signal (source or derived) that broadcasts changes
- `...receivers: SourceSignal<T>[]` - Multiple source signals that will receive updates

**Outputs**

- `SignalsEffect` - A single effect for disposing the connection

**Observable behavior**

- When the transmitter's value changes, all receivers are updated to match
- All receivers are updated synchronously
- Each receiver can still be updated independently
- A single effect manages all receiver updates

**Edge cases**

- Empty receivers array creates an effect that does nothing
- Transmitter can be source or derived signal
- Receivers must be source signals (mutable)

**Failure cases**

- None - TypeScript enforces type compatibility

---

## API Layer - Promise States

### promstates<R, Args extends Array<any>, I>(promiseFn: (...args: Args) => Promise<R>, initialValue?: I, ultimately?: () => void): readonly [(...args: Args) => Promise<void>, DerivedSignal<unknown extends I ? R | undefined : R | I>, DerivedSignal<Error | undefined>, DerivedSignal<boolean>]

**What it does**
Creates promise state signals for async operations.

**Inputs**

- `promiseFn: (...args: Args) => Promise<R>` - A promise-returning function
- `initialValue?: I` - Optional initial value for the result signal
- `ultimately?: () => void` - Optional callback to run in the promise's finally block

**Outputs**

- A tuple of:
  1. `runPromise: (...args: Args) => Promise<void>` - Function to run the promise
  2. `result: DerivedSignal<R | I | undefined>` - Signal for the promise result
  3. `error: DerivedSignal<Error | undefined>` - Signal for the promise error
  4. `isRunning: DerivedSignal<boolean>` - Signal for whether the promise is running

**Observable behavior**

- Calling `runPromise(...args)` executes the promise function
- `isRunning` becomes `true` when the promise starts, `false` when it completes
- On success: `result` is updated, `error` is set to `undefined`
- On failure: `error` is updated, `result` preserves the previous successful result
- The `ultimately` callback runs in the finally block
- States are derived signals that update automatically

**Edge cases**

- If no initial value provided, result signal starts as `undefined`
- If the promise fails multiple times, the last successful result is preserved
- The promise can be run multiple times

**Failure cases**

- If the promise function throws synchronously, the error propagates
- If the ultimately callback throws, the error propagates

---

## API Layer - Template

### tmpl(strings: TemplateStringsArray, ...tlExpressions: StringSignalDeriverTemplateExpressions): DerivedSignal<string>

**What it does**
Tagged template function for string interpolation with signals.

**Inputs**

- `strings: TemplateStringsArray` - The static string parts of the template literal
- `...tlExpressions: StringSignalDeriverTemplateExpressions` - The dynamic expressions inside ${}

**Outputs**

- `DerivedSignal<string>` - A derived signal of the interpolated string

**Observable behavior**

- The derived signal's value is the interpolated string
- Recomputes whenever any signal in the expressions changes
- Expressions can be:
  - Signals (accessed via `.value`)
  - Deriver functions (called to get value)
  - Plain values (used as-is)
- Null/undefined values are converted to empty strings

**Edge cases**

- Works with any combination of signals, functions, and plain values
- Null/undefined expressions become empty strings
- All values are converted to strings via `.toString()`

**Failure cases**

- If `.toString()` throws on a value, the error propagates

---

## API Layer - Traps

### trap(input: MaybeSignalValue<T>): SignalTrap<T>

**What it does**
Creates a type-specific trap object with convenient derived signal methods.

**Inputs**

- `input: MaybeSignalValue<T>` - A signal or plain value

**Outputs**

- `SignalTrap<T>` - An object with type-specific methods that return derived signals

**Observable behavior**

- The trap type is determined by the runtime type of the unwrapped value
- For numbers: returns NumberSignalTrap with numeric operations
- For strings: returns StringSignalTrap with string operations
- For arrays: returns ArraySignalTrap with array operations
- For plain objects: returns RecordSignalTrap with object operations
- For other types: returns GenericTrap with basic operations
- All methods return derived signals that update when the input changes

**Edge cases**

- The trap type is determined by the initial value's type
- If the input is a signal, the trap type is based on its current value
- Type changes in the signal are not reflected in the trap type

**Failure cases**

- For object trap: throws if the value is not a plain object

---

### GenericTrap Methods

#### get string(): DerivedSignal<string>

**What it does**
Converts the value to a string signal.

**Observable behavior**

- Returns derived signal of `value.toString()`
- Returns `undefined` if value is `null` or `undefined`

---

#### or<OV>(orValue: MaybeSignalValue<OV>): DerivedSignal<NonNullable<T> | OV>

**What it does**
Returns the value if truthy, otherwise the fallback value.

**Observable behavior**

- Returns derived signal of `value || orValue`
- Recomputes when either value changes

---

### NumberSignalTrap Methods

#### toConfined(start: MaybeSignalValue<number>, end: MaybeSignalValue<number>): DerivedSignal<number>

**What it does**
Confines the number to a range.

**Observable behavior**

- Returns derived signal of value clamped between start and end
- If value < start, returns start
- If value > end, returns end
- Otherwise returns value

---

#### toExponential(fractionDigits?: MaybeSignalValue<number>): DerivedSignal<string>

**What it does**
Converts to exponential notation string.

**Observable behavior**

- Returns derived signal of `value.toExponential(fractionDigits)`

---

#### toLocaleString(locales?: MaybeSignalValue<string | string[] | undefined>, options?: Intl.NumberFormatOptions): DerivedSignal<string>

**What it does**
Converts to locale-specific string.

**Observable behavior**

- Returns derived signal of `value.toLocaleString(locales, options)`

---

#### toFixed(fractionDigits?: MaybeSignalValue<number>): DerivedSignal<string>

**What it does**
Converts to fixed-point notation string.

**Observable behavior**

- Returns derived signal of `value.toFixed(fractionDigits)`

---

#### toPrecision(precision?: MaybeSignalValue<number>): DerivedSignal<string>

**What it does**
Converts to precision notation string.

**Observable behavior**

- Returns derived signal of `value.toPrecision(precision)`

---

### StringSignalTrap Methods

All standard string methods (charAt, concat, includes, etc.) are available as derived signal methods. Additionally:

#### get length(): DerivedSignal<number>

**What it does**
Returns the string length as a derived signal.

---

#### get lowercase(): DerivedSignal<string>

**What it does**
Returns the lowercase version of the string.

---

#### get Sentencecase(): DerivedSignal<string>

**What it does**
Returns the string with first letter capitalized, rest lowercase.

---

#### get TitleCase(): DerivedSignal<string>

**What it does**
Returns the string with each word's first letter capitalized.

---

#### get UPPERCASE(): DerivedSignal<string>

**What it does**
Returns the uppercase version of the string.

---

#### localeCompare(that: MaybeSignalValue<string>, locales?: MaybeSignalValue<string | string[] | undefined>, options?: Intl.CollatorOptions): DerivedSignal<number>

**What it does**
Compares strings according to locale.

---

#### normalize(form: MaybeSignalValue<"NFC" | "NFD" | "NFKC" | "NFKD">): DerivedSignal<string>

**What it does**
Normalizes the string to the specified Unicode form.

---

#### replace(searchValue: MaybeSignalValue<string> | RegExp, replaceValue: MaybeSignalValue<string>): DerivedSignal<string>

**What it does**
Replaces the first match of searchValue with replaceValue.

---

#### replaceAll(searchValue: MaybeSignalValue<string> | RegExp, replaceValue: MaybeSignalValue<string>): DerivedSignal<string>

**What it does**
Replaces all matches of searchValue with replaceValue.

---

#### search(regexp: RegExp): DerivedSignal<number>

**What it does**
Searches for a match and returns the index.

---

#### split(separator: MaybeSignalValue<string> | RegExp, limit?: MaybeSignalValue<number | undefined>): DerivedSignal<string[]>

**What it does**
Splits the string into an array.

---

### ArraySignalTrap Methods

All standard array methods (at, concat, slice, etc.) are available as derived signal methods. Additionally:

#### get length(): DerivedSignal<number>

**What it does**
Returns the array length as a derived signal.

---

#### get lastItem(): DerivedSignal<T | undefined>

**What it does**
Returns the last item of the array as a derived signal.

---

#### get reversed(): DerivedSignal<T[]>

**What it does**
Returns a reversed copy of the array as a derived signal.

---

#### partition(where: (item: T, index: number, array: T[]) => boolean): readonly [DerivedSignal<T[]>, DerivedSignal<T[]>]

**What it does**
Splits the array into two derived signals based on a predicate.

**Observable behavior**

- Returns a tuple of [passing, failing] derived signals
- First signal contains items where predicate returns true
- Second signal contains items where predicate returns false

---

### RecordSignalTrap Methods

#### prop<K extends keyof T>(key: K): DerivedSignal<T[K]>

**What it does**
Returns a derived signal for a specific property.

**Observable behavior**

- Returns derived signal of `value[key]`
- Recomputes when the object or the property changes

---

#### get props(): { [key in keyof T]: DerivedSignal<T[key]> }

**What it does**
Returns an object with all properties as derived signals.

**Observable behavior**

- Returns an object where each property is a derived signal
- Each property signal recomputes when the object changes

---

#### get keys(): DerivedSignal<string[]>

**What it does**
Returns the object's keys as a derived signal.

---

## API Layer - Operations

### op(input: MaybeSignalValue<T> | (() => T)): Operation<T>

**What it does**
Creates an operation object for composing logical and mathematical operations on signals.

**Inputs**

- `input: MaybeSignalValue<T> | (() => T)` - A signal, plain value, or function returning a value

**Outputs**

- `Operation<T>` - An operation object with type-specific methods

**Observable behavior**

- The operation type is determined by the runtime type of the evaluated value
- For numbers: returns NumberOperation with math operations
- For strings/arrays: returns StringAndArrayOperation with length operations
- For other types: returns GenericOperation with logical operations
- All methods return new operation objects (chaining)
- Final result is obtained via getters (truthy, falsy, result, etc.)

**Edge cases**

- If input is a function, it's called to get the value
- The operation type is determined by the initial evaluated value
- Type changes in the signal are not reflected in the operation type

---

### GenericOperation Methods

#### get truthy(): DerivedSignal<boolean>

**What it does**
Returns a derived signal of whether the value is truthy.

---

#### get falsy(): DerivedSignal<boolean>

**What it does**
Returns a derived signal of whether the value is falsy.

---

#### get truthyFalsyPair(): DerivedSignal<readonly [boolean, boolean]>

**What it does**
Returns a derived signal of [isTruthy, isFalsy] pair.

---

#### ternary<Tr, Fl>(valueIfTruthy: MaybeSignalValue<Tr>, valueIfFalsy: MaybeSignalValue<Fl>): DerivedSignal<Tr | Fl>

**What it does**
Returns valueIfTruthy if truthy, otherwise valueIfFalsy.

---

#### or(checkValue: MaybeSignalValue<any>): GenericOperation

**What it does**
Chains an OR operation. Returns new operation for further chaining.

---

#### orNot(checkValue: MaybeSignalValue<any>): GenericOperation

**What it does**
Chains an OR-NOT operation. Returns new operation for further chaining.

---

#### and(checkValue: MaybeSignalValue<any>): GenericOperation

**What it does**
Chains an AND operation. Returns new operation for further chaining.

---

#### andNot(checkValue: MaybeSignalValue<any>): GenericOperation

**What it does**
Chains an AND-NOT operation. Returns new operation for further chaining.

---

#### equals(compareValue: MaybeSignalValue<any>): GenericOperation

**What it does**
Chains an equality comparison. Returns new operation for further chaining.

---

#### notEquals(compareValue: MaybeSignalValue<any>): GenericOperation

**What it does**
Chains an inequality comparison. Returns new operation for further chaining.

---

#### orBothEqual(subjectValue: MaybeSignalValue<any>, compareValue: MaybeSignalValue<any>): GenericOperation

**What it does**
Chains an OR operation with an equality check on two other values.

---

#### orBothUnequal(subjectValue: MaybeSignalValue<any>, compareValue: MaybeSignalValue<any>): GenericOperation

**What it does**
Chains an OR operation with an inequality check on two other values.

---

#### andBothEqual(subjectValue: MaybeSignalValue<any>, compareValue: MaybeSignalValue<any>): GenericOperation

**What it does**
Chains an AND operation with an equality check on two other values.

---

#### andBothUnequal(subjectValue: MaybeSignalValue<any>, compareValue: MaybeSignalValue<any>): GenericOperation

**What it does**
Chains an AND operation with an inequality check on two other values.

---

#### orThisIsLT/ThisIsLTE/ThisIsGT/ThisIsGTE(subjectValue: MaybeSignalValue<number>, compareValue: MaybeSignalValue<number>): GenericOperation

**What it does**
Chains an OR operation with a comparison check on two other values.

---

#### andThisIsLT/ThisIsLTE/ThisIsGT/ThisIsGTE(subjectValue: MaybeSignalValue<number>, compareValue: MaybeSignalValue<number>): GenericOperation

**What it does**
Chains an AND operation with a comparison check on two other values.

---

### NumberOperation Methods

Extends GenericOperation with:

#### get result(): DerivedSignal<number>

**What it does**
Returns the numeric value as a derived signal.

---

#### add(num: MaybeSignalValue<number>): NumberOperation

**What it does**
Chains an addition operation. Returns new operation for further chaining.

---

#### sub(num: MaybeSignalValue<number>): NumberOperation

**What it does**
Chains a subtraction operation. Returns new operation for further chaining.

---

#### mul(num: MaybeSignalValue<number>): NumberOperation

**What it does**
Chains a multiplication operation. Returns new operation for further chaining.

---

#### div(num: MaybeSignalValue<number>): NumberOperation

**What it does**
Chains a division operation. Returns new operation for further chaining.

---

#### mod(num: MaybeSignalValue<number>): NumberOperation

**What it does**
Chains a modulo operation. Returns new operation for further chaining.

---

#### pow(num: MaybeSignalValue<number>): NumberOperation

**What it does**
Chains an exponentiation operation. Returns new operation for further chaining.

---

#### isBetween(lowerValue: MaybeSignalValue<number>, upperValue: MaybeSignalValue<number>, touchingLower?: boolean, touchingUpper?: boolean): GenericOperation

**What it does**
Checks if the value is between lower and upper (inclusive by default).

---

#### isLT/isLTE/isGT/isGTE(compareValue: MaybeSignalValue<number>): GenericOperation

**What it does**
Chains a comparison operation. Returns new operation for further chaining.

---

### StringAndArrayOperation Methods

Extends GenericOperation with:

#### lengthBetween(lowerValue: MaybeSignalValue<number>, upperValue: MaybeSignalValue<number>, touchingLower?: boolean, touchingUpper?: boolean): GenericOperation

**What it does**
Checks if the length is between lower and upper (inclusive by default).

---

#### lengthEquals/lengthNotEquals/lengthLT/lengthLTE/lengthGT/lengthGTE(compareValue: MaybeSignalValue<number>): GenericOperation

**What it does**
Chains a length comparison operation. Returns new operation for further chaining.

---

## Internal Helper

### setCurrentEffect(effect: SignalsEffect | null): void

**What it does**
Sets the global current effect for dependency tracking.

**Inputs**

- `effect: SignalsEffect | null` - The effect to set as current, or null to clear

**Outputs**

- `void`

**Observable behavior**

- Sets the module-level `_currentSignalEffect` variable
- Used internally by the `effect()` function
- Not intended for external use

**Edge cases**

- Setting to null clears the current effect
- Only one effect can be current at a time

**Failure cases**

- None - this is an internal API
