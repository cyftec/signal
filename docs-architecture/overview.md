# Architecture Notes

## High-Level Architecture

This is a custom signal implementation for reactive state management in TypeScript. The library provides three main primitive types:

1. **Source Signals** - Mutable signals created from plain values
2. **Derived Signals** - Read-only signals computed from other signals
3. **Effects** - Functions that run when dependent signals change

The architecture uses a global variable-based dependency tracking system rather than an explicit graph structure.

## Major Concepts

### Signal Primitives

**SourceSignal<T>**

- Created via `signal(input: T)` function
- Has `type: "source-signal"` property for runtime type discrimination
- Contains a `value` getter/setter
- For arrays: extends with array mutation methods (push, pop, splice, etc.)
- For objects: extends with `set(partial)` method for partial updates
- Internally uses `@cyftec/immut` for immutable value handling

**DerivedSignal<T>**

- Created via `derive(valueGetterFn: (oldValue) => T)` function
- Has `type: "derived-signal"` property
- Read-only - has `value` getter but no setter
- Has `prevValue` getter to access previous computed value
- Has `dispose()` method to stop tracking dependencies
- Internally implemented as a source signal + effect pattern

**NonSignal<T>**

- Runtime type wrapper for plain values
- Has `type: "non-signal"` property
- Used for runtime type discrimination in MaybeSignalValue types
- Created via `getNonSignalObject(input: T)`

### Effects

**SignalsEffect**

- Created via `effect(fn: () => void)` function
- Has `canDisposeNow: boolean` flag
- Has `dispose()` method to mark for cleanup
- Registered to signals when their `.value` is accessed during effect execution
- Only re-runs if it actually accessed signal values during previous execution

### Dependency Tracking Strategy

**Global Variable-Based Tracking**

- Uses module-level `_currentSignalEffect: SignalsEffect | null` variable
- When `effect()` is called, it sets `_currentSignalEffect` before executing the function
- When a signal's `.value` getter is called, it checks if `_currentSignalEffect` exists
- If it exists, the effect is added to the signal's internal `_effects` Set
- After effect execution, `_currentSignalEffect` is set back to `null`

**No Explicit Graph Structure**

- No dependency graph data structure
- Each signal maintains a Set of registered effects
- Dependencies are tracked implicitly through the global variable during execution
- This means effects must access `.value` during execution to establish dependencies

### Scheduling Strategy

**Synchronous Execution**

- No batching or deferred execution
- When a signal's value is set, all registered effects run immediately
- Effects run in the order they were registered
- No scheduling queue or microtask timing

**Effect Execution Flow**

1. Signal value is set via setter
2. Signal checks if new value equals old value (short-circuits if equal)
3. Signal updates internal value using `immut()`
4. Signal iterates through its `_effects` Set
5. For each effect: if `canDisposeNow` is true, remove it; otherwise, execute it
6. Effects may access other signals' `.value`, triggering their effects recursively

### Batching

**No Batching Mechanism**

- All updates are synchronous and immediate
- No automatic batching of multiple signal updates
- No manual batch API provided
- Each signal update triggers all dependent effects immediately

### Cleanup/Disposal

**Effect Disposal**

- Call `effect.dispose()` to set `canDisposeNow = true`
- Disposed effects are removed from signal's `_effects` Set on next signal update
- Disposed effects never run again

**Derived Signal Disposal**

- Call `derivedSignal.dispose()` to dispose its internal effect
- This stops the derived signal from tracking its dependencies
- The derived signal's value remains accessible but won't update

**Bulk Disposal**

- `dispose(...derivedSignalsOrEffects)` utility function
- Accepts multiple derived signals and/or effects
- Calls `.dispose()` on each argument

### Internal Graph Structures

**Signal Internal State**

- `_value`: The current value (stored immutably via `@cyftec/immut`)
- `_effects`: A Set of registered SignalsEffect functions

**Derived Signal Internal State**

- `oldValue`: Previous computed value
- `derivedSource`: Internal source signal holding the computed value
- `derivedSourceUpdator`: Internal effect that recomputes the value

