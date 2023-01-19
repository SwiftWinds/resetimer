<script lang="ts">
  import { invoke } from "@tauri-apps/api/tauri";
  import { onMount } from "svelte";

  let name = "";
  let greetMsg = "";

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    greetMsg = await invoke("greet", { name });
  }

  async function getFrontmostWindow() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    const activeWindow = await invoke("get_frontmost_window") as string;
    console.log(JSON.parse(activeWindow));
  }

  onMount(() => {
		const interval = setInterval(() => {
      getFrontmostWindow();
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<div>
  <div class="row">
    <input id="greet-input" placeholder="Enter a name..." bind:value={name} />
    <button on:click={greet}> Greet </button>
  </div>
  <p>{greetMsg}</p>
</div>
