export default function uninstall() {
	// unregister service worker
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.getRegistrations().then((registrations) => {
			for (let registration of registrations) {
				registration.unregister()
			}
		})
	}
	// clear cache storage
	if ('caches' in window) {
		window.caches.keys().then((cacheKeys) => {
			for (let cacheKey of cacheKeys) {
				window.caches.delete(cacheKey)
			}
		})
	}
	// clear indexedDB
	if ('indexedDB' in window) {
		if ('databases' in window.indexedDB) {
			window.indexedDB.databases().then((idbInfoList) => {
				for (let idbInfo of idbInfoList) {
					if (idbInfo.name) {
						window.indexedDB.deleteDatabase(idbInfo.name)
					}
				}
			})
		} else {
			// @ts-ignore
			window.indexedDB.deleteDatabase('workbox-expiration')
		}
	}
	// clear local storage
	if ('localStorage' in window) {
		window.localStorage.clear()
	}
	if ('sessionStorage' in window) {
		window.sessionStorage.clear()
	}
}
