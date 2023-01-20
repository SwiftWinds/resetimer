import { invoke } from "@tauri-apps/api/tauri";
import { derived, readable, writable } from "svelte/store";

import { runCommand } from "$lib/utils/run-command";
import pMemoize from "p-memoize";
import ExpiryMap from "expiry-map";

export const runningApps = readable<string[]>(["Loading..."], (set) => {
  const interval = setInterval(async () => {
    const { stdout } = await runCommand("run-osascript", [
      "-e",
      'tell application "System Events" to get name of (processes where background only is false)',
    ]);
    set(stdout.split(", "));
  }, 1000);

  return () => {
    clearInterval(interval);
  };
});

interface ActiveWindow {
  title: string;
  process_name: string;
  window_id: string;
  process_id: string;
}

export const activeApp = readable<ActiveWindow | null>(null, (set) => {
  const interval = setInterval(async () => {
    const activeWindow = (await invoke("get_frontmost_window")) as string;
    set(JSON.parse(activeWindow));
  }, 100);

  return () => {
    clearInterval(interval);
  };
});
export const activeProcessName = derived(
  activeApp,
  ($activeApp) => $activeApp?.process_name ?? ""
);

const getPathFromPid = pMemoize(async (pid: string | undefined) => {
  console.log("getPathFromPid called with pid", pid);
  if (!pid) {
    return null;
  }
  console.log("pid", pid);
  const { stdout } = await runCommand("run-ps", ["-o", "comm=", "-p", pid]);
  console.log("stdout", stdout);
  // truncate stdout after the last instance of ".app"
  const lastIndexOfApp = stdout.lastIndexOf(".app");
  if (lastIndexOfApp === -1) {
    return null;
  }
  return stdout.slice(0, lastIndexOfApp + ".app".length);
});

const getBundleIdFromPath = pMemoize(async (path: string | null) => {
  console.log("getBundleIdFromPath called with path", path);
  if (!path) {
    return null;
  }
  const { stdout } = await runCommand("mdls-get-bundleid", [
    "-name",
    "kMDItemCFBundleIdentifier",
    "-r",
    path,
  ]);
  console.log("bundle id", stdout.trim());

  return stdout.trim();
});

const cache = new ExpiryMap(1000);

const getUrlFromBundleId = pMemoize(
  async (bundleId: string | null) => {
    console.log("getUrlFromBundleId called with bundleId", bundleId);
    if (!bundleId) {
      return null;
    }
    let appleScript;
    if (
      [
        "com.google.Chrome",
        "com.google.Chrome.beta",
        "com.google.Chrome.dev",
        "com.google.Chrome.canary",
        "com.brave.Browser",
        "com.brave.Browser.beta",
        "com.brave.Browser.nightly",
        "com.microsoft.edgemac",
        "com.microsoft.edgemac.Beta",
        "com.microsoft.edgemac.Dev",
        "com.microsoft.edgemac.Canary",
        "com.mighty.app",
        "com.ghostbrowser.gb1",
        "com.bookry.wavebox",
        "com.pushplaylabs.sidekick",
        "com.operasoftware.Opera",
        "com.operasoftware.OperaNext",
        "com.operasoftware.OperaDeveloper",
        "com.vivaldi.Vivaldi",
      ].includes(bundleId)
    ) {
      appleScript = `tell app id "${bundleId}" to get the URL of active tab of front window`;
    } else if (
      ["com.apple.Safari", "com.apple.SafariTechnologyPreview"].includes(
        bundleId
      )
    ) {
      appleScript = `tell app id "${bundleId}" to get URL of front document`;
    } else {
      return null;
    }

    const { stdout } = await runCommand("run-osascript", ["-e", appleScript]);

    return stdout.trim();
  },
  { cache }
);

export const currentUrl = derived(activeApp, ($activeApp, set) => {
  getPathFromPid($activeApp?.process_id)
    .then(getBundleIdFromPath)
    .then(getUrlFromBundleId)
    .then(set);
});

export const selectedApps = writable<string[]>([]);
export const selectedUrls = writable<string[]>([]);
export const isUsingAppWhitelist = writable(false);
export const isUsingUrlWhitelist = writable(false);
