# signal &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/cyftec/signal/blob/main/LICENSE) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/cyftec/signal/blob/main/LICENSE)


## Adding to the project
```bun add @cyftech/signal```

## Usage
```
import { signal, effect } from "@cyftech/signal";

const color = signal("green");
const TRAFFIC_LIGHT_CHANGE_CUTOFF_IN_MS = 10000;

setInterval(() => {
  if(color.value === "green") color.value = "yellow";
  if(color.value === "yellow") color.value = "red";
  if(color.value === "red") color.value = "green";
}, TRAFFIC_LIGHT_CHANGE_CUTOFF_IN_MS);

effect(() => {
  if(color.value === "green")
    updateUiWithMessage("Keep moving. Don't congest the traffic.")
    
  if(color.value === "yellow")
    updateUiWithMessage("Slow down! The stop signal is coming.")
    
  if(color.value === "red")
    updateUiWithMessage("STOP. Please do not cross the crossing.")
})
```
