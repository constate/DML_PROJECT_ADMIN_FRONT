const fs = require('fs');
const {
    loadSpreadsheet,
    localesPath,
    getPureKey,
    ns,
    lngs,
    sheetId,
    columnKeyToHeader,
    NOT_AVAILABLE_CELL,
} = require('./index');

const headerValues = ['KEY', 'ko-KR', 'en-US', 'ja-JP'];

async function addNewSheet(doc, title, sheetId) {
    const sheet = await doc.addSheet({
        // sheetId,
        title,
        headerValues,
    });

    return sheet;
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}_${month}_${day}_${hours}${minutes}${seconds}`;
}

// 예제 실행
console.log(formatDate(new Date())); // 예: 2025_03_26_153045

async function updateTranslationsFromKeyMapToSheet(doc, keyMap) {
    const title = `Sheet_${formatDate(new Date())}`; // 고유한 이름으로 시트 타이틀 설정 (날짜+uuid)
    const sheet = await addNewSheet(doc, title, sheetId); // 새로운 시트를 추가

    const rows = await sheet.getRows();

    // 기존 시트의 KEY 목록을 Set에 저장 (빠른 조회 가능)
    const existingKeys = new Set(rows.map((row) => row[columnKeyToHeader.key]));

    const addedRows = [];
    for (const [key, translations] of Object.entries(keyMap)) {
        if (!existingKeys.has(key)) {
            // 기존 시트에 없는 경우만 추가
            const row = {
                [columnKeyToHeader.key]: key,
                ...Object.keys(translations).reduce((result, lng) => {
                    const header = columnKeyToHeader[lng];
                    result[header] = translations[lng] || NOT_AVAILABLE_CELL;
                    return result;
                }, {}),
            };
            addedRows.push(row);
        }
    }

    if (addedRows.length > 0) {
        await sheet.addRows(addedRows);
        console.log(`${addedRows.length}개의 새로운 키가 추가되었습니다.`);
    } else {
        console.log('새롭게 추가할 키가 없습니다.');
    }
}

// async function updateTranslationsFromKeyMapToSheet(doc, keyMap) {
//     const title = `Sheet_${new Date().toISOString()}`; // 고유한 이름으로 시트 타이틀 설정 (날짜 기반)
//     const sheet = await addNewSheet(doc, title, sheetId); // 새로운 시트를 추가

//     const addedRows = [];
//     for (const [key, translations] of Object.entries(keyMap)) {
//         // 새로운 키를 시트에 추가
//         const row = {
//             [columnKeyToHeader.key]: key,
//             ...Object.keys(translations).reduce((result, lng) => {
//                 const header = columnKeyToHeader[lng];
//                 result[header] = translations[lng] || NOT_AVAILABLE_CELL;
//                 return result;
//             }, {}),
//         };
//         addedRows.push(row);
//     }

//     if (addedRows.length > 0) {
//         await sheet.addRows(addedRows); // 새로운 시트에 번역 항목 추가
//         console.log(
//             `${addedRows.length}개의 새로운 키가 ${title} 시트에 추가되었습니다.`,
//         );
//     } else {
//         console.log('새롭게 추가할 키가 없습니다.');
//     }
// }

function toJson(keyMap) {
    const json = {};

    Object.entries(keyMap).forEach(([__, keysByPlural]) => {
        for (const [keyWithPostfix, translations] of Object.entries(
            keysByPlural,
        )) {
            json[keyWithPostfix] = {
                ...translations,
            };
        }
    });

    return json;
}

function gatherKeyMap(keyMap, lng, json) {
    for (const [keyWithPostfix, translated] of Object.entries(json)) {
        const key = getPureKey(keyWithPostfix);

        if (!keyMap[key]) {
            keyMap[key] = {};
        }

        const keyMapWithLng = keyMap[key];
        if (!keyMapWithLng[keyWithPostfix]) {
            keyMapWithLng[keyWithPostfix] = lngs.reduce((initObj, lng) => {
                initObj[lng] = NOT_AVAILABLE_CELL;

                return initObj;
            }, {});
        }

        keyMapWithLng[keyWithPostfix][lng] = translated;
    }
}

async function updateSheetFromJson() {
    const doc = await loadSpreadsheet();

    fs.readdir(localesPath, (error, lngs) => {
        if (error) {
            throw error;
        }

        const keyMap = {};

        lngs.forEach((lng) => {
            const localeJsonFilePath = `${localesPath}/${lng}/${ns}.json`;

            // eslint-disable-next-line no-sync
            const json = fs.readFileSync(localeJsonFilePath, 'utf8');

            gatherKeyMap(keyMap, lng, JSON.parse(json));
        });

        updateTranslationsFromKeyMapToSheet(doc, toJson(keyMap));
    });
}

updateSheetFromJson();
