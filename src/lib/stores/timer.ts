import { derived, get, writable } from "svelte/store";
import { activeApp, isWhitelist, selectedApps } from "./apps";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/api/notification";
import breakOverAudio from "$lib/assets/break-over.mp3";
import formatSeconds from "$lib/utils/time";
import { persisted } from 'svelte-local-storage-store';

export function createBreakTimer() {
  const { subscribe, set, update } = writable(0);

  let originalSeconds: number;
  let interval: NodeJS.Timer;
  let hasReset = false;

  async function sendBreakOverNotification() {
    let permissionGranted = await isPermissionGranted();
    if (!isPermissionGranted()) {
      const permission = await requestPermission();
      permissionGranted = permission === "granted";
      requestPermission();
    }
    
    if (permissionGranted) {
      sendNotification({
        title: "Break over! 😢",
        body: "Aww... Boohoo! Time to get back to work! 😭",
        icon: "https://cdn-icons-png.flaticon.com/512/60/60802.png",
      });
      new Audio(breakOverAudio).play();
    }
  }

  function start(breakSeconds: number) {
    if (!hasReset) {
      originalSeconds = breakSeconds;
      hasReset = true;
    } 
    set(breakSeconds + get(breakTimer));
    interval = setInterval(() => {
      if (get(isWorking)) {
        return;
      }
      update((n) => {
        console.log("break timer", n);
        if (n <= 0) {
          sendBreakOverNotification();
          return n;
        }
        return n - 1;
      });
    }, 1000);
  }

  function stop() {
    clearInterval(interval);
  }

  function cancel() {
    stop();
    set(0);
    hasReset = false;
  }

  return {
    subscribe,
    start,
    cancel,
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

  async function sendResetNotification() {
    let permissionGranted = await isPermissionGranted();
    if (!isPermissionGranted()) {
      const permission = await requestPermission();
      permissionGranted = permission === "granted";
      requestPermission();
    }
    
    if (permissionGranted) {
      sendNotification({
        title: `Break tank refilled! 😌`,
        body: `You now have up to ${formatSeconds(get(breakTimer))} minutes of break time! 🤩`,
      });
    }
  }

  function start(workSeconds: number) {
    originalSeconds = workSeconds;
    set(workSeconds);
    interval = setInterval(() => {
      update((n) => {
        console.log("work timer", n);
        if (n <= 0) {
          breakTimer.reset();
          workTimer.reset();
          sendResetNotification();
          return originalSeconds;
        }
        return n - 1;
      });
    }, 1000);
  }

  function stop() {
    clearInterval(interval);
  }

  function cancel() {
    stop();
    set(0);
  }

  return {
    subscribe,
    start,
    cancel,
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

export const breakMinutes = persisted('breakMinutes', 5);
export const workMinutes = persisted('workMinutes', 30);
