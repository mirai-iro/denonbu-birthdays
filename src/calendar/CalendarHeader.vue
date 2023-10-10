<script setup lang="ts">
import { computed } from 'vue'

import './calendar.css'

const props = defineProps<{
	wdays: string[]
	startWday: number
}>()

const headerWdays = computed(() => {
	const headerWdays: [number, string][] = []
	for (let pos = 0; pos < 7; pos++) {
		let wday = props.startWday + pos
		if (wday > 6) {
			wday -= 7
		}
		headerWdays.push([wday, props.wdays[wday]])
	}
	return headerWdays
})
</script>

<template>
	<thead role="rowgroup">
		<tr role="row" class="text-center">
			<template v-for="[wday, wdayText] in headerWdays" :key="`calendar-header-${wday}`">
				<th role="columnheader" :aria-label="wdayText" :class="`calendar-wday-${wday}`" style="width: calc(100% / 7)">{{ wdayText }}</th>
			</template>
		</tr>
	</thead>
</template>
