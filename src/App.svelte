<script lang="ts">
	import { Papir, Dialogue, Scene, Action, Transition, Buffer, Artefact } from "./lib";
	import { papirStore, dispatchPapirEvent } from "./lib/stores/papir";
	import thinkIcon from "./lib/components/artefacts/assets/think_artefact.png";

	import { onMount } from "svelte";
	import { fade, fly } from "svelte/transition";
	import { cubicIn } from "svelte/easing";
	import "@ibm/plex/css/ibm-plex.css";
	import { demo, loremIpsum } from "./mock";
	import { script, improv } from "./stores";
	import type { Message } from "./types";
	import { typewriter } from "./lib/typewriter";

	import { RiShapesFill } from "svelte-remixicon";
	import { Markdown } from "carta-md";
	import {
		PrintableIcon,
		PrintableArtefact,
		ThinkArtefact,
	} from "./lib/components/artefacts/index";
	// import PrintableArtefact from './lib/components/artefacts/PrintableArtefact.svelte';
	// import thinkArtefact from './lib/components/artefacts/assets/think_artefact.png';

	const empty = (role: string): Message => ({
		role: role,
		content: "",
		parenthetical: "",
	});
	let pre = script(demo(3));
	let post = script([]);
	let tail = improv(empty("user"));

	let isPrinting = false;
	let mounted = false;

	$: mainPapirState = $papirStore["main-papir"] || { isOpen: false, activeArtefact: null };
	$: secondaryPapirState = $papirStore["secondary-papir"] || {
		isOpen: false,
		activeArtefact: null,
	};
	$: isOpen = mainPapirState.isOpen;

	let isHovered = false;

	onMount(() => {
		mounted = true;
		const mediaQueryList = window.matchMedia("print");

		const handlePrintChange = (e: MediaQueryListEvent) => {
			isPrinting = e.matches;
		};

		mediaQueryList.addEventListener("change", handlePrintChange);

		return () => {
			mediaQueryList.removeEventListener("change", handlePrintChange);
		};
	});

	function handlePapirStateChange(event: CustomEvent) {
		const { action, papirId } = event.detail;
		if (papirId === "main-papir") {
			if (action === "hover") {
				isHovered = true;
			} else if (action === "close") {
				isHovered = false;
			}
		}
	}

	function handleArtefactClick() {
		dispatchPapirEvent("open", "main-papir");
	}

	function handleArtefactReveal(event: CustomEvent) {
		const { isOpen } = event.detail;
		dispatchPapirEvent(isOpen ? "close" : "open", "main-papir");
	}

	let invited = undefined;
	const dial =
		(user: string, assistant: string) =>
		(role = "assistant") =>
			role == "assistant" ? assistant : user;
	const dial1 = dial("user", "agent #1");
	const dial2 = dial("user", "agent #2");

	async function simulateTyping() {
		await new Promise((r) => setTimeout(r, 500));
		const words = loremIpsum("assistant").split(" ");
		let opus = "";
		for (let word of words) {
			if (opus) opus += " ";
			opus += word;
			tail.update((p) => ({ ...p, content: opus }));
			await new Promise((r) =>
				setTimeout(r, Math.random() * 100 + (Math.random() < 0.5 ? Math.random() * 200 : 0)),
			);
		}
	}
	async function send() {
		post.append($tail);
		tail = improv(empty("assistant"));
		await simulateTyping();
		post.append($tail);
		tail = improv(empty("user"));
		listening = false;
	}
	// TODO: event handler hangs the reactivity, `send` should be some kind of signal, I guess?
	let listening = false;
	$: if (listening) send();
</script>

