<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
	color?: string
}>()

const colorValue = computed(() => (props.color || 'inherit'))

const styles = computed(() => {
	return {
		color: colorValue.value,
		textShadow: '#ddd 1px 1px',
		fontSize: '1rem',
	}
})
</script>

<template>
	<span :style="styles"><slot>■</slot></span>
</template>
