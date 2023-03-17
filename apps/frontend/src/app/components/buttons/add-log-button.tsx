import { useAuth0 } from '@auth0/auth0-react';
import {
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Typography,
} from '@mui/material';
import { useState, useEffect } from 'react';

export const AddLog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState<{
    longitude: number;
    latitude: number;
  }>();
  const [temperature, setTemperature] = useState<number>();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);
  const { getAccessTokenSilently } = useAuth0();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      const accessToken = await getAccessTokenSilently();
      const addNewLogUrl = `${apiUrl}/logs`;
      const body = {
        temperature: temperature,
        location: {
          type: 'Point',
          coordinates: [location?.longitude, location?.latitude],
        },
      };
      const response = await fetch(addNewLogUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const json = await response.json();
      setOpen(false);
      return json;
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Button variant="contained" onClick={handleClickOpen} size="large">
        Add Log
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Covid Temperature Log</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter your current temperature </DialogContentText>
          <Typography variant="h5" color={'InfoText'}>
            Accept location access to be added to the covid log map
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Temperature"
            type="number"
            fullWidth
            variant="standard"
            onChange={(e) => setTemperature(Number(e.target.value))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
