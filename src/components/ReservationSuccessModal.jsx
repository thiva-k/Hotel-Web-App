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

const ReservationSuccessModal = ({ open, onClose, tableID, reservationKey }) => {
  

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Reservation Successful !</DialogTitle>
      <DialogContent>
        <Grid container alignItems="center" justifyContent="center" spacing={1}>
          <Grid item>
            <CheckCircleIcon fontSize="large" color="success" />
          </Grid>
          <Grid item>
            <Typography variant="body1">
              You have successfully placed a reservation.
            </Typography>
            <Typography variant="body1">
              Your table ID is {tableID} !
            </Typography>
            <Typography variant="body1">
              Please bring this key with you :
            </Typography>
            <Typography variant="body1">
              {reservationKey}
            </Typography>
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

export default ReservationSuccessModal;
