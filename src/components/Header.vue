<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import type { AppConfig } from '../app_config'

const props = defineProps<{
	appConfig: AppConfig
}>()

const emits = defineEmits([
	'open-config-modal',
])

const route = useRoute()

const isActiveUpcoming = computed(() => {
	return (route.name === 'upcoming') ? 'active' : ''
})
const isActiveCalendar = computed(() => {
	return (route.name === 'calendar') ? 'active' : ''
})
const isActiveList = computed(() => {
	return (route.name === 'list') ? 'active' : ''
})
const isActiveBookmark = computed(() => {
	return (route.name === 'bookmark') ? 'active' : ''
})

function handleClickConfig() {
	emits('open-config-modal')
}
</script>

<template>
	<header class="sticky-top bg-body">
		<nav class="navbar bg-body-tertiary mb-2">
			<div class="container-fluid">
				<div class="navbar-brand">
					<h1 class="fs-5 m-0">電音部 誕生日カレンダー</h1>
				</div>
				<div class="ms-auto">
					<button class="btn btn-sm btn-outline-secondary" @click="handleClickConfig">設定</button>
				</div>
			</div>
		</nav>
		<div class="container-fluid">
			<ul class="nav nav-pills nav-justified">
				<li class="nav-item text-nowrap mx-1"><RouterLink to="/" :class="`h-100 nav-link ${isActiveUpcoming}`">もうすぐ</RouterLink></li>
				<li class="nav-item text-nowrap mx-1"><RouterLink to="/calendar" :class="`h-100 nav-link ${isActiveCalendar}`">カレンダー</RouterLink></li>
				<li class="nav-item text-nowrap mx-1"><RouterLink to="/list" :class="`h-100 nav-link ${isActiveList}`">リスト</RouterLink></li>
				<template v-if="props.appConfig.enableBookmark">
					<li class="nav-item text-nowrap mx-1"><RouterLink to="/bookmark" :class="`h-100 nav-link ${isActiveBookmark}`">お気に入り</RouterLink></li>
				</template>
			</ul>
		</div>
	</header>
</template>
