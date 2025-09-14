import api from './api'; // Your pre-configured axios instance

interface ZoneData {
    name: string;
    warning: string;
    coordinates: [number, number][][];
}

/**
 * Fetches all existing danger zones from the backend.
 */
export const getZones = async () => {
    const response = await api.get('/zones');
    return response.data;
};

/**
 * Creates a new danger zone.
 * @param {ZoneData} zoneData The data for the new zone.
 */
export const createZone = async (zoneData: ZoneData) => {
    const response = await api.post('/zones', zoneData);
    return response.data;
};

/**
 * Deletes a danger zone by its ID.
 * @param {string} zoneId The ID of the zone to delete.
 */
export const deleteZone = async (zoneId: string) => {
    const response = await api.delete(`/zones/${zoneId}`);
    return response.data;
};