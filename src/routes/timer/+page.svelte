<script lang="ts">
  import { goto } from "$app/navigation";
  import { activeApp, currentUrl } from "$lib/stores/apps";
  import { breakTimer, workTimer, elapsedSeconds } from "$lib/stores/timer";
  import { formatTime } from "$lib/utils/time";

  function stopTimer() {
    breakTimer.cancel();
    workTimer.cancel();

    goto("/");
  }

  function pauseTimer() {
    breakTimer.pause();
    workTimer.pause();
  }
</script>

<h2 class="reset-title">
  Remaining time until reset: {formatTime($workTimer)}
</h2>
<h2>Remaining break time: {formatTime($breakTimer)}</h2>

<h3>
  You've been focusing for {formatTime($elapsedSeconds)} seconds
</h3>

<div>{JSON.stringify($activeApp)}</div>
<div>{$currentUrl}</div>

<div>
  <button on:click={stopTimer}>Stop</button>
  <button on:click={pauseTimer}>Pause</button>
</div>

<style>
  .reset-title {
    margin-bottom: 2px;
  }
</style>
