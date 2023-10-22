import React, { useContext, useEffect, useState } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import {
  Modal,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { DateRange } from "react-date-range";
import { getDate } from "date-fns";
import { AuthContext } from "../context/AuthContext";
import { addDoc, collection, getDocs, Timestamp } from "firebase/firestore"; // Import Timestamp
import { db } from "../lib/firebase";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { toast } from "react-hot-toast";
import { bookModalStyle } from "../helper/styles";
import { useNavigate } from "react-router-dom";
import RoomBookingSuccessModal from "./RoomBookingSuccessModal";

export const BookingModal = ({ open, handleClose, room }) => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [guests, setGuests] = useState([]);
  const [selectedGuestCount, setSelectedGuestCount] = useState(1);
  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Define a Set to keep track of booked room numbers
  const bookedRoomNumbers = new Set();

  useEffect(() => {
    // Calculate the maximum number of guests based on room data
    const maxGuests = room?.maxGuests || 1; // Use maxGuests or a default value
    setGuests(numberOfGuests(maxGuests));
  }, [room]);

  const handleChange = (event) => {
    setSelectedGuestCount(event.target.value);
  };

  function numberOfGuests(maxGuest) {
    const guestsArr = [];
    for (let i = 1; i <= maxGuest; i++) {
      guestsArr.push(i);
    }
    return guestsArr;
  }

  function getTotalNightsBooked() {
    const startDate = getDate(dates[0].startDate);
    const endDate = getDate(dates[0].endDate);
    const totalNightsBooked = endDate - startDate;
    return totalNightsBooked;
  }

  const bookings = collection(db, "bookings");

  const handleReserve = async () => {
    setIsLoading(true);
    const { uid, displayName } = currentUser;
    const pricePerNight = room?.pricePerNight || 0;
    const totalNights = getTotalNightsBooked();
    const totalPrice = pricePerNight * totalNights;

    const startDate = dates[0]?.startDate;
    const endDate = dates[0]?.endDate;

    // Format the dates to Firestore Timestamp objects
    const formattedStartDate = Timestamp.fromDate(startDate);
    const formattedEndDate = Timestamp.fromDate(endDate);

    // Declare availableRoomNum outside of the if block
    let availableRoomNum = null;

    // Create a variable to keep track of the number of reserved rooms
    let numReserved = 0;

    // Iterate through the bookings collection to check for overlapping bookings
    const querySnapshot = await getDocs(bookings);
    querySnapshot.forEach((doc) => {
      const booking = doc.data();

      // Convert the booking start and end dates to JavaScript Date objects
      const bookingStartDate = booking.bookingStartDate.toDate();
      const bookingEndDate = booking.bookingEndDate.toDate();

      // Check if the current booking overlaps with the selected time period
      if (
        (startDate >= bookingStartDate && startDate < bookingEndDate) ||
        (endDate > bookingStartDate && endDate <= bookingEndDate)
      ) {
        if (booking.roomTitle === room?.title) {
          numReserved++;
          // Add booked room numbers to the set
          if (booking.roomNum) {
            bookedRoomNumbers.add(booking.roomNum);
          }
        }
      }
    });

    // Compare numReserved with room.numRooms and proceed accordingly
    if (numReserved < room?.numRooms) {
      // Find the first available room number for the selected room title
      const maxRoomNum = room?.numRooms || 0; // Maximum room number for the selected room title
      for (let i = 1; i <= maxRoomNum; i++) {
        if (!bookedRoomNumbers.has(i)) {
          availableRoomNum = i;
          break; // Found an available room number, exit the loop
        }
      }

      if (availableRoomNum !== null) {
        // Proceed with the booking and assign the available room number
        await addDoc(bookings, {
          roomTitle: room?.title || "Room",
          numberOfGuests: selectedGuestCount,
          bookingStartDate: formattedStartDate,
          bookingEndDate: formattedEndDate,
          price: totalPrice,
          bookedBy: {
            uid,
            displayName,
          },
          roomNum: availableRoomNum, // Assign the available room number
        })
          .then(() => {
            toast.success("Booking successful");
            handleClose();
            navigate("/my-profile");
            setIsLoading(false);
            setIsSuccessModalOpen(true);
          })
          .catch((error) => {
            toast.error(error.message);
            setIsLoading(false);
          });
      } else {
        // Show an alert indicating that all rooms of the selected type are fully booked during the selected period
        alert("Sorry, all rooms of this type are fully booked during the selected period.");
        setIsLoading(false);
      }
    } else {
      // Show an alert indicating that the room is fully booked during the selected period
      alert("Sorry, these rooms are fully booked during the selected period.");
      setIsLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={bookModalStyle}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          ${room?.pricePerNight || 0} /night
        </Typography>
        <FormControl fullWidth sx={{ marginTop: 3 }}>
          <InputLabel id="demo-simple-select-label">
            Number of Guests
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedGuestCount}
            label="Number of Adults"
            onChange={handleChange}
          >
            {guests.map((guest) => (
              <MenuItem key={guest} value={guest}>
                {guest}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <InputLabel>Select Dates</InputLabel>
        <DateRange
          className="date-range"
          editableDateInputs={true}
          onChange={(item) => setDates([item.selection])}
          moveRangeOnFirstSelection={false}
          ranges={dates}
          minDate={new Date()}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginY: 2,
          }}
        >
          <Typography
            fontSize={17}
            fontWeight={"bold"}
            component="p"
            variant="h6"
          >
            ${room?.pricePerNight || 0} x{" "}
            {dates[0]?.endDate ? getTotalNightsBooked() : 0} nights
          </Typography>

          <Typography
            fontSize={17}
            fontWeight={"bold"}
            component="p"
            variant="h6"
          >
            $
            {dates[0]?.endDate
              ? (room?.pricePerNight || 0) * getTotalNightsBooked()
              : 0}
          </Typography>
        </Box>
        <Typography
          fontSize={20}
          fontWeight={"bold"}
          component="p"
          variant="h6"
        >
          Subtotal: $
          {dates[0]?.endDate
            ? (room?.pricePerNight || 0) * getTotalNightsBooked()
            : 0}
        </Typography>
        <Button
          onClick={handleReserve}
          sx={{ width: "100%", marginTop: 2, marginLeft: 0 }}
          variant="outlined"
          color="primary"
          disabled={!dates[0].endDate}
        >
          {isLoading ? (
            <LoadingSpinner color={"primary"} size={20} />
          ) : (
            "Reserve"
          )}
        </Button>
        {isSuccessModalOpen && (
          <RoomBookingSuccessModal
            open={isSuccessModalOpen}
            onClose={handleClose}
            roomTitle={room?.title || "Room"}
            roomNum={availableRoomNum}
          />
        )}
      </Box>
    </Modal>
  );
};
