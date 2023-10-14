
export type AppConfig = {
	startDate: Date
	upcomingDays: number
	brandsTitle: string
	enableBrandsBadge: boolean
	detailNotes: string
}

const appConfig: AppConfig = {
	startDate: new Date('2020-06-28'),
	upcomingDays: 0,
	brandsTitle: 'エリア',
	enableBrandsBadge: true,
	detailNotes: '※「パーソナルカラー」は、ASOBISTAGEの「アソビライト」に設定されている色です。',
}

export default appConfig
