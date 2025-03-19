// src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// persist 미들웨어를 사용하여 localStorage에 토큰 저장
const useAuthStore = create(
    persist(
        (set, get) => ({
            accessToken: null,
            isAuthenticated: false,
            user: null,

            // 로그인 성공 시 토큰 저장
            setAccessToken: (accessToken, user) =>
                set({
                    accessToken,
                    isAuthenticated: !!accessToken,
                    user,
                }),

            // 로그아웃 시 토큰 제거
            logout: () =>
                set({
                    accessToken: null,
                    isAuthenticated: false,
                    user: null,
                }),

            // 토큰 유효성 확인 함수
            checkAuth: () => {
                const { accessToken } = get();
                // 여기서 토큰 만료 확인 로직을 추가할 수 있습니다
                return !!accessToken;
            },
        }),
        {
            name: 'auth-storage', // localStorage에 저장될 키 이름
            getStorage: () => localStorage, // 저장소 지정 (localStorage 사용)
        },
    ),
);

export default useAuthStore;
