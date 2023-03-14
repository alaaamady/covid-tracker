import Map, { Marker, Popup } from 'react-map-gl';
import { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import { PageLayout } from '../components/page-layout';
import { AddLog } from '../components/AddLog';
import { Box } from '@mui/system';

interface LogList {
  _id: string;
  userId: string;
  temperature: number;
  location: {
    type: 'Point';
    coordinates: number[];
    _id: string;
  };
  __v: number;
}
export const Dashboard: React.FC = () => {
  const [location, setLocation] = useState<{
    longitude: number;
    latitude: number;
  }>();
  const [selectedLog, setSelectedLog] = useState<LogList>();
  const [loading, setLoading] = useState<boolean>(true);
  const [logList, setLogList] = useState<LogList[]>();
  const { getAccessTokenSilently } = useAuth0();

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
    const getLogList = async () => {
      const accessToken = await getAccessTokenSilently();
      const apiUrl = 'http://localhost:3000';
      const getAllLogsUrl = `${apiUrl}/api/logs`;
      const allLogsResponse = await fetch(getAllLogsUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      const json = await allLogsResponse.json();
      const logs = json.data;
      setLogList(logs);
    };
    getLogList();
  }, [getAccessTokenSilently]);
  return (
    <PageLayout>
      {!loading ? (
        <Map
          initialViewState={{
            longitude: location?.longitude,
            latitude: location?.latitude,
            zoom: 14,
          }}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          mapboxAccessToken="pk.eyJ1IjoiYWxhYW1hZHkiLCJhIjoiY2xmN3o1ZHc5MDAxczQzb2ljaWJsemlqciJ9.hsQyC8LhKEhQ8X0PvfMQHQ"
        >
          {selectedLog && (
            <Popup
              onClose={() => setSelectedLog(undefined)}
              longitude={selectedLog.location.coordinates[0]}
              latitude={selectedLog.location.coordinates[1]}
              anchor="top"
            >
              <h1>{selectedLog.temperature} °C</h1>
            </Popup>
          )}
          {logList?.map((log) => (
            <Marker
              key={log._id}
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setSelectedLog(log);
              }}
              longitude={log.location.coordinates[0]}
              latitude={log.location.coordinates[1]}
            />
          ))}
          <Box sx={{ position: 'fixed', right: '5%', top: '15%' }}>
            <AddLog />
          </Box>
        </Map>
      ) : (
        <CircularProgress />
      )}
    </PageLayout>
  );
};
