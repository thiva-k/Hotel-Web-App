import React, { useState , useContext} from 'react';
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
import Footer from '../components/Footer';
import { AuthContext } from "../context/AuthContext";

const AboutUs = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { currentUser } = useContext(AuthContext);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  const hotelImages = [
    'https://thehoughtonhotel.com/wp-content/uploads/2023/02/Houghton-Hotel-3-20-scaled.jpg',
    'https://digital.ihg.com/is/image/ihg/ihgor-member-rate-web-offers-1440x720',
    'https://media.timeout.com/images/101800601/image.jpg',
    'https://buckinghamplace.lk/wp-content/uploads/2023/09/pool_001.jpg'  ];

  const restaurantImages = [
    'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudCUyMGZvb2R8ZW58MHx8MHx8fDA%3D&w=1000&q=80',
    'https://img.freepik.com/free-photo/top-view-table-full-delicious-food-composition_23-2149141353.jpg?w=2000',
    'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?cs=srgb&dl=pexels-chan-walrus-958545.jpg&fm=jpg',
    'https://media.istockphoto.com/id/104704117/photo/restaurant-plates.jpg?s=612x612&w=0&k=20&c=MhFdN_qVgzoHov-kgFx0qWSW0nZht4lZV1zinC3Ea44=',
  ];

  const roomImages=[
    'https://i.ibb.co/x3v9GF8/executive-suite-living-room-1920-x-1080-wide.jpg',
    'https://i.ibb.co/0Bt6SxF/tentrem-hotel-yogyakarta-home-image271.jpg',
    'https://i.ibb.co/T0VpvyV/Executive-Suite-Bedroom2-P.jpg',
    'https://i.ibb.co/HnVBpVh/Executive-Suite-768x576.jpg'

  ]

  return (
  <>  
    <div>
      <Navbar />
      <Container maxWidth="lg">
        {/* Hotel Section */}
        <Paper elevation={3} sx={{ padding: 3, marginTop: 5 }}>
          <Typography variant="h4" gutterBottom>
            Welcome to Crown Hotels, A Perfect Blend of Comfort and Culinary Delights !
          </Typography>
          <Typography variant="body1" paragraph>
          "Welcome to Crown Hotels, where comfort meets culinary excellence. Our hotel offers cozy rooms with modern amenities and a renowned restaurant serving a delectable fusion of local and international flavors. Whether you're here for business or leisure, we provide a warm and welcoming retreat where you can indulge in the art of fine dining and experience exceptional hospitality. Join us at Crown Hotels for a memorable stay that combines luxurious comfort with gastronomic delight."


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
            Exquisite Dine-In Restaurants
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

        
        {/* Room Section */}
        <Paper elevation={3} sx={{ padding: 3, marginTop: 5, marginBottom:3 }}>
          <Typography variant="h4" gutterBottom>
            Luxury Rooms at Affordable Prices
          </Typography>
          <Typography variant="body1" paragraph>
          Discover unparalleled comfort and elegance in our meticulously designed hotel rooms, featuring modern amenities and captivating views. Whether for business or leisure, our rooms offer a tranquil retreat to relax and recharge during your stay. Welcome to a world of luxury and convenience.
          </Typography>
          <Carousel
            index={currentSlide}
            autoPlay={true}
            animation="slide"
            interval={5000} // Set the interval time (5 seconds in this example)
          >
            {roomImages.map((image, index) => (
              <Card key={index}>
                <CardMedia component="img" height="400" alt={`Restaurant ${index + 1}`} src={image} />
              </Card>
            ))}
          </Carousel>
          
        </Paper>
      </Container>
    </div>

   <Footer/>

  </>   
  );
};

export default AboutUs;
