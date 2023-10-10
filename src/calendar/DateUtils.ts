export const JA_WDAYS = ['日', '月', '火', '水', '木', '金', '土']

export const EN_WDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export type YearMonthTuple = [number, number]

export type YearMonthDayTuple = [number, number, number]

export type YmdValue = number

export type YearMonthValue = number

export function getYmdValue(year: number, month: number, day: number): YmdValue {
	return ((year * 10000) + (month * 100) + day)
}

export function getYearMonthValue(year: number, month: number): YearMonthValue {
	return ((year * 100) + month)
}

export function getYmdValueByDate(date: Date): YmdValue {
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	return ((year * 10000) + (month * 100) + day)
}

export function getYearMonthDayTuple(date: Date): YearMonthDayTuple {
	return [
		date.getFullYear(),
		(date.getMonth() + 1),
		date.getDate(),
	]
}

export function getDateByYearMonthDay(year: number, month: number, day: number): Date {
	return new Date(year, (month - 1), day, 0, 0, 0, 0)
}

export function getDateText(date: Date): string {
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const wday = date.getDay()

	return '' + year.toString().padStart(4, '0')
		+ '/' + month.toString().padStart(2, '0')
		+ '/' + day.toString().padStart(2, '0')
		+ '(' + JA_WDAYS[wday] + ')'
}

export function getDateByYearMonth(year: number, month: number): Date {
	return getDateByYearMonthDay(year, month, 1)
}

export function isValidYearMonth(year: number, month: number): boolean {
	return ((year > 0) && (month >= 1) && (month <= 12))
}

export function getDaysOfMonth(month: number, year = 2000): number {
	switch (month) {
		case 2:
			return (isLeapYear(year)) ? 29 : 28
		case 4:
		case 6:
		case 9:
		case 11:
			return 30
		default:
			return 31
	}
}

export function isLeapYear(year: number): boolean {
	return (
		((year % 400) === 0)
		|| (((year % 100) !== 0) && ((year % 4) === 0))
	)
}

export function isValidYearMonthDay(year: number, month: number, day: number): boolean {
	return isValidYearMonth(year, month) && (day >= 1) && (day <= getDaysOfMonth(month, year))
}

export function shiftYearMonth(year: number, month: number, shift: number): YearMonthTuple {
	let shiftedYear = year
	let shiftedMonth = (month + shift)
	while (shiftedMonth < 1) {
		shiftedMonth += 12
		shiftedYear--
	}
	while (shiftedMonth > 12) {
		shiftedMonth -= 12
		shiftedYear++
	}
	return [shiftedYear, shiftedMonth]
}
