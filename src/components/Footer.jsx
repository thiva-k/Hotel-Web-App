import React from 'react';
import { Container, Grid, Link, Typography } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import { styled } from '@mui/system';

const FooterRoot = styled('div')({
  backgroundColor: (theme) => theme.palette.primary.main,
  color: 'white',
  padding: '32px 0',
  width: '100%',
});

const FooterContainer = styled(Container)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  maxWidth: '100%',
  padding: '0', // Disable gutters
});

const LogoImage = styled('img')({
  width: '70px',
  height: 'auto',
  marginRight: '24px', // Add spacing between logo and links
  filter: "invert(1)",
});

const SocialIcons = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

const SocialLink = styled(Link)({
  color: 'white',
  textDecoration: 'none',
  margin: '0 12px',
  '&:hover': {
    textDecoration: 'underline',
  },
});

function Footer() {
  return (
    <FooterRoot>
      <FooterContainer disableGutters>
        <LogoImage src="/crown_logo.svg" alt="Crown Logo" />
        <Grid container alignItems="center" justifyContent="flex-end"> {/* Align links to the right */}
          <Grid item>
            <SocialIcons>
              <Link
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                component={SocialLink}
              >
                <FacebookIcon fontSize="large" />
              </Link>
              <Link
                href="https://www.twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                component={SocialLink}
              >
                <TwitterIcon fontSize="large" />
              </Link>
              <Link
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                component={SocialLink}
              >
                <InstagramIcon fontSize="large" />
              </Link>
            </SocialIcons>
          </Grid>
          <Grid item>
            <Typography variant="body2">
              <Link href="/about" component={SocialLink}>
                About
              </Link>
              <Link href="/chat" component={SocialLink}>
                Contact Us
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </FooterContainer>
    </FooterRoot>
  );
}

export default Footer;
