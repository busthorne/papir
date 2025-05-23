<script lang="ts">
	import { spring } from "svelte/motion";
	import { createEventDispatcher, onMount, onDestroy } from "svelte";
	import { papirStore, type PapirState } from "../stores/papir";

	const dispatch = createEventDispatcher();

	export let id: string;

	// Додаємо реактивні змінні для різних розмірів екрану
	$: isMobile = window.innerWidth <= 768;
	$: maxStages = isMobile ? 3 : 2;
	$: firstStageScroll = window.innerWidth * (isMobile ? 0.2 : 0.2);
	$: secondStageScroll = window.innerWidth * (isMobile ? 0.5 : 0.9);
	$: thirdStageScroll = window.innerWidth * 0.8;
	export let swipeThreshold = window.innerWidth * 0.125;

	const scrollLeft = spring(0, { stiffness: 0.25, damping: 1 });
	$: currentStage = 0;

	// Local reactive state that syncs with the store
	$: state = $papirStore[id] || { isOpen: false, activeArtefact: null };
	$: isOpen = state.isOpen;

	// Додаємо обробник зміни розміру вікна
	function handleResize() {
		if (currentStage > maxStages - 1) {
			currentStage = maxStages - 1;
			const targetScroll = getTargetScroll(currentStage);
			scrollLeft.set(targetScroll);
		}
	}

	function getTargetScroll(stage: number): number {
		switch (stage) {
			case 3:
				return thirdStageScroll;
			case 2:
				return secondStageScroll;
			case 1:
				return firstStageScroll;
			default:
				return 0;
		}
	}

	function toggleOpen(value: boolean, stage: number = 1) {
		papirStore.toggleOpen(id, value);
		if (isMobile && stage === 1) {
			currentStage = value ? 1 : 2;
		} else {
			currentStage = value ? 1 : 0;
		}
		console.log(currentStage);

		const targetScroll = getTargetScroll(currentStage);
		scrollLeft.set(targetScroll);
		dispatch("papirStateChange", { isOpen: value, stage: currentStage });
	}

	// Handle global events
	function handlePapirAction(event: CustomEvent) {
		const { action, papirId } = event.detail;
		if (papirId === id) {
			toggleOpen(action === "open");
		}
	}

	onMount(() => {
		window.addEventListener("resize", handleResize);
		papirStore.register(id);
		window.addEventListener("papir-action", handlePapirAction as EventListener);
	});

	onDestroy(() => {
		window.removeEventListener("resize", handleResize);
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
			initialScrollLeft = node.scrollLeft;
			isSwipe = null;
		};

		const touchMoveHandler = (event: TouchEvent) => {
			if (!x1) return;
			xDiff = x1 - event.touches[0].clientX;
			yDiff = y1 - event.touches[0].clientY;
			isSwipe = isSwipe === null ? Math.abs(xDiff) > Math.abs(yDiff) : isSwipe;

			if (isSwipe) {
				node.classList.add("in-swipe");
				const newScroll = initialScrollLeft + xDiff;

				const maxScroll = currentStage === 1 ? firstStageScroll : secondStageScroll;
				scrollLeft.set(Math.min(newScroll, maxScroll));
			}
		};

		const touchEndHandler = () => {
			if (!isSwipe) return;

			const currentScroll = node.scrollLeft;
			let newStage = currentStage;

			if (Math.abs(xDiff) > swipeThreshold) {
				if (xDiff > 0) {
					newStage = currentStage < maxStages ? currentStage + 1 : maxStages;
				} else {
					newStage = currentStage > 0 ? currentStage - 1 : 0;
				}
			} else {
				if (isMobile) {
					if (currentScroll > thirdStageScroll * 0.7) {
						newStage = 3;
					} else if (currentScroll > secondStageScroll * 0.7) {
						newStage = 2;
					} else if (currentScroll > firstStageScroll * 0.7) {
						newStage = 1;
					} else {
						newStage = 0;
					}
				} else {
					if (currentScroll > secondStageScroll * 0.7) {
						newStage = 2;
					} else if (currentScroll > firstStageScroll * 0.7) {
						newStage = 1;
					} else {
						newStage = 0;
					}
				}
			}

			toggleOpen(newStage > 0, newStage);
			node.classList.remove("in-swipe");
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
	class:stage-one={currentStage === 1}
	class:stage-two={currentStage === 2}
	use:handleSwipe
	on:mouseenter={handleMouseEnter}
	on:mouseleave={handleMouseLeave}>
	<div class="papir-content">
		<div class="papir primary">
			<slot />
		</div>
		<div class="papir secondary">
			{#if (isMobile && currentStage === 2) || (!isMobile && currentStage === 1)}
				<slot name="artifacts" />
			{/if}
		</div>
	</div>
</div>

<style global lang="scss">
	:root {
		--print: "IBM Plex Mono", monospace;
		--print-size: 12px;
		--sheet-width: 70vw;
		--dialogue-width: 20vw;
		--sheet-horizontal-padding: 0;
		--leftband-width: 20vw;
		--rightband-width: 0;
		--band-gap: 5vw;

		--border-color: #b9b9b9;
		--selection-color: #b5f0ff3d;
		--focus-outline: #222d36;
		--hover-color: #e9e9e9;
		--caret-color: #161616;
		--text-color: #1a1a1a;
		--border-color-dark: #4d4d4c;
		--selection-color-dark: #b5f0ff3d;
		--focus-outline-dark: #76bbf3;
		--hover-color-dark: #4d4d4c;
		--caret-color-dark: #ffffff;
		--text-color-dark: #f1f1f1;

		font-family: var(--print);
		font-size: var(--print-size);

		@media print {
			.papir-container {
				margin-left: 0;
			}
			--band-gap: 10vw;
			--sheet-width: 100vw;
			--dialogue-width: 50vw;
			--leftband-width: 0;
			--rightband-width: 0;
			--sheet-horizontal-padding: 0;

			.default-icon {
				display: none;
			}
			.print-icon {
				display: block;
			}
		}

		@media (max-width: 1440px) {
			--sheet-width: 100vw;
		}

		@media (max-width: 1200px) {
			--sheet-width: 95vw;
		}

		@media (max-width: 1024px) {
			--sheet-width: 85vw;
			--dialogue-width: 45vw;
			--leftband-width: 0;
		}

		@media (max-width: 768px) {
			--sheet-width: 90vw;
			--dialogue-width: 50vw;
		}
	}

	:global(.action p) {
		font-size: var(--print-size);
		// line-height: 26px;
		// font-weight: 400;

		// @media (max-width: 768px) {
		// 	font-size: 13px;
		// 	line-height: 22px;
		// }
	}

	.remixicon {
		cursor: pointer;
	}
	a {
		text-decoration: underline;
		color: var(--text-color);
	}

	body {
		// background: #f5f5f5;
		// background: #fff;
		margin: 0;
	}
	.papir {
		padding-top: 2rem;
		margin-bottom: 30vh;
	}

	.print-icon {
		display: none;
	}

	p {
		&.isArtefact {
			// @media (max-width: 768px) {
			// 	padding-right: 50px;
			// }
		}
	}

	.papir-container {
		display: flex;
		width: 100%;
		margin-left: var(--band-gap);
		overflow: hidden;
	}

	.secondary-content {
		opacity: 0;
		animation: fadeIn 0.3s forwards;
		animation-delay: 0.3s; // Delay until after hinge animation
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.papir-container {
		width: 100%;
		height: 100%;
		overflow-x: hidden;
		overflow-y: scroll;
		overscroll-behavior: none;

		&::-webkit-scrollbar {
			display: none;
		}

		&.in-swipe {
			overflow-y: hidden;
		}

		&.stage-one {
			.papir-content {
				@media (max-width: 768px) {
					transform: translateX(-20vw);
				}
				@media (min-width: 769px) {
					transform: translateX(-30vw);
				}
			}
		}

		&.stage-two {
			.papir-content {
				@media (max-width: 768px) {
					transform: translateX(-50vw);
				}
				@media (min-width: 769px) {
					transform: translateX(-70vw);
				}
			}
		}

		&.stage-three {
			.papir-content {
				@media (max-width: 768px) {
					transform: translateX(-80vw);
				}
			}
		}

		&:not(.in-swipe).opened :global(.primary) {
			opacity: 1;
		}

		&:not(.in-swipe).opened :global(.secondary) {
			//width: 30vw;
			//padding: 2rem;
		}
		&.opened :global(.secondary) {
			//width: 30vw;
			//padding: 2rem;
		}
	}

	.papir-content {
		// min-width: 130%;
		height: auto;
		display: flex;
		justify-content: center;
		transition: transform 0.3s ease-out;

		@media (max-width: 768px) {
			// min-width: 200%;
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
			// width: 30vw;
			// padding: 2rem;
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
		// text-align: left;
	}
</style>
