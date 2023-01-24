<script lang="ts">
  	import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
  export let src: string;
  export let selected: String;

  function setLanguage(event: any) {
    const lang: string = event.target.getAttribute('data-lang');
    event.target.style.opacity = "0.2";
		dispatch('message', {
			lang: lang,
		});
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<img
  {src}
  width="20"
  height="20"
  alt=""
  data-lang={selected}
  on:click={setLanguage}
/>

<style>
  /* .selected {
    opacity: 0.2;
  } */

  img {
    cursor: pointer;
  }

  img:hover {
    opacity: 0.2;
  }
</style>