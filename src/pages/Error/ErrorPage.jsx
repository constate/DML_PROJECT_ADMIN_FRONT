import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

export const ErrorPage = () => {
    const navigate = useNavigate();

    return (
        <Container>
            <ContentWrapper>
                <div>
                    <ErrorCode>404</ErrorCode>
                    <Title>페이지를 찾을 수 없습니다</Title>
                    <Description>
                        요청하신 페이지가 존재하지 않거나 이동되었을 수
                        있습니다.
                    </Description>
                </div>

                <Divider>
                    <DividerText>다음 옵션을 이용해보세요</DividerText>
                </Divider>

                <ButtonGroup>
                    <OutlineButton onClick={() => navigate(-1)}>
                        이전 페이지로 돌아가기
                    </OutlineButton>
                    <PrimaryButton as={Link} to="/">
                        홈으로 이동하기
                    </PrimaryButton>
                </ButtonGroup>

                <Footer>Copyright © {new Date().getFullYear()}</Footer>
            </ContentWrapper>
        </Container>
    );
};

const Container = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f9fafb;
    padding: 2rem 1rem;
`;

const ContentWrapper = styled.div`
    max-width: 500px;
    width: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

const ErrorCode = styled.h1`
    font-size: 9rem;
    font-weight: 800;
    color: #06402b;
    line-height: 1;
    margin: 0;
`;

const Title = styled.h2`
    font-size: 2rem;
    font-weight: 700;
    color: #111827;
    margin: 1rem 0 0.5rem;
`;

const Description = styled.p`
    font-size: 1rem;
    color: #6b7280;
    margin: 0;
`;

const Divider = styled.div`
    position: relative;
    padding: 1.5rem 0;

    &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 1px;
        background-color: #e5e7eb;
    }
`;

const DividerText = styled.span`
    position: relative;
    padding: 0 0.75rem;
    background-color: #f9fafb;
    color: #6b7280;
    font-size: 0.875rem;
`;

const ButtonGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    @media (min-width: 640px) {
        flex-direction: row;
        justify-content: center;
        gap: 1rem;
    }
`;

const Button = styled.button`
    padding: 0.625rem 1rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

    &:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
    }
`;

const OutlineButton = styled(Button)`
    border: 1px solid #06402b;
    background-color: white;
    color: #06402b;

    &:hover {
        background-color: #e8e9ed;
    }
`;

const PrimaryButton = styled(Button)`
    border: 1px solid transparent;
    background-color: #06402b;
    color: white;
    text-decoration: none;
    &:hover {
        background-color: #0a5f40;
    }
`;

const Footer = styled.div`
    padding-top: 2rem;
    color: #9ca3af;
    font-size: 0.875rem;
`;