**Effect Internal State**

- `canDisposeNow`: Boolean flag for disposal status
- `dispose()`: Method to mark for disposal

## Data Flow

1. **Signal Creation**
   - `signal(input)` creates a source signal with immutable initial value
   - Array/object signals get extended with mutation methods

2. **Effect Registration**
   - `effect(fn)` sets `_currentSignalEffect`, executes fn, then clears it
   - When fn accesses `signal.value`, the signal adds the effect to its `_effects` Set

3. **Value Update**
   - Setting `signal.value = newValue` triggers immediate effect execution
   - Signal updates its internal value immutably
   - Signal runs all registered effects (removing disposed ones)

4. **Derived Signal Computation**
   - `derive(fn)` creates internal source signal + effect
   - The effect runs `fn(oldValue)` and updates the internal source signal
   - When dependencies change, the effect re-runs, updating the derived value

## Areas That Differ from Common Signal Libraries

1. **Global Variable Dependency Tracking**
   - Most libraries use explicit dependency graphs or stacks
   - This implementation uses a single module-level variable
   - Simpler but less flexible for nested scenarios

2. **No Batching**
   - SolidJS, Preact Signals, Angular Signals all have batching
   - This implementation has no batching mechanism
   - Every update triggers immediate synchronous propagation

3. **Derived Signal Implementation**
   - Most libraries have dedicated derived signal nodes
   - This implementation wraps a source signal + effect
   - More indirect but achieves same result

4. **Array Mutation Methods**
   - Most signal libraries treat arrays as immutable
   - This implementation provides mutating methods (push, pop, etc.)
   - Methods create new immutable arrays internally but feel mutable

5. **Custom Array Methods**
   - Includes `remove()` method (inverse of filter)
   - Not standard in JavaScript or other signal libraries

6. **No Scheduling**
   - No microtask scheduling or deferred execution
   - All propagation is synchronous
   - Different from most frameworks that use scheduling for performance

7. **Type Discrimination**
   - Uses `type` property on all signal objects
   - Enables runtime type checking for MaybeSignalValue types
   - Not common in other signal libraries

8. **NonSignal Objects**
   - Explicit runtime type wrapper for plain values
   - Used for type discrimination in complex type scenarios
   - Uncommon pattern in other libraries

## Unusual Implementation Details

1. **Effect Registration Condition**
   - Effects only register to signals if `.value` is accessed during execution
   - If an effect has conditional logic that skips `.value` access, it won't track that dependency
   - This is intentional but different from automatic dependency collection

2. **Disposal Cleanup Timing**
   - Disposed effects are not removed immediately
   - They are removed on the next signal update
   - Lazy cleanup strategy

3. **Array Signal Implementation**
   - Array mutation methods create new arrays internally
   - But the API feels like standard array mutation
   - Uses `mutator` pattern to wrap array methods

4. **Derived Signal Previous Value**
   - Derived signals expose `prevValue` getter
   - This is uncommon in other signal libraries
   - Useful for diffing or change detection

5. **Object Signal Partial Updates**
   - Object signals have `set(partial)` method
   - Performs shallow merge with existing value
   - Different from full replacement

6. **No Automatic Disposal**
   - No automatic disposal based on scope or lifecycle
   - Manual disposal required
   - Different from frameworks with component lifecycle

## API Layer Structure

The library has two main layers:

**Core Layer** (`src/_core/`)

- Primitive implementations: signal, derive, effect, dispose
- Type definitions and utilities
- Type checkers and value getters

**API Layer** (`src/api/`)

- Higher-level convenience APIs
- Operations: composable operations on signals
- Traps: type-specific utility methods
- Connectors: signal-to-signal connections
- Templates: string interpolation with signals
- Promise states: async state management
- Compute: function-based derived signals

## Dependencies

- `@cyftec/immut` - Used for immutable value handling
  - `immut()` - Creates immutable copy of value
  - `newVal()` - Extracts value from immutable wrapper
  - `isPlainObject()` - Type checking for plain objects
