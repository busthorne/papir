export interface Message {
	role: string;
	content: string;
	parenthetical?: string;
	error?: string;
}
