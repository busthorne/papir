<script lang="ts">
	import Buffer from "./Buffer.svelte";

	export let role = "";
	export let parenthetical = "";
	export let markdown = "";
	export let prompt = false;
	export let cont = false;
	export let id: string = "";
</script>

<section class="dialogue" class:prompt class:cont {id}>
	<article>
		<div class="role" {role}>
			<slot name="role">
				{#if role}{role}{/if}
			</slot>
		</div>
		<div class="parenthetical" class:noMargin={!parenthetical}>
			<slot name="parenthetical">
				{#if parenthetical}({parenthetical}){/if}
			</slot>
		</div>
		<div class="line">
			<slot name="buffer">
				<Buffer {markdown} {prompt} on:shutter />
			</slot>
		</div>
	</article>
	<slot name="right" />
</section>

<style lang="scss">
	.dialogue {
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
		font-weight: 700;
		text-transform: uppercase;
		font-size: var(--print-size);
		padding-left: 10rem;

		@media (max-width: 768px) {
			font-size: 14px;
			line-height: 18px;
		}
	}

	.parenthetical {
		grid-column: dialogue;
		color: #666;
		padding-left: 7rem;
		font-size: var(--print-size);
		line-height: 19px;

		&.noMargin {
			margin: 0;
		}

		@media (max-width: 768px) {
			font-size: 12px;
			line-height: 16px;
		}
	}

	.line {
		margin-top: 14px;
		grid-column: dialogue;
		.prompt & {
			border-radius: 4px;
			// top, bottom, left, right
			background:
				linear-gradient(90deg, var(--border-color) 50%, transparent 50%) repeat-x,
				linear-gradient(90deg, var(--border-color) 50%, transparent 50%) repeat-x 0 100%,
				linear-gradient(0deg, var(--border-color) 50%, transparent 50%) repeat-y,
				linear-gradient(0deg, var(--border-color) 50%, transparent 50%) repeat-y 100% 0;
			background-size:
				15px 1px,
				15px 1px,
				1px 15px,
				1px 15px;
		}
	}
</style>
