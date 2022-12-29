<script lang="ts">
    export let src: string;
</script>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<img
  src={src}
  width="20"
  height="20"
  alt=""
  on:click
/>