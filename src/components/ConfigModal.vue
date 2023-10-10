<script setup lang="ts">
import { ref } from 'vue'

import type { AppConfig } from '../app_config'

import uninstall from '../uninstall'

const modal = ref(null)

defineExpose({
	modal,
})

const props = defineProps<{
	appConfig: AppConfig
	colorMode: string
	startWdayOnCalendar: number
	isShowLastAndNextOnCalendar: boolean
	isShowJpHolidayOnCalendar: boolean
}>()

const emits = defineEmits([
	'update:colorMode',
	'update:startWdayOnCalendar',
	'update:isShowLastAndNextOnCalendar',
	'update:isShowJpHolidayOnCalendar',
])

function handleChangeColorMode(event: Event) {
	const select = event.target as HTMLSelectElement
	emits('update:colorMode', select.options[select.selectedIndex].value)
}

function handleChangeIsShowLastAndNextOnCalendar(event: Event) {
	const checkbox = event.target as HTMLInputElement
	emits('update:isShowLastAndNextOnCalendar', checkbox.checked)
}

function handleChangeIsShowJpHolidayOnCalendar(event: Event) {
	const checkbox = event.target as HTMLInputElement
	emits('update:isShowJpHolidayOnCalendar', checkbox.checked)
}

function handleChangeStartWdayOnCalendar(event: Event) {
	const select = event.target as HTMLSelectElement
	emits('update:startWdayOnCalendar', parseInt(select.options[select.selectedIndex].value, 10))
}

function handleClickUninstall() {
	uninstall()
	window.alert('データを初期化(すべて削除)しました。\nページを閉じてください。')
}
</script>

<template>
	<div class="modal fade" tabindex="-1" ref="modal">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header">
					<h2 class="modal-title fs-5">設定</h2>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<div class="">
						<h3 class="modal-title fs-6">全体</h3>
						<div class="my-1 input-group">
							<label class="input-group-text" id="config-color-mode">カラーモード</label>
							<select class="form-select" for="config-color-mode" :value="props.colorMode" @change="handleChangeColorMode">
								<option value="auto">OSと同期</option>
								<option value="light">ライト</option>
								<option value="dark">ダーク</option>
							</select>
						</div>
					</div>
					<div class="">
						<h3 class="modal-title fs-6">カレンダー</h3>
						<div class="my-1 form-check form-switch">
							<input class="form-check-input" id="config-is-show-last-and-next-on-calendar" type="checkbox" :checked="props.isShowLastAndNextOnCalendar" @change="handleChangeIsShowLastAndNextOnCalendar">
							<label class="form-check-label" for="config-is-show-last-and-next-on-calendar">前後の日付を表示する</label>
						</div>
						<div class="my-1 form-check form-switch">
							<input class="form-check-input" id="config-is-show-jp-holiday-on-calendar" type="checkbox" :checked="props.isShowJpHolidayOnCalendar" @change="handleChangeIsShowJpHolidayOnCalendar">
							<label class="form-check-label" for="config-is-show-jp-holiday-on-calendar">祝日を表示する</label>
						</div>
						<div class="my-1 input-group">
							<label class="input-group-text" id="config-start-wday-on-calendar">週の開始日</label>
							<select class="form-select" for="config-start-wday-on-calendar" :value="props.startWdayOnCalendar" @change="handleChangeStartWdayOnCalendar">
								<option :value="1">月曜日</option>
								<option :value="0">日曜日</option>
								<option :value="6">土曜日</option>
							</select>
						</div>
					</div>
					<form class="form mt-3" action="#" @submit.prevent>
						<button @click="handleClickUninstall" class="btn btn-danger">データの初期化</button>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>
