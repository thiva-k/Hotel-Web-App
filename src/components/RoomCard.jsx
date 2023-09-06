import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ cursor: 'pointer' }} onClick={() => navigate(`/rooms/${room.id}`)}>
          {room.title} 
        </Typography>
        <Typography variant="body2">Price per Night: ${room.pricePerNight}</Typography>
        <Typography variant="body2">Beds: {room.numBeds}</Typography>
        <Typography variant="body2">Baths: {room.numBaths}</Typography>
        <Typography variant="body2">AC: {room.isAC ? 'Yes' : 'No'}</Typography>
      </CardContent>
    </Card>
  );
};
