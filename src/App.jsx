import { ThemeProvider } from 'styled-components';
import { theme } from '@styles/theme.js';
import { router } from './router/Router.jsx';
import { RouterProvider } from 'react-router-dom';
const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <RouterProvider router={router}></RouterProvider>
        </ThemeProvider>
    );
};

export default App;
