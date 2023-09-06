import React, { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Button, TextField, Container, Typography } from '@mui/material';
import { bookModalStyle } from '../helper/styles'; // Assuming you have defined styles
import {Navbar} from '../components/Navbar';




const ReservationForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [guests, setGuests] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');

  const handleReservation = async () => {
    // Handle reservation logic (as described in the previous answer)
  };

  return (
    <>
        <Navbar />
        <Container maxWidth={'md'} sx={{ marginTop: 5 }} >
        
        <div  >

            <Typography variant="h6" component="h2" align='center'>
            Reserve a Table !
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
            sx={{ marginTop: 2 }}
            />

            <TextField
            label="Start Time"
            type="time"
            fullWidth
            value={selectedStartTime}
            onChange={(e) => setSelectedStartTime(e.target.value)}
            sx={{ marginTop: 2 }}
            />

            <TextField
            label="End Time"
            type="time"
            fullWidth
            value={selectedEndTime}
            onChange={(e) => setSelectedEndTime(e.target.value)}
            sx={{ marginTop: 2 }}
            />  
                   
            <Container sx={{ marginTop: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '50px', }}> 

                <Button
                onClick={handleReservation}
                variant="outlined"
                color="primary"
                >
                Reserve Table
                </Button>      

            </Container>
            
        </div>
        </Container>

    </>
  );
};

export default ReservationForm;
