<script lang="ts">
	import Buffer from "./Buffer.svelte";
	export let value = "";
</script>

<section class="action">
	<article>
		{#if value}
			<Buffer bind:markdown={value} />
		{:else}
			<slot />
		{/if}
	</article>
	<slot name="right" />
</section>
