import { derived, get, writable } from "svelte/store";
import {
  activeProcessName,
  currentUrl,
  isUsingAppWhitelist,
  isUsingUrlWhitelist,
  selectedApps,
  selectedUrls,
} from "./apps";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/api/notification";
import breakOverMp3 from "$lib/assets/break-over.mp3";
import { formatTime } from "$lib/utils/time";
import { persisted } from "svelte-local-storage-store";
import { cleanUrl } from "$lib/utils/url";

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
      new Audio(breakOverMp3).play();
    }
  }

  function start(breakSeconds: number) {
    if (!hasReset) {
      originalSeconds = breakSeconds;
      hasReset = true;
      resets.set(0);
    } else {
      resets.update((n) => n + 1);
    }
    set(breakSeconds + get(breakTimer));
    let lastBreakNotification: number;
    let lastTick = Date.now();
    interval = setInterval(() => {
      if (get(isWorking)) {
        lastTick = Date.now();
        return;
      }
      update((n) => {
        if (n <= 0) {
          if (
            !lastBreakNotification ||
            Date.now() - lastBreakNotification > 1000
          ) {
            lastBreakNotification = Date.now();
            sendBreakOverNotification();
          }
          return 0;
        }
        const tick = Date.now();
        const dt = (tick - lastTick) / 1000;
        lastTick = tick;
        return n - dt;
      });
    }, 10);
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
  let hasReset = false;

  async function sendResetNotification() {
    let permissionGranted = await isPermissionGranted();
    if (!isPermissionGranted()) {
      const permission = await requestPermission();
      permissionGranted = permission === "granted";
      requestPermission();
    }

    if (permissionGranted) {
      sendNotification({
        title: `You've focused for ${formatTime(get(elapsedSeconds))}! 🎉`,
        body: `You now have up to ${formatTime(
          get(breakTimer)
        )} of break time! 🤩`,
      });
    }
  }

  function start(workSeconds: number) {
    if (!hasReset) {
      originalSeconds = workSeconds;
      const now = new Date();
      const currentHour = new Date();
      currentHour.setMinutes(0, 0, 0); // also resets seconds and milliseconds
      let currentStep = new Date(currentHour.getTime());
      let nextStep = new Date(currentHour.getTime() + workSeconds * 1000);
      while (nextStep <= now) {
        currentStep = nextStep;
        nextStep = new Date(currentStep.getTime() + workSeconds * 1000);
      }
      const start = [nextStep, currentStep].sort(function (a, b) {
        // @ts-ignore
        var distanceA = Math.abs(now - a);
        // @ts-ignore
        var distanceB = Math.abs(now - b);
        return distanceA - distanceB; // sort a before b when the distance is smaller
      })[0];
      const end = new Date(start.getTime() + workSeconds * 1000);
      workSeconds = (end.getTime() - now.getTime()) / 1000;
    }
    totalTime.set(workSeconds);
    set(workSeconds);
    let lastTick = Date.now();
    interval = setInterval(() => {
      update((n) => {
        if (n <= 0) {
          breakTimer.reset();
          workTimer.reset();
          sendResetNotification();
          return originalSeconds;
        }
        const tick = Date.now();
        const dt = (tick - lastTick) / 1000;
        lastTick = tick;
        return n - dt;
      });
    }, 10);
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

export const totalTime = writable(0);

export const isWorking = derived(
  [
    activeProcessName,
    currentUrl,
    isUsingAppWhitelist,
    selectedApps,
    isUsingUrlWhitelist,
    selectedUrls,
  ],
  ([
    $activeProcessName,
    $currentUrl,
    $isUsingAppWhitelist,
    $selectedApps,
    $isUsingUrlWhitelist,
    $selectedUrls,
  ]) => {
    const isUsingSelectedApp = $selectedApps.includes($activeProcessName);
    const isUsingSelectedUrl = $selectedUrls.some((url) => {
      return (
        (typeof $currentUrl === "string" || $currentUrl instanceof String) &&
        cleanUrl($currentUrl as string).startsWith(cleanUrl(url))
      );
    });

    if ($isUsingAppWhitelist && $isUsingUrlWhitelist) {
      return isUsingSelectedApp && isUsingSelectedUrl;
    }

    if ($isUsingAppWhitelist && !$isUsingUrlWhitelist) {
      return isUsingSelectedApp && !isUsingSelectedUrl;
    }

    if (!$isUsingAppWhitelist && $isUsingUrlWhitelist) {
      return !isUsingSelectedApp && isUsingSelectedUrl;
    }

    if (!$isUsingAppWhitelist && !$isUsingUrlWhitelist) {
      return !isUsingSelectedApp && !isUsingSelectedUrl;
    }
  }
);

export const resets = writable(0);

export const breakMinutes = persisted("breakMinutes", 5);
export const workMinutes = persisted("workMinutes", 30);

export const elapsedSeconds = derived(
  [resets, workMinutes, totalTime, workTimer],
  ([$resets, $workMinutes, $totalTime, $workTimer]) => {
    return $resets * $workMinutes * 60 + ($totalTime - $workTimer);
  }
);
