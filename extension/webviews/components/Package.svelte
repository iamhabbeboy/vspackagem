<script lang="ts">
  import { onMount } from "svelte";
  import type { PackageType } from "../types/interfaces";
  export let pkg: any;
  export let vendor: string;
  let isInstalling: boolean = false;
  export let packageInstalled: string;

  let img =
    "https://res.cloudinary.com/denj7z5ec/image/upload/v1669411991/js_zgy2wh.png";

  onMount(() => {
    switch (vendor) {
      case "composer":
        img =
          "https://res.cloudinary.com/denj7z5ec/image/upload/v1669412388/php_tczkal.png";
        break;
      case "goget":
        img =
          "https://res.cloudinary.com/denj7z5ec/image/upload/v1669412388/go_qo9jg9.png";
        break;
      case "npm":
        img =
          "https://res.cloudinary.com/denj7z5ec/image/upload/v1669411991/js_zgy2wh.png";
        break;
      default:
        break;
    }
  });

  const installer = async (pkg: PackageType) => {
    isInstalling = true;
    let command = `${vendor}::${pkg.name}`;
    if(pkg.reference) {
      command += `::${pkg.reference}`; 
    }
    tsvscode.postMessage({ type: "onInstall", value: command });
  };
</script>

<li>
  <div style="padding-top: 2px">
    <img src={img} width="20" height="20" alt="" />
  </div>
  <div style="padding-left: 5px;width:90%">
    <div style="display:flex;justify-content:space-between;width:100%">
      <b>{pkg.name}</b>
      <span>{pkg.version}</span>
    </div>
    <p>{pkg.description.substr(0, 30)}</p>
    <div style="display:flex;justify-content:space-between;width:100%">
      <p style="padding-top:2px">{pkg.author}</p>
      {#if packageInstalled === pkg.name}
        <button class="button-sm button-disabled" disabled>Installed</button>
      {:else}
        <button class="button-sm" on:click={() => installer(pkg)}
          >Install
          {#if isInstalling === true}
            <img
              src="https://res.cloudinary.com/denj7z5ec/image/upload/v1673626970/loader_ugnkvf.svg"
              width="10"
              height="10"
              alt=""
            />
          {/if}
        </button>
      {/if}
    </div>
  </div>
</li>

<style>
  li {
    list-style-type: none;
    display: flex;
    padding-top: 5px;
    padding-bottom: 5px;
  }
  li:hover {
    background: rgba(0, 0, 0, 0.5);
    cursor: pointer;
  }

  .button-sm {
    padding: 3px;
    width: auto;
    border-radius: 2px;
  }

  .button-disabled {
    background: #ccc !important;
    color: #fff;
  }

  img {
    cursor: pointer;
  }
</style>
