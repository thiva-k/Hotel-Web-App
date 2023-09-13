import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  // Generate a random number for the image URL
  const randomImageSig = Math.random();

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ cursor: 'pointer' }} onClick={() => navigate(`/rooms/${room.id}`)}>
          {room.title} 
        </Typography>

        {/* Add the image below the title */}
        <img
          src={room.images[0] + `?sig=${randomImageSig}`}
          alt="Room"
          style={{ width: '100%', height: '210px',cursor: 'pointer' }}
          onClick={() => navigate(`/rooms/${room.id}`)}
          // focus when hovered
          
        />

        <Typography variant="body2">Price per Night: ${room.pricePerNight}</Typography>
        <Typography variant="body2">Beds: {room.numBeds}</Typography>
        <Typography variant="body2">Baths: {room.numBaths}</Typography>
        <Typography variant="body2">AC: {room.isAC ? 'Yes' : 'No'}</Typography>
      </CardContent>
    </Card>
  );
};
