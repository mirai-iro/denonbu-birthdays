<script setup lang="ts">
import { computed, ComputedRef } from 'vue'

import type { BrandEntry } from '../birthdays/BrandsMaster'

const props = defineProps<{
	colorMode: string
	brands: BrandEntry[]
	isShort?: boolean
}>()

const brandBadgeClassNames: ComputedRef<string[]> = computed(() => {
	const classNames = []
	if (props.colorMode === 'dark') {
		classNames.push('bg-light-subtle')
	} else {
		classNames.push('bg-secondary')
	}
	return classNames
})

</script>
<template>
	<template v-for="brand in brands" :key="brand.id">
		<span class="me-1 small badge" :class="[...brandBadgeClassNames, `bg-brand-${brand.symbol}`]">{{ ((props.isShort && brand.short_name) ? brand.short_name : brand.name) }}</span>
	</template>
</template>
