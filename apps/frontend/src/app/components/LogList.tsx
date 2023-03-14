import { useAuth0 } from '@auth0/auth0-react';
import { List, ListItem, Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';

interface Log {
  temperature: number;
  createdAt: Date;
}
export const LogList = () => {
  const [userLogs, setUserLogs] = useState<Log[]>();
  const { getAccessTokenSilently } = useAuth0();
  useEffect(() => {
    const getUserLogs = async () => {
      const apiUrl = 'http://localhost:3000';
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(`${apiUrl}/api/logs/personal`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      const json = await response.json();
      const logs = json.data;
      setUserLogs(logs.length ? logs : [logs]);
    };
    getUserLogs();
  }, [getAccessTokenSilently]);

  console.log(userLogs);
  return (
    <Box>
      <Typography variant="h3">Your Log History</Typography>
      <List>
        {userLogs?.map((log) => {
          return (
            <>
              <ListItem>
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
    </Box>
  );
};
