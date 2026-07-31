# signal &middot; [![npm version](https://img.shields.io/badge/npm-v0.1.2-red.svg)](https://www.npmjs.com/package/@cyftech/signal) [![WIP Tag](https://img.shields.io/badge/status-WIP-yellow.svg)](https://github.com/cyftec/signal/blob/main/package.json) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/cyftec/signal/blob/main/LICENSE)

Signals are basic data units that can automatically alert functions or computations when the data it holds changes.
This library is a TypeScript implementation of signals.

The implementation consists of basic building blocks like,
<br>
`mutable` - the method to create a mutable signal of data
<br>
`derive` - the method to create a read-only signal from other signal(s).
<br>
`antenna` - the method which takes a callback function, to be run whenever the signals (called inside the callback function's definition), changes

## Adding to the project

Currently, only TypeScript and Bun version of the library is completed.
<br>
`bun add @cyftech/signal`

## Development Setup

After cloning the repository, set up the git hooks:

```bash
bun run setup:hooks
```

This configures git to use the pre-commit hook in `.githooks/` which runs tests before allowing commits.

## Usage

```ts
import { mutable, antenna } from "@cyftech/signal";

const color = mutable("green");
const TRAFFIC_LIGHT_CHANGE_CUTOFF_IN_MS = 10000;

setInterval(() => {
  if (color.value === "green") color.value = "yellow";
  if (color.value === "yellow") color.value = "red";
  if (color.value === "red") color.value = "green";
}, TRAFFIC_LIGHT_CHANGE_CUTOFF_IN_MS);

// the callback in antenna method gets executed every time the value of 'color' signal changes
antenna(() => {
  if (color.value === "green")
    updateUiWithMessage("Keep moving. Don't congest the traffic.");

  if (color.value === "yellow")
    updateUiWithMessage("Slow down! Signal is about to stop.");

  if (color.value === "red")
    updateUiWithMessage("STOP. Please do not cross the crossing.");
});
```
