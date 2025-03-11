import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GlobalStyles } from '@styles/GlobalStyles.js';
import './index.css';
import App from './App.jsx';
import '@utils/locales/i18n';
import ChannelService from '@utils/channelTalk/ChannelService';

ChannelService.loadScript();
const CHANNEL_SERVICE_KEY = import.meta.env.VITE_DML_CHANNEL_SERVICE_KEY || '';
ChannelService.boot({
    pluginKey: CHANNEL_SERVICE_KEY,
});
ChannelService.showChannelButton();

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <GlobalStyles />
        <App />
    </StrictMode>
);
