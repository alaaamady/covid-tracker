import { useAuth0 } from '@auth0/auth0-react';
import { Typography, Box } from '@mui/material';
import React from 'react';
import { AddLog } from '../components/buttons/add-log-button';
import { LogList } from '../components/log-list';
import { PageLayout } from '../components/page-layout';

export const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth0();
  return (
    <PageLayout>
      <Box textAlign={'center'} sx={{ padding: '5%' }}>
        <Typography variant="h1" margin={'2%'} fontWeight="500">
          Track Covid Cases
        </Typography>
        <Box flexDirection={'row'} marginBottom={'5%'}>
          <Typography variant="h5" margin={'2%'}>
            {!isAuthenticated ? 'Register and l' : 'L'}og your covid reports{' '}
          </Typography>
          {isAuthenticated && <AddLog />}
        </Box>

        {isAuthenticated && <LogList />}
      </Box>
    </PageLayout>
  );
};
