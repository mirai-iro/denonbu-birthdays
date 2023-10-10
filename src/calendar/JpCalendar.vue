<script setup lang="ts">
import { computed } from 'vue'

import { YmdValue, getDateByYearMonthDay } from './DateUtils'
import { JA_WDAYS, getYmdValue, shiftYearMonth, getDateText } from './DateUtils'
import { JP_HOLIDAY_MARK, getJpHolidaysByYearMonth } from './JpHolidays'
import { CalendarEvent } from './CalendarEvent'

import Calendar from './Calendar.vue'

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
	isShowHoliday?: boolean
	highlightDateSet?: Set<YmdValue>
	dateCalendarEventsMap?: Map<YmdValue, CalendarEvent[]>
	summaryText?: string
}>()

const wdays = computed(() => {
	return props.wdays || JA_WDAYS
})

const affectGetDateText = computed(() => {
	return props.getDateText || getDateText
})

const holidayMap = computed(() => {
	const workHolidayMap = new Map<YmdValue, CalendarEvent>()
	const targetYearMonthList = [
		shiftYearMonth(props.year, props.month, -1),
		[props.year, props.month],
		shiftYearMonth(props.year, props.month, +1),
	]
	for (let [workYear, workMonth] of targetYearMonthList) {
		const jpHolidays = getJpHolidaysByYearMonth(workYear, workMonth)
		for (let entry of jpHolidays) {
			const ymdValue = getYmdValue(entry.year, entry.month, entry.day)
			const date = getDateByYearMonthDay(entry.year, entry.month, entry.day)
			workHolidayMap.set(ymdValue, {
				id: ymdValue,
				subject: entry.text,
				started_at: date,
				ended_at: (new Date(date.getTime() + 86400000)),
				mark: JP_HOLIDAY_MARK,
			})
		}
	}
	return workHolidayMap
})

const affectHolidayMap = computed(() => {
	return (props.isShowHoliday) ? holidayMap.value : (new Map<YmdValue, CalendarEvent>())
})

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
	<Calendar
		:year="props.year"
		:month="props.month"
		:wdays="wdays"
		:start-wday="props.startWday"
		:get-date-text="affectGetDateText"
		:is-show-last-and-next="props.isShowLastAndNext"
		:holiday-map="affectHolidayMap"
		:highlight-date-set="props.highlightDateSet"
		:date-calendar-events-map="props.dateCalendarEventsMap"
		:summaryText="calendarSummaryText"
		@select-date="handleSelectDate"
		@select-calendar-event="handleSelectCalendarEvent"
	/>
</template>
