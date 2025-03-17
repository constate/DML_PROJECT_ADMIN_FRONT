import React, { useState } from 'react';
import styled from 'styled-components';

import { signup } from '../../apis/auth/auth';

export const SignupPage = () => {
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        passwordConfirm: '',
    });

    // Error state
    const [errors, setErrors] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        passwordConfirm: '',
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Clear error when user types
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: '',
            });
        }

        // Check password confirmation match when typing in either password field
        if (name === 'password' || name === 'passwordConfirm') {
            if (
                (name === 'password' &&
                    formData.passwordConfirm &&
                    value !== formData.passwordConfirm) ||
                (name === 'passwordConfirm' && value !== formData.password)
            ) {
                setErrors((prev) => ({
                    ...prev,
                    passwordConfirm: '비밀번호가 일치하지 않습니다',
                }));
            } else if (
                name === 'passwordConfirm' &&
                value === formData.password
            ) {
                setErrors((prev) => ({
                    ...prev,
                    passwordConfirm: '',
                }));
            }
        }
    };

    // Validate form
    const validateForm = () => {
        let isValid = true;
        const newErrors = { ...errors };

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = '이름을 입력해주세요';
            isValid = false;
        }

        // Phone validation
        const phoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
        if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = '올바른 휴대폰 번호를 입력해주세요';
            isValid = false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = '올바른 이메일 주소를 입력해주세요';
            isValid = false;
        }

        // Password validation
        if (formData.password.length < 6) {
            newErrors.password = '비밀번호는 6자 이상이어야 합니다';
            isValid = false;
        }

        // Password confirmation validation
        if (!formData.passwordConfirm) {
            newErrors.passwordConfirm = '비밀번호 확인을 입력해주세요';
            isValid = false;
        } else if (formData.password !== formData.passwordConfirm) {
            newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Submit form data
            console.log('Form submitted:', formData);
            try {
                const responseData = await signup({
                    username: formData.name,
                    phone: formData.phone,
                    email: formData.email,
                    password: formData.password,
                });
                console.log('회원가입 성공', responseData);
            } catch (error) {
                console.log(error);
                if (error.response?.data?.message) {
                    alert(`회원가입 실패: ${error.response.data.message}`);
                } else {
                    alert('회원가입 중 오류가 발생했습니다.');
                }
            }
        }
    };

    return (
        <Container>
            <FormCard>
                <Header>
                    <Title>회원가입</Title>
                    <Subtitle>서비스 이용을 위한 계정을 만들어주세요</Subtitle>
                </Header>

                <form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label htmlFor="name">이름</Label>
                        <Input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            hasError={!!errors.name}
                            placeholder="홍길동"
                        />
                        {errors.name && (
                            <ErrorMessage>{errors.name}</ErrorMessage>
                        )}
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="phone">휴대폰 번호</Label>
                        <Input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            hasError={!!errors.phone}
                            placeholder="010-0000-0000"
                        />
                        {errors.phone && (
                            <ErrorMessage>{errors.phone}</ErrorMessage>
                        )}
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="email">이메일</Label>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            hasError={!!errors.email}
                            placeholder="example@email.com"
                        />
                        {errors.email && (
                            <ErrorMessage>{errors.email}</ErrorMessage>
                        )}
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="password">비밀번호</Label>
                        <Input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            hasError={!!errors.password}
                            placeholder="6자 이상 입력해주세요"
                        />
                        {errors.password && (
                            <ErrorMessage>{errors.password}</ErrorMessage>
                        )}
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
                        <Input
                            type="password"
                            id="passwordConfirm"
                            name="passwordConfirm"
                            value={formData.passwordConfirm}
                            onChange={handleChange}
                            hasError={!!errors.passwordConfirm}
                            placeholder="비밀번호를 다시 입력해주세요"
                        />
                        {errors.passwordConfirm && (
                            <ErrorMessage>
                                {errors.passwordConfirm}
                            </ErrorMessage>
                        )}
                    </FormGroup>

                    <SubmitButton type="submit">가입하기</SubmitButton>
                </form>
            </FormCard>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #f9fafb;
`;

const FormCard = styled.div`
    width: 100%;
    max-width: 440px;
    padding: 40px;
    background-color: white;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const Header = styled.div`
    margin-bottom: 40px;
    text-align: center;
`;

const Title = styled.h1`
    font-size: 28px;
    font-weight: 700;
    color: #191f28;
    margin: 0;
`;

const Subtitle = styled.p`
    font-size: 16px;
    color: #6b7684;
    margin-top: 8px;
`;

const FormGroup = styled.div`
    margin-bottom: 24px;
`;

const Label = styled.label`
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #4e5968;
    margin-bottom: 6px;
`;

const Input = styled.input`
    width: 100%;
    padding: 14px 16px;
    border: 1px solid ${(props) => (props.hasError ? '#f03e3e' : '#dee2e6')};
    border-radius: 8px;
    font-size: 16px;
    transition: all 0.2s ease;

    &:focus {
        outline: none;
        border-color: #3282f6;
        box-shadow: 0 0 0 3px rgba(50, 130, 246, 0.15);
    }

    &::placeholder {
        color: #adb5bd;
    }
`;

const ErrorMessage = styled.p`
    font-size: 13px;
    color: #f03e3e;
    margin-top: 6px;
`;

const SubmitButton = styled.button`
    width: 100%;
    padding: 14px;
    background-color: #3282f6;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #2272eb;
    }

    &:disabled {
        background-color: #adb5bd;
        cursor: not-allowed;
    }
`;
