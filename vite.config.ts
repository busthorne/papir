import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
	plugins: [svelte({
    emitCss: true
  })],
	build: {
		lib: {
			entry: './src/lib/index.ts',
			name: 'papir',
			fileName: 'index',
			formats: ['es', 'cjs']
		},
		rollupOptions: {
			external: ['svelte', 'svelte/internal'],
			output: {
				globals: {
					svelte: 'Svelte'
				}
			}
		}
	}
})