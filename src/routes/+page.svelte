<script lang="ts">
  import { runningApps, isUsingAppWhitelist, selectedApps } from "$lib/stores/apps";
  import {
    breakMinutes,
    breakTimer,
    workMinutes,
    workTimer,
  } from "$lib/stores/timer";
  import { goto } from "$app/navigation";
  import UrlList from "$lib/components/UrlList.svelte";

  function startTimer() {
    console.log("Starting timer");
    console.log("Break minutes: " + $breakMinutes);
    console.log("Work minutes: " + $workMinutes);
    console.log("Is whitelist: " + $isUsingAppWhitelist);
    console.log("Selected apps: " + $selectedApps);

    breakTimer.start($breakMinutes * 60);
    workTimer.start($workMinutes * 60);

    console.log("Timer started");

    goto("/timer");
  }
</script>

<h1>Welcome to ReseTimer!</h1>

<div>
  <p># break minutes:</p>

  <input
    type="number"
    id="break-input"
    placeholder="Enter break in minutes..."
    bind:value={$breakMinutes}
  />

  <br />

  <p># work minutes:</p>
  <input
    type="number"
    id="break-input"
    placeholder="Enter work in minutes..."
    bind:value={$workMinutes}
  />
  <br />
  <br />
  <input
    type="checkbox"
    id="app-list-mode"
    name="app-list-mode"
    bind:checked={$isUsingAppWhitelist}
  />
  <label for="app-list-mode">Whitelist apps</label>
  <br />
  <br />
  <label for="apps">Apps to {$isUsingAppWhitelist ? "allow" : "block"}:</label>
  <select bind:value={$selectedApps} name="apps" id="apps" multiple>
    {#each $runningApps as app}
      <option value={app}>{app}</option>
    {/each}
  </select>
  <br />
  <br />
  <UrlList />
  <button on:click={startTimer}>Start</button>
</div>
