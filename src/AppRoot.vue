<script setup lang="ts">
import { onMounted, onUnmounted, ref, provide, watch } from 'vue'
import type { Ref } from 'vue'

import type { BirthdayEntry } from './birthdays/BirthdaysMaster'
import { birthdays_master } from './birthdays/BirthdaysMaster'
import { brands_master } from './birthdays/BrandsMaster'

import Header from './components/Header.vue'
import ConfigModal from './components/ConfigModal.vue'
import BirthdayDetailModal from './components/BirthdayDetailModal.vue'

import type { AppConfig } from './app_config'
import appConfigDefaultValue from './app_config'
const appConfig: AppConfig = {
	...appConfigDefaultValue,
	startDate: new Date('2020-06-28'),
	upcomingDays: 45,
	brandsTitle: 'エリア',
	enableBrandsBadge: true,
	enableBookmark: false,
	detailNotes: '※「パーソナルカラー」は、ASOBISTAGEの「アソビライト」に設定されている色です。',
}

const currentDate = new Date()
const currentYear = ref(currentDate.getFullYear())
const currentMonth = ref(currentDate.getMonth() + 1)
const currentDay = ref(currentDate.getDate())

const bsColorMode = ref('auto')
function handleChangeColorMode() {
	let affectBsColorMode = bsColorMode.value || 'auto'
	if (affectBsColorMode === 'auto') {
		affectBsColorMode = (window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light'
	}
	document.documentElement.dataset.bsTheme = affectBsColorMode
}
const bsColorModeStorageKey = 'color-mode'
onMounted(() => {
	bsColorMode.value = window.localStorage.getItem(bsColorModeStorageKey) || 'auto'
	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
		handleChangeColorMode()
	})
	handleChangeColorMode()
})
watch(bsColorMode, () => {
	window.localStorage.setItem(bsColorModeStorageKey, bsColorMode.value)
	handleChangeColorMode()
})

const startWdayOnCalendar = ref(1)
const isShowLastAndNextOnCalendar = ref(true)
const isShowJpHolidayOnCalendar = ref(true)
onMounted(() => {
	startWdayOnCalendar.value = parseInt(window.localStorage.getItem('start-wday-on-calendar') || '1');
	isShowLastAndNextOnCalendar.value = (window.localStorage.getItem('is-show-last-and-next-on-calendar') != 'false');
	isShowJpHolidayOnCalendar.value = (window.localStorage.getItem('is-show-jp-holiday-on-calendar') != 'false');
})
watch(startWdayOnCalendar, () => {
	window.localStorage.setItem('start-wday-on-calendar', startWdayOnCalendar.value.toString());
})
watch(isShowLastAndNextOnCalendar, () => {
	window.localStorage.setItem('is-show-last-and-next-on-calendar', isShowLastAndNextOnCalendar.value.toString());
})
watch(isShowJpHolidayOnCalendar, () => {
	window.localStorage.setItem('is-show-jp-holiday-on-calendar', isShowJpHolidayOnCalendar.value.toString());
})
provide('birthdays.config.startWdayOnCalendar', startWdayOnCalendar)
provide('birthdays.config.isShowLastAndNextOnCalendar', isShowLastAndNextOnCalendar)
provide('birthdays.config.isShowJpHolidayOnCalendar', isShowJpHolidayOnCalendar)

let timerHandler = setTimeout(() => { /* noop */ }, 60000)
onMounted(() => {
	const checkUpdateCurrentDate = () => {
		const currentDate = new Date()
		currentYear.value = currentDate.getFullYear()
		currentMonth.value = currentDate.getMonth() + 1
		currentDay.value = currentDate.getDate()

		clearTimeout(timerHandler)
		const nextTick = (60 - currentDate.getSeconds()) * 1000
		timerHandler = setTimeout(checkUpdateCurrentDate, nextTick)
	}
	checkUpdateCurrentDate()
})
onUnmounted(() => {
	clearTimeout(timerHandler)
})

const configModal = ref()
function handleOpenConfigModal() {
	if (configModal.value) {
		const configModalContainer = configModal.value.modal as HTMLElement
		// @ts-ignore
		window.bootstrap.Modal.getOrCreateInstance(configModalContainer).show();
	}
}

const birthdayDetailModal = ref()
const birthdayDetailTargetEntry: Ref<BirthdayEntry | undefined> = ref()
function handleSelectBirthday(birthdaysMasterId: number) {
	if (birthdays_master.has(birthdaysMasterId)) {
		birthdayDetailTargetEntry.value = birthdays_master.get(birthdaysMasterId)
		if (birthdayDetailModal.value) {
			const birthdayModalContainer = birthdayDetailModal.value.modal as HTMLElement
			// @ts-ignore
			window.bootstrap.Modal.getOrCreateInstance(birthdayModalContainer).show();
		}
	}
}

const birthdays_month_day_ids_map = new Map<number, Map<number, number[]>>()
for (let entry of birthdays_master.values()) {
	const birthdays_day_ids_map = birthdays_month_day_ids_map.get(entry.month) || new Map<number, number[]>()
	const birthdays_ids = birthdays_day_ids_map.get(entry.day) || []
	birthdays_ids.push(entry.id)
	birthdays_day_ids_map.set(entry.day, birthdays_ids)
	birthdays_month_day_ids_map.set(entry.month, birthdays_day_ids_map)
}
</script>

<template>
	<Header
		:app-config="appConfig"
		@open-config-modal="handleOpenConfigModal"
	/>
	<main class="container-fluid">
		<RouterView
			:app-config="appConfig"
			:color-mode="bsColorMode"
			:current-year="currentYear"
			:current-month="currentMonth"
			:current-day="currentDay"
			:birthdays-master="birthdays_master"
			:birthdays-month-day-ids-map="birthdays_month_day_ids_map"
			:brands-master="brands_master"
			@select-birthday="handleSelectBirthday"
		/>
	</main>
	<Teleport to="body">
		<ConfigModal ref="configModal"
			:app-config="appConfig"
			v-model:colorMode="bsColorMode"
			v-model:start-wday-on-calendar="startWdayOnCalendar"
			v-model:is-show-last-and-next-on-calendar="isShowLastAndNextOnCalendar"
			v-model:is-show-jp-holiday-on-calendar="isShowJpHolidayOnCalendar"
		/>
		<BirthdayDetailModal ref="birthdayDetailModal"
			:app-config="appConfig"
			:color-mode="bsColorMode"
			:birthday-entry="birthdayDetailTargetEntry"
			:brands-master="brands_master"
		/>
	</Teleport>
</template>
