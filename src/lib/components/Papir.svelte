<script lang="ts">
	export let isOpen = false;
</script>

<div class="papir-content">
	<div class="papir primary">
		<slot />
	</div>
	<div class="papir secondary">
		<slot name="artifacts" />
	</div>
</div>

<style lang="scss">
	.papir-container {
		width: 100%;
		height: 100vh;
		overflow-x: hidden;
		overflow-y: scroll;
		overscroll-behavior: none;
		
		&::-webkit-scrollbar {
			display: none;
		}
		
		&.in-swipe {
			overflow-y: hidden;
		}

		//after swipe
		&:not(.in-swipe).opened :global(.primary) {
			opacity: 1;
		}

		&.opened :global(.secondary) {
			width: 30vw;
			padding: 2rem;
		}
	}
	
	.papir-content {
		width: 130vw;
		height: auto;
		display: flex;
		justify-content: center;
		margin-bottom: 50rem !important;
	}
	
	.papir {
		width: var(--sheet-width);
		box-sizing: border-box;
		background: #fff;
		padding-left: var(--sheet-horizontal-padding);
		padding-right: var(--sheet-horizontal-padding);
		
		&.primary {
			transition: opacity 0.3s;
		}
		
		&.secondary {
			width: 30vw;
			padding: 2rem;
		}
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
		//margin-top: 1rem;

		@media (max-width: 768px) {
			width: calc(100% + var(--leftband-width) + var(--rightband-width));
		}
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
