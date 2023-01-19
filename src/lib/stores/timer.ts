import { derived, get, writable } from "svelte/store";
import { activeApp, isWhitelist, selectedApps } from "./apps";

export function createBreakTimer() {
  const { subscribe, set, update } = writable(0);

  let originalSeconds: number;
  let interval: NodeJS.Timer;

  function start(breakSeconds: number) {
    set(breakSeconds);
    interval = setInterval(() => {
      if (get(isWorking)) {
        return;
      }
      update((n) => {
        console.log("break timer", n);
        return n <= 0 ? n : n - 1;
      });
    }, 1000);
  }

  function stop() {
    clearInterval(interval);
  }

  return {
    subscribe,
    start,
    stop,
    reset: () => {
      stop();
      start(originalSeconds);
    },
  };
}
export const breakTimer = createBreakTimer();

export function createWorkTimer() {
  const { subscribe, set, update } = writable(0);

  let originalSeconds: number;
  let interval: NodeJS.Timer;

  function start(workSeconds: number) {
    originalSeconds = workSeconds;
    set(workSeconds);
    interval = setInterval(() => {
      update((n) => {
        console.log("work timer", n);
        if (n <= 0) {
          breakTimer.reset();
          workTimer.reset();
          return originalSeconds;
        }
        return n - 1;
      });
    }, 1000);
  }

  function stop() {
    clearInterval(interval);
  }

  return {
    subscribe,
    start,
    stop,
    reset: () => {
      stop();
      start(originalSeconds);
    },
  };
}
export const workTimer = createWorkTimer();

export const isWorking = derived(
  [activeApp, isWhitelist, selectedApps],
  ([$activeApp, $isWhitelist, $selectedApps]) => {
    const isUsingSelectedApp = $selectedApps.includes($activeApp);
    return $isWhitelist ? isUsingSelectedApp : !isUsingSelectedApp;
  }
);
