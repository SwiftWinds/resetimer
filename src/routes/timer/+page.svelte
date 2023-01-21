<script lang="ts">
  import { goto } from "$app/navigation";
  import { activeApp, currentUrl } from "$lib/stores/apps";
  import { breakTimer, workTimer, isWorking } from "$lib/stores/timer";
  import { formatTime } from "$lib/utils/time";

  function stopTimer() {
    breakTimer.cancel();
    workTimer.cancel();

    goto("/");
  }
</script>

<div>Remaining time until reset: {formatTime($workTimer)}</div>
<div>Remaining break time: {formatTime($breakTimer)}</div>

<div>{JSON.stringify($activeApp)}</div>
<div>{$currentUrl}</div>

<div>
  <button on:click={stopTimer}>Stop</button>
</div>
