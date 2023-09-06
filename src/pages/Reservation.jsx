import React, { useState } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  Container,
  Typography,
} from '@mui/material';
import { Navbar } from '../components/Navbar';
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  doc,
  Timestamp, // Import Timestamp from Firestore
} from 'firebase/firestore';
import { db } from '../lib/firebase.js';

const ReservationForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [guests, setGuests] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().substr(0, 10));
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const [selectedHours, setSelectedHours] = useState(1);

  const handleReservation = async () => {
    try {
      // Validate date and time format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      const timeRegex = /^\d{2}:\d{2}$/;

      if (!dateRegex.test(selectedDate) || !timeRegex.test(selectedStartTime)) {
        throw new Error('Invalid date or time format');
      }

      // Convert selectedDate and selectedStartTime to Firestore Timestamps
      const formattedDate = selectedDate.split('-').reverse().join('-');
      const formattedStartTime = `${formattedDate}T${selectedStartTime}:00.000Z`;
      const startTime = new Date(formattedStartTime);
      const endTime = new Date(startTime);
      endTime.setHours(startTime.getHours() + parseInt(selectedHours));

      // Query Firestore to get all documents in the 'tables' collection
      const tablesCollectionRef = collection(db, 'tables');
      const tablesSnapshot = await getDocs(tablesCollectionRef);

      if (tablesSnapshot.empty) {
        console.log('No tables found');
        return;
      }

      // Find an available table
      let availableTableID = null;
      const selectedDateTimeRange = {
        start: Timestamp.fromDate(startTime), // Use Firestore Timestamp here
        end: Timestamp.fromDate(endTime), // Use Firestore Timestamp here
      };

      tablesSnapshot.forEach((tableDoc) => {
        const tableData = tableDoc.data();
        const bookings = tableData.bookings || [];

        // Check if the selected time slot is available for this table
        let isSlotAvailable = true;

        for (const booking of bookings) {
          const bookingStartTime = booking.start.toDate();
          const bookingEndTime = booking.end.toDate();

          // Check if there is any overlap in time slots
          if (
            (selectedDateTimeRange.start.toDate() >= bookingStartTime && selectedDateTimeRange.start.toDate() < bookingEndTime) ||
            (selectedDateTimeRange.end.toDate() > bookingStartTime && selectedDateTimeRange.end.toDate() <= bookingEndTime) ||
            (selectedDateTimeRange.start.toDate() <= bookingStartTime && selectedDateTimeRange.end.toDate() >= bookingEndTime)
          ) {
            isSlotAvailable = false;
            break; // No need to check further for this table
          }
        }

        if (isSlotAvailable && availableTableID === null) {
          availableTableID = tableDoc.id; // Use the Firestore document ID
        }
      });

      if (availableTableID !== null) {
        // The selected time slot is available, add the reservation to tableBookings
        const reservationData = {
          name: name,
          email: email,
          numGuests: guests,
          dateTime: serverTimestamp(),
          tableID: availableTableID,
        };

        const tableBookingRef = collection(db, 'tableBookings');
        await addDoc(tableBookingRef, reservationData);

        console.log('Reservation added to tableBookings');

        // Reservation successful
        console.log('Reservation successful');
      } else {
        // No available tables for the selected time slot
        console.log('No available tables for the selected time slot');
      }
    } catch (error) {
      console.error('Error updating Firestore:', error);
    }
  };

  return (
    <>
      <Navbar />
      <Container disableGutters maxWidth={'md'} sx={{ marginTop: 5 }}>
        <div>
          <Typography variant="h6" component="h2" align="center">
            Reserve your Table
          </Typography>

          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ marginTop: 2 }}
          />

          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ marginTop: 2 }}
          />

          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <InputLabel>Number of Guests</InputLabel>
            <Select value={guests} onChange={(e) => setGuests(e.target.value)}>
              {[1, 2, 3, 4, 5, 6].map((guestCount) => (
                <MenuItem key={guestCount} value={guestCount}>
                  {guestCount}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Select Date"
            type="date"
            fullWidth
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            sx={{ marginTop: 2 }}
          />

          <Container
            disableGutters
            sx={{
              marginTop: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: '50px',
              gap: 3,
            }}
          >
            <TextField
              label="Start Time"
              type="time"
              fullWidth
              value={selectedStartTime}
              onChange={(e) => setSelectedStartTime(e.target.value)}
              sx={{ flex: '1', marginLeft: 0, marginRight: 0 }}
            />

            <TextField
              label="Hours"
              type="number"
              fullWidth
              value={selectedHours}
              onChange={(e) => setSelectedHours(e.target.value)}
              sx={{ flex: '1', marginLeft: 0, marginRight: 0 }}
              inputProps={{ min: 1, max: 5 }}
            />
          </Container>

          <Container
            sx={{
              marginTop: 5,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '50px',
            }}
          >
            <Button
              onClick={handleReservation}
              variant="outlined"
              color="primary"
              size="large"
            >
              Reserve Table
            </Button>
          </Container>
        </div>
      </Container>
    </>
  );
};

export default ReservationForm;
