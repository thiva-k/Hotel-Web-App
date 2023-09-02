import React from 'react';
import { Navbar } from '../components/Navbar';
import { Container, Grid } from '@mui/material';
import { RoomCard } from '../components/RoomCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useQuery } from 'react-query'; // Import useQuery

export default function Home({ setDarkMode }) {
  const fetchRooms = async () => {
    const roomsCollection = collection(db, 'rooms');
    const querySnapshot = await getDocs(roomsCollection);
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log(data);
    return data;
  };

  const { data, isLoading } = useQuery('rooms', fetchRooms);

  return isLoading ? (
    <LoadingSkeleton />
  ) : (
    <>
      <Navbar setDarkMode={setDarkMode} />
      <main>
        <Container maxWidth={'lg'} sx={{ marginTop: 3 }}>
          <Grid container spacing={2}>
            {data?.map((item) => (
              <Grid key={item.id} item xs={12} md={4}>
                <RoomCard room={item} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
    </>
  );
}
