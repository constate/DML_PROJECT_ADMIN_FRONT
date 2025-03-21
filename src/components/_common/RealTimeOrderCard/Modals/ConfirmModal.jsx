import React, { useState, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';

// 개선된 ConfirmModal 컴포넌트
export const ConfirmModal = ({
    isOpen,
    onClose,
    title,
    message,
    onConfirm,
    confirmText = '확인',
    cancelText = '취소',
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 420);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 420);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 300);
            document.body.style.overflow = '';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible) return null;

    return (
        <ModalOverlay isOpen={isOpen} onClick={onClose} isMobile={isMobile}>
            <ConfirmContainer
                isOpen={isOpen}
                isMobile={isMobile}
                onClick={(e) => e.stopPropagation()}
            >
                <ModalHeader>
                    <ModalTitle>{title}</ModalTitle>
                    <CloseButton onClick={onClose}>
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M18 6L6 18M6 6L18 18"
                                stroke="#667085"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </CloseButton>
                </ModalHeader>

                <ModalContent>
                    <Message>{message}</Message>
                </ModalContent>

                <ModalFooter>
                    <ActionButton variant="secondary" onClick={onClose}>
                        {cancelText}
                    </ActionButton>
                    <ActionButton variant="primary" onClick={onConfirm}>
                        {confirmText}
                    </ActionButton>
                </ModalFooter>

                {isMobile && <BottomSafeArea />}
            </ConfirmContainer>
        </ModalOverlay>
    );
};

// 개선된 모달 애니메이션
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const slideUp = keyframes`
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const slideDown = keyframes`
  from { transform: translateY(0); opacity: 1; }
  to { transform: translateY(50px); opacity: 0; }
`;

const scaleIn = keyframes`
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

const scaleOut = keyframes`
  from { transform: scale(1); opacity: 1; }
  to { transform: scale(0.95); opacity: 0; }
`;

// 개선된 스타일 컴포넌트
const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(16, 24, 40, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: ${(props) => (props.isMobile ? 'flex-end' : 'center')};
    justify-content: center;
    z-index: 1000;
    animation: ${(props) => (props.isOpen ? fadeIn : fadeOut)} 0.25s ease-out;
    will-change: opacity;
`;

const ConfirmContainer = styled.div`
    background-color: white;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    width: ${(props) => (props.isMobile ? '100%' : '420px')};
    max-width: ${(props) => (props.isMobile ? '100%' : '420px')};
    display: flex;
    flex-direction: column;
    overflow: hidden;
    will-change: transform, opacity;

    ${(props) => {
        if (props.isMobile) {
            return css`
                border-top-left-radius: 24px;
                border-top-right-radius: 24px;
                margin-bottom: env(safe-area-inset-bottom, 0px);
                animation: ${props.isOpen ? slideUp : slideDown} 0.3s
                    cubic-bezier(0.16, 1, 0.3, 1);
            `;
        } else {
            return css`
                border-radius: 16px;
                max-height: 90vh;
                animation: ${props.isOpen ? scaleIn : scaleOut} 0.25s
                    cubic-bezier(0.16, 1, 0.3, 1);
            `;
        }
    }}
`;

const ModalHeader = styled.div`
    padding: 20px 24px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const ModalTitle = styled.h2`
    font-size: 18px;
    font-weight: 600;
    color: #101828;
    margin: 0;
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.2s;
    color: #667085;
    margin: -8px;

    &:hover {
        background-color: #f9fafb;
    }
`;

const ModalContent = styled.div`
    padding: 8px 24px 24px;
    flex: 1;
`;

const Message = styled.p`
    font-size: 15px;
    color: #4d5761;
    margin: 0;
    line-height: 1.6;
`;

const ModalFooter = styled.div`
    padding: 16px 24px 24px;
    display: flex;
    gap: 12px;
`;

const ActionButton = styled.button`
    flex: 1;
    height: 44px;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;

    ${(props) => {
        if (props.variant === 'primary') {
            return css`
                background-color: #3182f6;
                color: white;
                border: none;
                box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);

                &:hover {
                    background-color: #1c64f2;
                }

                &:active {
                    background-color: #1a56db;
                    transform: translateY(1px);
                }
            `;
        } else {
            return css`
                background-color: white;
                color: #4b5563;
                border: 1px solid #e5e7eb;
                box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);

                &:hover {
                    background-color: #f9fafb;
                    border-color: #d1d5db;
                }

                &:active {
                    background-color: #f3f4f6;
                    transform: translateY(1px);
                }
            `;
        }
    }}
`;

// iOS 안전 영역을 위한 바닥 여백
const BottomSafeArea = styled.div`
    height: env(safe-area-inset-bottom, 0px);
    background-color: white;
`;
