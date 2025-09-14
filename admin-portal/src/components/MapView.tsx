import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '0 0 0.5rem 0.5rem', // To match the card's rounded bottom corners
};

const defaultCenter = {
    lat: 18.5204, // Default to Pune, India
    lng: 73.8567,
};

interface User {
        _id: string;
        walletAddress: string;
        lastLocation?: {
                coordinates: [number, number]; // [longitude, latitude]
        };
}

interface MapViewProps {
        users: User[];
}

const MapView: React.FC<MapViewProps> = ({ users }) => {
        // This hook loads the Google Maps script with your API key
        const { isLoaded } = useJsApiLoader({
                id: 'google-map-script',
                googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        });

        if (!isLoaded) {
                return <div className="flex items-center justify-center h-full">Loading Map...</div>;
        }

        return (
                <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={defaultCenter}
                        zoom={12}
                >
                        {/* Dummy marker for demonstration */}
                        <Marker 
                                position={{
                                        lat: 18.5304, // Slightly different latitude
                                        lng: 73.8567, // Same longitude
                                }}
                                title="Dummy Marker"
                        />

                        {users.map(user => 
                                // Ensure user has valid coordinates before rendering a marker
                                user.lastLocation?.coordinates && user.lastLocation.coordinates.length === 2 && (
                                        <Marker 
                                                key={user._id} 
                                                position={{
                                                        lat: user.lastLocation.coordinates[1], // latitude
                                                        lng: user.lastLocation.coordinates[0]  // longitude
                                                }}
                                                title={`User: ${user.walletAddress}`}
                                        />
                                )
                        )}
                </GoogleMap>
        );
};

export default MapView;