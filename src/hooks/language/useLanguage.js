import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const useLanguage = () => {
    const { i18n } = useTranslation();

    const changeLanguage = useCallback(
        (lng) => {
            i18n.changeLanguage(lng);
        },
        [i18n],
    );

    const toggleLanguage = useCallback(() => {
        const currentLanguage = i18n.language;
        const newLanguage =
            currentLanguage === 'LANG_EN' ? 'LANG_KO' : 'LANG_EN';
        changeLanguage(newLanguage);
    }, [i18n, changeLanguage]);

    return {
        currentLanguage: i18n.language,
        changeLanguage,
        toggleLanguage,
    };
};

export default useLanguage;
