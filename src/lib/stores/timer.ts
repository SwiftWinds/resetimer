import { derived, writable } from "svelte/store";
import { activeApp, selectedApps } from "./apps";

export const remainingBreakSeconds = writable(0);
export const remainingWorkSeconds = writable(0);
export const isWhitelist = writable(false);
export const isWorking = derived(
  [activeApp, isWhitelist, selectedApps],
  ([$activeApp, $isWhitelist, $selectedApps]) => {
    const isUsingSelectedApp = $selectedApps.includes($activeApp);
    return $isWhitelist ? isUsingSelectedApp : !isUsingSelectedApp;
  }
);
