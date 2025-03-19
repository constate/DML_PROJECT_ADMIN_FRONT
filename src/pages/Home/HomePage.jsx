import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const HomePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken')
            ? localStorage.getItem('accessToken')
            : sessionStorage.getItem('accessToken');

        // accessToken이 없으면 login 페이지로 리디렉션
        if (!accessToken) {
            navigate('/login', { replace: true });
        }
    }, [navigate]); // navigate가 변경되었을 때만 실행

    return (
        <div>
            <h1>홈 페이지</h1>
            <p>AccessToken이 존재하는 경우에만 볼 수 있는 페이지입니다.</p>
        </div>
    );
};
