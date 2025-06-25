
import React, { createContext, useContext, useState, useEffect } from 'react';

interface LocationContextType {
  userLocation: { lat: number; lng: number; address: string } | null;
  isLoading: boolean;
  error: string | null;
  requestLocation: () => void;
  setManualLocation: (address: string) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      // Using a simple reverse geocoding service (free tier)
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      const data = await response.json();
      return data.locality || data.city || data.countryName || 'Unknown location';
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return 'Unknown location';
    }
  };

  const requestLocation = () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const address = await reverseGeocode(latitude, longitude);
        
        setUserLocation({
          lat: latitude,
          lng: longitude,
          address
        });
        setIsLoading(false);
      },
      (error) => {
        setError('Unable to retrieve your location');
        setIsLoading(false);
        console.error('Geolocation error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const setManualLocation = async (address: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // For demo purposes, we'll set a default location
      // In a real app, you'd use geocoding to convert address to coordinates
      setUserLocation({
        lat: 40.7128,
        lng: -74.0060,
        address
      });
      setIsLoading(false);
    } catch (error) {
      setError('Unable to set location');
      setIsLoading(false);
    }
  };

  // Check for saved location on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      try {
        setUserLocation(JSON.parse(savedLocation));
      } catch (error) {
        console.error('Failed to parse saved location:', error);
      }
    }
  }, []);

  // Save location to localStorage when it changes
  useEffect(() => {
    if (userLocation) {
      localStorage.setItem('userLocation', JSON.stringify(userLocation));
    }
  }, [userLocation]);

  return (
    <LocationContext.Provider
      value={{
        userLocation,
        isLoading,
        error,
        requestLocation,
        setManualLocation
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
