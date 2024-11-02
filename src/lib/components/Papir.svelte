<script lang="ts">
</script>

<div class="papir">
	<slot />
</div>

<style lang="scss">
	.papir {
		width: var(--sheet-width);
		margin: auto;
		box-sizing: border-box;
		background: #fff;
	}

	:global(.papir section) {
		position: relative;
		display: grid;
		grid-template-columns:
			[left] var(--leftband-width)
			[script] 1fr
			[right] var(--rightband-width);
		gap: var(--band-gap);
		width: 100%;
		margin-top: 1rem;
	}
	:global(.papir article) {
		grid-column: script;
	}
	:global(.papir aside) {
		grid-column: left;
		text-align: right;
	}
	:global(.papir article + aside) {
		grid-column: right;
		text-align: left;
	}
</style>
