<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import type { Ref } from 'vue'

import type { BirthdayEntry } from '../birthdays/BirthdaysMaster'
import type { BrandEntry } from '../birthdays/BrandsMaster'

import type { AppConfig } from '../app_config'

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

</script>

<template>
	<h2 class="visually-hidden">Bookmark</h2>
	<div class="my-2">TODO</div>
</template>
