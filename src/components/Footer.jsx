import React from 'react';
import { Container, Grid, Link, Typography,Paper } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import { AuthContext } from "../context/AuthContext";
import { useState , useContext} from 'react';



function Footer() {

  const { currentUser } = useContext(AuthContext);
  const footerStyle = {
    backgroundColor: '#f5f5f5', // Slightly gray background
    color: 'black', // Text color
    padding: '5px 100px',
    width: '100%',
    boxShadow: '0px -2px 8px rgba(0, 0, 0, 0.1)', // Elevate the footer
    marginTop: '100px', // Add spacing between footer and content
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '100%',
    padding: '0', // Disable gutters
  };

  const logoImageStyle = {
    width: '70px',
    height: 'auto',
    marginRight: '16px', // Add spacing between logo and links
    filter: 'invert(1)',
  };

  const socialIconsStyle = {
    display: 'flex',
    alignItems: 'center',
  };

  const socialLinkStyle = {
    color: 'black', // Social icons color
    textDecoration: 'none',
    margin: '0 12px', // Add spacing between social icons
  };

  return (
    <div style={footerStyle}>
      <Container disableGutters style={containerStyle}>
        <img src="/crown_logo.svg" alt="Crown Logo" style={logoImageStyle} />
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <div style={socialIconsStyle}>
              <Link
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                style={socialLinkStyle}
              >
                <FacebookIcon fontSize="large" />
              </Link>
              <Link
                href="https://www.twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                style={socialLinkStyle}
              >
                <TwitterIcon fontSize="large" />
              </Link>
              <Link
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                style={socialLinkStyle}
              >
                <InstagramIcon fontSize="large" />
              </Link>
            </div>
          </Grid>
          {currentUser && (
          <Grid item>
            <Typography variant="body2">
              <Link href="/about" style={socialLinkStyle}>
                About
              </Link>
              <Link href="/chat" style={socialLinkStyle}>
                Contact Us
              </Link>
            </Typography>
          </Grid> )}
          {!currentUser && (
          <Paper elevation={3} style={{ padding: '20px', marginTop: '20px', marginBottom: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body1" gutterBottom>
              For inquiries, you can reach us at:
            </Typography>
            <Typography variant="body1" gutterBottom>
              Phone: 011-123-4567
            </Typography>
            <Typography variant="body1" gutterBottom>
              Email: info@crownhotels.com
            </Typography>
            <Typography variant="body1" gutterBottom>
              Address: No.123, Kattubedda Road, Moratuwa
            </Typography>
        </Paper>



          )}
        </Grid>
      </Container>
      <Typography variant="body2" align="center" style={{ marginTop: '16px' }}>
        ©2023 Group 24. All Rights Reserved.
      </Typography>
    </div>
  );
}

export default Footer;
