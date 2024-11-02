<script lang="ts">
	export let to = "";
</script>

<section class="transition">
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
	}
</style>
