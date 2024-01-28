import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
// import sri from '@small-tech/vite-plugin-sri';
import manifestSri from 'vite-plugin-manifest-sri';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';


export default defineConfig({
	plugins: [
		preact(), 
		cssInjectedByJsPlugin(),
		// sri(),
		manifestSri()
	],
	build: {
		manifest: true,
		rollupOptions: {
			output: {
				manualChunks: undefined,
				entryFileNames: `embed.js`,
				chunkFileNames: `embed.js`,
				assetFileNames: `[name].[ext]`
			},
		},
	},
});
