import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import useAuthStore from '@stores/authStore';

export const HomePage = () => {
    const navigate = useNavigate();
    const { accessToken, logout, checkAuth, user } = useAuthStore();
    // const [isAuthenticated, setIsAuthenticated] = useState(null); // 초기 상태는 null(확인 중)

    useEffect(() => {
        // 토큰이 없거나 유효하지 않으면 로그인 페이지로 리다이렉트
        if (!checkAuth()) {
            navigate('/login');
        }
    }, [checkAuth, navigate]);

    // useEffect(() => {
    //     const checkAuth = () => {
    //         const accessToken =
    //             localStorage.getItem('accessToken') ||
    //             sessionStorage.getItem('accessToken');

    //         if (!accessToken) {
    //             navigate('/login', { replace: true });
    //         } else {
    //             setIsAuthenticated(true);
    //         }
    //     };

    //     checkAuth();
    // }, [navigate]);

    // 인증 확인 중일 때는 아무것도 렌더링하지 않음
    // if (isAuthenticated === null) {
    //     return null;
    // }

    return (
        <div>
            <h1>홈 페이지</h1>
            <p>AccessToken이 존재하는 경우에만 볼 수 있는 페이지입니다.</p>
        </div>
    );
};
