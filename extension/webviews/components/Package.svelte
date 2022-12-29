<script lang="ts">
  import { onMount } from "svelte";
  export let pkg: any;
  export let vendor: string;
  let img = "https://res.cloudinary.com/denj7z5ec/image/upload/v1669411991/js_zgy2wh.png";

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

  const installer = () => {
    tsvscode.postMessage({ type: "onInstall", value: "yarn add axios" });
  };
</script>

<li>
  <div style="padding-top: 2px">
    <img src={img} width="20" height="20" alt="" />
  </div>
  <div style="padding-left: 5px;width:90%">
    <div style="display:flex;justify-content:space-between;width:100%">
      <b>{pkg.Name}</b>
      <span>{pkg.Version}</span>
    </div>
    <p>{pkg.Description}</p>
    <div style="display:flex;justify-content:space-between;width:100%">
      <p style="padding-top:2px">{pkg.Author}</p>
      <button class="button-sm" on:click={installer}>Install</button>
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

  img {
    cursor: pointer;
  }
</style>
