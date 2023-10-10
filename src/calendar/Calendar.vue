<script setup lang="ts">
import { computed, provide } from 'vue'

import type { YmdValue } from './DateUtils'
import { EN_WDAYS } from './DateUtils'
import type { CalendarEvent } from './CalendarEvent'

import CalendarHeader from './CalendarHeader.vue'
import CalendarBody from './CalendarBody.vue'

import './calendar.css'

const emits = defineEmits([
	'select-date',
	'select-calendar-event',
])

const props = defineProps<{
	year: number
	month: number
	wdays?: string[]
	startWday?: number
	getDateText?: Function
	isShowLastAndNext?: boolean
	holidayMap?: Map<YmdValue, CalendarEvent>
	highlightDateSet?: Set<YmdValue>
	dateCalendarEventsMap?: Map<YmdValue, CalendarEvent[]>
	summaryText?: string
}>()

const wdays = computed(() => {
	return props.wdays || EN_WDAYS
})
const startWday = computed(() => {
	return props.startWday ?? 1
})
const isShowLastAndNext = computed(() => {
	return !!(props.isShowLastAndNext)
})
const highlightDateSet = computed(() => {
	return props.highlightDateSet || (new Set<YmdValue>())
})
const holidayMap = computed(() => {
	return props.holidayMap || (new Map<YmdValue, CalendarEvent>())
})
const dateCalendarEventsMap = computed(() => {
	return props.dateCalendarEventsMap || (new Map<YmdValue, CalendarEvent[]>())
})

// provide('calendar.wdays', wdays)  // props経由
// provide('calendar.startWday', startWday)  // props経由
provide('calendar.getDateText', props.getDateText)
provide('calendar.isShowLastAndNext', isShowLastAndNext)
provide('calendar.holidayMap', holidayMap)
provide('calendar.highlightDateSet', highlightDateSet)
provide('calendar.dateCalendarEventsMap', dateCalendarEventsMap)

const calendarSummaryText = computed(() => {
	return props.summaryText || `${props.year}年${props.month}月のカレンダー`
})

function handleSelectDate(date: Date, element?: HTMLElement) {
	emits('select-date', date, element)
}

function handleSelectCalendarEvent(calendarEvent: CalendarEvent) {
	emits('select-calendar-event', calendarEvent)
}
</script>

<template>
	<table role="grid" class="table table-sm table-bordered w-100 m-0 text-break" :summary="calendarSummaryText" :title="calendarSummaryText">
		<CalendarHeader :wdays="wdays" :start-wday="startWday" />
		<CalendarBody
			:year="props.year"
			:month="props.month"
			:start-wday="startWday"
			@select-date="handleSelectDate"
			@select-calendar-event="handleSelectCalendarEvent"
		/>
	</table>
</template>
