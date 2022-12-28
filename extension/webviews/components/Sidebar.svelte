<script lang="ts">
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
    result: [
      {
        Name: "camera",
        Description: "hello camera",
        Version: "0.1.1",
        Published: "3 years",
        Author: "abbey",
      },
    ],
  };

  let query: string = "";

  const search = async () => {
    if (query === "") {
      return;
    }
    const response = await fetch(`${apiBaseUrl}/search?q=${query}&vendor=npm`);
    pkgs = await response.json();
  };

  const installer = () => {
    tsvscode.postMessage({ type: "onInstall", value: "yarn add axios" });
  };

  const handleSelection = (vendor: string) => {
    console.log("Hello world " + vendor)
  };
  // workbench.action.terminal.ne
</script>

<h3>Search Package</h3>
<input type="text" bind:value={query} />
<span on:click={handleSelection('goget')}>
<img
  src="https://res.cloudinary.com/denj7z5ec/image/upload/v1669412388/go_qo9jg9.png"
  width="20"
  height="20"
  alt=""
/>
</span>
&nbsp;
<img
  src="https://res.cloudinary.com/denj7z5ec/image/upload/v1669412388/php_tczkal.png"
  width="20"
  height="20"
  alt=""
  on:click={handleSelection('php')}
/>
&nbsp;
<img
  src="https://res.cloudinary.com/denj7z5ec/image/upload/v1669411991/js_zgy2wh.png"
  width="20"
  height="20"
  alt=""
  on:click={handleSelection('npm')}
/>
<button on:click={search}>Search</button>

{#if pkgs.result.length == 0}
  <p>No package found</p>
{:else}
  <ul>
    {#each pkgs.result as pkg}
      <li>
        <div style="padding-top: 2px">
          <img
            src="https://res.cloudinary.com/denj7z5ec/image/upload/v1669411991/js_zgy2wh.png"
            width="20"
            height="20"
            alt=""
          />
        </div>
        <div style="padding-left: 5px;width:90%">
          <div style="display:flex;justify-content:space-between;width:100%">
            <b>{pkg.Name}</b>
            <span>v1.0.0</span>
          </div>
          <p>Lorem ipsum...</p>
          <div style="display:flex;justify-content:space-between;width:100%">
            <p style="padding-top:2px">iamhabbeboy</p>
            <button class="button-sm" on:click={installer}>Install</button>
          </div>
        </div>
      </li>
    {/each}
  </ul>
{/if}

<style>
  ul {
    margin: 0;
    padding: 0;
  }
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
