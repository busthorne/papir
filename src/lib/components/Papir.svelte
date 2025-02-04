<script lang="ts">
	import { spring } from "svelte/motion";
	import { createEventDispatcher, onMount, onDestroy } from "svelte";
	import { papirStore, type PapirState } from "../stores/papir";

	const dispatch = createEventDispatcher();

	export let id: string;
	export let maxScroll = window.innerWidth * (window.innerWidth <= 768 ? 2 : 0.5);
	export let swipeThreshold = window.innerWidth * 0.125;

	const scrollLeft = spring(0, { stiffness: 0.25, damping: 1 });

	// Local reactive state that syncs with the store
	$: state = $papirStore[id] || { isOpen: false, activeArtefact: null };
	$: isOpen = state.isOpen;

	function toggleOpen(value: boolean) {
		papirStore.toggleOpen(id, value);
		scrollLeft.set(value ? maxScroll : 0);
		dispatch("papirStateChange", { isOpen: value });
	}

	// Handle global events
	function handlePapirAction(event: CustomEvent) {
		const { action, papirId } = event.detail;
		if (papirId === id) {
			toggleOpen(action === "open");
		}
	}

	onMount(() => {
		papirStore.register(id);
		window.addEventListener("papir-action", handlePapirAction as EventListener);
	});

	onDestroy(() => {
		papirStore.unregister(id);
		window.removeEventListener("papir-action", handlePapirAction as EventListener);
	});

	const handleSwipe = (node: HTMLElement) => {
		let x1: number, y1: number, xDiff: number, yDiff: number;
		let initialScrollLeft: number, isSwipe: boolean | null;

		const unsubscribeScrollLeft = scrollLeft.subscribe((value) => (node.scrollLeft = value));

		const touchStartHandler = (event: TouchEvent) => {
			x1 = event.touches[0].clientX;
			y1 = event.touches[0].clientY;
			initialScrollLeft = event.currentTarget.scrollLeft;
			isSwipe = null;
		};

		const touchMoveHandler = (event: TouchEvent) => {
			xDiff = x1 - event.touches[0].clientX;
			yDiff = y1 - event.touches[0].clientY;
			isSwipe = isSwipe === null ? (Math.abs(yDiff) > 6 ? false : Math.abs(xDiff) > 8) : isSwipe;

			if (isSwipe) {
				node.classList.add("in-swipe");
				scrollLeft.set(Math.min(initialScrollLeft + xDiff, maxScroll));
			}
		};

		const touchEndHandler = (event: TouchEvent) => {
			if (isSwipe) {
				const swiped = Math.abs(xDiff) >= swipeThreshold;
				toggleOpen(swiped ? xDiff > 0 : isOpen);
				node.classList.remove("in-swipe");
			}
		};

		node.addEventListener("touchstart", touchStartHandler, { passive: true });
		node.addEventListener("touchmove", touchMoveHandler, { passive: true });
		node.addEventListener("touchend", touchEndHandler, { passive: true });

		return {
			destroy() {
				unsubscribeScrollLeft();
				node.removeEventListener("touchstart", touchStartHandler);
				node.removeEventListener("touchmove", touchMoveHandler);
				node.removeEventListener("touchend", touchEndHandler);
			},
		};
	};

	function handleMouseEnter() {
		dispatchPapirEvent("hover", id);
	}

	function handleMouseLeave() {
		dispatchPapirEvent("close", id);
	}
</script>

<div
	class="papir-container"
	class:opened={isOpen}
	use:handleSwipe
	on:mouseenter={handleMouseEnter}
	on:mouseleave={handleMouseLeave}>
	<div class="papir-content">
		<div class="papir primary">
			<slot />
		</div>
		<div class="papir secondary">
			<slot name="artifacts" />
		</div>
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
		/* &:not(.in-swipe).opened :global(.primary) {
		opacity: 1;
	} */

		/* &:not(.in-swipe).opened {

	} */

		/* &.opened :global(.secondary) {
		//width: 30vw;
		//padding: 2rem;
	} */
	}

	.papir-content {
		min-width: 150%;
		height: auto;
		display: flex;
		justify-content: center;
		margin-bottom: 50rem !important;

		@media (max-width: 768px) {
			min-width: 200%;
		}
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
			//width: 30vw;
			//padding: 2rem;
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
