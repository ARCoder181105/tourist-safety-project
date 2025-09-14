import api from './api';

// Function to get historical SOS events
export const getSosHistory = async () => {
  const response = await api.get('/sos');
  return response.data;
};

export const decryptSos = async (sosId: string) => {
    const response = await api.get(`/sos/${sosId}/decrypt`);
    return response.data; // This will return the object from the police service
};
// You can add other SOS-related API functions here later