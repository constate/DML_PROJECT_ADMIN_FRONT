import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_DML_SERVER,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // HTTP Only 쿠키 사용 시 필수
});

let isRefreshing = false;
let refreshSubscribers = [];

const onTokenRefreshed = (newToken) => {
    refreshSubscribers.forEach((callback) => callback(newToken));
    refreshSubscribers = [];
};

const addRefreshSubscriber = (callback) => {
    refreshSubscribers.push(callback);
};

// 요청 인터셉터 (Access Token 추가)
axiosInstance.interceptors.request.use(
    (config) => {
        try {
            const authData = localStorage.getItem('auth-storage');
            const parsed = JSON.parse(authData);
            const accessToken = parsed?.state?.accessToken;

            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
        } catch (err) {
            console.warn('AccessToken 파싱 실패:', err);
        }

        return config;
    },
    (error) => Promise.reject(error),
);

// 응답 인터셉터 (Access Token 만료 시 Refresh)
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve) => {
                    addRefreshSubscriber((newToken) => {
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        resolve(axiosInstance(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { data } = await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }, // HTTP Only 쿠키 전송
                );

                localStorage.setItem('accessToken', data.accessToken);
                axiosInstance.defaults.headers.Authorization = `Bearer ${data.accessToken}`;
                onTokenRefreshed(data.accessToken);

                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error('토큰 갱신 실패, 로그인 필요');
                localStorage.removeItem('access_token');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    },
);

export default axiosInstance;
