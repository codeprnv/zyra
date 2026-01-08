'use client';

import { useEffect, useState } from 'react';

const LOCATION_STORAGE_KEY = 'user_location';
const LOCATION_EXPIRY_DAYS = 20;

const getStoredLocation = () => {
  const storedData = localStorage.getItem(LOCATION_STORAGE_KEY);

  if (!storedData) return null;

  const parsedData = JSON.parse(storedData);
  const expiryTime = LOCATION_EXPIRY_DAYS * 24 * 60 * 60 * 1000; // 20 days in ms
  const isExpired = Date.now() - parsedData.timestamp > expiryTime;

  return isExpired ? null : parsedData;
};

const useLocationTracking = () => {
  const [location, setLocation] = useState<{
    country: string;
    city: string;
  } | null>(getStoredLocation());

  const fetchLocation = async () => {
    try {
      const res = await fetch('http://ip-api.com/json/');
      const data = await res.json();
      if (!data) throw new Error();
      const newLocation = {
        country: data?.country,
        city: data?.city,
        timestamp: Date.now(),
      };
      return newLocation;
    } catch (error) {
      console.error('Error fetching the user location: ', error);
      return;
    }
  };

  useEffect(() => {
    if (location) return;
    const getAndStoreLocation = async () => {
      const newLocation = await fetchLocation();
      if (newLocation) {
        localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(newLocation));
        setLocation({
          country: newLocation.country,
          city: newLocation.city,
        });
      }
    };
    getAndStoreLocation();
  }, []);
  return location;
};

export default useLocationTracking