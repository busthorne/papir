<script lang="ts">
	import type { Plugin, KeyboardShortcut } from "carta-md";
	import { Carta, Markdown, MarkdownEditor } from "carta-md";
	import { math } from '@cartamd/plugin-math';
	import { code } from '@cartamd/plugin-code';
	import DOMPurify from "isomorphic-dompurify";
	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();

	const enter: KeyboardShortcut = {
		id: "newline",
		combination: new Set(["shift", "enter"]),
		action: (input) => {
			input.insertAt(input.getCursorXY().right, "\n");
			input.update();
		},
	};
	const shiftEnter: KeyboardShortcut = {
		id: "submit",
		combination: new Set(["enter"]),
		action: (input) => dispatch("shutter", {}),
	};

	const shortcuts = (): Plugin => {
		return {
			shortcuts: [enter, shiftEnter],
		};
	};

	const carta = new Carta({
		sanitizer: DOMPurify.sanitize,
		disablePrefixes: true,
		disableTabOuts: true,
		extensions: [shortcuts(), math(), code()],
	});

	export let markdown: string = "";
	export let placeholder = "";
	export let prompt = false;
</script>

<div class="buffer" class:prompt>
	{#if prompt}
		<MarkdownEditor
			{carta}
			bind:value={markdown}
			mode={"tabs"}
			{placeholder}
			selectedTab={"write"}
			textarea={{ autoFocus: prompt }}
			disableToolbar />
	{:else}
		{#key markdown}
			<Markdown {carta} value={markdown} />
		{/key}
	{/if}
</div>

<style lang="scss">
	.buffer {
		flex: 1;
		min-width: 0;
		height: 100%;
		box-sizing: border-box;
		&.prompt {
			opacity: 1;
			background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.05));
		}
		&::selection {
			background: var(--selection-color);
		}

		:global {
			.carta-font-code {
				font-family: var(--print);
				font-size: var(--print-size);
			}
			.carta-wrapper {
				padding: 0 1rem 0 1rem;
			}
			.carta-container > * {
				margin: 1.7rem 0 1.4rem 0;
			}
			.carta-input {
				caret-color: var(--caret-color);
				::placeholder {
					color: var(--border-color);
				}
				&,
				.carta-renderer {
					overflow-y: hidden;
				}
				& > pre {
					background: inherit;
				}
			}
		}
	}
</style>
