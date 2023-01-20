<script lang="ts">
  import trashCanSvg from "$lib/assets/trash-can.svg";
  import { isWhitelist } from "$lib/stores/apps";

  export let urls: string[] = [];
  let input: string;

  function addUrl() {
    console.log("addUrl", input);
    if (input) {
      urls = [...urls, input];
      input = "";
    }
  }

  function deleteUrl(event: MouseEvent) {
    const target = event.target as HTMLImageElement;
    const item = target.parentElement as HTMLDivElement;
    const itemText = item.querySelector(".item-text") as HTMLSpanElement;
    const url = itemText.textContent;

    urls = urls.filter((u) => u !== url);
  }
</script>

<div>Websites to {$isWhitelist ? "allow" : "block"}:</div>

<div id="list">
  {#each urls as url}
    <div class="item">
      <span class="item-text">{url}</span>
      <img
        on:click={deleteUrl}
        src={trashCanSvg}
        alt="delete url"
        class="trash-can"
      />
    </div>
  {/each}
</div>

<form id="input-container" on:submit|preventDefault={addUrl}>
  <input bind:value={input} type="text" id="input-field" />
  <button id="add-button">Add</button>
</form>

<style>
  #list {
    width: 300px;
    border-bottom: 1px solid gray;
  }

  .item {
    display: flex;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid gray;
    border-right: 1px solid gray;
    border-left: 1px solid gray;
  }
  .item:first-child {
    border-top: 1px solid gray;
  }

  #input-container {
    display: flex;
    align-items: center;
    border-top: 1px solid gray;
  }

  #input-field {
    flex: 1;
    padding: 10px;
    border: 1px solid gray;
    width: 280px;
  }

  #add-button {
    padding: 10px;
    border: none;
  }

  .item-text {
    margin-right: auto;
  }

  .trash-can {
    width: 20px;
    height: 20px;
  }
</style>
