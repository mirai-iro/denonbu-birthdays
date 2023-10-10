<script setup lang="ts">
import { computed, ComputedRef } from 'vue'

import { getDateByYearMonthDay, getDaysOfMonth } from '../calendar/DateUtils'

import type { CalendarEvent } from '../calendar/CalendarEvent'
import CalendarEventLine from '../calendar/CalendarEventLine.vue'

import type { BirthdayEntry } from '../birthdays/BirthdaysMaster'
import { type BrandEntry } from '../birthdays/BrandsMaster'

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

type ListEntry = [number, number, number, ExtendCalendarEvent[]]

const list: ComputedRef<ListEntry[]> = computed(() => {
	const list: ListEntry[] = []
	const currentDate = getDateByYearMonthDay(props.currentYear, props.currentMonth, props.currentDay)
	for (let monthIdx = 0; monthIdx <= 12; monthIdx++) {
		let year = props.currentYear
		let month = props.currentMonth + monthIdx
		if (month > 12) {
			year++
			month -= 12
		}
		const birthdaysDayIdsMap = props.birthdaysMonthDayIdsMap.get(month)
		if (birthdaysDayIdsMap) {
			const startDay = (monthIdx == 0) ? props.currentDay : 1
			const endDay = (monthIdx == 12) ? (props.currentDay - 1) : getDaysOfMonth(month, year)
			for (let day = startDay; day <= endDay; day++) {
				const birthdaysMasterIds = birthdaysDayIdsMap.get(day) || []
				if (birthdaysMasterIds.length < 1) {
					continue
				}
				const calendarEvents: ExtendCalendarEvent[] = []
				const date = getDateByYearMonthDay(year, month, day)
				const remainDays = Math.ceil((date.getTime() - currentDate.getTime()) / 86400000)
				for (let birthdaysMasterId of birthdaysMasterIds) {
					const birthdayEntry = props.birthdaysMaster.get(birthdaysMasterId)
					if (!(birthdayEntry)) {
						continue;
					}
					if (birthdayEntry.first_year && (year < birthdayEntry.first_year)) {
						continue;
					}
					if (birthdayEntry.last_year && (year > birthdayEntry.last_year)) {
						continue;
					}
					const brandEntries: BrandEntry[] = []
					if (props.appConfig.enableBrandsBadge && birthdayEntry.brand_ids) {
						for (let brand_id of birthdayEntry.brand_ids) {
							const brandEntry = props.brandsMaster.get(brand_id)
							brandEntry && brandEntries.push(brandEntry)
						}
					}
					calendarEvents.push({
						id: `birthdays-${birthdayEntry.id}`,
						subject: birthdayEntry.name,
						started_at: date,
						ended_at: new Date(date.getTime() + 86400000),
						color: birthdayEntry.color,
						birthdays_master_id: birthdayEntry.id,
						brands: brandEntries,
					})
				}
				list.push([month, day, remainDays, calendarEvents])
			}
		}
	}
	return list
})

function handleClickBirthday(birthdaysMasterId: number) {
	emits('select-birthday', birthdaysMasterId)
}
</script>

<template>
	<h2 class="visually-hidden">List &amp; Search</h2>
	<table class="table table-sm table-hover my-2">
		<colgroup>
			<col style="width:3.5rem;">
			<col style="width:5rem;">
			<col>
		</colgroup>
		<tbody>
			<template v-for="[month, day, remainDays, calendarEvents] in list" :key="`${month}-${day}`">
				<tr :class="((month === currentMonth) && (day === currentDay)) ? 'calendar-highlight' : ''">
					<td>{{ month }}/{{ day }}</td>
					<td>
						<small v-if="(remainDays == 0)" class="text-warning-emphasis">今日です！</small>
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
			</template>
		</tbody>
	</table>
</template>
