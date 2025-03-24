import axios from 'axios';

const SHEET_ID = '1H3INGTYUqMps3DT9snGus4AGLoFoPszdd77sGYOGkcM';
const API_KEY = import.meta.env.VITE_DML_GOOGLE_API_KEY || '';

export async function fetchTranslations() {
    try {
        const response = await axios.get(
            // `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}?key=${API_KEY}`,
            `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/data?key=${API_KEY}`,
        );

        console.log('response.data', response.data);
        const rows = response.data.values;
        console.log(rows);
        if (!rows || rows.length === 0) {
            throw new Error('No data found in the spreadsheet');
        }

        const headers = rows[0];
        const keyIndex = headers.indexOf('key');
        const translations = {};

        // 모든 언어 코드 초기화
        headers.forEach((header, index) => {
            if (index !== keyIndex && header.startsWith('LANG_')) {
                translations[header] = {};
            }
        });

        // 번역 데이터 구성
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const key = row[keyIndex];

            if (key) {
                headers.forEach((header, index) => {
                    if (index !== keyIndex && header.startsWith('LANG_')) {
                        translations[header][key] = row[index] || '';
                    }
                });
            }
        }

        return translations;
    } catch (error) {
        console.error('Error fetching translations:', error);
        return null;
    }
}
