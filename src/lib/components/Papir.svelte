<script lang="ts">
	import { spring } from 'svelte/motion';
	import { setContext } from 'svelte';
	
	export let isOpen = false;
	
	const scrollLeft = spring(0, { stiffness: 0.25, damping: 1 });
	
	// Функція для програмного свайпу
	function toggleOpen(value: boolean) {
		isOpen = value;
		const max = window.innerWidth * 0.1;
		scrollLeft.set(value ? max : 0);
	}
	
	// Надаємо функцію через контекст
	setContext('toggleOpen', toggleOpen);
	
	const hinge = (node: HTMLElement) => {
		let x1: number, y1: number, xDiff: number, yDiff: number;
		let initialScrollLeft: number, isSwipe: boolean | null;
		
		const unsubscribeScrollLeft = scrollLeft.subscribe(
			value => node.scrollLeft = value
		);
		
		const touchStartHandler = (event: TouchEvent) => {
			x1 = event.touches[0].clientX;
			y1 = event.touches[0].clientY;
			initialScrollLeft = event.currentTarget.scrollLeft;
			isSwipe = null;
		};
		
		const touchMoveHandler = (event: TouchEvent) => {
			xDiff = x1 - event.touches[0].clientX;
			yDiff = y1 - event.touches[0].clientY;
			isSwipe = isSwipe === null ? 
				(Math.abs(yDiff) > 6 ? false : Math.abs(xDiff) > 8) : 
				isSwipe;
			
			if (isSwipe) {
				node.classList.add('in-swipe');
				const maxScroll = window.innerWidth * 0.3;
				scrollLeft.set(Math.min(initialScrollLeft + xDiff, maxScroll));
			}
		};
		
		const touchEndHandler = (event: TouchEvent) => {
			if (isSwipe) {
				const maxScroll = window.innerWidth * 0.3;
				const swiped = Math.abs(xDiff) >= window.innerWidth * 0.125;
				isOpen = swiped ? xDiff > 0 : isOpen;
				
				node.classList.remove('in-swipe');
				scrollLeft.set(isOpen ? maxScroll : 0);
			}
		};
		
		node.addEventListener('touchstart', touchStartHandler, { passive: true });
		node.addEventListener('touchmove', touchMoveHandler, { passive: true });
		node.addEventListener('touchend', touchEndHandler, { passive: true });
		
		return {
			destroy() {
				unsubscribeScrollLeft();
				node.removeEventListener('touchstart', touchStartHandler);
				node.removeEventListener('touchmove', touchMoveHandler);
				node.removeEventListener('touchend', touchEndHandler);
			}
		};
	};
</script>

<div class="papir-container" class:opened={isOpen} use:hinge>
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
		&:not(.in-swipe).opened :global(.primary) {
			opacity: 1;
		}
	}
	
	.papir-content {
		width: 130vw;
		min-height: 100%;
		display: flex;
	}
	
	.papir {
		width: 100vw;
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
		margin-top: 1rem;

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
