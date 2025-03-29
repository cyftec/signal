# signal &middot; [![npm version](https://img.shields.io/badge/npm-v0.1.2-red.svg)](https://www.npmjs.com/package/@cyftech/signal) [![WIP Tag](https://img.shields.io/badge/status-WIP-yellow.svg)](https://github.com/cyftec/signal/blob/main/package.json) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/cyftec/signal/blob/main/LICENSE)

Signals are basic data units that can automatically alert functions or computations when the data it holds changes.
This library is a TypeScript implementation of signals.

The implementation consists of basic building blocks like,
<br>
`signal` - the method to create a source signal of data
<br>
`derive` - the method to create a read-only signal from other signal(s).
<br>
`effect` - the method which takes a callback function, to be run whenever the signals (called inside the callback function's definition), changes

## Adding to the project

Currently, only TypeScript and Bun version of the library is completed.
<br>
`bun add @cyftech/signal`

## Usage

```ts
import { signal, effect } from "@cyftech/signal";

const color = signal("green");
const TRAFFIC_LIGHT_CHANGE_CUTOFF_IN_MS = 10000;

setInterval(() => {
  if (color.value === "green") color.value = "yellow";
  if (color.value === "yellow") color.value = "red";
  if (color.value === "red") color.value = "green";
}, TRAFFIC_LIGHT_CHANGE_CUTOFF_IN_MS);

// the callback in effect method gets executed every time the value of 'color' signal changes
effect(() => {
  if (color.value === "green")
    updateUiWithMessage("Keep moving. Don't congest the traffic.");

  if (color.value === "yellow")
    updateUiWithMessage("Slow down! Signal is about to stop.");

  if (color.value === "red")
    updateUiWithMessage("STOP. Please do not cross the crossing.");
});
```
