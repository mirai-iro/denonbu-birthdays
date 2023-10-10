<script setup lang="ts">
import { computed, inject } from 'vue'
import type { Ref, ComputedRef } from 'vue'

import { getDateByYearMonth, getYmdValueByDate } from './DateUtils'
import type { YmdValue } from './DateUtils'
import type { CalendarEvent } from './CalendarEvent'
import type { CalendarDay } from './CalendarDay'

import CalendarBodyDay from './CalendarBodyDay.vue'

const emits = defineEmits([
	'select-date',
	'select-calendar-event',
])

const props = defineProps<{
	year: number
	month: number
	startWday: number

}>()

const holidayMap = inject('calendar.holidayMap') as Ref<Map<YmdValue, CalendarEvent>>
const highlightDateSet = inject('calendar.highlightDateSet') as Ref<Set<YmdValue>>
const dateCalendarEventsMap = inject('calendar.dateCalendarEventsMap') as ComputedRef<Map<YmdValue, CalendarEvent[]>>

const calendarTable = computed(() => {
	const workDate = getDateByYearMonth(props.year, props.month)
	const thisMonthIdx = workDate.getMonth()
	{
		const wday = workDate.getDay()
		let backToDay = wday - props.startWday
		if (backToDay < 0) {
			backToDay += 7
		}
		workDate.setTime(workDate.getTime() - (backToDay * 86400000))
	}

	const calendarTable = [] as CalendarDay[][]
	do {
		const weekDays = [] as CalendarDay[]
		for (let dayInWeek = 0; dayInWeek < 7; dayInWeek++) {
			const cellDate = new Date(workDate)
			const cellDateYmd = getYmdValueByDate(cellDate)
			weekDays.push({
				date: cellDate,
				isThisMonth: cellDate.getMonth() === thisMonthIdx,
				holiday: holidayMap.value.get(cellDateYmd),
				isHighlight: highlightDateSet.value.has(cellDateYmd),
				calendarEvents: dateCalendarEventsMap.value.get(cellDateYmd),
			})
			workDate.setTime(workDate.getTime() + 86400000)
		}
		calendarTable.push(weekDays)
	} while (workDate.getMonth() === thisMonthIdx)
	return calendarTable
})

function handleSelectDate(date: Date, element?: HTMLElement) {
	emits('select-date', date, element)
}

function handleSelectCalendarEvent(calendarEvent: CalendarEvent) {
	emits('select-calendar-event', calendarEvent)
}
</script>

<template>
	<tbody role="rowgroup">
		<tr v-for="(days, idx) in calendarTable" :key="`calendar-week-${idx}`" role="row">
			<template v-for="calendarDay in days" :key="calendarDay.date.toDateString()">
				<CalendarBodyDay
					:calendar-day="calendarDay"
					@select-date="handleSelectDate"
					@select-calendar-event="handleSelectCalendarEvent"
				/>
			</template>
		</tr>
	</tbody>
</template>
