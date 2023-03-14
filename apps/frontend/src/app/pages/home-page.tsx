import { useAuth0 } from '@auth0/auth0-react';
import { Typography, Box } from '@mui/material';
import React from 'react';
import { AddLog } from '../components/AddLog';
import { LogList } from '../components/LogList';
import { PageLayout } from '../components/page-layout';

export const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth0();
  return (
    <PageLayout>
      <Box>
        <Typography variant="h1">Track Covid Cases</Typography>
        <Box flexDirection={'row'}>
          <Typography variant="h3">
            {!isAuthenticated ? 'Register and l' : 'L'}og your covid reports{' '}
          </Typography>
          {isAuthenticated && <AddLog />}
        </Box>

        {isAuthenticated && <LogList />}
      </Box>
    </PageLayout>
  );
};
