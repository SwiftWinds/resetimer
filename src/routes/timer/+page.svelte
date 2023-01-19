<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    breakTimer,
    workTimer,
    isWorking,
  } from "$lib/stores/timer";

  function padLeft(num: number, pad: string, length: number) {
    return (new Array(length + 1).join(pad) + num).slice(-length);
  }

  $: remainingWorkSecondsFormatted = `${padLeft(
    Math.floor($workTimer / 60),
    "0",
    2
  )}:${padLeft($workTimer % 60, "0", 2)}`;

  $: remainingBreakSecondsFormatted = `${padLeft(
    Math.floor($breakTimer / 60),
    "0",
    2
  )}:${padLeft($breakTimer % 60, "0", 2)}`;

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
