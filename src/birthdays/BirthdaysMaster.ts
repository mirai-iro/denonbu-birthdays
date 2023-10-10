
export type BirthdayEntry = {
	id: number
	name: string
	month: number
	day: number
	first_year?: number
	last_year?: number
	color?: string
	brand_ids?: number[]
}

export const birthdays_master = new Map<number, BirthdayEntry>()
export const brands_birthdays_ids_map = new Map<number, Set<number>>()

import denonbu_birthdays_data from './denonbu_birthdays.json'

for (let entry of denonbu_birthdays_data) {
	birthdays_master.set(entry.id, entry)
	if (entry.brand_ids) {
		for (let brand_id of entry.brand_ids) {
			const birthdays_ids = brands_birthdays_ids_map.get(brand_id) || new Set<number>()
			birthdays_ids.add(entry.id)
			brands_birthdays_ids_map.set(brand_id, birthdays_ids)
		}
	}
}
