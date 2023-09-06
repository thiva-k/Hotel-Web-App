import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "..//lib/firebase"; 
import {
  Box,
  Button,
  CardContent,
  Container,
  ListItem,
  Typography,
  List,
} from "@mui/material";
import { Navbar } from "../components/Navbar";
import { BookingModal } from "../components/BookingModal";
import { Toaster } from "react-hot-toast";

const RoomInfo = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const roomRef = doc(db, "rooms", id);
        const roomDoc = await getDoc(roomRef);

        if (roomDoc.exists()) {
          
          setRoom(roomDoc.data());
        } else {
          
          console.log("Room not found");
        }
      } catch (error) {
       
        console.error("Error fetching room data:", error);
      }
    };

    fetchRoomData();
  }, [id]);

  return (
    <>
      <Navbar />
      <main>
        <Container
          maxWidth={"lg"}
          sx={{
            marginTop: 4,
          }}
        >
          {room && (
            <>
              <Typography fontSize={40} sx={{ lineHeight: 1.9, marginBottom: 3 }}>
                {room.title}
              </Typography>
              
              <Typography fontSize={25} variant="subtitle1" sx={{ marginTop: 2 }}>
                {room.description}
              </Typography>
             
              <Box sx={{ display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  marginTop: 1, }}>
                <Typography fontSize={20} sx={{ marginBottom: 2 }} >Room Details:</Typography>
                <Typography  fontSize={15}>Number of Beds: {room.numBeds}</Typography>
                <Typography fontSize={15}>Number of Baths: {room.numBaths}</Typography>
                <Typography fontSize={15}>AC: {room.isAC ? "Yes" : "No"}</Typography>
                <Typography fontSize={15}>Maximum Guests: {room.maxGuests}</Typography>
              </Box>
              
              <Typography fontSize={20} sx={{ marginTop: 2 }}>
                What this room offers:
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  marginTop: 1,
                }}
              >
                {room.offers.map((offer, index) => (
                  <Typography fontSize={15} key={index} variant="caption">
                    {offer}
                  </Typography>
                ))}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  marginTop: 5,
                 
                }}
              >
                <Button onClick={() => setOpen(true)} variant="outlined">
                  Reserve
                </Button>
              </Box>
            </>
          )}
        </Container>
      </main>
      <BookingModal
        room={room} 
        open={open}
        handleClose={() => setOpen(false)}
      />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 1500,
          style: {
            fontSize: 14,
          },
        }}
      />
    </>
  );
};

export default RoomInfo;
