<script lang="ts">
	import type { Message } from "./types";

	import { Papir, Dialogue, Scene, Action, Transition, Artefact } from "./lib";
	import { papirStore, dispatchPapirEvent } from "./lib/stores/papir";
	import { onMount } from "svelte";
	import { fade, fly } from "svelte/transition";
	import { demo, loremIpsum } from "./mock";
	import { script, improv } from "./stores";
	import { typewriter } from "./lib/typewriter";

	import "@ibm/plex/css/ibm-plex.css";
	import thinkIcon from "./lib/components/artefacts/assets/think_artefact.png";

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
	async function send(e: CustomEvent) {
		const prompt = e.detail.markdown;
		if (prompt === "") return e.preventDefault();
		console.log(prompt);
		tail.update((p) => ({ ...p, content: prompt }));
		post.append($tail);
		listening = true;
		tail = improv(empty("assistant"));
		await simulateTyping();
		post.append($tail);
		tail = improv(empty("user"));
		listening = false;
	}

	let listening = false;
</script>

{#if mounted}
	<Papir id="main-papir" on:papirStateChange={handlePapirStateChange}>
		<div in:typewriter={{ speed: 50 }}>
			<Scene prefix={"int."} where={"train car"} when={"future"} />
		</div>
		<Action>
			<p>{loremIpsum("user").slice(0, -1) + "."}</p>
			<p class:isArtefact={true}>{loremIpsum("user").slice(0, -1) + "."}</p>
			<p>{loremIpsum("user").slice(0, -1) + "."}</p>
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
		{#each $pre as message, i}
			<Dialogue
				role={dial1(message.role)}
				parenthetical={message.parenthetical}
				markdown={message.content} />
			{#if i == 0}
				<Action id="action-01">
					<p>
						The margin may contains artefacts, and is how users interact with the environment in a
						meaningful way.
					</p>
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
						<p class="invite">
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
						markdown={$tail.content}
						on:shutter={send}
						prompt={!listening} />
				</div>
			{/key}
		{/if}
		<div slot="artifacts">
			<!-- <Papir id="secondary-papir"> -->
			<div class="secondary-content">
				<Scene prefix={"int."} where={"secondary view"} when={"now"} />
				<Action>
					<p class:isArtefact={true}>
						This is additional content that appears after the hinge effect.
						{loremIpsum("assistant")}
					</p>
				</Action>
			</div>
			<!-- </Papir> -->
		</div>
	</Papir>

	{#if mainPapirState.isOpen && !isHovered}
		<Papir id="secondary-papir" on:papirStateChange={handlePapirStateChange}>
			<div class="secondary-content">
				<Scene prefix={"int."} where={"secondary view"} when={"now"} />
				<Action>
					<p>This is additional content that appears after the hinge effect.</p>
				</Action>
			</div>
		</Papir>
	{/if}
{/if}

<style global lang="scss">
	.invite {
		display: flex;
		gap: 1rem;
	}
</style>
