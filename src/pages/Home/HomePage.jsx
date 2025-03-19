import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const HomePage = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(null); // 초기 상태는 null(확인 중)

    useEffect(() => {
        const checkAuth = () => {
            const accessToken =
                localStorage.getItem('accessToken') ||
                sessionStorage.getItem('accessToken');

            if (!accessToken) {
                navigate('/login', { replace: true });
            } else {
                setIsAuthenticated(true);
            }
        };

        checkAuth();
    }, [navigate]);

    // 인증 확인 중일 때는 아무것도 렌더링하지 않음
    if (isAuthenticated === null) {
        return null;
    }

    return (
        <div>
            <h1>홈 페이지</h1>
            <p>AccessToken이 존재하는 경우에만 볼 수 있는 페이지입니다.</p>
        </div>
    );
};
