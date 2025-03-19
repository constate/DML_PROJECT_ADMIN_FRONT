import React, { useState } from 'react';
import styled from 'styled-components';

export const RealTimeOrderCard = ({ order, onStatusChange, onCancel }) => {
    const [isDisabled, setIsDisabled] = useState(order.status === 'completed');

    const handleStatusChange = () => {
        let newStatus;
        switch (order.status) {
            case 'pending':
                newStatus = 'inProgress';
                break;
            case 'inProgress':
                newStatus = 'completed';
                setIsDisabled(true);
                break;
            default:
                return;
        }
        onStatusChange(order.id, newStatus);
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending':
                return '수락대기';
            case 'inProgress':
                return '제조중';
            case 'completed':
                return '완료';
            case 'cancelled':
                return '취소';
            default:
                return '';
        }
    };

    const getActionButtonText = (status) => {
        switch (status) {
            case 'pending':
                return '주문수락';
            case 'inProgress':
                return '완료';
            default:
                return '완료';
        }
    };

    const formatTime = (dateTime) => {
        const date = new Date(dateTime);
        return `${date.getHours()}:${date
            .getMinutes()
            .toString()
            .padStart(2, '0')}`;
    };

    return (
        <CardContainer>
            <StatusBadge status={order.status}>
                {getStatusText(order.status)}
            </StatusBadge>

            <TitleSection>
                <Title>테이블 {order.tableNumber}</Title>
                <OrderTime>{formatTime(order.orderTime)}</OrderTime>
            </TitleSection>

            <InfoSection>
                <InfoLabel>주문 내역</InfoLabel>
                <OrderItems>
                    {order.items.map((item, index) => (
                        <OrderItem key={index}>
                            <ItemName>{item.name}</ItemName>
                            <ItemQuantity>x{item.quantity}</ItemQuantity>
                        </OrderItem>
                    ))}
                </OrderItems>
            </InfoSection>

            <TotalSection>
                <TotalLabel>총 금액</TotalLabel>
                <TotalAmount>
                    {order.totalAmount.toLocaleString()}원
                </TotalAmount>
            </TotalSection>

            <ButtonContainer>
                <CancelButton
                    onClick={() => onCancel(order.id)}
                    disabled={isDisabled}
                >
                    주문취소
                </CancelButton>
                <ActionButton
                    status={order.status}
                    onClick={handleStatusChange}
                    disabled={isDisabled || order.status === 'cancelled'}
                >
                    {getActionButtonText(order.status)}
                </ActionButton>
            </ButtonContainer>
        </CardContainer>
    );
};

const CardContainer = styled.div`
    background-color: white;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    margin-bottom: 16px;
    position: relative;
    border: 1px solid #f2f4f6;
`;

const StatusBadge = styled.div`
    position: absolute;
    top: 20px;
    right: 20px;
    padding: 6px 12px;
    border-radius: 100px;
    font-size: 12px;
    font-weight: 600;

    ${({ status }) => {
        switch (status) {
            case 'pending':
                return `
          background-color: #FFF8E6;
          color: #F9A825;
        `;
            case 'inProgress':
                return `
          background-color: #E3F2FD;
          color: #1976D2;
        `;
            case 'completed':
                return `
          background-color: #E8F5E9;
          color: #2E7D32;
        `;
            case 'cancelled':
                return `
          background-color: #FFEBEE;
          color: #C62828;
        `;
            default:
                return '';
        }
    }}
`;

const TitleSection = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
`;

const Title = styled.h3`
    font-size: 18px;
    font-weight: 700;
    color: #191f28;
    margin: 0;
`;

const OrderTime = styled.span`
    font-size: 14px;
    color: #6b7684;
`;

const InfoSection = styled.div`
    margin-bottom: 16px;
`;

const InfoLabel = styled.p`
    font-size: 14px;
    color: #6b7684;
    margin: 0 0 8px 0;
`;

const OrderItems = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

const OrderItem = styled.div`
    display: flex;
    justify-content: space-between;
`;

const ItemName = styled.span`
    font-size: 15px;
    color: #333b47;
`;

const ItemQuantity = styled.span`
    font-size: 15px;
    color: #333b47;
    font-weight: 500;
`;

const TotalSection = styled.div`
    display: flex;
    justify-content: space-between;
    padding-top: 16px;
    margin-top: 12px;
    border-top: 1px solid #f2f4f6;
`;

const TotalLabel = styled.span`
    font-size: 15px;
    font-weight: 600;
    color: #191f28;
`;

const TotalAmount = styled.span`
    font-size: 16px;
    font-weight: 700;
    color: #191f28;
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 12px;
    margin-top: 20px;
`;

const Button = styled.button`
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const CancelButton = styled(Button)`
    flex: 1;
    background-color: #f2f4f6;
    color: #4e5968;

    &:hover:not(:disabled) {
        background-color: #e5e8eb;
    }
`;

const ActionButton = styled(Button)`
    flex: 1;
    ${({ status }) => {
        switch (status) {
            case 'pending':
                return `
          background-color: #3182F6;
          color: white;
          &:hover:not(:disabled) {
            background-color: #1B64DA;
          }
        `;
            case 'inProgress':
                return `
          background-color: #00C471;
          color: white;
          &:hover:not(:disabled) {
            background-color: #00A661;
          }
        `;
            default:
                return `
          background-color: #00C471;
          color: white;
          &:hover:not(:disabled) {
            background-color: #00A661;
          }
        `;
        }
    }}
`;
