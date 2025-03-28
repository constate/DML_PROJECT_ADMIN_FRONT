import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GlobalStyles } from '@styles/GlobalStyles.js';
import { I18nextProvider } from 'react-i18next';
import './index.css';
import App from './App.jsx';
import ChannelService from '@utils/channelTalk/ChannelService';
import { i18n, initializeI18next } from './plugins/i18next';
initializeI18next();

ChannelService.loadScript();
const CHANNEL_SERVICE_KEY = import.meta.env.VITE_DML_CHANNEL_SERVICE_KEY || '';
ChannelService.boot({
    pluginKey: CHANNEL_SERVICE_KEY,
});
ChannelService.hideChannelButton();

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <I18nextProvider i18n={i18n}>
            <GlobalStyles />
            <App />
        </I18nextProvider>
    </StrictMode>,
);
