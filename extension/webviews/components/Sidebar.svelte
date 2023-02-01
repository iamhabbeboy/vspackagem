<script lang="ts">
  import { onMount } from "svelte";
  import type { PackageProps, PackageType } from "../types/interfaces";
  import Image from "./Image.svelte";
  import Package from "./Package.svelte";

  $: tsvscode.postMessage({ type: "onPackageListing", value: "testing" });

  let pkgs: PackageProps = {
    status: false,
    result: [],
  };

  let query: string = "";
  let vendor: string = "";
  let selected: string = "";
  let isLoading: boolean = false;
  let isInstalling: boolean = false;
  let packageInstalled: string = "";
  let packageList: any = []; //Array<{name: string, package: []}>

  const search = async () => {
    if (query === "") {
      return;
    }
    isLoading = true
    const response = await fetch(
      `${apiBaseUrl}/search?q=${query}&vendor=${vendor}`
    );
    pkgs = await response.json();
    isLoading = false;
  };

  interface EventData {
    command: string;
    data: {
        type: string;
        value: string;
    };
  }

  onMount(() => {
    window.addEventListener("message", (event: MessageEvent<EventData>) => {
      const message = event.data;
      switch (message.command) {
        case "onInstalled":
          isInstalling = false;
          packageInstalled = message.data.type === "onSuccess" ? message.data.value : "";
          break;
        case "onPackageListed":
          packageList = message.data;
          break;
        default:
          console.log("Unknown message type");
      }
    });
  });

  const handleSelection = (event: any) => {
    vendor = event.detail.lang;
  };
</script>

<h3>Search Package</h3>
<input type="text" bind:value={query} />

<Image
  selected="goget"
  on:message={handleSelection}
  src={"https://res.cloudinary.com/denj7z5ec/image/upload/v1669412388/go_qo9jg9.png"}
/>
&nbsp;
<Image
  selected="composer"
  on:message={handleSelection}
  src={"https://res.cloudinary.com/denj7z5ec/image/upload/v1669412388/php_tczkal.png"}
/>
&nbsp;
<Image
  selected="npm"
  on:message={handleSelection}
  src={"https://res.cloudinary.com/denj7z5ec/image/upload/v1669411991/js_zgy2wh.png"}
/>
<button on:click={search} disabled={!!isLoading}>Search</button>
<div class="packages">
  {#if isLoading === true}
    <img
      src="https://res.cloudinary.com/denj7z5ec/image/upload/v1673626970/loader_ugnkvf.svg"
      width="20"
      height="20"
      alt=""
    />
  {:else if isLoading === false && pkgs.status === true && pkgs.result.length == 0}
    <p>No package found</p>
  {:else}
    <ul>
      {#each pkgs.result as pkg}
        <Package {pkg} {vendor} {packageInstalled}/>
      {/each}
    </ul>
  {/if}
</div>
{#each packageList as pkg}
<div class="installed-packages">
  <h5>Installed Node Packages ({pkg.name})</h5>
  <ul>
    {#each Object.entries((pkg.package)) as [key, value]}
      <li>{key} - {value}</li>
    {/each}
  </ul>
</div>
{/each}


<style>
  ul {
    margin: 0;
    padding: 0;
  }

  .installed-packages li {
    list-style: none;
    margin: 0;
    padding: 5px 2px;
  }

  .installed-packages li:hover {
    background: #ccc;
    color: #000;
    cursor: pointer;
  }

  .packages {
    height: 300px;
    overflow: auto;
  }

  .installed-packages {
    border-top: 1px solid #ccc;
    padding-top: 10px;
    margin-top: 10px;
  }
</style>
