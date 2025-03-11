import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GlobalStyles } from './styles/GlobalStyles.js';
import './index.css';
import App from './App.jsx';
import '@utils/locales/i18n';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <GlobalStyles />
        <App />
    </StrictMode>,
);
