export const demo = (n = 4) => {
	return Array(n).fill(0).map((_, i) => {
		let role = (i % 2 == 0 ? 'user' : 'assistant');
		return {
			role,
			content: loremIpsum(role),
			parenthetical: Math.random() < 0.2 ? 'agitated' : ''
		}
	});
}

export const loremIpsum = (role: string) => {
	const lorem = [
		// Short (4-8 words)
		"Lorem ipsum dolor sit amet", "Consectetur adipiscing elit",
		"Sed do eiusmod tempor", "Ut labore et dolore magna aliqua",
		"Quis nostrud exercitation", "Duis aute irure dolor",
		"Excepteur sint occaecat", "Non proident sunt in culpa",
		"Commodo consequat velit", "Voluptate velit esse cillum",
		// Medium (12-15 words) 
		"Nulla facilisi morbi tempus iaculis urna id volutpat lacus laoreet non",
		"Egestas integer eget aliquet nibh praesent tristique magna sit amet purus",
		"Elementum tempus egestas sed sed risus pretium quam vulputate dignissim suspendisse",
		"Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac",
		// Long (25-30 words)
		"Amet consectetur adipiscing elit pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas integer eget aliquet nibh praesent",
	];

	const ipsum = (words_mean: number, stddev: number, paragraphs = false) => {
		const how_many = Math.max(10, Math.round(
			words_mean + stddev * (Math.random()
				+ Math.random()
				+ Math.random() - 1.5)
		));
		const words_at = lorem.map(s => s.split(' ').length);
		let opus = [];
		let wordcount = 0;
		// shuffle
		const L = [...lorem].sort(() => Math.random() - 0.5);
		for (let i = 0; wordcount < how_many; i++) {
			opus.push(L[i]);
			wordcount += words_at[i];
		}
		if (paragraphs) {
			const num_paragraphs = 1 + Math.round(3 * Math.random());
			const words_per_para = Math.ceil(opus.length / num_paragraphs);

			return opus
				.reduce((paras, word, i) => {
					const para_idx = Math.floor(i / words_per_para);
					if (!paras[para_idx]) paras[para_idx] = [];
					paras[para_idx].push(word);
					return paras;
				}, [] as string[][])
				.map(para => para.join('. '))
				.map(p => String(p[0]).toUpperCase() + p.slice(1))
				.join('.\n\n');
		}
		return opus.join('. ');
	};
	return role == 'user' ? ipsum(5, 10) + '?' : ipsum(10, 20, true) + '.';
}
