import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '@stores/authStore';

export const ProtectedRoute = () => {
    const checkAuth = useAuthStore((state) => state.checkAuth);

    // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
    if (!checkAuth()) {
        return <Navigate to="/login" replace />;
    }

    // 인증된 사용자는 자식 라우트를 렌더링
    return <Outlet />;
};
