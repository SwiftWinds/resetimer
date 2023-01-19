import { invoke } from "@tauri-apps/api/tauri";
import { readable, writable } from "svelte/store";

import { runCommand } from "$lib/utils/run-command";

export const runningApps = readable<string[]>([], (set) => {
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
export const activeApp = readable<string>("", (set) => {
  const interval = setInterval(async () => {
    const activeWindow = (await invoke("get_frontmost_window")) as string;
    set(JSON.parse(activeWindow).process_name);
  }, 1000);

  return () => {
    clearInterval(interval);
  };
});
export const selectedApps = writable<string[]>([]);
