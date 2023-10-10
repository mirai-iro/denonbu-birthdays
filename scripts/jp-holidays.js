import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JP_GOV_HOLIDAYS_CSV = 'https://www8.cao.go.jp/chosei/shukujitsu/syukujitsu.csv';

const dst_json_file = `${__dirname}/../src/calendar/jp_holidays.json`;

const min_year = parseInt(process.argv[2], 10) || 2000;

fetch(JP_GOV_HOLIDAYS_CSV).then((response) => {
	if (!(response.ok)) {
		console.error(response);
		throw new Error('network error.');
	}
	return response.arrayBuffer()
}).then((response_data) => {
	const sjis_decoder = new TextDecoder('Shift_JIS');
	return sjis_decoder.decode(response_data)
}).then((response_text) => {
	const holidays = [];
	const lines = response_text.split("\r\n");
	for (let idx = 1; idx < lines.length; idx++) {
		let [date, jp_holiday_ja_text] = (lines[idx] ?? '').split(',');
		if (date === '') {
			continue;
		}
		const [year, month, day] = date.split('/').map((item) => { return parseInt(item, 10) });
		if (year < min_year) {
			continue;
		}
		if (jp_holiday_ja_text === '休日') {
			jp_holiday_ja_text = '国民の休日'
		}
		holidays.push([[year, month, day], jp_holiday_ja_text]);
	}
	fs.writeFileSync(dst_json_file, JSON.stringify(holidays));
});
