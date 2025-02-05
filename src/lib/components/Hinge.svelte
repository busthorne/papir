<script lang="ts">
    import { spring } from 'svelte/motion';
    import { setContext } from 'svelte';
    
    export let isOpen = false;
    export let maxScroll = window.innerWidth * 0.3;
    export let swipeThreshold = window.innerWidth * 0.125;
    
    const scrollLeft = spring(0, { stiffness: 0.25, damping: 1 });
    
    function toggleOpen(value: boolean) {
        isOpen = value;
        scrollLeft.set(value ? maxScroll : 0);
    }
    
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
                scrollLeft.set(Math.min(initialScrollLeft + xDiff, maxScroll));
            }
        };
        
        const touchEndHandler = (event: TouchEvent) => {
            if (isSwipe) {
                const swiped = Math.abs(xDiff) >= swipeThreshold;
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

<div class="hinge-container" class:opened={isOpen} use:hinge>
    <slot />
</div>

<style>
    .hinge-container {
        width: 100%;
        height: 100vh;
        overflow-x: hidden;
        overflow-y: scroll;
        overscroll-behavior: none;
    }
    
    .hinge-container::-webkit-scrollbar {
        display: none;
    }
    
    .hinge-container.in-swipe {
        overflow-y: hidden;
    }
</style> 