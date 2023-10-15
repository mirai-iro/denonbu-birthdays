<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ComputedRef } from 'vue'

import type { BirthdayEntry } from '../birthdays/BirthdaysMaster'
import type { BrandEntry } from '../birthdays/BrandsMaster'

import type { AppConfig } from '../app_config'

import ColorCube from '../calendar/ColorCube.vue'
import BrandBadges from '../components/BrandBadges.vue'

const modal = ref(null)

defineExpose({
	modal,
})

const props = defineProps<{
	appConfig: AppConfig
	colorMode: string
	birthdayEntry?: BirthdayEntry
	brandsMaster: Map<number, BrandEntry>
}>()

const brandEntries: ComputedRef<BrandEntry[]> = computed(() => {
	const brandEntries = []
	if (props.birthdayEntry && props.birthdayEntry.brand_ids) {
		for (let brand_id of props.birthdayEntry.brand_ids) {
			const brandEntry = props.brandsMaster.get(brand_id)
			if (brandEntry) {
				brandEntries.push(brandEntry)
			}
		}
	}
	return brandEntries
})

</script>

<template>
	<div class="modal fade" tabindex="-1" ref="modal">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header">
					<h2 class="modal-title fs-5">詳細情報</h2>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body px-2 py-1">
					<table class="table m-0" v-if="props.birthdayEntry">
						<colgroup>
							<col style="width:6rem;" />
							<col />
						</colgroup>
						<tbody>
							<tr>
								<th>名前</th>
								<td>{{ props.birthdayEntry.name }}</td>
							</tr>
							<tr>
								<th>誕生日</th>
								<td>{{ props.birthdayEntry.month }}月{{ props.birthdayEntry.day }}日</td>
							</tr>
							<tr v-if="props.birthdayEntry.color">
								<th class="text-nowrap">パーソナルカラー</th>
								<td><ColorCube :color="props.birthdayEntry.color" class="calendar-personal-color-cube" /> {{ props.birthdayEntry.color }}</td>
							</tr>
							<tr>
								<th>{{ props.appConfig.brandsTitle }}</th>
								<td>
									<template v-if="props.appConfig.enableBrandsBadge">
										<BrandBadges :color-mode="colorMode" :brands="brandEntries" />
									</template>
									<template v-else>
										<ul class="list-unstyled m-0">
											<li v-for="brand in brandEntries" :key="brand.id">{{ brand.name }}</li>
										</ul>
									</template>
								</td>
							</tr>
						</tbody>
					</table>
					<div v-if="props.appConfig.detailNotes" class="m-2 small text-secondary">{{ props.appConfig.detailNotes }}</div>
				</div>
			</div>
		</div>
	</div>
</template>
