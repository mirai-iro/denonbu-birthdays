export type BrandEntry = {
	id: number
	name: string
	short_name: string
	symbol?: string
	started_on?: string | null
	ended_on?: string | null
	disp_order: number
}

export const brands_master = new Map<number, BrandEntry>()

import denonbu_brands_data from './denonbu_brands.json'

for (let entry of denonbu_brands_data) {
	brands_master.set(entry.id, entry)
}
