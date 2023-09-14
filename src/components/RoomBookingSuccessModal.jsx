import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Button,
  Grid,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RoomIcon from '@mui/icons-material/Room'; // You can use the RoomIcon for the room logo

const RoomBookingSuccessModal = ({ open, onClose, roomTitle, roomNum }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Booking Successful!</DialogTitle>
      <DialogContent>
        <Grid container alignItems="center" justifyContent="center" spacing={1}>
          <Grid item>
            <RoomIcon fontSize="large" color="primary" />
          </Grid>
          <Grid item>
            <Typography variant="body1">
              You have successfully booked a room.
            </Typography>
            <Typography variant="body1">
              Room Title: {roomTitle}
            </Typography>
            <Typography variant="body1">
              Room Number: {roomNum}
            </Typography>
            {/* You can add more details here if needed */}
          </Grid>
          <Grid item>
            <Button onClick={onClose} color="primary">
              Close
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default RoomBookingSuccessModal;
