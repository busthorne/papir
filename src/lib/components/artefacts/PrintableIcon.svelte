<script lang="ts">
	import { onMount } from "svelte";
	import { AwesomeQR } from "awesome-qr";
	import QRCode from "@castlenine/svelte-qrcode";

	export let id: string = "";
	export let url: string = "";

	let qrCode: string = "";
	let iconElement: HTMLElement;

	let size = 150;
	let opacity = 0.1;
	let dotScale = 0.45;
	let logoImage = "";

	async function generateAwesomeQR() {
		if (!url || !iconElement) {
			return;
		}

		const imgElement = iconElement.querySelector("img");
		if (!imgElement) {
			return;
		}

		logoImage = imgElement.src;

		const qr = await new AwesomeQR({
			text: url,
			size: 1000,
			backgroundImage: logoImage,
			backgroundDimming: `rgba(0,0,0,${opacity})`,
			dotScale: dotScale,
		}).draw();

		qrCode = qr as string;
	}

	onMount(() => {
		generateAwesomeQR();
	});
</script>

<div class="icon" {id}>
	{#if url}
		<!-- <a href={url}> -->
			<span class="print-icon">
				{#if qrCode}
					<div class="qr-container">
						<img src={qrCode} alt="QR Code" width={size} height={size} />
					</div>
					<!-- <QRCode data={url} size={150} logoInBase64={logoImage} logoSize={15} /> -->
				{:else}
					<slot />
				{/if}
			</span>
			<span class="default-icon" {id} bind:this={iconElement}>
				<slot />
			</span>
		<!-- </a> -->
	{:else}
		<span class="print-icon">
			<slot />
		</span>
		<span class="default-icon" {id}>
			<slot name="print" />
		</span>
	{/if}
</div>

<style lang="scss">
	.print-icon {
		display: none;

		img {
			object-fit: contain;
		}
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

			.qr-controls {
				display: none;
			}
		}
	}

	.qr-container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.qr-controls {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;

		label {
			display: flex;
			flex-direction: column;
			font-size: 0.8rem;

			input {
				width: 100%;
			}
		}
	}

	.icon {
		cursor: pointer;

		a {
			color: inherit;
			text-decoration: none;
		}
	}
</style>
