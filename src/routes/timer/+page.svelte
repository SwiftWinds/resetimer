<script lang="ts">
  import { goto } from "$app/navigation";
  import { activeApp, currentUrl } from "$lib/stores/apps";
  import { breakTimer, workTimer, isWorking } from "$lib/stores/timer";
  import formatSeconds from "$lib/utils/time";

  function stopTimer() {
    breakTimer.cancel();
    workTimer.cancel();

    goto("/");
  }
</script>

{#if $isWorking || $breakTimer <= 0}
  <div>Remaining time until reset: {formatSeconds($workTimer)}</div>
{:else}
  <div>Remaining break time: {formatSeconds($breakTimer)}</div>
{/if}

<div>{JSON.stringify($activeApp)}</div>
<div>{$currentUrl}</div>

<div>
  <button on:click={stopTimer}>Stop</button>
</div>
