import axios from 'axios';

const DML_SERVER = import.meta.env.VITE_DML_SERVER || '';

export const signup = async (sendJson) => {
    try {
        const response = await axios.post(`${DML_SERVER}/api/signup`, sendJson);
        console.log('response', response);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const login = async (sendJson) => {
    try {
        const response = await axios.post(`${DML_SERVER}/api/login`, sendJson);
        console.log('response', response);
        return response.data;
    } catch (error) {
        throw error;
    }
};
