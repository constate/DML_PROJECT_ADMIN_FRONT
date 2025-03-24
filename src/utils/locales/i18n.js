import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { fetchTranslations } from './fetchTranslations';

// 기본 번역 (시트 데이터 로드 전 대체)
import englishCommonJson from '@utils/locales/translationEN.json';
import koreanCommonJson from '@utils/locales/translationKO.json';
import japanCommonJson from '@utils/locales/translationJP.json';

const defaultResources = {
    LANG_EN: {
        translation: englishCommonJson,
    },
    LANG_KO: {
        translation: koreanCommonJson,
    },
    LANG_JP: {
        translation: japanCommonJson,
    },
};

// i18n 초기화 (기본 번역으로 먼저 설정)
i18n.use(initReactI18next).init({
    resources: defaultResources,
    lng: 'LANG_KO',
    fallbackLng: 'LANG_EN',
    interpolation: {
        escapeValue: false,
    },
});

// 구글 시트에서 번역 로드
async function loadTranslationsFromSheet() {
    const translations = await fetchTranslations();

    if (translations) {
        // 각 언어 번역 데이터 추가
        Object.keys(translations).forEach((langCode) => {
            i18n.addResourceBundle(
                langCode,
                'translation',
                translations[langCode],
                true,
                true,
            );
        });
        console.log('Translations loaded from Google Sheets');
    }
}

// 앱이 시작될 때 번역 로드
loadTranslationsFromSheet();

export default i18n;
