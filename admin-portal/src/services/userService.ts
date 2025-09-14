import api from './api';

export const getAllUsers = async () => {
    const response = await api.get('/users');
    return response.data;
};
export const getUsersWithStatus = async () => {
    const response = await api.get('/users/status');
    return response.data;
};