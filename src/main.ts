import { createApp } from 'vue'

import AppRoot from './AppRoot.vue'

import router from './router'

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.getRegistrations().then((registrations) => {
		for (let registration of registrations) {
			if (registration.waiting) {
				registration.waiting.postMessage({ type: 'SKIP_WAITING' })
			}
			registration.update()
		}
	})
}

createApp(AppRoot).use(router).mount('#app-container')
