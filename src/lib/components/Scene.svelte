<script lang="ts">
	export let prefix: string;
	export let where: string;
	export let when: string;
	export let id: string = "";

</script>

<section class="scene" id={id}>
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
		//height: 18px;
		h1 {
			font-size: 18px;
			font-weight: 600;
			line-height: 23px;
			text-transform: uppercase;
			margin: 0 0 23px 0;

			@media (max-width: 768px) {
				font-size: 14px;
				line-height: 18px;
			}
		}
	}
</style>
