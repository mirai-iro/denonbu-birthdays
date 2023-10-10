<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'

import { YearMonthTuple, getYearMonthValue } from './DateUtils'

const emits = defineEmits([
	'change-year-month',
])

const props = defineProps<{
	year: number
	month: number
	headYearMonth?: YearMonthTuple
	tailYearMonth?: YearMonthTuple
}>()

const year = ref(props.year)

const headYearMonth = computed(() => (props.headYearMonth || [0, 1]) as YearMonthTuple)
const tailYearMonth = computed(() => (props.tailYearMonth || [9999, 12]) as YearMonthTuple)
const headYear = computed(() => headYearMonth.value[0])
const tailYear = computed(() => tailYearMonth.value[0])
const headYMValue = computed(() => getYearMonthValue(...headYearMonth.value))
const tailYMValue = computed(() => getYearMonthValue(...tailYearMonth.value))

watchEffect(async () => {
	year.value = props.year
})

function changeYearMonth(inputYear: number, inputMonth: number) {
	const changedYMvalue = getYearMonthValue(inputYear, inputMonth)
	if (changedYMvalue < headYMValue.value) {
		emits('change-year-month', ...headYearMonth.value)
	} else if (changedYMvalue > tailYMValue.value) {
		emits('change-year-month', ...tailYearMonth.value)
	} else {
		emits('change-year-month', inputYear, inputMonth)
	}
}

function handleChangeYearInput(event: Event) {
	const inputElem = event.target as HTMLInputElement
	const inputYear = parseInt(inputElem.value, 10)
	if (isFinite(inputYear)) {
		if (inputYear !== props.year) {
			changeYearMonth(inputYear, props.month)
		}
	} else {
		year.value = props.year
	}
}

function handleChangeMonthSelect(event: Event) {
	const selectElem = event.target as HTMLSelectElement
	const inputMonthValue = selectElem.options[selectElem.selectedIndex].value
	if (inputMonthValue) {
		const inputMonth = parseInt(inputMonthValue, 10)
		changeYearMonth(props.year, inputMonth)
		year.value = props.year
	}
}

const monthSelectOptions = computed(() => {
	const monthSelectOptions = []
	const [headYear, headMonth] = headYearMonth.value
	const [tailYear, tailMonth] = tailYearMonth.value
	const optionsHeadMonth = (props.year <= headYear) ? headMonth : 1
	const optionsTailMonth = (props.year >= tailYear) ? tailMonth : 12
	for (let workMonth = optionsHeadMonth; workMonth <= optionsTailMonth; workMonth++) {
		monthSelectOptions.push(workMonth)
	}
	return monthSelectOptions
})

</script>

<template>
	<form class="form ms-auto" action="#" @submit.prevent>
		<div class="hstack gap-1 my-1">
			<div class="input-group" style="min-width:8rem;">
				<input type="number" id="calendar-select-year" class="form-control" name="year" :min="headYear" :max="tailYear" :value="year" @change="handleChangeYearInput" />
				<label for="calendar-select-year" class="input-group-text">年</label>
			</div>
			<div class="input-group" style="min-width:7rem;">
				<select id="calendar-select-month" class="form-select" name="month" :value="props.month" @change="handleChangeMonthSelect">
					<option v-for="month in monthSelectOptions" :key="month" :value="month">{{ month }}</option>
				</select>
				<label for="calendar-select-month" class="input-group-text">月</label>
			</div>
		</div>
	</form>
</template>
