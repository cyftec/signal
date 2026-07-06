export const SHOWCASE_CODE = `import { signal, effect } from "@cyftech/signal";

type LightState = "red" | "amber" | "green";

const light = signal<LightState>("red");
const order: LightState[] = ["red", "amber", "green"];

effect(() => {
  trafficLight.dataset.state = light.value;
});

setInterval(() => {
  const current = order.indexOf(light.value);
  light.value = order[(current + 1) % order.length];
}, 1200);`;
