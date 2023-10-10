<script setup lang="ts">
import { computed } from 'vue'

import type { YearMonthDayTuple } from '../calendar/DateUtils'
import { getDateByYearMonthDay, getYearMonthDayTuple } from '../calendar/DateUtils'

import type { CalendarEvent } from '../calendar/CalendarEvent'
import CalendarEventLine from '../calendar/CalendarEventLine.vue'

import type { BirthdayEntry } from '../birthdays/BirthdaysMaster'
import type { BrandEntry } from '../birthdays/BrandsMaster'

import type { AppConfig } from '../app_config'

import BrandBadges from '../components/BrandBadges.vue'

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
	'select-birthday',
])

type ExtendCalendarEvent = CalendarEvent & {
	birthdays_master_id: number
	brands: BrandEntry[]
}

type UpcomingTableRowTuple = [YearMonthDayTuple, ExtendCalendarEvent[], number]

const upcomingRows = computed(() => {
	const upcomingDays = props.appConfig.upcomingDays || 30
	const upcomingRows: UpcomingTableRowTuple[] = []

	const currentDate = getDateByYearMonthDay(props.currentYear, props.currentMonth, props.currentDay)
	const workDate = new Date(currentDate)
	for (let idx = 0; idx < upcomingDays; idx++) {
		const [year, month, day] = getYearMonthDayTuple(workDate)
		const remainDays = Math.ceil((workDate.getTime() - currentDate.getTime()) / 86400000)
		const birthdaysMasterIds = props.birthdaysMonthDayIdsMap.get(month)?.get(day) || []
		if (birthdaysMasterIds.length) {
			const calendarEvents: ExtendCalendarEvent[] = []
			for (let birthdaysMasterId of birthdaysMasterIds) {
				const birthdayEntry = props.birthdaysMaster.get(birthdaysMasterId)
				if (birthdayEntry) {
					const brandEntries: BrandEntry[] = []
					if (props.appConfig.enableBrandsBadge && birthdayEntry.brand_ids) {
						for (let brand_id of birthdayEntry.brand_ids) {
							const brandEntry = props.brandsMaster.get(brand_id)
							brandEntry && brandEntries.push(brandEntry)
						}
					}
					const calendarEvent = {
						id: birthdayEntry.id,
						subject: birthdayEntry.name,
						started_at: workDate,
						ended_at: new Date(workDate.getTime() + 86400000),
						color: birthdayEntry.color,
						birthdays_master_id: birthdayEntry.id,
						brands: brandEntries,
					}
					calendarEvents.push(calendarEvent)
				}
			}
			upcomingRows.push([[year, month, day], calendarEvents, remainDays])
		}
		workDate.setTime(workDate.getTime() + 86400000)
	}
	return upcomingRows
})

function handleClickBirthday(birthdaysMasterId: number) {
	emits('select-birthday', birthdaysMasterId)
}
</script>

<template>
	<h2 class="visually-hidden">Upcoming</h2>
	<div class="my-2">今日は{{ currentMonth }}月{{ currentDay }}日です</div>
	<table class="table table-sm table-hover my-2">
		<colgroup>
			<col style="width:3.5rem;">
			<col style="width:5rem;">
			<col>
		</colgroup>
		<tbody>
			<tr v-for="([[year, month, day], calendarEvents, remainDays], rowIdx) in upcomingRows" :key="rowIdx" :class="((month === currentMonth) && (day === currentDay)) ? 'calendar-highlight' : ''">
				<td>{{ month }}/{{ day }}</td>
				<td>
					<small v-if="(remainDays == 0)" class="fw-bold">今日です！</small>
					<small v-else class="text-body-secondary">あと{{ remainDays }}日</small>
				</td>
				<td>
					<ul class="list-inline m-0" v-if="calendarEvents.length">
						<template v-for="calendarEvent in calendarEvents" :key="calendarEvent.id">
							<li class="list-inline-item me-2" :class="calendarEvent.class_name">
								<span @click="handleClickBirthday(calendarEvent.birthdays_master_id)" role="button">
									<CalendarEventLine :event="calendarEvent" />
								</span>
								<span v-if="calendarEvent.brands" class="ms-1">
									<BrandBadges :is-short="true" :color-mode="colorMode" :brands="calendarEvent.brands" />
								</span>
							</li>
						</template>
					</ul>
				</td>
			</tr>
		</tbody>
	</table>
</template>
