import fs from 'fs'

import { defineConfig, splitVendorChunkPlugin } from 'vite'
import vue from '@vitejs/plugin-vue'

import type { VitePWAOptions } from 'vite-plugin-pwa'
import { VitePWA } from 'vite-plugin-pwa'

import replace from '@rollup/plugin-replace'

const webManifestJson = fs.readFileSync('./src/manifest.json')
const webManifest = JSON.parse(webManifestJson.toString())

import BASE_PATH from './src/base_path'

//----------------------------------------

const pwaOptions: Partial<VitePWAOptions> = {
	base: BASE_PATH,
	manifest: webManifest,
	injectRegister: 'inline',
	includeAssets: [
		// 'favicon.svg',
	],
	workbox: {

	},
	devOptions: {
		enabled: (process.env.NODE_ENV === 'development'),
		type: 'module',
		navigateFallback: 'index.html',
	},
}

// const currentDate = new Date()
const replaceValues = {
	// __BUILD_TIMESTAMP__: Math.floor(currentDate.getTime() / 1000).toString(),
	__BASE_PATH__: BASE_PATH,
	__PUBLIC_URL_ROOT__: `https://mirai-iro.github.io${BASE_PATH}`.replace(/\/$/, ''),
}

function toKebabCase(camelCaseOrPascalCase: string): string {
	return camelCaseOrPascalCase.replace(/^([A-Z])/, (p1) => p1.toLowerCase())
		.replace(/([A-Z])/g, (p1) => `-${p1.toLowerCase()}`)
		.replace(/-{2,}/g, '-')
}

export default defineConfig({
	base: BASE_PATH,
	build: {
		sourcemap: (process.env.SOURCE_MAP === 'true'),
		rollupOptions: {
			output: {
				manualChunks(id) {
					const matches = id.match(/\/pages\/(.+)\.vue$/)
					if (matches) {
						return 'pages/' + toKebabCase(matches[1])
					}
					if (id.endsWith('/jp_holidays.json')) {
						return 'jp_holidays_data'
					}
					if (id.endsWith('.json')) {
						return 'master_data'
					}
				},
				globals: {
					bootstrap: 'bootstrap',
				},
			},
		},
	},
	plugins: [
		splitVendorChunkPlugin(),
		vue(),
		VitePWA(pwaOptions),
		replace({
			values: replaceValues,
			preventAssignment: true,
		}),
	],
})
