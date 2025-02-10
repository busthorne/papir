<script lang="ts">
	import { onMount } from "svelte";
	import QRCode from "@castlenine/svelte-qrcode";

	export let id: string = "";
	export let url: string = "";
	export let size: number = 60;
	export let logoSize: number = 30;
	export let errorCorrectionLevel: "L" | "M" | "Q" | "H" = "H";

	let iconElement: HTMLElement;
	let logoImage: string = "";
	let qrReady = false;

	onMount(async () => {
		if (!iconElement) return;
		const imgElement = iconElement.querySelector("img");
		if (!imgElement) return;

		// Чекаємо завантаження зображення
		if (!imgElement.complete) {
			await new Promise((resolve) => {
				imgElement.onload = resolve;
			});
		}

		logoImage = imgElement.src;
		qrReady = true;
	});
</script>

<div class="icon" {id}>
	{#if url}
		<!-- <a href={url}> -->
		<span class="print-icon">
			<div class="qr-container">
				{#if qrReady}
					<QRCode data={url} {size} logoInBase64={logoImage} {logoSize} {errorCorrectionLevel} />
				{/if}
			</div>
		</span>
		<span class="default-icon" bind:this={iconElement}>
			<slot />
		</span>
		<!-- </a> -->
	{:else}
		<span class="default-icon">
			<slot />
		</span>
	{/if}
</div>

<style lang="scss">
	.print-icon {
		display: none;
		position: relative;
		right: 5rem;
	}

	.default-icon {
		display: block;
	}

	@media print {
		.default-icon {
			display: none;
		}
		.print-icon {
			display: block;
		}
	}

	.icon {
		cursor: pointer;

		a {
			color: inherit;
			text-decoration: none;
		}

		@media (max-width: 768px) {
			transform: translateX(calc(-50% + 3px));
			transition: transform 0.3s ease-in-out;

			&.isOpen {
				transform: translateX(calc(-50% - 3px)) scaleX(-1);
			}
		}
	}
</style>
