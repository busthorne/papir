<script lang="ts">
	import PrintableIcon from "./PrintableIcon.svelte";

	export let id: string;
	export let url: string;
	export let imgSrc: string;
	export let imgAlt: string = "Artefact icon";
	export let size: number = 24;
</script>

<PrintableIcon {id} {url}>
	<img src={imgSrc} alt={imgAlt} width={size} height={size} />
</PrintableIcon>
