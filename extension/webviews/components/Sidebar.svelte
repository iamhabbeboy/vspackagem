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
    result: PkgType[];
  }

  let pkgs: PkgsType = {
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
    pkgs.result = [];
    const response = await fetch(`${apiBaseUrl}/search?q=${query}&vendor=${vendor}`);
    pkgs = await response.json();
    isLoading = true;
  };

  const handleSelection = (publisher: string) => {
    vendor = publisher;
    selected = "selected";
  };

</script>

<h3>Search Package</h3>
<input type="text" bind:value={query} />

<Image selected={selected} src={"https://res.cloudinary.com/denj7z5ec/image/upload/v1669412388/go_qo9jg9.png"} on:click={() => handleSelection("goget")}/>
&nbsp;
<Image selected={selected} src={"https://res.cloudinary.com/denj7z5ec/image/upload/v1669412388/php_tczkal.png"} on:click={() => handleSelection("composer")}/>
&nbsp;
<Image selected={selected} src={"https://res.cloudinary.com/denj7z5ec/image/upload/v1669411991/js_zgy2wh.png"} on:click={() => handleSelection("npm")}/>
<button on:click={search}>Search</button>

{#if pkgs.result.length == 0}
  <p>No package found</p>
{:else}
  <ul>
    {#each pkgs.result as pkg}
      <Package pkg={pkg} vendor={vendor} />
    {/each}
  </ul>
{/if}

<style>
  ul {
    margin: 0;
    padding: 0;
  }
</style>
