import React, { useState, useEffect, useRef } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { DetailModal } from './Modals/DetailModal';
import { ConfirmModal } from './Modals/ConfirmModal';

export const RealTimeOrderCard = ({
    order,
    onStatusChange,
    onCompleteAnimationEnd,
}) => {
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isConfirmSheetOpen, setIsConfirmSheetOpen] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');
    const [animateOut, setAnimateOut] = useState(false);
    const [elapsedTime, setElapsedTime] = useState('');
    const cardRef = useRef(null);

    // 경과 시간 계산 및 업데이트
    useEffect(() => {
        const calculateElapsedTime = () => {
            const now = new Date();
            const orderTime = new Date(order.orderTime);
            const diffInMinutes = Math.floor((now - orderTime) / (1000 * 60));

            if (diffInMinutes < 60) {
                setElapsedTime(`${diffInMinutes}분 전`);
            } else {
                const hours = Math.floor(diffInMinutes / 60);
                const minutes = diffInMinutes % 60;
                setElapsedTime(`${hours}시간 ${minutes}분 전`);
            }
        };

        calculateElapsedTime();
        const timer = setInterval(calculateElapsedTime, 60000); // 1분마다 업데이트

        return () => clearInterval(timer);
    }, [order.orderTime]);

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

    const handleCompleteClick = () => {
        setConfirmMessage('주문을 완료하시겠습니까?');
        setIsConfirmSheetOpen(true);
    };

    const handleConfirmAction = () => {
        onStatusChange(order.id, 'completed');
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
                        <OrderTime>
                            {formatTime(new Date(order.orderTime))}
                        </OrderTime>
                    </TableInfo>
                    <ElapsedTime status={order.status}>
                        {order.status === 'cancelled'
                            ? '취소됨'
                            : order.status === 'completed'
                            ? '완료'
                            : elapsedTime}
                    </ElapsedTime>
                </CardHeader>

                <ScrollableContent>
                    <ItemList>
                        {order.items.map((item, index) => (
                            <Item key={index}>
                                <ItemName>{item.name}</ItemName>
                                <ItemQuantity>x{item.quantity}</ItemQuantity>
                            </Item>
                        ))}
                    </ItemList>
                </ScrollableContent>

                <FixedBottom>
                    <TotalAmount>
                        <TotalLabel>총액</TotalLabel>
                        <TotalValue>
                            {order.totalAmount.toLocaleString()}원
                        </TotalValue>
                    </TotalAmount>

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
                                onClick={handleCompleteClick}
                            >
                                완료
                            </ActionButton>
                        )}
                    </CardFooter>
                </FixedBottom>

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

            {isConfirmSheetOpen && (
                <ConfirmModal
                    isOpen={isConfirmSheetOpen}
                    onClose={() => setIsConfirmSheetOpen(false)}
                    title="주문 처리 확인"
                    message={confirmMessage}
                    onConfirm={handleConfirmAction}
                    confirmText="확인"
                />
            )}
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
    transition: transform 0.2s, box-shadow 0.2s;
    position: relative;
    display: flex;
    flex-direction: column;
    height: 320px; /* 고정 높이 */
    width: 100%;
    overflow: hidden;

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
    min-height: 70px;
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

const ElapsedTime = styled.div`
    display: inline-flex;
    padding: 4px 8px;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 500;

    ${(props) => {
        switch (props.status) {
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

const ScrollableContent = styled.div`
    padding: 16px;
    overflow-y: auto;
    flex-grow: 1;
`;

const ItemList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
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

const FixedBottom = styled.div`
    border-top: 1px solid #f2f4f6;
    margin-top: auto;
`;

const TotalAmount = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #f2f4f6;
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

// ConfirmBottomSheet 컴포넌트 추가 (원래 Modal 폴더에서 가져오는 것 대신)
const ConfirmBottomSheet = ({
    isOpen,
    onClose,
    title,
    message,
    onConfirm,
    confirmText,
}) => {
    if (!isOpen) return null;

    return (
        <BottomSheetContainer>
            <BottomSheetOverlay onClick={onClose} />
            <BottomSheetContent>
                <BottomSheetHeader>
                    <BottomSheetTitle>{title}</BottomSheetTitle>
                    <CloseButton onClick={onClose}>×</CloseButton>
                </BottomSheetHeader>
                <BottomSheetBody>
                    <Message>{message}</Message>
                </BottomSheetBody>
                <BottomSheetFooter>
                    <CancelBtn onClick={onClose}>취소</CancelBtn>
                    <ConfirmBtn onClick={onConfirm}>{confirmText}</ConfirmBtn>
                </BottomSheetFooter>
            </BottomSheetContent>
        </BottomSheetContainer>
    );
};

const BottomSheetContainer = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    height: 100%;
`;

const BottomSheetOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
`;

const BottomSheetContent = styled.div`
    position: relative;
    width: 100%;
    max-width: 500px;
    background-color: white;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    padding: 20px;
    z-index: 1001;
`;

const BottomSheetHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
`;

const BottomSheetTitle = styled.h3`
    margin: 0;
    font-size: 18px;
    font-weight: 600;
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #6b7684;
`;

const BottomSheetBody = styled.div`
    margin-bottom: 24px;
`;

const Message = styled.p`
    margin: 0;
    font-size: 16px;
    color: #4b5563;
`;

const BottomSheetFooter = styled.div`
    display: flex;
    gap: 8px;
`;

const CancelBtn = styled.button`
    flex: 1;
    padding: 12px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    background-color: white;
    color: #4b5563;
    border: 1px solid #e5e7eb;

    &:hover {
        background-color: #f9fafb;
    }
`;

const ConfirmBtn = styled.button`
    flex: 1;
    padding: 12px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    background-color: #3182f6;
    color: white;
    border: none;

    &:hover {
        background-color: #1c64f2;
    }
`;
