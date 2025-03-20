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
                <Title>실시간 주문 현황</Title>
                <OrderCount>{orders.length}개의 주문</OrderCount>
            </Header>

            <OrderGrid>
                {orders.map((order) => (
                    <RealTimeOrderCard
                        key={order.id}
                        order={order}
                        onStatusChange={handleStatusChange}
                        onCancel={handleCancel}
                    />
                ))}
            </OrderGrid>
        </Container>
    );
};

// Styled Components
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

const OrderCount = styled.span`
    font-size: 16px;
    color: #6b7684;
    font-weight: 500;
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
