// MenuCard.jsx
import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';

export const MenuCard = ({ name, price, description, type, imageUrl }) => {
  return (
    <Card>
      <CardMedia
        component="img"
        alt={name}
        height="200"
        image={imageUrl}
      />
      <CardContent>
        <Typography variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Type: {type}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Price: ${price}
        </Typography>
      </CardContent>
    </Card>
  );
};


