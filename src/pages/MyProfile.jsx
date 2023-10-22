import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Button,
} from "@mui/material";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { isAfter } from "date-fns";
import { AuthContext } from "../context/AuthContext";
import { db } from "../lib/firebase";
import { Navbar } from "../components/Navbar";
import Footer from "../components/Footer";

export default function MyProfile() {
  const { currentUser } = useContext(AuthContext);
  const [roomBookings, setRoomBookings] = useState([]);
  const [tableBookings, setTableBookings] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    // Room Bookings
    const roomBookingsQuery = query(
      collection(db, "bookings"),
      where("bookedBy.uid", "==", currentUser?.uid),
      orderBy("bookingStartDate", "desc")
    );

    const unsubscribeRoomBookings = onSnapshot(roomBookingsQuery, (snapshot) => {
      setRoomBookings(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });

    // Table Bookings
    const tableBookingsQuery = query(
      collection(db, "tableBookings"),
      where("userID", "==", currentUser?.uid),
      orderBy("start", "desc")
    );

    const unsubscribeTableBookings = onSnapshot(
      tableBookingsQuery,
      (snapshot) => {
        setTableBookings(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
      }
    );

    return () => {
      unsubscribeRoomBookings();
      unsubscribeTableBookings();
    };
  }, [currentUser]);

  // Function to handle cancellation
  const cancelReservation = async (type, id) => {
    try {
      if (type === "roomBooking") {
        // Delete room booking record
        await deleteDoc(doc(db, "bookings", id));
      } else if (type === "tableBooking") {
        // Delete table booking record
        await deleteDoc(doc(db, "tableBookings", id));
      }
    } catch (error) {
      console.error("Error cancelling reservation:", error);
    }
  };

  // Function to check if a room booking is in the future
  const isFutureRoomBooking = (bookingEndDate) => {
    const endDate = bookingEndDate.toDate(); // Convert Firestore Timestamp to JavaScript Date
    const currentDate = new Date();
    return isAfter(endDate, currentDate);
  };

  return (
    <div>
      <Navbar />
      <Container maxWidth={"lg"}>
        <Box
          sx={{
            marginTop: 3,
            display: "flex",
            alignItems: "center",
            gap: "0 14px",
          }}
        >
          <img
            style={{
              borderRadius: "100%",
              width: 60,
              height: 60,
              objectFit: "cover",
            }}
            src={currentUser?.photoURL}
            alt={currentUser?.displayName}
          />
          <Typography variant={"h6"}>{currentUser?.displayName}</Typography>
        </Box>
        {/* Room Booking History */}
        <Typography marginTop={3} fontWeight={"bold"} variant={"h6"}>
          Room Booking History
        </Typography>
        <TableContainer component={Paper} sx={{ marginTop: 3 }}>
          <Table sx={{ width: "100%" }} aria-label="room booking history table">
            <TableHead>
              <TableRow>
                <TableCell>Room Name</TableCell>
                <TableCell align="right">Check In</TableCell>
                <TableCell align="right">Check Out</TableCell>
                <TableCell align="right">Number of Guests</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roomBookings.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row?.data?.roomTitle}
                  </TableCell>
                  <TableCell align="right">
                    {row?.data?.bookingStartDate.toDate().toLocaleString()} {/* Convert Firestore Timestamp to a formatted date string */}
                  </TableCell>
                  <TableCell align="right">
                    {row?.data?.bookingEndDate.toDate().toLocaleString()} {/* Convert Firestore Timestamp to a formatted date string */}
                  </TableCell>
                  <TableCell align="right">
                    {row?.data?.numberOfGuests}
                  </TableCell>
                  <TableCell align="right">
                    {row?.data?.price ? "$" + row?.data?.price : ""}
                  </TableCell>
                  <TableCell align="right">
                    {isFutureRoomBooking(row?.data?.bookingEndDate) ? (
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => cancelReservation("roomBooking", row.id)}
                      >
                        Cancel
                      </Button>
                    ) : (
                      "Completed"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Table Reservation History */}
        <Typography marginTop={3} fontWeight={"bold"} variant={"h6"}>
          Table Reservation History
        </Typography>
        <TableContainer component={Paper} sx={{ marginTop: 3 }}>
          <Table sx={{ width: "100%" }} aria-label="table booking history table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Email</TableCell>
                <TableCell align="right">Start Time</TableCell>
                <TableCell align="right">End Time</TableCell>
                <TableCell align="right">Number of Guests</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableBookings.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{row?.data?.name}</TableCell>
                  <TableCell align="right">{row?.data?.email}</TableCell>
                  <TableCell align="right">
                    {row?.data?.start.toDate().toLocaleString()} {/* Convert Firestore Timestamp to a formatted date string */}
                  </TableCell>
                  <TableCell align="right">
                    {row?.data?.end.toDate().toLocaleString()} {/* Convert Firestore Timestamp to a formatted date string */}
                  </TableCell>
                  <TableCell align="right">{row?.data?.numGuests}</TableCell>
                  <TableCell align="right">
                    {isAfter(new Date(), row.data.start.toDate()) ? (
                      "Completed"
                    ) : (
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => cancelReservation("tableBooking", row.id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      <Footer />
    </div>
  );
}
