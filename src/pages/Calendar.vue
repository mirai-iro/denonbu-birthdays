<script setup lang="ts">
import type { Ref } from 'vue'
import { onMounted, computed, watch, inject, ref } from 'vue'

import type { YearMonthTuple, YmdValue } from '../calendar/DateUtils'
import { getDateText, getDaysOfMonth, getYearMonthDayTuple, getYearMonthValue, getYmdValue, getYmdValueByDate, shiftYearMonth } from '../calendar/DateUtils'
import { JP_HOLIDAY_MARK, getJpHolidayByDate } from '../calendar/JpHolidays'

import type { CalendarEvent } from '../calendar/CalendarEvent'
import CalendarEventLine from '../calendar/CalendarEventLine.vue'

import JpCalendar from '../calendar/JpCalendar.vue'
import CalendarNav from '../calendar/CalendarNav.vue'

import type { BirthdayEntry } from '../birthdays/BirthdaysMaster'
import type { BrandEntry } from '../birthdays/BrandsMaster'

import type { AppConfig } from '../app_config'

const props = defineProps<{
	appConfig: AppConfig
	colorMode: string
	currentYear: number
	currentMonth: number
	currentDay: number
	birthdaysMaster: Map<number, BirthdayEntry>
	birthdaysMonthDayIdsMap: Map<number, Map<number, number[]>>
	brandsMaster: Map<number, BrandEntry>
}>()

const emits = defineEmits([
	'select-date',
	'select-calendar-event',
	'select-birthday',
])

const headYearMonth = computed(() => {
	const [startYear, startMonth] = getYearMonthDayTuple(props.appConfig.startDate)
	return [startYear, startMonth] as YearMonthTuple
})
const tailYearMonth = computed(() => {
	return shiftYearMonth(props.currentYear, props.currentMonth, +12)
})
const highlightDateSet = computed(() => {
	return new Set<YmdValue>([getYmdValue(props.currentYear, props.currentMonth, props.currentDay)])
})

const startWday = inject('birthdays.config.startWdayOnCalendar') as Ref<number>
const isShowLastAndNext = inject('birthdays.config.isShowLastAndNextOnCalendar') as Ref<boolean>
const isShowJpHoliday = inject('birthdays.config.isShowJpHolidayOnCalendar') as Ref<boolean>

const year = ref(props.currentYear)
const month = ref(props.currentMonth)
onMounted(() => {
	year.value = parseInt(window.sessionStorage.getItem('calendar-year') || props.currentYear.toString());
	month.value = parseInt(window.sessionStorage.getItem('calendar-month') || props.currentMonth.toString());
})
watch(year, () => {
	window.sessionStorage.setItem('calendar-year', year.value.toString())
})
watch(month, () => {
	window.sessionStorage.setItem('calendar-month', month.value.toString())
})
const dateCalendarEventsMap = computed(() => {
	const dateCalendarEventsMap = new Map<YmdValue, CalendarEvent[]>()
	const targetYearMonthList = [
		shiftYearMonth(year.value, month.value, -1),
		[year.value, month.value],
		shiftYearMonth(year.value, month.value, +1),
	]
	for (let [workYear, workMonth] of targetYearMonthList) {
		const birthdaysDayIdsMap = props.birthdaysMonthDayIdsMap.get(workMonth)
		if (birthdaysDayIdsMap) {
			const endDayOfMonth = getDaysOfMonth(workMonth, workYear)
			for (let workDay = 1; workDay <= endDayOfMonth; workDay++) {
				const birthdaysMasterIds = birthdaysDayIdsMap.get(workDay) || []
				if (birthdaysMasterIds.length < 1) {
					continue
				}
				const date = new Date(workYear, (workMonth - 1), workDay, 0, 0, 0, 0)
				const calendarEvents = [] as CalendarEvent[]
				for (let birthdaysMasterId of birthdaysMasterIds) {
					const birthdayEntry = props.birthdaysMaster.get(birthdaysMasterId)
					if (!(birthdayEntry)) {
						continue
					}
					if (birthdayEntry.first_year && (year.value < birthdayEntry.first_year)) {
						continue
					}
					if (birthdayEntry.last_year && (year.value > birthdayEntry.last_year)) {
						continue
					}
					calendarEvents.push({
						id: `birthdays-${birthdayEntry.id}`,
						subject: birthdayEntry.name,
						started_at: date,
						ended_at: new Date(date.getTime() + 86400000),
						color: birthdayEntry.color,
					})
				}
				const ymdValue = getYmdValueByDate(date)
				dateCalendarEventsMap.set(ymdValue, calendarEvents)
			}
		}
	}
	return dateCalendarEventsMap
})

function handleChangeYearMonth(inputYear: number, inputMonth: number) {
	const inputYearMonthValue = getYearMonthValue(inputYear, inputMonth)
	const headYearMonthValue = getYearMonthValue(...headYearMonth.value)
	const tailYearMonthValue = getYearMonthValue(...tailYearMonth.value)
	if ((inputYearMonthValue >= headYearMonthValue) && (inputYearMonthValue <= tailYearMonthValue)) {
		year.value = inputYear
		month.value = inputMonth
	}
}

