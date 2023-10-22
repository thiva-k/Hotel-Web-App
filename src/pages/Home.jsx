import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Container, Grid, TextField, Button, Slider, Typography, Box } from '@mui/material';
import { RoomCard } from '../components/RoomCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useQuery } from 'react-query';
import Footer from '../components/Footer';

export default function Home({ setDarkMode }) {
  const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in the "yyyy-MM-dd" format

  const [startDate, setStartDate] = useState(currentDate); // Set the default "From" date to the current date
  const [endDate, setEndDate] = useState('');
  const [guests, setGuests] = useState(1); // Set a default value for the number of guests
  const [price, setPrice] = useState(1); // Set a default value for the price

  const fetchRooms = async () => {
    const roomsCollection = collection(db, 'rooms');
    const querySnapshot = await getDocs(roomsCollection);
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log(data);
    return data;
  };

  const { data, isLoading } = useQuery('rooms', fetchRooms);

  const handleGuestsChange = (event, newValue) => {
    setGuests(newValue);
  };

  const handlePriceChange = (event, newValue) => {
    setPrice(newValue);
  };

  return isLoading ? (
    <LoadingSkeleton />
  ) : (
    <>
      <Navbar setDarkMode={setDarkMode} />
      <main>
        <Container maxWidth={'lg'} sx={{ marginTop: 5 }}>
          {/* Filter Section */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 35,
              gap: '20px',
            }}
          >
            <div style={{ flex: 1 }}>
              <Typography variant="body2">From:</Typography>
              <TextField
                type="date"
                variant="outlined"
                size="small"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                inputProps={{ min: currentDate }} // Set the minimum date to the current date
              />
            </div>
            <div style={{ flex: 1 }}>
              <Typography variant="body2">To:</Typography>
              <TextField
                type="date"
                variant="outlined"
                size="small"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                inputProps={{ min: startDate }} // Set the minimum date to the selected "From" date
              />
            </div>
            <div style={{ flex: 1 }}>
              <Typography variant="body2">Number of Guests (1-10):</Typography>
              <Slider
                value={guests}
                onChange={handleGuestsChange}
                min={1}
                max={10}
                valueLabelDisplay="auto"
              />
            </div>
            <div style={{ flex: 1 }}>
              <Typography variant="body2">Price $ ( 1- 1000):</Typography>
              <Slider
                value={price}
                onChange={handlePriceChange}
                min={1}
                max={1000}
                valueLabelDisplay="auto"
              />
            </div>
            <div style={{ }}>
              <Button variant="contained" color="primary">
                Apply Filters
              </Button>
            </div>
          </div>

          {/* Room Cards Section (Render your room cards here) */}
          <Grid container spacing={2}>
            {data?.map((item) => (
              <Grid key={item.id} item xs={12} md={4}>
                <RoomCard room={item} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      <Footer />
    </>
  );
}
