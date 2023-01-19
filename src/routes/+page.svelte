<script lang="ts">
  import { runningApps, isWhitelist, selectedApps } from "$lib/stores/apps";
  import { breakTimer, workTimer } from "$lib/stores/timer";
  import { goto } from '$app/navigation';

  let breakMinutes = 5;
  let workMinutes = 30;

  function startTimer() {
    console.log("Starting timer");
    console.log("Break minutes: " + breakMinutes);
    console.log("Work minutes: " + workMinutes);
    console.log("Is whitelist: " + $isWhitelist);
    console.log("Selected apps: " + $selectedApps);

    breakTimer.start(breakMinutes * 60);
    workTimer.start(workMinutes * 60);

    console.log("Timer started");

    goto('/timer');
  }
</script>

<h1>Welcome to ReseTimer!</h1>

<div>
  <p>Break amount:</p>

  <input
    type="number"
    id="break-input"
    placeholder="Enter break in minutes..."
    bind:value={breakMinutes}
  />

  <br />

  <p>Work amount:</p>
  <input
    type="number"
    id="break-input"
    placeholder="Enter work in minutes..."
    bind:value={workMinutes}
  />
  <br />
  <br />
  <input
    type="checkbox"
    id="list-mode"
    name="list-mode"
    bind:checked={$isWhitelist}
  />
  <label for="list-mode">Whitelist</label>
  <br />
  <br />
  <label for="apps">Applications to {$isWhitelist ? 'allow' : 'block'}:</label>
  <select bind:value={$selectedApps} name="apps" id="apps" multiple>
    {#each $runningApps as app}
      <option value={app}>{app}</option>
    {/each}
  </select>
  <br />
  <br />
  <button on:click={startTimer}>Start</button>
</div>
