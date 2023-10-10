
export type AppConfig = {
	startDate: Date
	upcomingDays: number
	brandsTitle: string
	enableBrandsBadge: boolean
	enableBookmark: boolean
	detailNotes: string
}

const defaultValue: AppConfig = {
	startDate: new Date('2000-01-01'),
	upcomingDays: 30,
	brandsTitle: '登場作品',
	enableBrandsBadge: false,
	enableBookmark: false,
	detailNotes: '',
}

export default defaultValue
