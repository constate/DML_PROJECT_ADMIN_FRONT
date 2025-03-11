import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import englishCommonJson from '@utils/locales/translationEN.json';
import koreanCommonJson from '@utils/locales/translationKO.json';
import japanCommonJson from '@utils/locales/translationJP.json';

i18n.use(initReactI18next).init({
    resources: {
        LANG_EN: {
            translation: {
                ...englishCommonJson,
            },
        },
        LANG_KO: {
            translation: {
                ...koreanCommonJson,
            },
        },
        LANG_JP: {
            translation: {
                ...japanCommonJson,
            },
        },
    },
    lng: 'LANG_KO',
    fallbackLng: 'LANG_EN',
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
