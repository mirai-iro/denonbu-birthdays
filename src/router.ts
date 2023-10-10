import { createRouter, createWebHistory } from 'vue-router'

import UpcomingPage from './pages/Upcoming.vue'
import CalendarPage from './pages/Calendar.vue'
import ListPage from './pages/List.vue'
import BookmarkPage from './pages/Bookmark.vue'

export default createRouter({
	history: createWebHistory(),
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
			name: 'bookmark',
			path: '/bookmark',
			component: BookmarkPage,
		},
		{
			name: 'upcoming',
			path: '/:pathMatch(.*)*',
			component: UpcomingPage,
		},
	],
})
