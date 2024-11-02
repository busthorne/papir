export const typewriter = (node: HTMLElement, { speed = 50 }) => {
	const targets = flattext(node);
	if (!targets) {
		throw new Error(`This transition only works on elements with text nodes`);
	}
	let totalLength = 0;
	const ranges = targets.map(textNode => {
		if (!textNode.textContent) {
			return undefined;
		}
		const range = [totalLength, totalLength + textNode.textContent.length];
		totalLength += textNode.textContent.length;
		const text = textNode.textContent;
		textNode.textContent = '';
		return { textNode, range, text };
	});
	let currentRangeIndex = 0;
	const getCurrentRange = (i: number) => {
		while (ranges[currentRangeIndex].range[1] < i && currentRangeIndex < ranges.length) {
			const { textNode, text } = ranges[currentRangeIndex];
			textNode.textContent = text;		// finish typing up the last node
			currentRangeIndex++;
		}
		return ranges[currentRangeIndex];
	}
	const duration = totalLength * speed;
	return {
		duration,
		tick: (t) => {
			const progress = ~~(totalLength * t);
			const { textNode, range, text } = getCurrentRange(progress);
			const [start, end] = range;
			const textLength = ((progress - start) / (end - start)) * text.length;
			textNode.textContent = text.slice(0, textLength);
		},
	};
}

const flattext = (node: Node): Text[] => {
	if (node.nodeType === Node.TEXT_NODE) {
		return [node as Text];
	}
	if (!node.hasChildNodes()) {
		return [];
	}
	const texts: Text[] = [];
	node.childNodes.forEach(child =>
		flattext(child).forEach(text => texts.push(text)));
	return texts;
}
