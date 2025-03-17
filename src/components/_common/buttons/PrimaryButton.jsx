import { styled } from 'styled-components';

export const PrimaryButton = ({ children }) => {
    return <Button>{children}</Button>;
};

const Button = styled.button`
    width: 100%;
    padding: 10px 16px;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    margin: 5px;
    transition: all 0.2s ease;
    background-color: #06402b;
    color: white;
    &:hover {
        background-color: #0a5f40;
    }
    &:active {
        background-color: #032818;
    }
`;
