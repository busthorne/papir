import { writable } from "svelte/store";
import type { Message } from "./types";
import { tweened } from 'svelte/motion';
import { expoInOut, quadInOut } from "svelte/easing";

const flipFlop = () => {
	const { subscribe, set } = writable(false);
	return {
		subscribe,
		start: () => set(true),
		stop: () => set(false),
	};
};
export const listening = flipFlop();

export const improv = (m: Message) => {
	const { subscribe, set, update } = writable(m);
	return {
		subscribe,
		set,
		update,
		append: (chunk: string) => update((m) => ({ ...m, content: m.content + chunk })),
	};
};

export const script = (messages: Message[]) => {
	const { subscribe, update, set } = writable<Message[]>(messages);

	return {
		subscribe,
		set,
		append: (line: Message) => {
			update((lines) => [...lines, line]);
			return line;
		},
	};
};

export const isOpen = writable(false);
export const scrollLeft = tweened(0, { duration: 1000, easing: quadInOut, delay: 0 });
// Функція для керування станом
export function toggleOpen(value: boolean) {
	isOpen.set(value);
	const max = window.innerWidth * 2;
	scrollLeft.set(value ? max : 0);
}