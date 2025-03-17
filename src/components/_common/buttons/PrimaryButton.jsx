import { styled } from 'styled-components';

export const PrimaryButton = ({ children }) => {
    return <Button>{children}</Button>;
};

const Button = styled.button`
    width: 100%;
    padding: 14px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;
    background-color: #06402b;
    color: white;
    &:hover {
        background-color: #0a5f40;
    }
    &:active {
        background-color: #032818;
    }
    &:disabled {
        background-color: #adb5bd;
        cursor: not-allowed;
    }
`;
