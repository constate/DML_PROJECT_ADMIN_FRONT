import React, { useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { RealTimeOrderCard } from '../../components/_common/RealTimeOrderCard/RealTimeOrderCard';
import { ConfirmModal } from '../../components/_common/RealTimeOrderCard/Modals/ConfirmModal';

export const RealTimeOrderPage = () => {
    const [orders, setOrders] = useState([
        {
            id: 1,
            tableNumber: 3,
            orderTime: new Date('2025-03-19T12:30:00'),
            items: [
                { name: '아메리카노', quantity: 2, price: 4500 },
                { name: '카페라떼', quantity: 1, price: 5000 },
                { name: '치즈케이크1', quantity: 1, price: 4500 },
                { name: '치즈케이크2', quantity: 1, price: 4500 },
                { name: '치즈케이크3', quantity: 1, price: 4500 },
                { name: '치즈케이크4', quantity: 1, price: 4500 },
                { name: '치즈케이크5', quantity: 1, price: 4500 },
                { name: '치즈케이크6', quantity: 1, price: 4500 },
            ],
            totalAmount: 18500,
            status: 'pending',
            selected: false,
        },
        {
            id: 2,
            tableNumber: 7,
            orderTime: new Date('2022-03-19T12:15:00'),
            items: [
                { name: '카푸치노', quantity: 2, price: 5500 },
                { name: '바닐라라떼', quantity: 1, price: 5500 },
                { name: '크로플', quantity: 2, price: 4250 },
            ],
            totalAmount: 25000,
            status: 'pending',
            selected: false,
        },
        {
            id: 3,
            tableNumber: 2,
            orderTime: new Date('2025-03-19T11:50:00'),
            items: [
                { name: '에스프레소', quantity: 1, price: 4000 },
                { name: '티라미수', quantity: 1, price: 8000 },
            ],
            totalAmount: 12000,
            status: 'completed',
            selected: false,
        },
        {
            id: 4,
            tableNumber: 5,
            orderTime: new Date('2025-03-19T12:40:00'),
            items: [
                { name: '녹차라떼', quantity: 2, price: 5000 },
                { name: '초코케이크', quantity: 1, price: 5500 },
            ],
            totalAmount: 15500,
            status: 'pending',
            selected: false,
        },
        {
            id: 5,
            tableNumber: 6,
            orderTime: new Date('2025-03-19T12:45:00'),
            items: [
                { name: '녹차라떼', quantity: 2, price: 5000 },
                { name: '초코케이크', quantity: 1, price: 5500 },
            ],
            totalAmount: 15500,
            status: 'pending',
            selected: false,
        },
        {
            id: 6,
            tableNumber: 8,
            orderTime: new Date('2025-03-19T12:50:00'),
            items: [
                { name: '녹차라떼', quantity: 2, price: 5000 },
                { name: '초코케이크', quantity: 1, price: 5500 },
            ],
            totalAmount: 15500,
            status: 'pending',
            selected: false,
        },
        {
            id: 7,
            tableNumber: 9,
            orderTime: new Date('2025-03-19T12:55:00'),
            items: [
                { name: '녹차라떼', quantity: 2, price: 5000 },
                { name: '초코케이크', quantity: 1, price: 5500 },
            ],
            totalAmount: 15500,
            status: 'pending',
            selected: false,
        },
        {
            id: 8,
            tableNumber: 10,
            orderTime: new Date('2025-03-19T13:00:00'),
            items: [
                { name: '녹차라떼', quantity: 2, price: 5000 },
                { name: '초코케이크', quantity: 1, price: 5500 },
            ],
            totalAmount: 15500,
            status: 'pending',
            selected: false,
        },
    ]);

    // 완료된 주문들을 담을 상태 (애니메이션 완료 후 보관용)
    const [completedOrders, setCompletedOrders] = useState([]);
    // 일괄 처리 확인 모달
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const handleStatusChange = (orderId, newStatus) => {
        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                order.id === orderId ? { ...order, status: newStatus } : order,
            ),
        );
    };

    const handleCancel = (orderId) => {
        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                order.id === orderId
                    ? { ...order, status: 'cancelled' }
                    : order,
            ),
        );
    };

    // 완료 애니메이션이 끝난 주문 처리
    const handleCompleteAnimationEnd = (orderId) => {
        setOrders((prevOrders) => {
            // 완료된 주문 찾기
            const completedOrder = prevOrders.find(
                (order) => order.id === orderId,
            );

            // 완료된 주문을 completedOrders 배열에 추가
            if (completedOrder) {
                setCompletedOrders((prev) => [...prev, completedOrder]);
            }

            // 주문 목록에서 제거
            return prevOrders.filter((order) => order.id !== orderId);
        });
    };

    // 카드 선택 토글 핸들러
    const handleToggleSelect = (orderId) => {
        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                order.id === orderId && order.status === 'pending'
                    ? { ...order, selected: !order.selected }
                    : order,
            ),
        );
    };

    // 선택한 모든 주문 완료 처리
    const handleCompleteSelected = () => {
        setIsConfirmModalOpen(true);
    };

    // 선택한 주문들을 완료 상태로 변경
    const handleConfirmCompletion = () => {
        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                order.selected && order.status === 'pending'
                    ? { ...order, status: 'completed', selected: false }
                    : order,
            ),
        );
        setIsConfirmModalOpen(false);
    };

    // 선택된 주문 카운트
    const selectedOrderCount = orders.filter(
        (order) => order.selected && order.status === 'pending',
    ).length;

    // 현재 주문 카운트 (취소된 주문은 제외)
    const activeOrderCount = orders.filter(
        (order) => order.status !== 'cancelled',
    ).length;

    return (
        <Container>
            <FixedHeader>
                <Title>실시간 주문 현황</Title>
                <OrderCountBadge>{activeOrderCount}개의 주문</OrderCountBadge>
            </FixedHeader>

            <Content>
                <OrderGrid>
                    {orders.map((order) => (
                        <RealTimeOrderCard
                            key={order.id}
                            order={order}
                            onStatusChange={handleStatusChange}
                            onCancel={handleCancel}
                            onCompleteAnimationEnd={handleCompleteAnimationEnd}
                            onToggleSelect={handleToggleSelect}
                            selected={order.selected}
                        />
                    ))}
                </OrderGrid>

                {completedOrders.length > 0 && (
                    <CompletedSection>
                        <CompletedHeader>
                            <CompletedTitle>완료된 주문</CompletedTitle>
                            <CompletedCount>
                                {completedOrders.length}개
                            </CompletedCount>
                        </CompletedHeader>
                        <CompletedList>
                            {completedOrders.slice(0, 3).map((order) => (
                                <CompletedItem key={order.id}>
                                    테이블 {order.tableNumber} -{' '}
                                    {order.items.length}개 품목
                                </CompletedItem>
                            ))}
                            {completedOrders.length > 3 && (
                                <MoreCompletedItems>
                                    외 {completedOrders.length - 3}개 주문 완료
                                </MoreCompletedItems>
                            )}
                        </CompletedList>
                    </CompletedSection>
                )}
            </Content>

            {/* 선택된 주문이 있을 때만 표시되는 하단 팝오버 */}
            {selectedOrderCount > 0 && (
                <SelectionPopover>
                    <PopoverContent>
                        <SelectedCount>
                            <OrderCheckIcon>
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M9 12L11 14L15 10"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    />
                                </svg>
                            </OrderCheckIcon>
                            <span>{selectedOrderCount}개 선택됨</span>
                        </SelectedCount>
                        <CompleteAllButton onClick={handleCompleteSelected}>
                            모두 완료
                        </CompleteAllButton>
                    </PopoverContent>
                </SelectionPopover>
            )}

            {/* 일괄 완료 확인 모달 */}
            {isConfirmModalOpen && (
                <ConfirmModal
                    isOpen={isConfirmModalOpen}
                    onClose={() => setIsConfirmModalOpen(false)}
                    title="주문 일괄 완료"
                    message={`선택한 ${selectedOrderCount}개의 주문을 모두 완료하시겠습니까?`}
                    onConfirm={handleConfirmCompletion}
                    confirmText="모두 완료"
                />
            )}
        </Container>
    );
};

