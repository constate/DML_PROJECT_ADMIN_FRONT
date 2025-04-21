import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { postProduct } from '../../apis/product/product';

export const CreateProductPage = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        mainImagePath: '',
        status: 'ACTIVE',
        quantity: 1,
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'price' || name === 'quantity') {
            // 숫자 입력 필드는 숫자만 허용
            const numberValue = value.replace(/[^0-9]/g, '');
            setFormData({
                ...formData,
                [name]: numberValue,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = '제품명을 입력해주세요';
        if (!formData.price) newErrors.price = '가격을 입력해주세요';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const response = await postProduct(formData);

            if (response.data.success) {
                // 성공 시 제품 목록 페이지로 이동
                console.log('상품 생성 완료!!!!');
                // navigate(`/groups/${groupId}/products`);
            }
        } catch (error) {
            console.error('제품 생성 오류:', error);
            const errorMessage =
                error.response?.data?.message ||
                '제품을 추가하는 중 오류가 발생했습니다.';
            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container>
            <Header>
                <Title>새 제품 등록</Title>
                <Subtitle>그룹에 새로운 제품을 등록합니다</Subtitle>
            </Header>

            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label htmlFor="name">제품명 *</Label>
                    <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="제품명을 입력하세요"
                        error={errors.name}
                    />
                    {errors.name && <ErrorText>{errors.name}</ErrorText>}
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="description">제품 설명</Label>
                    <TextArea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="제품에 대한 설명을 입력하세요"
                        rows={4}
                    />
                </FormGroup>

                <FormRow>
                    <FormGroup style={{ flex: 1, marginRight: '12px' }}>
                        <Label htmlFor="price">가격 (원) *</Label>
                        <Input
                            id="price"
                            name="price"
                            type="text"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="0"
                            error={errors.price}
                        />
                        {errors.price && <ErrorText>{errors.price}</ErrorText>}
                    </FormGroup>

                    <FormGroup style={{ flex: 1 }}>
                        <Label htmlFor="quantity">수량</Label>
                        <Input
                            id="quantity"
                            name="quantity"
                            type="text"
                            value={formData.quantity}
                            onChange={handleChange}
                            placeholder="1"
                        />
                    </FormGroup>
                </FormRow>

                <FormGroup>
                    <Label htmlFor="mainImagePath">대표 이미지 URL</Label>
                    <Input
                        id="mainImagePath"
                        name="mainImagePath"
                        type="text"
                        value={formData.mainImagePath}
                        onChange={handleChange}
                        placeholder="이미지 URL을 입력하세요"
                    />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="status">상태</Label>
                    <Select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <option value="ACTIVE">판매중</option>
                        <option value="INACTIVE">숨김</option>
                        <option value="SOLD_OUT">품절</option>
                    </Select>
                </FormGroup>

                <ButtonContainer>
                    <CancelButton
                        type="button"
                        onClick={() => navigate(`/groups/${groupId}/products`)}
                    >
                        취소
                    </CancelButton>
                    <SubmitButton type="submit" disabled={isLoading}>
                        {isLoading ? '처리중...' : '제품 등록하기'}
                    </SubmitButton>
                </ButtonContainer>
            </Form>
        </Container>
    );
};

// 스타일 컴포넌트
const Container = styled.div`
    max-width: 720px;
    margin: 0 auto;
    padding: 40px 20px;
`;

const Header = styled.header`
    margin-bottom: 40px;
`;

const Title = styled.h1`
    font-size: 28px;
    font-weight: 700;
    color: #191f28;
    margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
    font-size: 16px;
    color: #8b95a1;
    margin: 0;
`;

const Form = styled.form`
    background-color: #ffffff;
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
    margin-bottom: 24px;
`;

const FormRow = styled.div`
    display: flex;
    margin-bottom: 24px;

    @media (max-width: 600px) {
        flex-direction: column;

        & > div {
            margin-right: 0 !important;
            margin-bottom: 24px;
        }
    }
`;

const Label = styled.label`
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #4e5968;
    margin-bottom: 8px;
`;

const Input = styled.input`
    width: 100%;
    height: 48px;
    padding: 0 16px;
    font-size: 16px;
    border: 1px solid ${(props) => (props.error ? '#F03E3E' : '#DFE2E6')};
    border-radius: 8px;
    background-color: #ffffff;
    transition: all 0.2s;

    &:focus {
        outline: none;
        border-color: #3182f6;
        box-shadow: 0 0 0 2px rgba(49, 130, 246, 0.2);
    }

    &::placeholder {
        color: #adb5bd;
    }
`;

const TextArea = styled.textarea`
    width: 100%;
    padding: 12px 16px;
    font-size: 16px;
    border: 1px solid #dfe2e6;
    border-radius: 8px;
    background-color: #ffffff;
    resize: vertical;
    min-height: 120px;
    transition: all 0.2s;

    &:focus {
        outline: none;
        border-color: #3182f6;
        box-shadow: 0 0 0 2px rgba(49, 130, 246, 0.2);
    }

    &::placeholder {
        color: #adb5bd;
    }
`;

const Select = styled.select`
    width: 100%;
    height: 48px;
    padding: 0 16px;
    font-size: 16px;
    border: 1px solid #dfe2e6;
    border-radius: 8px;
    background-color: #ffffff;
    cursor: pointer;
    transition: all 0.2s;

    &:focus {
        outline: none;
        border-color: #3182f6;
        box-shadow: 0 0 0 2px rgba(49, 130, 246, 0.2);
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 32px;
    gap: 12px;
`;

const Button = styled.button`
    height: 48px;
    padding: 0 24px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const SubmitButton = styled(Button)`
    background-color: #3182f6;
    color: white;
    border: none;

    &:hover:not(:disabled) {
        background-color: #1c6fdc;
    }

    &:active:not(:disabled) {
        background-color: #0f5bc2;
    }
`;

const CancelButton = styled(Button)`
    background-color: transparent;
    color: #4e5968;
    border: 1px solid #dfe2e6;

    &:hover {
        background-color: #f8f9fa;
    }

    &:active {
        background-color: #f1f3f5;
    }
`;

const ErrorText = styled.span`
    display: block;
    color: #f03e3e;
    font-size: 13px;
    margin-top: 6px;
`;
