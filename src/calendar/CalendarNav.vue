<script setup lang="ts">
import { YearMonthTuple } from './DateUtils'

import CalendarNavLinks from './CalendarNavLinks.vue'
import CalendarNavYearMonthForm from './CalendarNavYearMonthForm.vue'

const emits = defineEmits([
	'change-year-month',
	'select-date',
])

const props = defineProps<{
	year: number
	month: number
	currentYear: number
	currentMonth: number
	currentDay: number
	headYearMonth?: YearMonthTuple
	tailYearMonth?: YearMonthTuple
}>()

function handleChangeYearMonth(inputYear: number, inputMonth: number) {
	emits('change-year-month', inputYear, inputMonth)
}
function handleSelectDate(date: Date) {
	emits('select-date', date)
}
</script>

<template>
	<div class="d-block d-md-flex gap-2 mb-1">
		<CalendarNavLinks
			:year="props.year"
			:month="props.month"
			:currentYear="props.currentYear"
			:currentMonth="props.currentMonth"
			:currentDay="props.currentDay"
			:headYearMonth="props.headYearMonth"
			:tailYearMonth="props.tailYearMonth"
			@change-year-month="handleChangeYearMonth"
			@select-date="handleSelectDate"
		/>
		<CalendarNavYearMonthForm
			:year="props.year"
			:month="props.month"
			:headYearMonth="props.headYearMonth"
			:tailYearMonth="props.tailYearMonth"
			@change-year-month="handleChangeYearMonth"
		/>
	</div>
</template>
