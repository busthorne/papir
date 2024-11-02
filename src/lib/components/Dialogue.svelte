<script lang="ts">
	import Buffer from "./Buffer.svelte";

	export let role = "";
	export let parenthetical = "";
	export let markdown = "";
	export let prompt = false;
	export let cont = false;
</script>

<section class="dialogue" class:prompt class:cont>
	<article>
		<div class="role" {role}>
			<slot name="role">
				{#if role}{role}{/if}
			</slot>
		</div>
		<div class="parenthetical">
			<slot name="parenthetical">
				{#if parenthetical}({parenthetical}){/if}
			</slot>
		</div>
		<div class="line">
			<slot name="buffer">
				<Buffer bind:markdown {prompt} on:shutter />
			</slot>
		</div>
	</article>
	<slot name="right" />
</section>

<style lang="scss">
	.dialogue-container {
		margin: 2rem 0;
	}
	article {
		display: grid;
		grid-template-columns:
			[leftside] 1fr
			[dialogue] minmax(auto, var(--dialogue-width))
			[rightside] 1fr;
		width: 100%;

		:global {
			.carta-viewer {
				p {
					margin: var(--print-size);
				}
				p:first-child {
					margin-top: 0;
				}
			}
		}
	}

	.role {
		grid-column: dialogue;
		font-weight: bold;
		text-transform: uppercase;
		font-size: 1.1rem;
		padding-left: 10rem;
		margin-bottom: 0.5rem;
	}

	.parenthetical {
		grid-column: dialogue;
		color: #666;
		padding-left: 7rem;
		margin-bottom: 0.5rem;
	}

	.line {
		grid-column: dialogue;
		.prompt & {
			border-radius: 4px;
			// top, bottom, left, right
			background:
				linear-gradient(90deg, var(--border-color) 50%, transparent 50%)
					repeat-x,
				linear-gradient(90deg, var(--border-color) 50%, transparent 50%)
					repeat-x 0 100%,
				linear-gradient(0deg, var(--border-color) 50%, transparent 50%) repeat-y,
				linear-gradient(0deg, var(--border-color) 50%, transparent 50%) repeat-y
					100% 0;
			background-size:
				15px 1px,
				15px 1px,
				1px 15px,
				1px 15px;
		}
	}
</style>
