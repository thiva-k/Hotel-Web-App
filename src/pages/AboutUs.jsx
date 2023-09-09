import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardMedia,
  Button,
  ButtonGroup,
} from '@mui/material';
import { Navbar } from '../components/Navbar';
import Carousel from 'react-material-ui-carousel';

const AboutUs = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  const hotelImages = [
    'https://img.freepik.com/free-photo/luxury-classic-modern-bedroom-suite-hotel_105762-1787.jpg?w=2000',
    'https://www.usatoday.com/gcdn/-mm-/05b227ad5b8ad4e9dcb53af4f31d7fbdb7fa901b/c=0-64-2119-1259/local/-/media/USATODAY/USATODAY/2014/08/13/1407953244000-177513283.jpg',
    'https://assets-global.website-files.com/5c6d6c45eaa55f57c6367749/624b471bdf247131f10ea14f_61d31b8dbff9b500cbd7ed32_types_of_rooms_in_a_5-star_hotel_2_optimized_optimized.jpeg',
    'https://static01.nyt.com/images/2019/03/24/travel/24trending-shophotels1/24trending-shophotels1-superJumbo.jpg',
  ];

  const restaurantImages = [
    'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudCUyMGZvb2R8ZW58MHx8MHx8fDA%3D&w=1000&q=80',
    'https://img.freepik.com/free-photo/top-view-table-full-delicious-food-composition_23-2149141353.jpg?w=2000',
    'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?cs=srgb&dl=pexels-chan-walrus-958545.jpg&fm=jpg',
    'https://media.istockphoto.com/id/104704117/photo/restaurant-plates.jpg?s=612x612&w=0&k=20&c=MhFdN_qVgzoHov-kgFx0qWSW0nZht4lZV1zinC3Ea44=',
  ];

  return (
    <div>
      <Navbar />
      <Container maxWidth="lg">
        {/* Hotel Section */}
        <Paper elevation={3} sx={{ padding: 3, marginTop: 5 }}>
          <Typography variant="h4" gutterBottom>
            Welcome to Crown Hotels
          </Typography>
          <Typography variant="body1" paragraph>
            Discover a world of luxury and comfort at our hotels. We offer a
            variety of elegant rooms and suites to make your stay memorable.
          </Typography>
          <Carousel
            index={currentSlide}
            autoPlay={true}
            animation="slide"
            interval={5000} // Set the interval time (5 seconds in this example)
          >
            {hotelImages.map((image, index) => (
              <Card key={index}>
                <CardMedia component="img" height="400" alt={`Hotel Room ${index + 1}`} src={image} />
              </Card>
            ))}
          </Carousel>
          
        </Paper>

        {/* Restaurant Section */}
        <Paper elevation={3} sx={{ padding: 3, marginTop: 5, marginBottom:3 }}>
          <Typography variant="h4" gutterBottom>
            Dine-In Restaurants
          </Typography>
          <Typography variant="body1" paragraph>
            Indulge in a culinary journey at our dine-in restaurants. Our chefs
            create exquisite dishes using the finest ingredients.
          </Typography>
          <Carousel
            index={currentSlide}
            autoPlay={true}
            animation="slide"
            interval={5000} // Set the interval time (5 seconds in this example)
          >
            {restaurantImages.map((image, index) => (
              <Card key={index}>
                <CardMedia component="img" height="400" alt={`Restaurant ${index + 1}`} src={image} />
              </Card>
            ))}
          </Carousel>
          
        </Paper>
      </Container>
    </div>
  );
};

export default AboutUs;
