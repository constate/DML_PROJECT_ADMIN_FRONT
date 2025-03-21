import React, { useState } from 'react';
import styled from 'styled-components';
import { RealTimeOrderCard } from '../../components/_common/RealTimeOrderCard/RealTimeOrderCard';

export const RealTimeOrderPage = () => {
    const [orders, setOrders] = useState([
        {
            id: 1,
            tableNumber: 3,
            orderTime: new Date('2025-03-19T12:30:00'),
            items: [
                { name: '아메리카노', quantity: 2, price: 4500 },
                { name: '카페라떼', quantity: 1, price: 5000 },
                { name: '치즈케이크', quantity: 1, price: 4500 },
                { name: '치즈케이크', quantity: 1, price: 4500 },
                { name: '치즈케이크', quantity: 1, price: 4500 },
                { name: '치즈케이크', quantity: 1, price: 4500 },
                { name: '치즈케이크', quantity: 1, price: 4500 },
            ],
            totalAmount: 18500,
            status: 'pending',
        },
        {
            id: 2,
            tableNumber: 7,
            orderTime: new Date('2025-03-19T12:15:00'),
            items: [
                { name: '카푸치노', quantity: 2, price: 5500 },
                { name: '바닐라라떼', quantity: 1, price: 5500 },
                { name: '크로플', quantity: 2, price: 4250 },
            ],
            totalAmount: 25000,
            status: 'inProgress',
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
        },
    ]);

    // 완료된 주문들을 담을 상태 (애니메이션 완료 후 보관용)
    const [completedOrders, setCompletedOrders] = useState([]);

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

    // 현재 주문 카운트 (취소된 주문은 제외)
    const activeOrderCount = orders.filter(
        (order) => order.status !== 'cancelled',
    ).length;

    return (
        <Container>
            <Header>
                <Title>실시간 주문 현황</Title>
                <OrderCountBadge>{activeOrderCount}개의 주문</OrderCountBadge>
            </Header>

            <OrderGrid>
                {orders.map((order) => (
                    <RealTimeOrderCard
                        key={order.id}
                        order={order}
                        onStatusChange={handleStatusChange}
                        onCancel={handleCancel}
                        onCompleteAnimationEnd={handleCompleteAnimationEnd}
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
        </Container>
    );
};

// 스타일 컴포넌트
const Container = styled.div`
    width: 100%;
    padding: 24px 16px;
    background-color: #f9fafb;
    min-height: 100vh;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
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
