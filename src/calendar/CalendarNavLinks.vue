<script setup lang="ts">
import { computed } from 'vue'

import type { YearMonthTuple } from './DateUtils'
import { getDateByYearMonthDay, getYearMonthValue, shiftYearMonth } from './DateUtils'

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

const headYMValue = computed(() => {
	return props.headYearMonth ? getYearMonthValue(...props.headYearMonth) : 0
})
const tailYMValue = computed(() => {
	return props.tailYearMonth ? getYearMonthValue(...props.tailYearMonth) : 999999
})
const prevYearYM = computed(() => shiftYearMonth(props.year, props.month, -12))
const prevMonthYM = computed(() => shiftYearMonth(props.year, props.month, -1))
const nextMonthYM = computed(() => shiftYearMonth(props.year, props.month, +1))
const nextYearYM = computed(() => shiftYearMonth(props.year, props.month, +12))
const prevYearYMValue = computed(() => getYearMonthValue(...prevYearYM.value))
const prevMonthYMValue = computed(() => getYearMonthValue(...prevMonthYM.value))
const nextMonthYMValue = computed(() => getYearMonthValue(...nextMonthYM.value))
const nextYearYMValue = computed(() => getYearMonthValue(...nextYearYM.value))
const isEnablePrevYear = computed(() => ((prevYearYMValue.value >= headYMValue.value) && (prevYearYMValue.value <= tailYMValue.value)))
const isEnablePrevMonth = computed(() => ((prevMonthYMValue.value >= headYMValue.value) && (prevMonthYMValue.value <= tailYMValue.value)))
const isEnableNextMonth = computed(() => ((nextMonthYMValue.value >= headYMValue.value) && (nextMonthYMValue.value <= tailYMValue.value)))
const isEnableNextYear = computed(() => ((nextYearYMValue.value >= headYMValue.value) && (nextYearYMValue.value <= tailYMValue.value)))

function handleClickPrevYear() {
	emits('change-year-month', ...prevYearYM.value)
}
function handleClickPrevMonth() {
	emits('change-year-month', ...prevMonthYM.value)
}
function handleClickCurrent() {
	emits('change-year-month', props.currentYear, props.currentMonth)
	emits('select-date', getDateByYearMonthDay(props.currentYear, props.currentMonth, props.currentDay))
}
function handleClickNextMonth() {
	emits('change-year-month', ...nextMonthYM.value)
}
function handleClickNextYear() {
	emits('change-year-month', ...nextYearYM.value)
}
</script>

<template>
	<nav class="nav nav-fill w-100">
		<button @click="handleClickPrevYear" :class="`nav-link btn btn-link px-1 ${(isEnablePrevYear) ? '' : 'disabled'}`">&laquo; 前年</button>
		<button @click="handleClickPrevMonth" :class="`nav-link btn btn-link px-1 ${(isEnablePrevMonth) ? '' : 'disabled'}`">&lt; 前月</button>
		<button @click="handleClickCurrent" class="nav-link btn btn-link px-1">今月<span class="d-none d-md-inline">({{ props.currentYear }}年{{ props.currentMonth }}月)</span></button>
		<button @click="handleClickNextMonth" :class="`nav-link btn btn-link px-1 ${(isEnableNextMonth) ? '' : 'disabled'}`">翌月 &gt;</button>
		<button @click="handleClickNextYear" :class="`nav-link btn btn-link px-1 ${(isEnableNextYear) ? '' : 'disabled'}`">翌年 &raquo;</button>
	</nav>
</template>
