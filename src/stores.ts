import { writable } from "svelte/store";
import type { Message } from "./types";
import { spring } from 'svelte/motion';

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
export const scrollLeft = spring(0, { stiffness: 0.25, damping: 1 });
// Функція для керування станом
export function toggleOpen(value: boolean) {
	isOpen.set(value);
	const max = window.innerWidth * 0.1;
	scrollLeft.set(value ? max : 0);
}