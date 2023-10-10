import type { CalendarEvent } from './CalendarEvent'

export type CalendarDay = {
	date: Date
	isThisMonth: boolean
	holiday?: CalendarEvent
	isHighlight: boolean
	calendarEvents?: CalendarEvent[]
}
