<script lang="ts">
	export let to = "";
	export let id: string = "";
</script>

<section class="transition" {id}>
	<article>
		<slot>
			<p>{to}</p>
		</slot>
	</article>
	<slot name="right" />
</section>

<style lang="scss">
	.transition {
		text-transform: uppercase;
		text-align: right;

		// :global(p) {
		// 	margin-bottom: 37px;
		// 	font-size: 18px;
		// 	line-height: 23px;
		// 	font-weight: 400;

		// 	@media (max-width: 768px) {
		// 		font-size: 14px;
		// 		line-height: 18px;
		// 	}
		// }
	}
</style>
