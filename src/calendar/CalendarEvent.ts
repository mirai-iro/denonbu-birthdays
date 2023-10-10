
export type CalendarEvent = {
	id: number | string
	subject: string
	started_at: Date
	ended_at?: Date
	notes?: string
	color?: string
	mark?: string
	class_name?: string
}
