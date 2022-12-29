<script lang="ts">
    export let src: string;
    export let selected: String;
</script>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<img
  src={src}
  width="20"
  height="20"
  alt=""
  class:selected={selected === "selected"}
  on:click
/>

<style>
      .selected {
		background-color: #ff3e00;
		color: white;
    opacity: 0.2;
	}
</style>