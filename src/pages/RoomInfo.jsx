import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "..//lib/firebase"; // Import your Firebase configuration
import {
  Box,
  Button,
  CardContent,
  Container,
  ListItem,
  Typography,
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
          // Room data found, update state
          setRoom(roomDoc.data());
        } else {
          // Room data not found, handle accordingly (e.g., show an error message)
          console.log("Room not found");
        }
      } catch (error) {
        // Handle any errors that may occur during the fetch
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
            marginTop: 2,
          }}
        >
          {room && (
            <>
              <Typography fontSize={40} sx={{ lineHeight: 1.9, marginBottom: 3 }}>
                {room.title}
              </Typography>
              {/* ... Other components */}
              <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
                {room.description}
              </Typography>
              {/* ... Other components */}
              <Box sx={{ marginTop: 2 }}>
                <Typography variant="h5">What this place offers:</Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column", // Display items in a vertical column
                    alignItems: "flex-start", // Align items to the start of the column
                    marginTop: 1, // Add some margin between items
                  }}
                >
                  {room.offers.map((offer, index) => (
                    <Typography key={index} variant="caption">
                      {offer}
                    </Typography>
                  ))}
                </Box>
                <Box
                  sx={{
                    display: "flex", // Keep the button in a flex layout
                    marginTop: 10, // Add margin between the button and the items
                    marginLeft: 0, // Remove margin from the left of the button
                  }}
                >
                  <Button onClick={() => setOpen(true)} variant="outlined">
                    Reserve
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </Container>
      </main>
      <BookingModal
        room={room} // Pass the room data to BookingModal
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
