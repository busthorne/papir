<script lang="ts">
	import Buffer from "./Buffer.svelte";
	export let value = "";
	export let id: string = "";
</script>


<section class="action" id={id}>
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
		margin-bottom: 37px;

		:global(p) {
			font-size: 16px;
			line-height: 26px;
			font-weight: 400;

			@media (max-width: 768px) {
				font-size: 13px;
				line-height: 22px;
			}
		}
	}
</style>