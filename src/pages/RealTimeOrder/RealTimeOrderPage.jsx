import React, { useState } from 'react';
import styled from 'styled-components';
import { RealTimeOrderCard } from '@components/_common/RealTimeOrderCard/RealTimeOrderCard';

export const RealTimeOrderPage = () => {
    const [orders, setOrders] = useState([
        {
            id: 1,
            tableNumber: 3,
            orderTime: new Date('2025-03-19T12:30:00'),
            items: [
                { name: '아메리카노', quantity: 2 },
                { name: '카페라떼', quantity: 1 },
                { name: '치즈케이크', quantity: 1 },
            ],
            totalAmount: 18500,
            status: 'pending',
        },
        {
            id: 2,
            tableNumber: 7,
            orderTime: new Date('2025-03-19T12:15:00'),
            items: [
                { name: '카푸치노', quantity: 2 },
                { name: '바닐라라떼', quantity: 1 },
                { name: '크로플', quantity: 2 },
            ],
            totalAmount: 25000,
            status: 'inProgress',
        },
        {
            id: 3,
            tableNumber: 2,
            orderTime: new Date('2025-03-19T11:50:00'),
            items: [
                { name: '에스프레소', quantity: 1 },
                { name: '티라미수', quantity: 1 },
            ],
            totalAmount: 12000,
            status: 'completed',
        },
    ]);

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

    return (
        <Container>
            <Header>
                <Title>주문 관리</Title>
                <OrderCount>{orders.length}개의 주문</OrderCount>
            </Header>

            <OrderList>
                {orders.map((order) => (
                    <RealTimeOrderCard
                        key={order.id}
                        order={order}
                        onStatusChange={handleStatusChange}
                        onCancel={handleCancel}
                    />
                ))}
            </OrderList>
        </Container>
    );
};

// Styled Components
const Container = styled.div`
    max-width: 600px;
    margin: 0 auto;
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
`;

const OrderCount = styled.span`
    font-size: 16px;
    color: #6b7684;
    font-weight: 500;
`;

const OrderList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;
