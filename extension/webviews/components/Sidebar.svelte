<script lang="ts">
  import Image from "./Image.svelte";
  import Package from "./Package.svelte";

  interface PkgType {
    Name: string;
    Description: string;
    Version: string;
    Published: string;
    Author: string;
  }

  interface PkgsType {
    status: boolean;
    result: PkgType[];
  }

  let pkgs: PkgsType = {
    status: false,
    result: [],
  };

  let query: string = "";
  let vendor: string = "";
  let selected: string = "";
  let isLoading: boolean = false;

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

  // const media = document.querySelector("meta[name=image-path]");
  // const filepath = media?.getAttribute("content");

  const handleSelection = (event: any) => {
    vendor = event.detail.lang;
    // selected = "selected";
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
      <Package {pkg} {vendor} />
    {/each}
  </ul>
{/if}

<style>
  ul {
    margin: 0;
    padding: 0;
  }
</style>
