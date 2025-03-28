const fs = require('fs');
const mkdirp = require('mkdirp');
const {
    loadSpreadsheet,
    localesPath,
    ns,
    lngs,
    sheetId,
    columnKeyToHeader,
    NOT_AVAILABLE_CELL,
} = require('./index');
console.log('localesPath', localesPath);
console.log('lngs', lngs);
console.log('ns', ns);

/**
 * fetch translations from google spread sheet and transform to json
 * @param {GoogleSpreadsheet} doc GoogleSpreadsheet document
 * @returns [object] translation map
 * {
 *   "ko-KR": {
 *     "key": "value"
 *   },
 *   "en-US": {
 *     "key": "value"
 *   },
 *   "ja-JP": {
 *     "key": "value"
 *   },
 * }
 */

async function fetchTranslationsFromSheetToJson(doc) {
    const sheet = doc.sheetsById[sheetId];
    if (!sheet) {
        return {};
    }

    // 먼저 헤더 정보를 로드
    await sheet.loadHeaderRow();
    console.log('Headers:', sheet.headerValues);

    const lngsMap = {};
    const rows = await sheet.getRows();

    rows.forEach((row) => {
        // 좀 더 디버깅을 위한 로그
        console.log('Raw Row:', row);
        console.log('Row Keys:', Object.keys(row));

        // row 객체에서 직접 KEY 값 가져오기
        const key = row.get('KEY');

        console.log('Extracted Key:', key);

        if (!key) {
            console.warn('Key is undefined for this row');
            return;
        }

        lngs.forEach((lng) => {
            // get() 메서드 사용
            const translation = row.get(columnKeyToHeader[lng]);

            // NOT_AVAILABLE_CELL("_N/A") means no related language
            if (translation === NOT_AVAILABLE_CELL) {
                return;
            }

            if (!lngsMap[lng]) {
                lngsMap[lng] = {};
            }

            lngsMap[lng][key] = translation || ''; // prevent to remove undefined value like ({"key": undefined})
        });
    });

    return lngsMap;
}

function checkAndMakeLocaleDir(dirPath, subDirs) {
    return new Promise((resolve) => {
        subDirs.forEach((subDir, index) => {
            mkdirp(`${dirPath}/${subDir}`, (err) => {
                if (err) {
                    throw err;
                }

                if (index === subDirs.length - 1) {
                    resolve();
                }
            });
        });
    });
}

async function updateJsonFromSheet() {
    await checkAndMakeLocaleDir(localesPath, lngs);

    const doc = await loadSpreadsheet();
    const lngsMap = await fetchTranslationsFromSheetToJson(doc);
    console.log('lngsMap', lngsMap);

    fs.readdir(localesPath, (error, lngs) => {
        if (error) {
            throw error;
        }

        lngs.forEach((lng) => {
            const localeJsonFilePath = `${localesPath}/${lng}/${ns}.json`;

            const jsonString = JSON.stringify(lngsMap[lng], null, 2);

            fs.writeFile(localeJsonFilePath, jsonString, 'utf8', (err) => {
                if (err) {
                    throw err;
                }
            });
        });
    });
}

updateJsonFromSheet();