function getCalendarEventsInDate(date: Date): CalendarEvent[] {
	const [selectYear, selectMonth, selectDay] = getYearMonthDayTuple(date)

	const calendarEvents = []
	const birthdaysMasterIds = props.birthdaysMonthDayIdsMap.get(selectMonth)?.get(selectDay) || []
	for (let birthdaysMasterId of birthdaysMasterIds) {
		const birthday = props.birthdaysMaster.get(birthdaysMasterId)
		if (!(birthday)) {
			continue
		}
		if (birthday.first_year && (selectYear < birthday.first_year)) {
			continue
		}
		if (birthday.last_year && (selectYear > birthday.last_year)) {
			continue
		}
		calendarEvents.push({
			id: `birthdays-${birthday.id}`,
			subject: birthday.name,
			started_at: date,
			ended_at: new Date(date.getTime() + 86400000),
			color: birthday.color,
		})
	}

	return calendarEvents
}

function handleSelectDate(date: Date, element?: HTMLElement) {
	if (!(element)) {
		return false;
	}

	const calendarEvents = getCalendarEventsInDate(date)

	let holidayClassName = ''
	if (isShowJpHoliday.value) {
		const jpHoliday = getJpHolidayByDate(date)
		if (jpHoliday) {
			calendarEvents.unshift({
				id: `holiday-${date.toISOString().substring(0, 10)}`,
				subject: jpHoliday.text,
				started_at: date,
				ended_at: (new Date(date.getTime() + 86400000)),
				mark: JP_HOLIDAY_MARK,
				class_name: 'calendar-holiday',
			})
			holidayClassName = 'calendar-holiday'
		}
	}

	if (calendarEvents.length) {
		popoverContentList.value = calendarEvents
		// @ts-ignore
		const popover = window.bootstrap.Popover.getOrCreateInstance(element, {
			placement: 'bottom',
			trigger: '',
			offset: [0, 0],
			delay: { show: 0, hide: 50 },
			html: true,
			content: popoverContent.value,
			template: '<div class="popover d-md-none" role="popover">'
				+ '<div class="popover-arrow"></div>'
				+ `<div class="popover-header px-2 py-1 small calendar-wday-${date.getDay()} ${holidayClassName}"></div>`
				+ '<div class="popover-body p-0"></div>'
				+ '</div>',
		})
		// popover.setContent({
		// 	'.popover-header': getDateText(date),
		// 	'.popover-body': popoverContent.value,
		// })
	} else {
		// @ts-ignore
		const popover = window.bootstrap.Popover.getInstance(element)
		if (popover) {
			popover.disable()
		}
	}
}

function handleSelectCalendarEvent(calendarEvent: CalendarEvent) {
	if (!(calendarEvent)) {
		return;
	}
	const calendarEventId = String(calendarEvent.id)
	const matchBirthdayEvent = calendarEventId.match(/^birthdays-(\d+)$/);
	if (matchBirthdayEvent) {
		const birthdaysMasterId = parseInt(matchBirthdayEvent[1], 10)
		if (props.birthdaysMaster.has(birthdaysMasterId)) {
			emits('select-birthday', birthdaysMasterId)
		}
	}
}

const popoverContent = ref()
const popoverContentList = ref([] as CalendarEvent[])

</script>

<template>
	<h2 class="visually-hidden">{{ year }}年{{ month }}月のカレンダー</h2>
	<div class="my-2">
		<CalendarNav
			:year="year"
			:month="month"
			:current-year="props.currentYear"
			:current-month="props.currentMonth"
			:current-day="props.currentDay"
			:head-year-month="headYearMonth"
			:tail-year-month="tailYearMonth"
			@change-year-month="handleChangeYearMonth"
			@select-date="handleSelectDate"
		/>
		<JpCalendar
			:year="year"
			:month="month"
			:start-wday="startWday"
			:get-date-text="getDateText"
			:is-show-last-and-next="isShowLastAndNext"
			:is-show-holiday="isShowJpHoliday"
			:highlight-date-set="highlightDateSet"
			:date-calendar-events-map="dateCalendarEventsMap"
			@select-date="handleSelectDate"
			@select-calendar-event="handleSelectCalendarEvent"
		/>
	</div>
	<div class="visually-hidden">
		<div ref="popoverContent">
			<ul class="list-group list-group-flush rounded-3">
				<template v-for="calendarEvent in popoverContentList" :key="calendarEvent.id">
					<li class="list-group-item px-2 py-1" :class="calendarEvent.class_name" role="button" @click="handleSelectCalendarEvent(calendarEvent)">
						<CalendarEventLine :event="calendarEvent" />
					</li>
				</template>
			</ul>
		</div>
	</div>
</template>
