import { useAuth0, User } from '@auth0/auth0-react';
import React, { useEffect, useState, useContext } from 'react';
import { EditButton } from '../components/buttons/edit-button';
import { PageLayout } from '../components/page-layout';
import {
  Avatar,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Box,
} from '@mui/material';
import { StoreContext } from '../store';

export const ProfilePage: React.FC = () => {
  const [userMetadata, setUserMetadata] = useState<User>();
  const { userName } = useContext(StoreContext);

  //calback
  const { user } = useAuth0();
  useEffect(() => {
    setUserMetadata({
      name: user?.name,
      email: user?.email,
      picture: user?.picture,
    });
  }, [user]);
  if (!user) {
    return null;
  }
  console.log(userName ?? user.name);
  return (
    <PageLayout>
      <Card
        variant="outlined"
        sx={{
          margin: '15%',
        }}
      >
        <CardHeader
          title={
            <Typography variant="h3" justifyContent={'center'}>
              {userName ?? user.name}
            </Typography>
          }
          avatar={
            <Avatar
              alt="Profile Picture"
              src={userMetadata?.picture ?? user.picture}
            />
          }
        />
        <CardContent>
          <Box display="flex">
            <EditButton />
          </Box>
        </CardContent>
      </Card>
    </PageLayout>
  );
};
