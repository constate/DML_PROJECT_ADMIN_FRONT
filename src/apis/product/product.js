import axios from 'axios';

const DML_SERVER = import.meta.env.VITE_DML_SERVER || '';

export const postProduct = async (sendJson) => {
    try {
        const response = await axios.post(
            `${DML_SERVER}/api/product`,
            sendJson,
        );
        console.log('response', response);
        return response.data;
    } catch (error) {
        throw error;
    }
};
