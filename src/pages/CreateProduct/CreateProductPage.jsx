import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

export const CreateProductPage = () => {
    const [groupId, setGroupId] = useState('');
    const [name, setName] = useState('');
    const [categoryInput, setCategoryInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        const categoryIds = categoryInput
            .split(',')
            .map((id) => id.trim())
            .filter((id) => id);

        if (!groupId || !name || categoryIds.length === 0) {
            setSuccess(false);
            setMessage('모든 필드를 올바르게 입력해주세요.');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post('/products', {
                groupId,
                name,
                categoryIds,
            });
            setSuccess(true);
            setMessage(`✅ 생성 성공! Product ID: ${response.data.productId}`);
            setGroupId('');
            setName('');
            setCategoryInput('');
        } catch (error) {
            console.error(error);
            setSuccess(false);
            setMessage('❌ 생성 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Title>🛠️ Product 생성</Title>
            <Form onSubmit={handleSubmit}>
                <div>
                    <Label>Group ID</Label>
                    <Input
                        type="text"
                        value={groupId}
                        onChange={(e) => setGroupId(e.target.value)}
                        placeholder="예: group123"
                    />
                </div>

                <div>
                    <Label>Product 이름</Label>
                    <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="예: 무선 이어폰"
                    />
                </div>

                <div>
                    <Label>Category ID 목록 (쉼표로 구분)</Label>
                    <Input
                        type="text"
                        value={categoryInput}
                        onChange={(e) => setCategoryInput(e.target.value)}
                        placeholder="예: cat1, cat2"
                    />
                </div>

                <Button type="submit" disabled={loading}>
                    {loading ? '생성 중...' : 'Product 생성'}
                </Button>

                {message && <Message success={success}>{message}</Message>}
            </Form>
        </Container>
    );
};

const Container = styled.div`
    max-width: 480px;
    margin: 3rem auto;
    padding: 2rem;
    border-radius: 12px;
    background-color: #f9f9f9;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h2`
    font-size: 1.75rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
`;

const Label = styled.label`
    font-weight: 500;
    margin-bottom: 0.25rem;
`;

const Input = styled.input`
    padding: 0.65rem 0.75rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    width: 100%;
    font-size: 1rem;
`;

const Button = styled.button`
    padding: 0.75rem;
    background-color: #4f46e5;
    color: white;
    font-weight: 600;
    font-size: 1rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #4338ca;
    }

    &:disabled {
        background-color: #a5b4fc;
        cursor: not-allowed;
    }
`;

const Message = styled.p`
    text-align: center;
    font-weight: 500;
    color: ${(props) => (props.success ? '#22c55e' : '#ef4444')};
`;
