import { createRouter, createWebHistory } from 'vue-router'

// import UpcomingPage from './pages/Upcoming.vue'
import CalendarPage from './pages/Calendar.vue'
import ListPage from './pages/List.vue'

const BASE_URL = '/denonbu-birthdays/'

export default createRouter({
	history: createWebHistory(BASE_URL),
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
