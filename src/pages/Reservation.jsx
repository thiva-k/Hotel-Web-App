import React, { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  Container,
  Typography,
  Paper,
} from '@mui/material';
import { Navbar } from '../components/Navbar';
import {
  collection,
  addDoc,
  serverTimestamp,
  Timestamp,
  getDocs,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import ReservationSuccessModal from '../components/ReservationSuccessModal';
import { v4 as uuidv4 } from 'uuid';
import Footer from '../components/Footer';

const ReservationForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [guests, setGuests] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().substr(0, 10));
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const [selectedHours, setSelectedHours] = useState(1);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [tableID, setTableID] = useState('');
  const [reservationKey, setReservationKey] = useState('');
  const [availableTables, setAvailableTables] = useState([]);

  const user = auth.currentUser;
  const userID = user ? user.uid : null;

  // Function to check table availability
  const checkAvailability = async () => {
    try {
      if (!selectedDate || !selectedStartTime) {
        return;
      }

      const formattedDateTime = `${selectedDate}T${selectedStartTime}:00.000Z`;
      const startTime = new Date(formattedDateTime);
      const endTime = new Date(startTime);
      endTime.setHours(startTime.getHours() + parseInt(selectedHours));

      const tablesCollectionRef = collection(db, 'tables');
      const tablesSnapshot = await getDocs(tablesCollectionRef);

      if (tablesSnapshot.empty) {
        console.log('No tables found');
        return;
      }

      const availableTableIDs = [];

      tablesSnapshot.forEach((tableDoc) => {
        const tableData = tableDoc.data();
        const tableID = tableDoc.id;

        if (tableData.isAvailable) {
          availableTableIDs.push(tableID);
        }
      });

      const tableBookingsCollectionRef = collection(db, 'tableBookings');
      const tableBookingsSnapshot = await getDocs(tableBookingsCollectionRef);

      tableBookingsSnapshot.forEach((bookingDoc) => {
        const bookingData = bookingDoc.data();
        const bookingStartTime = bookingData.start.toDate();
        const bookingEndTime = bookingData.end.toDate();

        for (const availableTableID of availableTableIDs) {
          const selectedDateTimeRange = {
            start: startTime,
            end: endTime,
          };

          if (
            (selectedDateTimeRange.start >= bookingStartTime &&
              selectedDateTimeRange.start < bookingEndTime) ||
            (selectedDateTimeRange.end > bookingStartTime &&
              selectedDateTimeRange.end <= bookingEndTime) ||
            (selectedDateTimeRange.start <= bookingStartTime &&
              selectedDateTimeRange.end >= bookingEndTime)
          ) {
            const index = availableTableIDs.indexOf(availableTableID);
            if (index !== -1) {
              availableTableIDs.splice(index, 1);
            }
          }
        }
      });

      setAvailableTables(availableTableIDs);
    } catch (error) {
      console.error('Error checking availability:', error);
    }
  };

  useEffect(() => {
    checkAvailability();
  }, [selectedDate, selectedStartTime, selectedHours]);

  const handleReservation = async () => {
    if (!name || !email || !selectedDate || !selectedStartTime) {
      alert('Please fill out all required fields.');
      throw new Error('Please fill out all required fields.');
    }

    if (availableTables.length > 0) {
      const formattedDateTime = `${selectedDate}T${selectedStartTime}:00.000Z`;
      const startTime = new Date(formattedDateTime);
      const endTime = new Date(startTime);
      endTime.setHours(startTime.getHours() + parseInt(selectedHours));

      // Generate a random string using UUID for the reservation key
      const randomString = uuidv4();
      setReservationKey(randomString);

      // The selected time slot is available, add the reservation to tableBookings
      const reservationData = {
        name: name,
        email: email,
        numGuests: guests,
        dateTime: serverTimestamp(),
        tableID: parseInt(availableTables[0]), // Use the first available table
        start: Timestamp.fromDate(startTime),
        end: Timestamp.fromDate(endTime),
        userID: userID,
        key: randomString,
      };

      const tableBookingRef = collection(db, 'tableBookings');
      await addDoc(tableBookingRef, reservationData);

      setTableID(availableTables[0]); // Set the tableID in state
      setSuccessModalOpen(true); // Open the success modal
      console.log('Reservation added to tableBookings');
      console.log('Reservation successful');
      console.log(`Your reservation key is: ${randomString}`);
      // sendEmail(randomString); // Send an email with the reservation key
      resetForm();
    } else {
      console.log('No available tables or selected time slot is no longer available');
      alert('No available tables on the selected time slot. Please select another time slot.');
    }
  };

  const sendEmail = async (reservationKey) => {
    try {
      const sendReservationKeyEmail = functions.httpsCallable('sendReservationKeyEmail');

      // Call the Firebase Cloud Function
      await sendReservationKeyEmail({ email, reservationKey });

      console.log(`Email sent to ${email} with reservation key.`);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setGuests(1);
    setSelectedDate(new Date().toISOString().substr(0, 10));
    setSelectedStartTime('');
    setSelectedHours(1);
  };

  return (
    <>
      <Navbar />
      <Container disableGutters maxWidth={'md'} sx={{ marginTop: 5 }}>
        <Paper elevation={3} style={{ padding: '20px' }}>

          {/* Reservation form */}
          <div>
            <Typography variant="h6" component="h2" align="center">
              Reserve A Table to Dine with Us Now!
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
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ marginTop: 2 }}
              inputProps={{
                min: new Date().toISOString().split('T')[0],
              }}
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
              <FormControl sx={{ flex: '1', marginLeft: 0, marginRight: 0 }}>
                <InputLabel>Number of Hours</InputLabel>
                <Select
                  value={selectedHours}
                  onChange={(e) => setSelectedHours(e.target.value)}
                >
                  {[1, 2, 3].map((hourCount) => (
                    <MenuItem key={hourCount} value={hourCount}>
                      {hourCount}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Container>

                        <Typography
              sx={{
                marginTop: 3,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '50px',
              }}
              variant="body1"
              align="center"
              gutterBottom
            >
              Available Tables: &nbsp;
              <span style={{ color: availableTables.length > 0 ? 'green' : 'inherit' }}>
                {availableTables.length === 0
                  ? '*Select Date and Time to Check Availability'
                  : availableTables.length}
              </span>
            </Typography>

            <Container
              sx={{
                marginTop: 0,
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
            <ReservationSuccessModal
              open={successModalOpen}
              onClose={() => setSuccessModalOpen(false)}
              tableID={tableID}
              reservationKey={reservationKey}
            />
          </div>
        </Paper>
      </Container>
      <Footer />
    </>
  );
};

export default ReservationForm;
