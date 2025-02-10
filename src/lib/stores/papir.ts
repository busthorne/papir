import { writable } from "svelte/store";

export interface PapirState {
	id: string;
	isOpen: boolean;
	activeArtefact: string | null;
}

function createPapirStore() {
	const { subscribe, update } = writable<Record<string, PapirState>>({});

	return {
		subscribe,
		register: (id: string) => {
			update((states) => ({
				...states,
				[id]: { id, isOpen: false, activeArtefact: null },
			}));
		},
		unregister: (id: string) => {
			update((states) => {
				const newStates = { ...states };
				delete newStates[id];
				return newStates;
			});
		},
		toggleOpen: (id: string, value: boolean) => {
			update((states) => ({
				...states,
				[id]: { ...states[id], isOpen: value },
			}));
		},
		setActiveArtefact: (id: string, artefactId: string | null) => {
			update((states) => ({
				...states,
				[id]: { ...states[id], activeArtefact: artefactId },
			}));
		},
	};
}

export const papirStore = createPapirStore();

// Custom event dispatcher
export function dispatchPapirEvent(action: "open" | "close" | "hover", papirId: string) {
	window.dispatchEvent(
		new CustomEvent("papir-action", {
			detail: { action, papirId },
		}),
	);
}
