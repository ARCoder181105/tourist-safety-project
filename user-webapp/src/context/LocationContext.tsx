import React, { createContext, useState, useContext, useEffect, useRef, ReactNode } from 'react';
import { updateUserLocation } from '../lib/api'; // The API service to send updates to the backend

// Define a simpler type for our location object
interface LocationCoords {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface LocationContextType {
  location: LocationCoords | null;
  isSharing: boolean;
  startSharing: () => void;
  stopSharing: () => void;
  errorMsg: string | null;
}

const LocationContext = createContext<LocationContextType | null>(null);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const watchId = useRef<number | null>(null); // The browser's watchId is a number

  // Get initial location on component mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser.");
      return;
    }

    // Get the location once to initialize the map
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords);
      },
      () => {
        setErrorMsg("Permission to access location was denied.");
      }
    );
  }, []);

  // This effect starts/stops the live tracking
  useEffect(() => {
    // Stop any existing watcher when the effect re-runs
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }

    if (isSharing) {
      // Start watching the user's position
      watchId.current = navigator.geolocation.watchPosition(
        (position) => {
          const newCoords = position.coords;
          setLocation(newCoords);
          // Send the update to the backend
          updateUserLocation({ 
            latitude: newCoords.latitude, 
            longitude: newCoords.longitude 
          }).catch(err => console.error("Failed to send location update:", err));
        },
        (error) => setErrorMsg("Location tracking error: " + error.message),
        { enableHighAccuracy: true }
      );
      console.log("Started live location sharing.");
    }

    // Cleanup function to stop watching when the component unmounts
    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, [isSharing]); // This effect re-runs whenever `isSharing` changes

  const startSharing = () => setIsSharing(true);
  const stopSharing = () => setIsSharing(false);

  return (
    <LocationContext.Provider value={{ location, isSharing, startSharing, stopSharing, errorMsg }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocation must be used within a LocationProvider');
  return context;
};