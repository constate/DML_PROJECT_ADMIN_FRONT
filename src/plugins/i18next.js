import i18next from 'i18next';
import ko_KR from '../utils/locales/ko-KR/translation.json';
import en_US from '../utils/locales/en-US/translation.json';
import ja_JP from '../utils/locales/ja-JP/translation.json';
// import ko_KR from '../assets/locales/ko-KR/translation.json';
// import en_US from '../assets/locales/en-US/translation.json';
// import ja_JP from '../assets/locales/ja-JP/translation.json';
// import ko_KR from '../../assets/locales/ko-KR/translation.json';
// import en_US from '../../assets/locales/en-US/translation.json';
// import ja_JP from '../../assets/locales/ja-JP/translation.json';

const lngs = ['ko-KR', 'en-US', 'ja-JP'];
/**
 * Must add new language here
 * @param lng {Language} language
 * @returns {Object} json resource
 */
function loadResource(lng) {
    let module;

    switch (lng) {
        case 'ko-KR': {
            module = ko_KR;
            break;
        }
        case 'en-US': {
            module = en_US;
            break;
        }
        case 'ja-JP': {
            module = ja_JP;
            break;
        }
        default:
            break;
    }

    return module;
}

function getResources(lngs) {
    const resources = {};

    lngs.forEach((lng) => {
        resources[lng] = {
            translation: loadResource(lng),
        };
    });

    return resources;
}

export function initializeI18next(lng = 'ja-JP') {
    i18next.init({
        lng,
        fallbackLng: false,
        returnEmptyString: false,
        keySeparator: false,
        nsSeparator: false,
        returnObjects: false,
        interpolation: {
            prefix: '{',
            suffix: '}',
            // prefix: '%{',
            // suffix: '}',
            // escapeValue: false,
        },
        parseMissingKeyHandler(key) {
            /* eslint-disable-next-line no-console */
            console.warn('parseMissingKeyHandler', `'key': '${key}'`);
            const keySeparator = '~~';
            const value = key.includes(keySeparator)
                ? key.split(keySeparator)[1]
                : key;

            return value;
        },
        resources: getResources(lngs),
    });
}

export function changeLanguage(lng) {
    return i18next.changeLanguage(lng);
}

export const i18n = i18next;
