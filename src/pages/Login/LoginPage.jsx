import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { login } from '../../apis/auth/auth';

import { PrimaryButton } from '../../components/_common/buttons/PrimaryButton';

export const LoginPage = () => {
    const navigate = useNavigate();
    // Form state
    const [rememberMe, setRememberMe] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    // Error state
    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });
    // rememberMe checkbox
    const handleCheckboxChange = (e) => {
        console.log(e.target.checked);
        setRememberMe(e.target.checked);
    };
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
    };

    // Validate form
    const validateForm = () => {
        let isValid = true;
        const newErrors = { ...errors };

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = '이메일을 입력해주세요';
            isValid = false;
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = '올바른 이메일 주소를 입력해주세요';
            isValid = false;
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = '비밀번호를 입력해주세요';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            console.log('Login submitted:', formData);
            try {
                const responseData = await login({
                    email: formData.email,
                    password: formData.password,
                });
                const { idToken, user } = responseData;
                if (idToken) {
                    // "로그인 상태 유지" 체크 여부에 따라 저장 방식 결정
                    console.log('rememberMe', rememberMe);
                    if (rememberMe) {
                        // localStorage에 토큰 저장 (오래 유지)
                        localStorage.setItem('accessToken', idToken);
                        // TokenStorage.setToken(token);
                    } else {
                        // 세션 스토리지에 저장 (브라우저 닫으면 삭제)
                        sessionStorage.setItem('accessToken', idToken);
                    }
                    // 필요시 서버와 협력하여 HttpOnly 쿠키 설정을 위한 API 호출도 가능
                    // (백엔드에서 처리해야 합니다)

                    // 로그인 성공 후 메인 페이지 또는 대시보드로 이동
                    // navigate('/home'); // 또는 원하는 경로
                } else {
                    throw new Error();
                }
                console.log('로그인 성공', responseData);
            } catch (error) {
                console.log(error);
                if (error.response?.data?.message) {
                    alert(`로그인 실패: ${error.response.data.message}`);
                } else {
                    alert('로그인 중 오류가 발생했습니다.');
                }
            }
        }
    };

    return (
        <Container>
            <FormCard>
                <Header>
                    <Title>로그인</Title>
                    <Subtitle>서비스 이용을 위해 로그인해주세요</Subtitle>
                </Header>

                <form onSubmit={handleSubmit}>
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
                            placeholder="비밀번호를 입력해주세요"
                        />
                        {errors.password && (
                            <ErrorMessage>{errors.password}</ErrorMessage>
                        )}
                    </FormGroup>

                    <UtilityContainer>
                        <RememberMeContainer>
                            <Checkbox
                                type="checkbox"
                                id="remember"
                                checked={rememberMe}
                                onChange={handleCheckboxChange}
                            />
                            <CheckboxLabel htmlFor="remember">
                                로그인 상태 유지
                            </CheckboxLabel>
                        </RememberMeContainer>

                        <ForgotPassword>비밀번호 찾기</ForgotPassword>
                    </UtilityContainer>

                    <PrimaryButton type="submit">로그인</PrimaryButton>

                    <RegisterLink>
                        계정이 없으신가요? <LinkText>회원가입</LinkText>
                    </RegisterLink>
                </form>
            </FormCard>
        </Container>
    );
};

// Styled Components
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

const UtilityContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
`;

const RememberMeContainer = styled.div`
    display: flex;
    align-items: center;
`;

const Checkbox = styled.input`
    margin: 0;
    margin-right: 8px;
    accent-color: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
`;

const CheckboxLabel = styled.label`
    font-size: 14px;
    color: #4e5968;
    cursor: pointer;
`;

const ForgotPassword = styled.span`
    font-size: 14px;
    color: ${({ theme }) => theme.colors.primary};
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
`;

const RegisterLink = styled.div`
    margin-top: 24px;
    text-align: center;
    font-size: 14px;
    color: #4e5968;
`;

const LinkText = styled.span`
    color: ${({ theme }) => theme.colors.primary};
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
`;