// 애니메이션 키프레임
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// 스타일 컴포넌트
const Container = styled.div`
    width: 100%;
    background-color: #f9fafb;
    min-height: 100vh;
`;

const FixedHeader = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    background-color: #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
`;

const Content = styled.div`
    padding: 84px 16px 24px; // 상단 패딩 증가 (헤더 높이 + 약간의 여백)
    padding-bottom: 80px; // 하단 팝오버를 위한 여백 추가
`;

const Title = styled.h1`
    font-size: 24px;
    font-weight: 700;
    color: #191f28;
    margin: 0;

    @media (min-width: 768px) {
        font-size: 28px;
    }
`;

const OrderCountBadge = styled.span`
    display: inline-flex;
    padding: 6px 12px;
    background-color: #e7f5ff;
    border-radius: 16px;
    font-size: 14px;
    font-weight: 600;
    color: #3182f6;
`;

const OrderGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;

    @media (min-width: 640px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 968px) {
        grid-template-columns: repeat(3, 1fr);
    }

    @media (min-width: 1200px) {
        grid-template-columns: repeat(4, 1fr);
    }

    @media (min-width: 1600px) {
        grid-template-columns: repeat(5, 1fr);
    }

    @media (min-width: 1920px) {
        grid-template-columns: repeat(6, 1fr);
    }
`;

const CompletedSection = styled.div`
    margin-top: 40px;
    padding: 16px;
    background-color: white;
    border-radius: 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const CompletedHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
`;

const CompletedTitle = styled.h2`
    font-size: 18px;
    font-weight: 600;
    color: #191f28;
    margin: 0;
`;

const CompletedCount = styled.span`
    font-size: 14px;
    color: #6b7684;
    font-weight: 500;
`;

const CompletedList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const CompletedItem = styled.div`
    font-size: 14px;
    color: #4b5563;
    padding: 8px 0;
    border-bottom: 1px solid #f2f4f6;
`;

const MoreCompletedItems = styled.div`
    font-size: 13px;
    color: #6b7684;
    margin-top: 8px;
    text-align: center;
`;

// 하단 팝오버 관련 스타일
const SelectionPopover = styled.div`
    position: fixed;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 999;
    width: 90%;
    max-width: 480px;
    animation: ${fadeIn} 0.3s ease-out;
`;

const PopoverContent = styled.div`
    background-color: #06402b;
    border-radius: 16px;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const SelectedCount = styled.div`
    display: flex;
    align-items: center;
    color: white;
    font-size: 15px;
    font-weight: 600;
    gap: 8px;
`;

const OrderCheckIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
`;

const CompleteAllButton = styled.button`
    background-color: white;
    color: #06402b;
    border: none;
    border-radius: 10px;
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background-color: #f2f4f6;
    }

    &:active {
        background-color: #e5e7eb;
    }
`;
