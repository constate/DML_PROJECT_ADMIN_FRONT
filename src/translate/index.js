const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
// const creds = require('../credentials/LanguageProjectIAM.json');
const creds = require('../../credentials/LanguageProjectIAM.json');
const i18nextConfig = require('../../i18next-scanner.config');

const spreadsheetDocId = '1H3INGTYUqMps3DT9snGus4AGLoFoPszdd77sGYOGkcM';
const ns = 'translation';
const lngs = i18nextConfig.options.lngs;
const loadPath = i18nextConfig.options.resource.loadPath;
const localesPath = loadPath.replace('/{{lng}}/{{ns}}.json', '');
const rePluralPostfix = new RegExp(/_plural|_[\d]/g);
const sheetId = 2109970465; // sheet gid 입력하기
const NOT_AVAILABLE_CELL = '_N/A';
const columnKeyToHeader = {
    key: 'KEY',
    'ko-KR': 'ko-KR',
    'en-US': 'en-US',
    'ja-JP': 'ja-JP',
};

/**
 * getting started from https://theoephraim.github.io/node-google-spreadsheet
 */
async function loadSpreadsheet() {
    // eslint-disable-next-line no-console
    console.info(
        '\u001B[32m',
        '=====================================================================================================================\n',
        '# i18next auto-sync using Spreadsheet\n\n',
        '  * Download translation resources from Spreadsheet and make /assets/locales/{{lng}}/{{ns}}.json\n',
        '  * Upload translation resources to Spreadsheet.\n\n',
        `The Spreadsheet for translation is here (\u001B[34mhttps://docs.google.com/spreadsheets/d/${spreadsheetDocId}/#gid=${sheetId}\u001B[0m)\n`,
        '=====================================================================================================================',
        '\u001B[0m',
    );

    // spreadsheet key is the long id in the sheets URL
    // const doc = new GoogleSpreadsheet(spreadsheetDocId);
    // console.log(doc);

    const serviceAccountAuth = new JWT({
        email: creds.client_email,
        key: creds.private_key,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(spreadsheetDocId, serviceAccountAuth);

    await doc.loadInfo(); // loads document properties and worksheets

    return doc;
}

function getPureKey(key = '') {
    return key.replace(rePluralPostfix, '');
}

module.exports = {
    localesPath,
    loadSpreadsheet,
    getPureKey,
    ns,
    lngs,
    sheetId,
    columnKeyToHeader,
    NOT_AVAILABLE_CELL,
};
