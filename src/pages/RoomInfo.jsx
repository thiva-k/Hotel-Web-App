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
import Footer from "../components/Footer";

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
              <Typography variant="h4"  sx={{ lineHeight: 1.9, marginBottom: 3,fontWeight: "bold" }}>
                {room.title}
              </Typography>

              {room.images && room.images.length > 0 && (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "1rem",
                    marginTop: "2rem",
                  }}
                >
                  {room.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Room ${index + 1}`}
                      style={{ width: "100%", height: "350px" }}
                    />
                  ))}
                </Box>
              )}

              <Typography fontSize={23} variant="subtitle1" sx={{ marginTop: 2 }}>
                {room.description}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  marginTop: 5,
                }}
              >
                <Typography variant="h5" sx={{ marginBottom: 2,fontWeight: "bold" }}>
                  Room Details
                </Typography>
                <Typography fontSize={18}>Number of Beds: {room.numBeds}</Typography>
                <Typography fontSize={18}>Number of Baths: {room.numBaths}</Typography>
                <Typography fontSize={18}>AC: {room.isAC ? "Yes" : "No"}</Typography>
                <Typography fontSize={18}>Maximum Guests: {room.maxGuests}</Typography>
              </Box>

              <Typography variant="h5"  sx={{ marginTop: 5,fontWeight: "bold" }}>
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
                  <Typography fontSize={18} key={index} variant="caption">
                     {offer}
                  </Typography>
                ))}
              </Box>

              

              <Box
                sx={{
                  display: "flex",
                  marginTop: 2,
                  justifyContent: "center",
                }}
              >
                <Button onClick={() => setOpen(true)} variant="outlined" size="large">
                  Reserve
                </Button>
              </Box>
            </>
          )}
        </Container>
      </main>
      <BookingModal room={room} open={open} handleClose={() => setOpen(false)} />
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
    <Footer />
  </>
  );
};

export default RoomInfo;
