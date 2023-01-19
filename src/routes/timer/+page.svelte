<script lang="ts">
  import {
    isWorking,
    remainingBreakSeconds,
    remainingWorkSeconds,
  } from "$lib/stores/timer";

  function padLeft(num: number, pad: string, length: number) {
    return (new Array(length + 1).join(pad) + num).slice(-length);
  }

  $: remainingWorkSecondsFormatted = `${padLeft(
    Math.floor($remainingWorkSeconds / 60),
    "0",
    2
  )}:${padLeft($remainingWorkSeconds % 60, "0", 2)}`;

  $: remainingBreakSecondsFormatted = `${padLeft(
    Math.floor($remainingBreakSeconds / 60),
    "0",
    2
  )}:${padLeft($remainingBreakSeconds % 60, "0", 2)}`;
</script>

{#if $isWorking}
  <div>Remaining time until reset: {remainingWorkSecondsFormatted}</div>
{:else}
  <div>Remaining break time: {remainingBreakSecondsFormatted}</div>
{/if}

<a href="/">Stop</a>
