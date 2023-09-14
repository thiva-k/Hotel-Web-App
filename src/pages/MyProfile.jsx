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
} from "@mui/material";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import { db } from "../lib/firebase";
import { format } from "date-fns"; // Import the 'format' function for date formatting
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

    console.log(tableBookingsQuery);

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

  return (
  <>
    <>
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
                    {row?.data?.bookingStartDate}
                  </TableCell>
                  <TableCell align="right">
                    {row?.data?.bookingEndDate}
                  </TableCell>
                  <TableCell align="right">
                    {row?.data?.numberOfGuests}
                  </TableCell>
                  <TableCell align="right">${row?.data?.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

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
              </TableRow>
            </TableHead>
            <TableBody>
              {tableBookings.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{row?.data?.name}</TableCell>
                  <TableCell align="right">
                    {row?.data?.email}
                  </TableCell>
                  <TableCell align="right">
                    {format(row?.data?.start.toDate(), "MM/dd/yyyy HH:mm")}
                  </TableCell>
                  <TableCell align="right">
                    {format(row?.data?.end.toDate(), "MM/dd/yyyy HH:mm")}
                  </TableCell>
                  <TableCell align="right">
                    {row?.data?.numGuests}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
    <Footer/>
  </>
  );
}
