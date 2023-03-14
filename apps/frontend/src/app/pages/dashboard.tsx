import Map from 'react-map-gl';
import { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';

const MAPBOX_TOKEN =
  'pk.eyJ1IjoiYWxhYW1hZHkiLCJhIjoiY2xmN3o1ZHc5MDAxczQzb2ljaWJsemlqciJ9.hsQyC8LhKEhQ8X0PvfMQHQ'; // Set your mapbox token here

export const Dashboard: React.FC = () => {
  const [location, setLocation] = useState<{
    longitude: number;
    latitude: number;
  }>();
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);
  return !loading ? (
    <Map
      initialViewState={{
        longitude: location?.longitude,
        latitude: location?.latitude,
        zoom: 14,
      }}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken="pk.eyJ1IjoiYWxhYW1hZHkiLCJhIjoiY2xmN3o1ZHc5MDAxczQzb2ljaWJsemlqciJ9.hsQyC8LhKEhQ8X0PvfMQHQ"
    />
  ) : (
    <CircularProgress />
  );
};
