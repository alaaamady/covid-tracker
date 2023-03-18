import { useAuth0 } from '@auth0/auth0-react';
import { List, ListItem, Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useContext, useEffect } from 'react';
import { StoreContext } from '../store';

export const LogList = () => {
  const { logList, setLogList } = useContext(StoreContext);
  const { getAccessTokenSilently } = useAuth0();
  useEffect(() => {
    const getUserLogs = async () => {
      const apiUrl = import.meta.env.VITE_API_URL;
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(`${apiUrl}/logs/personal`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      const json = await response.json();
      const logs = json.data;
      setLogList(logs);
      return logs;
    };
    getUserLogs();
  }, [getAccessTokenSilently]);
  return (
    <Box>
      <Typography variant="h3">Your Log History</Typography>
      {logList?.length ? (
        <List style={{ textAlign: 'center' }}>
          {logList?.map((log, key) => {
            return (
              <>
                <ListItem key={key}>
                  <Box flexDirection={'column'}>
                    <Typography variant="h4">{log.temperature} °C</Typography>
                    <Typography variant="h4">
                      {`${new Date(log.createdAt).getDate()}-${
                        new Date(log.createdAt).getMonth() + 1
                      }-${new Date(log.createdAt).getFullYear()} ${new Date(
                        log.createdAt
                      ).getHours()}:${new Date(
                        log.createdAt
                      ).getMinutes()}:${new Date(log.createdAt).getSeconds()}`}
                    </Typography>
                  </Box>
                </ListItem>
                <Divider />
              </>
            );
          })}
        </List>
      ) : null}
    </Box>
  );
};
