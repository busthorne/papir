<script lang="ts">
	import PrintableIcon from "./artefacts/PrintableIcon.svelte";
	import { createEventDispatcher } from "svelte";
	import { papirStore } from '../stores/papir';
	import type { SvelteComponent } from "svelte";

	const dispatch = createEventDispatcher();

	export let id: string = "";
	export let url: string = "";
	export let icon: string | typeof SvelteComponent;
	export let papirId: string;
	export let size: number = 24;
	export let alt: string = "Artefact icon";

	// Визначаємо, чи icon є строкою (шлях до зображення) чи компонентом
	$: isIconString = typeof icon === "string";
	$: isOpen = $papirStore[papirId]?.isOpen || false;

	function handlePeak(event: MouseEvent) {
		dispatch("peak", { event });
	}

	function handleHover(event: MouseEvent) {
		dispatch("hover", { event });
	}

	function handleReveal(event: MouseEvent) {
		dispatch("reveal", { event, isOpen });
	}
</script>

<PrintableIcon {id} {url}>
	{#if isIconString}
		<img
			src={String(icon)}
			{alt}
			width={size}
			height={size}
			on:mouseover={handleHover}
			on:click={handleReveal}
			on:mouseenter={handlePeak} />
	{:else}
		<svelte:component
			this={icon}
			on:mouseover={handleHover}
			on:click={handleReveal}
			on:mouseenter={handlePeak} />
	{/if}
</PrintableIcon>

<style>
	:global(.artefact) {
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}
</style>
