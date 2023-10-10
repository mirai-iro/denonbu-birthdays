<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import type { Ref } from 'vue'

import type { CalendarDay } from './CalendarDay'

import CalendarEventLine from './CalendarEventLine.vue'

import './calendar.css'
import { CalendarEvent } from './CalendarEvent'

const emits = defineEmits([
	'select-date',
	'select-calendar-event',
])

const props = defineProps<{
	calendarDay: CalendarDay
}>()

const getDateText = inject('calendar.getDateText') as Function
const isShowLastAndNext = inject('calendar.isShowLastAndNext') as Ref<boolean>

const fullDateText = computed(() => {
	return (getDateText) ? getDateText(props.calendarDay.date) : props.calendarDay.date.toLocaleDateString()
})

const month = computed(() => {
	return props.calendarDay.date.getMonth() + 1
})
const day = computed(() => {
	return props.calendarDay.date.getDate()
})
const calendarEvents = computed(() => {
	return props.calendarDay.calendarEvents || []
})
const isEffectiveCell = computed(() => {
	return isShowLastAndNext.value || props.calendarDay.isThisMonth
})
const cellClassNames = computed(() => {
	const classNames = [
		'calendar-cell',
		`calendar-wday-${props.calendarDay.date.getDay()}`,
	]
	if (isEffectiveCell.value) {
		if (props.calendarDay.holiday) {
			classNames.push('calendar-holiday')
		}
		if (props.calendarDay.isHighlight) {
			classNames.push('calendar-highlight')
		}
	}
	return classNames
})

const cellElement = ref() as Ref<HTMLElement>

function handleMouseenter(event: MouseEvent) {
	if (event.target instanceof HTMLElement) {
		event.target.focus()
	}
	event.preventDefault()
}
function handleMouseleave(event: MouseEvent) {
	if (event.target instanceof HTMLElement) {
		// event.target.blur()
	}
	event.preventDefault()
}
function handleFocus() {
	emits('select-date', props.calendarDay.date, cellElement.value)
}
function handleKeydown(event: KeyboardEvent) {
	let toFocusCellElem: HTMLElement = cellElement.value
	const rowElem = cellElement.value.parentElement
	switch (event.key) {
		case 'ArrowLeft':
			const prevCellElem = cellElement.value.previousElementSibling
			if (prevCellElem) {
				toFocusCellElem = prevCellElem as HTMLElement
			} else if (rowElem) {
				const prevRowElem = rowElem.previousElementSibling
				if (prevRowElem) {
					toFocusCellElem = prevRowElem.lastElementChild as HTMLElement
				}
			}
			break
		case 'ArrowRight':
			const nextCellElem = cellElement.value.nextElementSibling
			if (nextCellElem) {
				toFocusCellElem = nextCellElem as HTMLElement
			} else if (rowElem) {
				const nextRowElem = rowElem.nextElementSibling
				if (nextRowElem) {
					toFocusCellElem = nextRowElem.firstElementChild as HTMLElement
				}
			}
			break
		case 'ArrowUp':
			if (rowElem) {
				const prevRowElem = rowElem.previousElementSibling
				if (prevRowElem) {
					let columnIdx = 0
					for (let idx = 0; idx < rowElem.children.length; idx++) {
						if (rowElem.children[idx] == cellElement.value) {
							columnIdx = idx
							break
						}
					}
					toFocusCellElem = prevRowElem.children[columnIdx] as HTMLElement
				}
			}
			break
		case 'ArrowDown':
			if (rowElem) {
				const nextRowElem = rowElem.nextElementSibling
				if (nextRowElem) {
					let columnIdx = 0
					for (let idx = 0; idx < rowElem.children.length; idx++) {
						if (rowElem.children[idx] == cellElement.value) {
							columnIdx = idx
							break
						}
					}
					toFocusCellElem = nextRowElem.children[columnIdx] as HTMLElement
				}
			}
			break
	}
	if (toFocusCellElem != cellElement.value) {
		toFocusCellElem.focus()
		event.preventDefault()
	}
}

function handleSelectCalendarEvent(calendarEvent: CalendarEvent) {
	emits('select-calendar-event', calendarEvent)
}
</script>

<template>
	<template v-if="isEffectiveCell">
		<td
			ref="cellElement"
			:class="cellClassNames.join(' ')"
			:title="fullDateText"
			role="gridcell"
			tabindex="0"
			@mouseenter="handleMouseenter"
			@mouseleave="handleMouseleave"
			@focus="handleFocus"
			@keydown="handleKeydown"
		>
			<div class="hstack gap-1">
				<span v-if="props.calendarDay.isThisMonth" class="calendar-date align-self-start text-nowrap">{{ day }}</span>
				<span v-else-if="isShowLastAndNext" class="text-secondary calendar-date align-self-start text-nowrap">{{ month }}/{{ day }}</span>
				<span v-if="props.calendarDay.holiday" class="align-self-start ms-auto text-end small">{{ props.calendarDay.holiday.mark }}<span class="d-none d-md-inline">{{ props.calendarDay.holiday.subject }}</span></span>
			</div>
			<ul v-if="calendarEvents.length" class="calendar-event-lines">
				<li v-for="calendarEvent in calendarEvents" :key="calendarEvent.id" class="calendar-event-line" :class="calendarEvent.class_name">
					<CalendarEventLine :event="calendarEvent" @select-calendar-event="handleSelectCalendarEvent" />
				</li>
			</ul>
		</td>
	</template>
	<template v-else>
		<td :class="cellClassNames.join(' ')" :title="fullDateText"></td>
	</template>
</template>
