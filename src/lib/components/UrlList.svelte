<script lang="ts">
  import trashCanSvg from "$lib/assets/trash-can.svg";
  import { isUsingUrlWhitelist, selectedUrls } from "$lib/stores/apps";

  let input: string;

  function addUrl() {
    if (input) {
      $selectedUrls = [...$selectedUrls, input];
      input = "";
    }
  }

  function deleteUrl(index: number) {
    $selectedUrls = $selectedUrls.filter((_, i) => i !== index);
  }
</script>

<input
  type="checkbox"
  id="url-list-mode"
  name="url-list-mode"
  bind:checked={$isUsingUrlWhitelist}
/>
<label for="url-list-mode">Whitelist urls</label>

<div>Websites to {$isUsingUrlWhitelist ? "allow" : "block"}:</div>

<div id="list">
  {#each $selectedUrls as url, i}
    <div class="item">
      <span class="item-text">{url}</span>
      <button class="icon-wrapper" on:click={() => deleteUrl(i)}>
        <img src={trashCanSvg} alt="delete url" class="trash-can" />
      </button>
    </div>
  {/each}
</div>

<form id="input-container" on:submit|preventDefault={addUrl}>
  <input
    bind:value={input}
    type="text"
    id="input-field"
    autocorrect="off"
    autocapitalize="off"
  />
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

  .icon-wrapper {
    display: grid;
    place-items: center;
  }

  .trash-can {
    filter: invert(37%) sepia(38%) saturate(3211%) hue-rotate(345deg)
      brightness(95%) contrast(95%);
    width: 24px;
    height: 24px;
  }
</style>
