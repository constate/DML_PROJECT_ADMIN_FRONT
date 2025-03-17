import { styled } from 'styled-components';

export const AccentButton = (children) => {
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
    transition: all 0.2s ease;
    background-color: #f2c94c;
    color: #2d3436;
    &:hover {
        background-color: #f4d06f;
    }
    &:active {
        background-color: #d9b43d;
    }
    &:disabled {
        background-color: #b2bec3;
        cursor: not-allowed;
    }
`;