{#if mounted}
	<!-- <div class="papir-container"> -->
	<Papir id="main-papir" on:papirStateChange={handlePapirStateChange}>
		<div in:typewriter={{ speed: 50 }}>
			<Scene prefix={"int."} where={"train car"} when={"future"} />
		</div>
		<Action value={loremIpsum("user").slice(0, -1) + "."} />
		{#each $pre as message, i}
			<Dialogue
				role={dial1(message.role)}
				parenthetical={message.parenthetical}
				markdown={message.content} />
			{#if i == 0}
				<Action>
					<p class:isArtefact={true}>
						The margin may contains artefacts, and is how users interact with the environment.
					</p>
					<aside slot="right">
						<Artefact
							icon={thinkIcon}
							url="https://appar.at/dW7ve232/1dkw2h"
							id="think-artefact"
							papirId="main-papir"
							size={50}
							alt="Think artefact"
							on:hover={() => console.log("hover")}
							on:peak={() => console.log("peak")}
							on:reveal={handleArtefactReveal} />
					</aside>
				</Action>
			{/if}

			{#if i == 2 && invited != false}
				<Transition>
					{#key invited}
						<p in:typewriter={{ speed: 50, prefill: true }}>
							{#if invited == undefined}
								invite <b>{dial2()}</b>
								?
							{:else if invited}
								enter {dial2()}:
							{/if}
						</p>
					{/key}
					<aside slot="right">
						<p>
							{#if invited == undefined}
								<a href="#yes" on:click={() => (invited = true)}>YES</a>
								<a href="#no" on:click={() => (invited = false)}>NO</a>
							{/if}
						</p>
					</aside>
				</Transition>
			{/if}
		{/each}
		{#if invited}
			<div in:fade={{ duration: 200 }}>
				<Dialogue
					markdown={"I will be trying to perform a very complex calculation on the data—"}
					cont>
					<span slot="role">{dial2()}</span>
				</Dialogue>
				<Dialogue markdown={"Processing input..."}>
					<span slot="parenthetical">(thinking)</span>
				</Dialogue>
			</div>
		{/if}
		{#each $post as message, i}
			<div in:fly={{ y: 20, duration: 200 }}>
				<Dialogue role={message.role} markdown={message.content} parenthetical={"demo"} />
			</div>
		{/each}
		{#if invited !== undefined}
			{#key tail}
				<div in:fade={{ duration: 200, delay: 200 }}>
					<Dialogue
						role={$tail.role}
						bind:markdown={$tail.content}
						on:shutter={() => (listening = true)}
						prompt={!listening} />
				</div>
			{/key}
		{/if}
		<div slot="artifacts">
			{#if mainPapirState.isOpen && !isHovered}
				<Papir id="secondary-papir" on:papirStateChange={handlePapirStateChange}>
					<div class="secondary-content">
						<Scene prefix={"int."} where={"secondary view"} when={"now"} />
						<Action>
							<p class:isArtefact={true}>
								This is additional content that appears after the hinge effect.
							</p>
							<aside slot="right">
								<Artefact
									icon={thinkIcon}
									url="https://appar.at/dW7ve232/1dkw2h"
									id="think-artefact"
									papirId="secondary-papir"
									size={50}
									alt="Think artefact"
									on:hover={() => console.log("hover")}
									on:peak={() => console.log("peak")}
									on:reveal={handleArtefactReveal} />
							</aside>
						</Action>
					</div>
				</Papir>
			{/if}
		</div>
	</Papir>

	{#if mainPapirState.isOpen && !isHovered}
		<!-- <Papir 

	id="secondary-papir"
	on:papirStateChange={handlePapirStateChange}
>
	<div class="secondary-content">
		<Scene prefix={"int."} where={"secondary view"} when={"now"} />
		<Action>
			<p>This is additional content that appears after the hinge effect.</p>
		</Action>
	</div>
</Papir> -->
	{/if}
	<!-- </div> -->
{/if}

<style global lang="scss">
	:root {
		--print: "IBM Plex Mono", monospace;
		--print-size: 12px;
		--sheet-width: 55vw;
		--sheet-horizontal-padding: 0px;
		--dialogue-width: 80%;
		--leftband-width: 0px;
		--rightband-width: 100px;
		--band-gap: 5rem;

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

		@media (max-width: 1440px) {
			--sheet-width: 75vw;
		}

		@media (max-width: 1200px) {
			--sheet-width: 85vw;
		}

		@media (max-width: 1024px) {
			--sheet-width: 95vw;
		}

		@media print {
			--sheet-width: 50vw;
			--sheet-horizontal-padding: 0;
		}

		@media (max-width: 768px) {
			--sheet-width: 100vw;
			--sheet-horizontal-padding: 0;
			--band-gap: 0.5rem;
			--dialogue-width: 100%;
		}
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
	}

	.print-icon {
		display: none;
	}

	p {
		&.isArtefact {
			@media (max-width: 768px) {
				padding-right: 50px;
			}
		}
	}

	@media print {
		.default-icon {
			display: none;
		}
		.print-icon {
			display: block;
		}
	}

	.papir-container {
		display: flex;
		width: 100%;
		height: 100vh;
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
</style>
