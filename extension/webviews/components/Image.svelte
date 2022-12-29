<script lang="ts">
  export let src: string;
  export let selected: String;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<img
  {src}
  width="20"
  height="20"
  alt=""
  class:selected={selected === "selected"}
  on:click
/>

<style>
  .selected {
    opacity: 0.2;
  }

  img {
    cursor: pointer;
  }

  img:hover {
    opacity: 0.2;
  }
</style>