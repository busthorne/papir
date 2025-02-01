<script lang="ts">
	import { onMount } from "svelte";
	import QRCodeStyling from "qr-code-styling";

	export let alterLink: string;

	let showAlter = false;
	let qr;
	let qrContainer;

	onMount(() => {
		qr = new QRCodeStyling({
			data: alterLink,
			image: "/bober.png",
			width: 150,
			height: 150,
			dotsOptions: { color: "#000", type: "rounded" },
			backgroundOptions: { color: "#fff" },
			imageOptions: { crossOrigin: "anonymous", margin: 5 },
		});
	});

	window.addEventListener("beforeprint", () => {
		showAlter = true;
		setTimeout(() => qr.append(qrContainer), 0);
	});

	window.addEventListener("afterprint", () => {
		showAlter = false;
	});
</script>

{#if showAlter}
	<div bind:this={qrContainer}></div>
{:else}
	<slot></slot>
{/if}
