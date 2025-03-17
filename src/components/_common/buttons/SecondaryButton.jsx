import { styled } from 'styled-components';

export const SecondaryButton = (children) => {
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
    background-color: #f1f2f6;
    color: #06402b;
    border: 1px solid #06402b;
    &:hover {
        background-color: #e8e9ed;
    }
    &:active {
        background-color: #d8d9dd;
        color: #032818;
        border-color: #032818;
    }
`;
