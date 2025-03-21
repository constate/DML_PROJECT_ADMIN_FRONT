import React, { useState, useEffect, useRef } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { DetailModal, ConfirmBottomSheet } from './Modals/ModalComponents';

export const RealTimeOrderCard = ({
    order,
    onStatusChange,
    onCancel,
    onCompleteAnimationEnd,
}) => {
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isConfirmSheetOpen, setIsConfirmSheetOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState({
        type: '',
        message: '',
    });
    const [animateOut, setAnimateOut] = useState(false);
    const cardRef = useRef(null);

    // 완료 상태 변경 감지 및 애니메이션 시작
    useEffect(() => {
        if (order.status === 'completed' && !animateOut) {
            // 완료 상태로 변경 시 잠시 후 애니메이션 시작
            const timer = setTimeout(() => {
                setAnimateOut(true);
            }, 800); // 잠시 완료 상태를 보여준 후 사라지기 시작

            return () => clearTimeout(timer);
        }
    }, [order.status, animateOut]);

    // 애니메이션 종료 감지
    const handleAnimationEnd = () => {
        if (animateOut) {
            onCompleteAnimationEnd(order.id);
        }
    };

    const formatTime = (date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending':
                return '접수 대기';
            case 'inProgress':
                return '처리 중';
            case 'completed':
                return '완료';
            case 'cancelled':
                return '취소됨';
            default:
                return '상태 미정';
        }
    };

    const handleStatusChangeClick = (newStatus) => {
        setConfirmAction({
            type: 'status',
            newStatus,
            message: `주문을 ${
                newStatus === 'inProgress' ? '접수' : '완료'
            }하시겠습니까?`,
        });
        setIsConfirmSheetOpen(true);
    };

    const handleCancelClick = () => {
        setConfirmAction({
            type: 'cancel',
            message: '주문을 취소하시겠습니까?',
        });
        setIsConfirmSheetOpen(true);
    };

    const handleConfirmAction = () => {
        if (confirmAction.type === 'status') {
            onStatusChange(order.id, confirmAction.newStatus);
        } else if (confirmAction.type === 'cancel') {
            onCancel(order.id);
        }
        setIsConfirmSheetOpen(false);
    };

    return (
        <>
            <Card
                ref={cardRef}
                status={order.status}
                animateOut={animateOut}
                onAnimationEnd={handleAnimationEnd}
            >
                <CardHeader>
                    <TableInfo>
                        <TableNumber>{order.tableNumber}번 테이블</TableNumber>
                        <OrderTime>{formatTime(order.orderTime)}</OrderTime>
                    </TableInfo>
                    <StatusBadge status={order.status}>
                        {getStatusText(order.status)}
                    </StatusBadge>
                </CardHeader>

                <CardContent>
                    <ItemList>
                        {order.items.slice(0, 3).map((item, index) => (
                            <Item key={index}>
                                <ItemName>{item.name}</ItemName>
                                <ItemQuantity>x{item.quantity}</ItemQuantity>
                            </Item>
                        ))}
                        {order.items.length > 3 && (
                            <MoreItems>
                                외 {order.items.length - 3}개 품목
                            </MoreItems>
                        )}
                    </ItemList>

                    <TotalAmount>
                        <TotalLabel>총액</TotalLabel>
                        <TotalValue>
                            {order.totalAmount.toLocaleString()}원
                        </TotalValue>
                    </TotalAmount>
                </CardContent>

                <CardFooter>
                    <ActionButton
                        variant="secondary"
                        onClick={() => setIsDetailModalOpen(true)}
                    >
                        상세보기
                    </ActionButton>

                    {order.status === 'pending' && (
                        <ActionButton
                            variant="primary"
                            onClick={() =>
                                handleStatusChangeClick('inProgress')
                            }
                        >
                            접수하기
                        </ActionButton>
                    )}

                    {order.status === 'inProgress' && (
                        <ActionButton
                            variant="primary"
                            onClick={() => handleStatusChangeClick('completed')}
                        >
                            완료하기
                        </ActionButton>
                    )}

                    {(order.status === 'pending' ||
                        order.status === 'inProgress') && (
                        <CancelButton onClick={handleCancelClick}>
                            취소
                        </CancelButton>
                    )}
                </CardFooter>

                {/* 완료 시 표시되는 성공 아이콘 오버레이 */}
                {order.status === 'completed' && !animateOut && (
                    <CompletedOverlay>
                        <CheckIcon>
                            <svg
                                width="48"
                                height="48"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M20 6L9 17L4 12"
                                    stroke="white"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </CheckIcon>
                    </CompletedOverlay>
                )}
            </Card>

            <DetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                order={order}
            />

            <ConfirmBottomSheet
                isOpen={isConfirmSheetOpen}
                onClose={() => setIsConfirmSheetOpen(false)}
                title="주문 처리 확인"
                message={confirmAction.message}
                onConfirm={handleConfirmAction}
                confirmText={
                    confirmAction.type === 'cancel' ? '취소하기' : '확인'
                }
            />
        </>
    );
};

