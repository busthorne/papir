<script lang="ts">
	import { onMount } from "svelte";
	import QRCodeStyling from "qr-code-styling";

	export let CSSBased: boolean = true;
	export let alterLink: string;

	let showAlter = false;
	let qr;
	let qrContainer;

	onMount(() => {
		qr = new QRCodeStyling({
			data: alterLink,
			image: "/bober.png",
			width: 75,
			height: 75,
			dotsOptions: { color: "#000", type: "rounded" },
			backgroundOptions: { color: "#fff" },
			imageOptions: { crossOrigin: "anonymous", margin: 1, imageSize: 0.5 },
			shape: 'square'
		});

		if (CSSBased) qr.append(qrContainer);
	});

	window.addEventListener("beforeprint", (e) => {
		console.log(e)
		if (!CSSBased) {
			showAlter = true;
			setTimeout(() => qr.append(qrContainer), 0);
		}
	});

	window.addEventListener("afterprint", () => {
		if (!CSSBased) {
			showAlter = false;
		}
	});
</script>

{#if CSSBased}
	<div bind:this={qrContainer} class="qrcode"></div>
	<div class="children">
		<slot></slot>
	</div>
{:else if showAlter}
	<div bind:this={qrContainer}></div>
{:else}
	<slot></slot>
{/if}

<style>
	.children {
		display: unset;
	}
	.qrcode {
		display: none;
	}
	@media print {
		.children {
			display: none;
		}
		.qrcode {
			display: block;
		}
	}
</style>
