<script lang="ts">
  import { runningApps } from "$lib/stores/apps";

  let breakMinutes = 5;
  let workMinutes = 30;
  let selectedApps: string[] = [];
  let isWhitelist = false;

  $: console.log(selectedApps);
  $: console.log(breakMinutes);
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
    bind:checked={isWhitelist}
  />
  <label for="list-mode">Whitelist</label>
  <br />
  <br />
  <label for="apps">Applications to block:</label>
  <select bind:value={selectedApps} name="apps" id="apps" multiple>
    {#each $runningApps as app}
      <option value={app}>{app}</option>
    {/each}
  </select>
  <br />
  <br />
  <a href="/timer">Start</a>
</div>
