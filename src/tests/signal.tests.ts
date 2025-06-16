import { effect, signal, type SourceSignal } from "../index.js";

let sigValue = "nothing";
const strSignal: SourceSignal<string> = signal(sigValue);
let signalChangeCounter = 0;

effect(() => {
  console.log(
    `Test${++signalChangeCounter}: ${
      strSignal.value === sigValue ? "Pass" : "Failed"
    }`
  );
});

sigValue = "something";
strSignal.value = sigValue;
sigValue = "something else";
strSignal.value = sigValue;
