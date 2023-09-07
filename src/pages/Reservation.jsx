import React, { useState } from 'react';

import { auth, provider } from '../lib/firebase';
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
import ReservartionSuccessModal from '../components/ReservationSuccessModal';

const ReservationForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [guests, setGuests] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().substr(0, 10));
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const [selectedHours, setSelectedHours] = useState(1);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [tableID, setTableID] = useState('');

  const user = auth.currentUser;
  const userID = user ? user.uid : null;

  const handleReservation = async () => {
    try {
      // Validate date and time format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      const timeRegex = /^\d{2}:\d{2}$/;
  
      if (!dateRegex.test(selectedDate) || !timeRegex.test(selectedStartTime)) {
        throw new Error('Invalid date or time format');
      }
  
      // Combine selectedDate and selectedStartTime into a single ISO 8601 datetime string
      const formattedDateTime = `${selectedDate}T${selectedStartTime}:00.000Z`;
      const startTime = new Date(formattedDateTime);
      const endTime = new Date(startTime);
      endTime.setHours(startTime.getHours() + parseInt(selectedHours));
  
      // Query Firestore to get all documents in the 'tables' collection
      const tablesCollectionRef = collection(db, 'tables');
      const tablesSnapshot = await getDocs(tablesCollectionRef);
  
      if (tablesSnapshot.empty) {
        console.log('No tables found');
        return;
      }
  
      // Initialize an array to store available table IDs
      const availableTableIDs = [];
  
      // Iterate through the tables collection to find available tables
      tablesSnapshot.forEach((tableDoc) => {
        const tableData = tableDoc.data();
        const tableID = tableDoc.id;
  
        // Check if the table is available
        if (tableData.isAvailable) {
          availableTableIDs.push(tableID);
        }
      });
  
      // Query Firestore to get all documents in the 'tableBookings' collection
      const tableBookingsCollectionRef = collection(db, 'tableBookings');
      const tableBookingsSnapshot = await getDocs(tableBookingsCollectionRef);
  
      // Iterate through the tableBookings collection to check for conflicts
      tableBookingsSnapshot.forEach((bookingDoc) => {
        const bookingData = bookingDoc.data();
        const bookingStartTime = bookingData.start.toDate();
        const bookingEndTime = bookingData.end.toDate();
  
        // Check if there is any overlap in time slots
        for (const availableTableID of availableTableIDs) {
          const selectedDateTimeRange = {
            start: startTime,
            end: endTime,
          };
  
          if (
            (selectedDateTimeRange.start >= bookingStartTime && selectedDateTimeRange.start < bookingEndTime) ||
            (selectedDateTimeRange.end > bookingStartTime && selectedDateTimeRange.end <= bookingEndTime) ||
            (selectedDateTimeRange.start <= bookingStartTime && selectedDateTimeRange.end >= bookingEndTime)
          ) {
            // Remove the table ID from availableTableIDs if there's a conflict
            const index = availableTableIDs.indexOf(availableTableID);
            if (index !== -1) {
              availableTableIDs.splice(index, 1);
            }
          }
        }
      });
  
      if (availableTableIDs.length > 0) {
        // Get the first available table ID
        const availableTableID = availableTableIDs[0];
        setTableID(availableTableID); // Set the tableID in state
        setSuccessModalOpen(true); // Open the success modal
        console.log('Available table ID:', availableTableID);
  
        // The selected time slot is available, add the reservation to tableBookings
        const reservationData = {
          name: name,
          email: email,
          numGuests: guests,
          dateTime: serverTimestamp(),
          tableID: availableTableID,
          start: Timestamp.fromDate(startTime),
          end: Timestamp.fromDate(endTime),
          userID: userID,
        };
  
        const tableBookingRef = collection(db, 'tableBookings');
        await addDoc(tableBookingRef, reservationData);
  
        console.log('Reservation added to tableBookings');
        console.log('Reservation successful');
      } else {
        // No available tables or selected time slot is no longer available
        console.log('No available tables or selected time slot is no longer available');
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
            Reserve your Table Now !
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

<FormControl  sx={{ flex: '1', marginLeft: 0, marginRight: 0}}>
            <InputLabel>Number of Hours</InputLabel>
            <Select value={selectedHours} onChange={(e) => setSelectedHours(e.target.value)}>
              {[1, 2, 3].map((hourCount) => (
                <MenuItem key={hourCount} value={hourCount}>
                  {hourCount}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
          <ReservartionSuccessModal
            open={successModalOpen}
            onClose={() => setSuccessModalOpen(false)}
            tableID={tableID}
          />
        </div>
      </Container>
    </>
  );
};

export default ReservationForm;
