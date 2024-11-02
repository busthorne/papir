<script lang="ts">
	import { Papir, Dialogue, Scene, Action, Transition, Buffer } from "./lib";

	import { onMount } from "svelte";
	import { fade, fly } from "svelte/transition";
	import { cubicIn } from "svelte/easing";
	import "@ibm/plex/css/ibm-plex.css";
	import { demo, loremIpsum } from "./mock";
	import { script, improv } from "./stores";
	import type { Message } from "./types";
	import { typewriter } from "./lib/typewriter";

	import { RiShapesFill } from "svelte-remixicon";

	const empty = (role: string): Message => ({
		role: role,
		content: "",
		parenthetical: "",
	});
	let messages = script(demo(3));
	let tail = improv(empty("user"));

	let mounted = false;
	onMount(() => {
		mounted = true;
	});

	let invited = undefined;

	const dial =
		(user: string, assistant: string) =>
		(role = "assistant") =>
			role == "assistant" ? assistant : user;
	const dial1 = dial("user", "agent #1");
	const dial2 = dial("user", "agent #2");
</script>

{#if mounted}
	<Papir>
		<div in:typewriter={{ speed: 50 }}>
			<Scene prefix={"int."} where={"train car"} when={"future"} />
		</div>
		<Action value={loremIpsum("user").slice(0, -1) + "."} />
		{#each $messages as message, i}
			<Dialogue
				role={dial1(message.role)}
				parenthetical={message.parenthetical}
				markdown={message.content} />
			{#if i == 0}
				<Action>
					<p>The items</p>
					<aside slot="right">
						<p>
							<RiShapesFill size={"24px"} />
						</p>
					</aside>
				</Action>
			{/if}
			{#if i == 2 && invited != false}
				<Transition>
					{#key invited}
						<p in:typewriter={{ speed: 50 }}>
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
			<div in:fade={{ duration: 100 }}>
				<Dialogue
					markdown={"I will be trying to perform a very complex calculation on the data—"}
					cont>
					<span slot="role" in:fade={{ duration: 100 }}>{dial2()}</span>
				</Dialogue>
				<Dialogue markdown={"Processing input..."}>
					<span slot="parenthetical">(thinking)</span>
				</Dialogue>
			</div>
		{/if}
		{#if invited !== undefined}
			<Dialogue prompt role={"user"} markdown={$tail.content} />
		{/if}
	</Papir>
{/if}

<style global lang="scss">
	:root {
		--print: "IBM Plex Mono", monospace;
		--print-size: 12px;
		--sheet-width: 55vw;
		--dialogue-width: 20vw;
		--leftband-width: 0;
		--rightband-width: 10vw;
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
		margin-bottom: 50rem !important;
	}
	.papir {
		padding-top: 2rem;
	}
</style>
