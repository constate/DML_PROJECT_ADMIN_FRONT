import axiosInstance from '../axiosInstance';

const DML_SERVER = import.meta.env.VITE_DML_SERVER || '';

export const postProduct = async (sendJson) => {
    try {
        console.log(sendJson);
        const authData = localStorage.getItem('auth-storage');
        const parsed = JSON.parse(authData);
        const groups = parsed?.state?.user?.groups;
        const userId = parsed?.state?.user?.uid;
        const response = await axiosInstance.post(
            `${DML_SERVER}/api/${groups[0]}/product`,
            { ...sendJson, createdBy: userId },
        );
        console.log('response', response);
        return response.data;
    } catch (error) {
        throw error;
    }
};
