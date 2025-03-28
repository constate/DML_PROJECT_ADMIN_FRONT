import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css, keyframes } from 'styled-components';

// 상세보기 모달 컴포넌트
export const DetailModal = ({ isOpen, onClose, order }) => {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);

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

    const formatTime = (date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    // 총액 계산
    const calculateTotal = () => {
        return order.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
        );
    };

    return (
        <ModalOverlay isOpen={isOpen} onClick={onClose}>
            <DetailModalContainer
                isOpen={isOpen}
                onClick={(e) => e.stopPropagation()}
            >
                <ModalHeader>
                    <TableInfo>
                        <TableNumber>
                            {t('{number}번 테이블', {
                                number: order.tableNumber,
                            })}
                        </TableNumber>
                        <OrderTime>{formatTime(order.orderTime)}</OrderTime>
                    </TableInfo>
                    <CloseButton onClick={onClose}>
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M18 6L6 18M6 6L18 18"
                                stroke="#191F28"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </CloseButton>
                </ModalHeader>

                <ModalContent>
                    <Section>
                        <SectionTitle>{t('주문 내역')}</SectionTitle>
                        <ItemList>
                            {order.items.map((item, index) => (
                                <Item key={index}>
                                    <ItemInfo>
                                        <ItemName>{item.name}</ItemName>
                                        <ItemQuantity>
                                            {t('수량 {count}개', {
                                                count: item.quantity,
                                            })}
                                        </ItemQuantity>
                                    </ItemInfo>
                                    <ItemPrice>
                                        {t('{price}원', {
                                            price: (
                                                item.price * item.quantity
                                            ).toLocaleString(),
                                        })}
                                    </ItemPrice>
                                </Item>
                            ))}
                        </ItemList>
                    </Section>

                    <Divider />

                    <Section>
                        <TotalAmountRow>
                            <TotalLabel>{t('총 금액')}</TotalLabel>
                            <TotalAmount>
                                {t('{price}원', {
                                    price: calculateTotal().toLocaleString(),
                                })}
                            </TotalAmount>
                        </TotalAmountRow>
                    </Section>

                    <StatusSection>
                        <SectionTitle>{t('주문 상태')}</SectionTitle>
                        <StatusBadge status={order.status}>
                            {order.status === 'pending' && t('접수 대기')}
                            {order.status === 'inProgress' && t('처리 중')}
                            {order.status === 'completed' && t('완료')}
                            {order.status === 'cancelled' && t('취소됨')}
                        </StatusBadge>
                    </StatusSection>
                </ModalContent>

                <ModalFooter>
                    <ActionButton variant="secondary" onClick={onClose}>
                        {t('닫기')}
                    </ActionButton>
                    <ActionButton
                        variant="primary"
                        disabled={
                            order.status === 'cancelled' ||
                            order.status === 'completed'
                        }
                        onClick={() => console.log('주문 처리 액션')}
                    >
                        {order.status === 'pending'
                            ? t('주문 접수')
                            : t('완료 처리')}
                    </ActionButton>
                </ModalFooter>
            </DetailModalContainer>
        </ModalOverlay>
    );
};

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const slideUp = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`;

const slideDown = keyframes`
  from { transform: translateY(0); }
  to { transform: translateY(100%); }
`;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: ${(props) => (props.isOpen ? fadeIn : fadeOut)} 0.3s ease-in-out;
`;

const DetailModalContainer = styled.div`
    background-color: white;
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: ${(props) => (props.isOpen ? fadeIn : fadeOut)} 0.3s ease-in-out;

    @media (max-width: 420px) {
        width: 100%;
        height: 100%;
        max-height: 100vh;
        border-radius: 0;
    }
`;

const ModalHeader = styled.div`
    padding: 20px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f2f4f6;
`;

const TableInfo = styled.div`
    display: flex;
    flex-direction: column;
`;

const TableNumber = styled.h2`
    font-size: 18px;
    font-weight: 700;
    color: #191f28;
    margin: 0;
`;

const OrderTime = styled.span`
    font-size: 14px;
    color: #6b7684;
    margin-top: 4px;
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.2s;

    &:hover {
        background-color: #f2f4f6;
    }
`;

const ModalContent = styled.div`
    padding: 16px;
    flex: 1;
    overflow-y: auto;
`;

const Section = styled.div`
    margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
    font-size: 16px;
    font-weight: 600;
    color: #191f28;
    margin: 0 0 12px 0;
`;

const ItemList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const Item = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const ItemInfo = styled.div`
    display: flex;
    flex-direction: column;
`;

const ItemName = styled.span`
    font-size: 15px;
    color: #191f28;
    font-weight: 500;
`;

const ItemQuantity = styled.span`
    font-size: 13px;
    color: #6b7684;
    margin-top: 2px;
`;

const ItemPrice = styled.span`
    font-size: 15px;
    color: #191f28;
    font-weight: 500;
`;

const Divider = styled.div`
    height: 1px;
    background-color: #f2f4f6;
    margin: 16px 0;
`;

const TotalAmountRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
`;

const TotalLabel = styled.span`
    font-size: 16px;
    font-weight: 600;
    color: #191f28;
`;

const TotalAmount = styled.span`
    font-size: 18px;
    font-weight: 700;
    color: #3182f6;
`;

const StatusSection = styled.div`
    margin-top: 24px;
`;

const StatusBadge = styled.div`
    display: inline-flex;
    padding: 6px 12px;
    border-radius: 16px;
    font-size: 14px;
    font-weight: 500;

    ${(props) => {
        switch (props.status) {
            case 'pending':
                return css`
                    background-color: #fff8e1;
                    color: #f59f00;
                `;
            case 'inProgress':
                return css`
                    background-color: #e7f5ff;
                    color: #3182f6;
                `;
            case 'completed':
                return css`
                    background-color: #ebfbee;
                    color: #40c057;
                `;
            case 'cancelled':
                return css`
                    background-color: #fff5f5;
                    color: #fa5252;
                `;
            default:
                return css`
                    background-color: #f2f4f6;
                    color: #6b7684;
                `;
        }
    }}
`;

const ModalFooter = styled.div`
    padding: 16px;
    display: flex;
    gap: 8px;
    border-top: 1px solid #f2f4f6;
`;

const ActionButton = styled.button`
    flex: 1;
    height: 48px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    ${(props) => {
        if (props.variant === 'primary') {
            return css`
                background-color: #3182f6;
                color: white;
                border: none;

                &:hover {
                    background-color: #1c64f2;
                }

                &:disabled {
                    background-color: #e5e7eb;
                    color: #9ca3af;
                    cursor: not-allowed;
                }
            `;
        } else {
            return css`
                background-color: white;
                color: #4b5563;
                border: 1px solid #e5e7eb;

                &:hover {
                    background-color: #f9fafb;
                }
            `;
        }
    }}
`;
