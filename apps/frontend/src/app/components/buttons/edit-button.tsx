import { useAuth0 } from '@auth0/auth0-react';
import React, { useState } from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';

export const EditButton: React.FC = () => {
  const [name, setName] = useState('');
  const { getAccessTokenSilently, user } = useAuth0();

  const handleEdit = async () => {
    const domain = 'dev-cy0zxa6lnzeog5qu.us.auth0.com';
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: `https://${domain}/api/v2/`,
          scope:
            'update:users update:users_app_metadata update:current_user_metadata',
        },
      });
      console.log(accessToken);
      const userDetailsByIdUrlAPI = `${apiUrl}/api/edit-name`;

      const body = {
        userId: user?.sub,
        name: name,
      };
      const metadataResponse = await fetch(userDetailsByIdUrlAPI, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const response = await metadataResponse.json();
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box sx={{ textAlign: 'left', flexDirection: 'column' }}>
      <Typography variant="h4">Edit Name</Typography>
      <TextField
        id="outlined-basic"
        label="New Name"
        variant="outlined"
        onChange={(e) => setName(e.target.value)}
        fullWidth
        sx={{
          marginTop: '5%',
        }}
      />
      <Button
        onClick={handleEdit}
        color={'primary'}
        size="large"
        sx={{ marginTop: '5%' }}
        variant="contained"
      >
        Edit name
      </Button>
    </Box>
  );
};
