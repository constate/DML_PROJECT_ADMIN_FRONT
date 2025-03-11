import reset from 'styled-reset';
import { createGlobalStyle, styled } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
    ${reset};
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
`;

export const Container = styled.div`
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
    background-color: ${(props) => props.theme.colors.background};
    border-radius: 30px;
    overflow: hidden;
    position: relative;
    height: 100vh;
    display: flex;
    flex-direction: column;

    @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
        max-width: 100%;
        padding: 15px;
        border-radius: 0;
    }
`;
