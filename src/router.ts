import { createRouter, createWebHistory } from 'vue-router'

import BASE_PATH from './base_path'

// import UpcomingPage from './pages/Upcoming.vue'
import CalendarPage from './pages/Calendar.vue'
import ListPage from './pages/List.vue'

export default createRouter({
	history: createWebHistory(BASE_PATH),
	routes: [
		{
			name: 'list',
			path: '/list',
			component: ListPage,
		},
		{
			name: 'calendar',
			// path: '/calendar',
			path: '/:pathMatch(.*)*',
			component: CalendarPage,
		},
		/*
		{
			name: 'upcoming',
			path: '/:pathMatch(.*)*',
			component: UpcomingPage,
		},
		*/
	],
})