// 애니메이션 키프레임
const fadeOutAndSlideUp = keyframes`
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  30% {
    opacity: 1;
    transform: translateY(-10px) scale(1.02);
  }
  100% {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
    max-height: 0;
    margin-bottom: 0;
    padding: 0;
  }
`;

const fadeInCheckmark = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

// 스타일 컴포넌트
const Card = styled.div`
    background-color: white;
    border-radius: 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
    position: relative;

    ${(props) =>
        props.status === 'cancelled' &&
        `
    opacity: 0.7;
  `}

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    ${(props) =>
        props.animateOut &&
        css`
            animation: ${fadeOutAndSlideUp} 0.7s ease-in-out forwards;
            pointer-events: none;
        `}
`;

const CompletedOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(64, 192, 87, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 5;
`;

const CheckIcon = styled.div`
    animation: ${fadeInCheckmark} 0.5s ease-out forwards;
`;

const CardHeader = styled.div`
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 1px solid #f2f4f6;
`;

const TableInfo = styled.div`
    display: flex;
    flex-direction: column;
`;

const TableNumber = styled.h3`
    font-size: 16px;
    font-weight: 700;
    color: #191f28;
    margin: 0;
`;

const OrderTime = styled.span`
    font-size: 13px;
    color: #6b7684;
    margin-top: 4px;
`;

const StatusBadge = styled.div`
    display: inline-flex;
    padding: 4px 8px;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 500;

    ${(props) => {
        switch (props.status) {
            case 'pending':
                return `
          background-color: #FFF8E1;
          color: #F59F00;
        `;
            case 'inProgress':
                return `
          background-color: #E7F5FF;
          color: #3182F6;
        `;
            case 'completed':
                return `
          background-color: #EBFBEE;
          color: #40C057;
        `;
            case 'cancelled':
                return `
          background-color: #FFF5F5;
          color: #FA5252;
        `;
            default:
                return `
          background-color: #F2F4F6;
          color: #6B7684;
        `;
        }
    }}
`;

const CardContent = styled.div`
    padding: 16px;
`;

const ItemList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
`;

const Item = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const ItemName = styled.span`
    font-size: 14px;
    color: #191f28;
`;

const ItemQuantity = styled.span`
    font-size: 14px;
    color: #6b7684;
`;

const MoreItems = styled.div`
    font-size: 13px;
    color: #6b7684;
    margin-top: 4px;
`;

const TotalAmount = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
    padding-top: 12px;
    border-top: 1px solid #f2f4f6;
`;

const TotalLabel = styled.span`
    font-size: 14px;
    font-weight: 500;
    color: #191f28;
`;

const TotalValue = styled.span`
    font-size: 16px;
    font-weight: 700;
    color: #3182f6;
`;

const CardFooter = styled.div`
    padding: 12px 16px;
    display: flex;
    gap: 8px;
    border-top: 1px solid #f2f4f6;
    position: relative;
`;

const ActionButton = styled.button`
    flex: 1;
    height: 40px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    ${(props) => {
        if (props.variant === 'primary') {
            return `
        background-color: #3182F6;
        color: white;
        border: none;
        
        &:hover {
          background-color: #1C64F2;
        }
      `;
        } else {
            return `
        background-color: white;
        color: #4B5563;
        border: 1px solid #E5E7EB;
        
        &:hover {
          background-color: #F9FAFB;
        }
      `;
        }
    }}
`;

const CancelButton = styled.button`
    position: absolute;
    top: -30px;
    right: 16px;
    background: none;
    border: none;
    font-size: 13px;
    color: #6b7684;
    cursor: pointer;

    &:hover {
        color: #fa5252;
        text-decoration: underline;
    }
`;
