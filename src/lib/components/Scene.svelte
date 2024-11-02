<script lang="ts">
	export let prefix: string;
	export let where: string;
	export let when: string;
</script>

<section class="scene">
	<slot name="left" />
	<article>
		<h1>
			{#if prefix}
				{prefix}
			{/if}
			{where}
			{#if when}
				&mdash; {when}
			{/if}
		</h1>
	</article>
	<slot name="right" />
</section>

<style lang="scss">
	.scene {
		height: 2rem;
		h1 {
			font-size: 1rem;
			font-weight: 900;
			text-transform: uppercase;
		}
	}
</style>
