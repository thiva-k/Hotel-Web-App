import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Container, Grid, TextField, Slider, Typography } from '@mui/material';
import { RoomCard } from '../components/RoomCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useQuery } from 'react-query';
import Footer from '../components/Footer';

export default function Home({ setDarkMode }) {
  const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in the "yyyy-MM-dd" format

  const [startDate, setStartDate] = useState(currentDate);
  const [endDate, setEndDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [price, setPrice] = useState(1000);
  const [filtersApplied, setFiltersApplied] = useState(true);
  const [filteredData, setFilteredData] = useState([]);

  const fetchRooms = async () => {
    const roomsCollection = collection(db, 'rooms');
    const querySnapshot = await getDocs(roomsCollection);
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    const newData = data.filter(
      (room) => (!filtersApplied || (room.pricePerNight <= price && room.maxGuests >= guests))
    );

    return newData;
  };

  const { data = [], isLoading } = useQuery('rooms', fetchRooms);

  useEffect(() => {
    if (filtersApplied) {
      fetchRooms().then((newData) => {
        setFilteredData(newData);
      });
    } else {
      setFilteredData(data);
    }
  }, [filtersApplied, data, price, guests]);

  return isLoading ? (
    <LoadingSkeleton />
  ) : (
    <>
      <Navbar setDarkMode={setDarkMode} />
      <main>
        <Container maxWidth={'lg'} sx={{ marginTop: 5 }}>
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
                inputProps={{ min: currentDate }}
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
                inputProps={{ min: startDate }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Typography variant="body2">Number of Guests (1-10):</Typography>
              <Slider
                value={guests}
                min={1}
                max={10}
                valueLabelDisplay="auto"
                onChange={(event, newValue) => setGuests(newValue)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Typography variant="body2">Price $ (1-1000):</Typography>
              <Slider
                value={price}
                onChange={(event, newValue) => setPrice(newValue)}
                min={1}
                max={1000}
                valueLabelDisplay="auto"
              />
            </div>
          </div>

          <Grid container spacing={2}>
            {filteredData.map((item) => (
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
