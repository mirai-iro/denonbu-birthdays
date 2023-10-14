import { createRouter, createWebHistory } from 'vue-router'

import UpcomingPage from './pages/Upcoming.vue'
import CalendarPage from './pages/Calendar.vue'
import ListPage from './pages/List.vue'

const BASE_URL = '/denonbu-birthdays/'

export default createRouter({
	history: createWebHistory(BASE_URL),
	routes: [
		{
			name: 'calendar',
			path: '/calendar',
			component: CalendarPage,
		},
		{
			name: 'list',
			path: '/list',
			component: ListPage,
		},
		{
		},
		{
			name: 'upcoming',
			path: '/:pathMatch(.*)*',
			component: UpcomingPage,
		},
	],
})
