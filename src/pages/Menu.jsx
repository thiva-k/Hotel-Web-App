// Menu.jsx
import React, { useEffect, useState } from 'react';
import { Container, Grid } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import {MenuCard} from '../components/MenuCard';
import { Navbar } from '../components/Navbar';
import Footer from '../components/Footer';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const menuCollectionRef = collection(db, 'foods');
        const menuSnapshot = await getDocs(menuCollectionRef);
        const menuData = menuSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMenuItems(menuData);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, []);

  return (
  <> 
    <>
        <Navbar />
        <Container maxWidth="lg" sx={{marginTop:3}}>
        <Grid container spacing={2}>
            {menuItems.map((menuItem) => (
            <Grid item xs={12} sm={6} md={4} key={menuItem.id}>
                <MenuCard
                name={menuItem.name}
                price={menuItem.price}
                description={menuItem.description}
                type={menuItem.type}
                imageUrl={menuItem.url} // You can replace menuItem.id with a unique identifier from your data
                />
            </Grid>
            ))}
        </Grid>
        </Container>
    </>
    <Footer />
  </>  
  );
};

export default Menu;
