<script lang="ts">
	import Buffer from "./Buffer.svelte";
	export let value = "";
	export let id: string = "";
</script>

<section class="action" {id}>
	<article>
		{#if value}
			<Buffer bind:markdown={value} />
		{:else}
			<slot />
		{/if}
	</article>
	<slot name="right" />
</section>

<style lang="scss">
	.action {
		margin-bottom: 10px;
	}
</style>
