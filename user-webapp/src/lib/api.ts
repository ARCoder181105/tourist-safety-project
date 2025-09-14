import axios from 'axios';
import { getItem } from './storage.ts'; // Assuming you create a storage.ts

const API_URL = import.meta.env.VITE_BACKEND_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Function to submit a user-generated hazard report
export const submitHazardReport = async (reportData: any) => {
    const response = await api.post('/reports', reportData);
    return response.data;
};

// Function to send the verified SOS data to the backend
export const sendSOSPacket = async (sosData: any) => {
    const response = await api.post('/sos', sosData);
    return response.data;
};

/**
 * Sends the user's current coordinates to the backend.
 * @param location An object with latitude and longitude.
 */
export const updateUserLocation = async (location: { latitude: number, longitude: number }) => {
    // The JWT token is added automatically by the interceptor
    const response = await api.post('/users/location', location);
    return response.data;
};

export default api;