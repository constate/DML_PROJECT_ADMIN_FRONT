import React from 'react';
import { useTranslation } from 'react-i18next';

export const GlobalPage = () => {
    const { t, i18n } = useTranslation();
    return (
        <div>
            <h1>Translation Debug</h1>
            <div>
                {t('{count}중 {leftCount}개 남음', {
                    count: 1,
                    leftCount: 2,
                })}
            </div>
            <div>{t('{count}개 남음', { count: 123 })}</div>
            <div>{t('안녕하세요')}</div>
            <div>{t('안녕하세요123')}</div>
            <div>{t('안녕하세요345')}</div>
            <div>{t('안녕하세요678')}</div>
            <div>{t('안녕하세요1234')}</div>
        </div>
    );
};
