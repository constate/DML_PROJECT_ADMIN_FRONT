import React, { useState } from 'react';
import styled from 'styled-components';

export const RealTimeOrderCard = ({ order, onStatusChange, onCancel }) => {
    const [isDisabled, setIsDisabled] = useState(order.status === 'completed');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);

    const handleStatusChange = () => {
        let newStatus;
        switch (order.status) {
            case 'pending':
                newStatus = 'inProgress';
                break;
            case 'inProgress':
                newStatus = 'completed';
                break;
            default:
                return;
        }
        setConfirmAction(() => () => {
            onStatusChange(order.id, newStatus);
            if (newStatus === 'completed') {
                setIsDisabled(true);
            }
        });
        setShowConfirmModal(true);
    };

    const handleCancel = () => {
        setConfirmAction(() => () => onCancel(order.id));
        setShowConfirmModal(true);
    };

    const confirmActionAndClose = () => {
        confirmAction();
        setShowConfirmModal(false);
    };

    const showDetails = () => {
        setShowDetailsModal(true);
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

    const getConfirmModalText = () => {
        if (order.status === 'pending' && confirmAction) {
            return '주문을 수락하시겠습니까?';
        } else if (order.status === 'inProgress' && confirmAction) {
            return '주문을 완료 처리하시겠습니까?';
        } else {
            return '주문을 취소하시겠습니까?';
        }
    };

    const calculateItemTotal = (item) => {
        return item.price * item.quantity;
    };

    return (
        <CardContainer>
            {/* Header Section - Fixed at top */}
            <CardHeader>
                <TitleSection>
                    <Title>테이블 {order.tableNumber}</Title>
                    <OrderTime>{formatTime(order.orderTime)}</OrderTime>
                </TitleSection>
                <StatusBadge status={order.status}>
                    {getStatusText(order.status)}
                </StatusBadge>
            </CardHeader>

            {/* Body Section - Scrollable */}
            <CardBody>
                <InfoSection>
                    <InfoHeaderRow>
                        <InfoLabel>주문 내역</InfoLabel>
                        <DetailButton onClick={showDetails}>
                            상세보기
                        </DetailButton>
                    </InfoHeaderRow>

                    <OrderItems>
                        {order.items.map((item, index) => (
                            <OrderItem key={index}>
                                <ItemInfo>
                                    <ItemName>{item.name}</ItemName>
                                    <ItemPrice>
                                        {item.price.toLocaleString()}원
                                    </ItemPrice>
                                </ItemInfo>
                                <ItemQuantity>X{item.quantity}</ItemQuantity>
                            </OrderItem>
                        ))}
                    </OrderItems>
                </InfoSection>
            </CardBody>

            {/* Footer Section - Fixed at bottom */}
            <CardFooter>
                <TotalSection>
                    <TotalLabel>총 금액</TotalLabel>
                    <TotalAmount>
                        {order.totalAmount.toLocaleString()}원
                    </TotalAmount>
                </TotalSection>

                <ButtonContainer>
                    <CancelButton onClick={handleCancel} disabled={isDisabled}>
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
            </CardFooter>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <ModalOverlay>
                    <ModalContent>
                        <ModalTitle>{getConfirmModalText()}</ModalTitle>
                        <ModalButtonContainer>
                            <ModalCancelButton
                                onClick={() => setShowConfirmModal(false)}
                            >
                                취소
                            </ModalCancelButton>
                            <ModalConfirmButton onClick={confirmActionAndClose}>
                                확인
                            </ModalConfirmButton>
                        </ModalButtonContainer>
                    </ModalContent>
                </ModalOverlay>
            )}

            {/* Details Modal */}
            {showDetailsModal && (
                <ModalOverlay>
                    <DetailsModalContent>
                        <ModalCloseButton
                            onClick={() => setShowDetailsModal(false)}
                        >
                            ✕
                        </ModalCloseButton>
                        <DetailsModalTitle>주문 상세정보</DetailsModalTitle>
                        <DetailsModalInfo>
                            <DetailsRow>
                                <DetailsLabel>테이블 번호:</DetailsLabel>
                                <DetailsValue>{order.tableNumber}</DetailsValue>
                            </DetailsRow>
                            <DetailsRow>
                                <DetailsLabel>주문 시간:</DetailsLabel>
                                <DetailsValue>
                                    {formatTime(order.orderTime)}
                                </DetailsValue>
                            </DetailsRow>
                            <DetailsRow>
                                <DetailsLabel>상태:</DetailsLabel>
                                <DetailsStatusBadge status={order.status}>
                                    {getStatusText(order.status)}
                                </DetailsStatusBadge>
                            </DetailsRow>
                        </DetailsModalInfo>

                        <DetailsModalSection>
                            <DetailsSectionTitle>주문 내역</DetailsSectionTitle>
                            <DetailsTable>
                                <thead>
                                    <tr>
                                        <DetailsTableHeader>
                                            메뉴
                                        </DetailsTableHeader>
                                        <DetailsTableHeader>
                                            단가
                                        </DetailsTableHeader>
                                        <DetailsTableHeader>
                                            수량
                                        </DetailsTableHeader>
                                        <DetailsTableHeader>
                                            금액
                                        </DetailsTableHeader>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items.map((item, index) => (
                                        <tr key={index}>
                                            <DetailsTableCell>
                                                {item.name}
                                            </DetailsTableCell>
                                            <DetailsTableCell>
                                                {item.price.toLocaleString()}원
                                            </DetailsTableCell>
                                            <DetailsTableCell>
                                                {item.quantity}
                                            </DetailsTableCell>
                                            <DetailsTableCell>
                                                {calculateItemTotal(
                                                    item,
                                                ).toLocaleString()}
                                                원
                                            </DetailsTableCell>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <DetailsTableFooter colSpan="3">
                                            총 금액
                                        </DetailsTableFooter>
                                        <DetailsTableTotalCell>
                                            {order.totalAmount.toLocaleString()}
                                            원
                                        </DetailsTableTotalCell>
                                    </tr>
                                </tfoot>
                            </DetailsTable>
                        </DetailsModalSection>

                        <DetailsModalActions>
                            <DetailsModalButton
                                onClick={() => setShowDetailsModal(false)}
                            >
                                닫기
                            </DetailsModalButton>
                        </DetailsModalActions>
                    </DetailsModalContent>
                </ModalOverlay>
            )}
        </CardContainer>
    );
};

