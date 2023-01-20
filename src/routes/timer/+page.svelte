<script lang="ts">
  import { goto } from "$app/navigation";
  import { breakTimer, workTimer, isWorking } from "$lib/stores/timer";
  import formatSeconds from "$lib/utils/time";

  $: remainingWorkSecondsFormatted = formatSeconds($workTimer);

  $: remainingBreakSecondsFormatted = formatSeconds($breakTimer);

  function stopTimer() {
    console.log("Stopping timer");
    breakTimer.cancel();
    workTimer.cancel();

    goto("/");
  }
</script>

{#if $isWorking}
  <div>Remaining time until reset: {remainingWorkSecondsFormatted}</div>
{:else}
  <div>Remaining break time: {remainingBreakSecondsFormatted}</div>
{/if}

<div>
  <button on:click={stopTimer}>Stop</button>
</div>
