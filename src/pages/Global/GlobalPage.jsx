import { useTranslation } from 'react-i18next';
export const GlobalPage = () => {
    const { t } = useTranslation();
    return <div>{t('hello')}</div>;
};