const CardContainer = styled.div`
    background-color: white;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    margin-bottom: 16px;
    position: relative;
    border: 1px solid #f2f4f6;
    height: 420px;
    display: flex;
    flex-direction: column;
`;

const CardHeader = styled.div`
    padding: 20px 20px 10px 20px;
    border-bottom: 1px solid #f2f4f6;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const CardBody = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 0 20px;

    /* Scrollbar styling */
    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-track {
        /* background: #f1f1f1;
        border-radius: 10px; */
    }

    &::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #a1a1a1;
    }
`;

const CardFooter = styled.div`
    padding: 10px 20px 20px 20px;
    border-top: 1px solid #f2f4f6;
`;

const StatusBadge = styled.div`
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
    flex-direction: column;
    gap: 4px;
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
    padding: 15px 0;
`;

const InfoHeaderRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
`;

const InfoLabel = styled.p`
    font-size: 14px;
    color: #6b7684;
    margin: 0;
`;

const DetailButton = styled.button`
    background: none;
    border: none;
    color: #3182f6;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    transition: all 0.2s ease;

    &:hover {
        background-color: #f0f7ff;
    }
`;

const OrderItems = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const OrderItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 10px;
    background-color: #f9fafb;
    border-radius: 8px;
`;

const ItemInfo = styled.div`
    display: flex;
    flex-direction: column;
`;

const ItemName = styled.span`
    font-size: 15px;
    color: #333b47;
    margin-bottom: 4px;
`;

const ItemPrice = styled.span`
    font-size: 13px;
    color: #6b7684;
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
    margin-bottom: 16px;
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

// Modal Components
const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background-color: white;
    padding: 24px;
    border-radius: 12px;
    width: 320px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const ModalTitle = styled.h4`
    font-size: 16px;
    color: #191f28;
    margin: 0 0 24px 0;
    text-align: center;
`;

const ModalButtonContainer = styled.div`
    display: flex;
    gap: 12px;
`;

const ModalButton = styled.button`
    flex: 1;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
`;

const ModalCancelButton = styled(ModalButton)`
    background-color: #f2f4f6;
    color: #4e5968;

    &:hover {
        background-color: #e5e8eb;
    }
`;

const ModalConfirmButton = styled(ModalButton)`
    background-color: #3182f6;
    color: white;

    &:hover {
        background-color: #1b64da;
    }
`;

// Details Modal Components
const DetailsModalContent = styled.div`
    background-color: white;
    border-radius: 12px;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    position: relative;
    padding: 24px;

    /* Scrollbar styling */
    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #a1a1a1;
    }
`;

const ModalCloseButton = styled.button`
    position: absolute;
    top: 16px;
    right: 16px;
    background: none;
    border: none;
    font-size: 18px;
    color: #6b7684;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;

    &:hover {
        background-color: #f2f4f6;
    }
`;

const DetailsModalTitle = styled.h3`
    font-size: 20px;
    font-weight: 700;
    color: #191f28;
    margin: 0 0 20px 0;
    padding-bottom: 16px;
    border-bottom: 1px solid #f2f4f6;
`;

const DetailsModalInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 24px;
`;

const DetailsRow = styled.div`
    display: flex;
    align-items: center;
`;

const DetailsLabel = styled.span`
    font-size: 14px;
    color: #6b7684;
    width: 100px;
`;

const DetailsValue = styled.span`
    font-size: 14px;
    color: #191f28;
    font-weight: 500;
`;

const DetailsStatusBadge = styled(StatusBadge)`
    font-size: 12px;
    padding: 4px 10px;
`;

const DetailsModalSection = styled.div`
    margin-bottom: 24px;
`;

const DetailsSectionTitle = styled.h4`
    font-size: 16px;
    font-weight: 600;
    color: #191f28;
    margin: 0 0 16px 0;
`;

const DetailsTable = styled.table`
    width: 100%;
    border-collapse: collapse;
`;

const DetailsTableHeader = styled.th`
    text-align: left;
    padding: 12px 8px;
    font-size: 14px;
    font-weight: 600;
    color: #6b7684;
    border-bottom: 1px solid #f2f4f6;
`;

const DetailsTableCell = styled.td`
    padding: 12px 8px;
    font-size: 14px;
    color: #191f28;
    border-bottom: 1px solid #f2f4f6;
`;

const DetailsTableFooter = styled.td`
    padding: 14px 8px;
    font-size: 15px;
    font-weight: 600;
    color: #191f28;
    text-align: right;
`;

const DetailsTableTotalCell = styled.td`
    padding: 14px 8px;
    font-size: 16px;
    font-weight: 700;
    color: #191f28;
`;

const DetailsModalActions = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
`;

const DetailsModalButton = styled(Button)`
    width: 100px;
    background-color: #3182f6;
    color: white;

    &:hover {
        background-color: #1b64da;
    }
`;
