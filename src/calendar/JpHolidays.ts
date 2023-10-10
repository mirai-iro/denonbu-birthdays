import JP_HOLIDAYS from './jp_holidays.json'

export const JP_HOLIDAY_MARK = '🎌'

export type HolidayEntry = {
	year: number
	month: number
	day: number
	text: string
}

const daysMapOnYearMonthMap = new Map<number, Map<number, string>>()
for (let entry of JP_HOLIDAYS) {
	const [[year, month, day], text] = entry as [[number, number, number], string]
	if (!(year) || !(month) || !(day) || (text ?? '') === '') {
		continue
	}
	const yearMonth = (year * 100) + month
	const daysMap = daysMapOnYearMonthMap.get(yearMonth) || new Map<number, string>()
	daysMap.set(day, text)
	daysMapOnYearMonthMap.set(yearMonth, daysMap)
}

export function isJpHolidayDate(date: Date): boolean {
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	return isJpHoliday(year, month, day)
}

export function isJpHoliday(year: number, month: number, day: number): boolean {
	const yearMonth = (year * 100) + month
	const daysMap = daysMapOnYearMonthMap.get(yearMonth)
	if (daysMap) {
		return daysMap.has(day)
	} else {
		return false
	}
}

export function getJpHolidayByDate(date: Date): (HolidayEntry | null) {
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	return getJpHolidayByYearMonthDay(year, month, day)
}

export function getJpHolidayByYearMonthDay(year: number, month: number, day: number): (HolidayEntry | null) {
	const yearMonth = (year * 100) + month
	const daysMap = daysMapOnYearMonthMap.get(yearMonth)
	if (daysMap) {
		const text = daysMap.get(day) ?? ''
		if (text !== '') {
			return { year, month, day, text }
		} else {
			return null
		}
	} else {
		return null
	}
}

export function getJpHolidaysByYearMonth(year: number, month: number): HolidayEntry[] {
	const list: HolidayEntry[] = []
	const yearMonth = (year * 100) + month
	const daysMap = daysMapOnYearMonthMap.get(yearMonth)
	if (daysMap) {
		for (let [day, text] of daysMap) {
			list.push({ year, month, day, text })
		}
	}
	return list
}
