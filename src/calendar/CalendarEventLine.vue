<script setup lang="ts">
import { computed } from 'vue'

import { CalendarEvent } from './CalendarEvent'

import ColorCube from './ColorCube.vue'

const props = defineProps<{
	event: CalendarEvent
}>()

const emits = defineEmits([
	'select-calendar-event',
])

const mark = computed(() => {
	return props.event.mark || '■'
})

function handleClickSubject(event: MouseEvent) {
	emits('select-calendar-event', props.event)
}

</script>

<template>
	<ColorCube :color="props.event.color" class="calendar-event-line-mark">{{ mark }}</ColorCube>
	<span class="calendar-event-line-subject" @click="handleClickSubject" role="button"><slot>{{ props.event.subject }}</slot></span>
</template>
