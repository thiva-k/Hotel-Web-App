import React, { useContext } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  FormGroup,
  FormControlLabel,
  Toolbar,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../lib/firebase";
import { MaterialUISwitch } from "./Switch";

export const Navbar = () => {
  const { currentUser, setDarkMode } = useContext(AuthContext);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await auth.signOut().then(() => navigate("/"));
  };

  return (
    <AppBar position="sticky" color="inherit">
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingY: 1.2,
          }}
        >
          
          <Box sx={{ display: "flex", alignItems: "center",gap: 2 }}>
            <img
              src="/crown_logo.svg" 
              alt="Crown Logo"
              style={{
                width: 60, 
                marginRight:20 ,
                filter: "invert(1)",
              }}
            />
            <Typography
              onClick={() => navigate("/rooms")}
              sx={{ cursor: "pointer", transition: "transform 0.2s", 
              "&:hover": {
                transform: "scale(1.15)", 
              } }}
              variant="h7"
              color="inherit"
              component="div"
              fontWeight={"bold"}
              border={2}
              padding={0.75}
            >
              Book Rooms
            </Typography>

            <Typography
               sx={{ cursor: "pointer", transition: "transform 0.2s", 
               "&:hover": {
                 transform: "scale(1.15)", 
               } }}
               variant="h7"
               color="inherit"
               component="div"
               fontWeight={"bold"}
               border={2}
              padding={0.75}
               >
              View Menu
            </Typography>

            <Typography
               onClick={() => navigate("/reserve")}
               sx={{ cursor: "pointer", transition: "transform 0.2s", 
               "&:hover": {
                 transform: "scale(1.15)", 
               }, }}
               variant="h7"
               color="inherit"
               component="div"
               fontWeight={"bold"}
               border={2}
              padding={0.75}
               >
              Reserve Table 
            </Typography>

            <Typography
               sx={{ cursor: "pointer", transition: "transform 0.2s", 
               "&:hover": {
                 transform: "scale(1.15)", 
               } }}
               variant="h7"
               color="inherit"
               component="div"
               fontWeight={"bold"}
               border={2}
              padding={0.75}
               >
              Chat With Us 
            </Typography>

            <Typography
               sx={{ cursor: "pointer", transition: "transform 0.2s", 
               "&:hover": {
                 transform: "scale(1.15)", 
               } }}
               variant="h7"
               color="inherit"
               component="div"
               fontWeight={"bold"}
               border={2}
              padding={0.75}
               >
              About Us 
            </Typography>


          </Box>
          
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            
            <FormGroup sx={{ display: { xs: "none", md: "flex" } }}>
              <FormControlLabel
                control={
                  <MaterialUISwitch
                    onChange={() => setDarkMode((prev) => !prev)}
                  />
                }
              />
            </FormGroup>

            <Typography
              onClick={() => setDarkMode((prev) => !prev)}
              sx={{ display: { xs: "block", md: "none" }, cursor: "pointer" }}
              fontSize={15}
              variant="h6"
              color="inherit"
              component="a"
            >
              DarkMode
            </Typography>
            
            <Typography
              onClick={() => navigate("/rooms")}
              sx={{ cursor: "pointer" }}
              fontSize={15}
              variant="h6"
              color="inherit"
              component="a"
            >
              Home
            </Typography>

            <IconButton
              id="demo-positioned-menu"
              onClick={handleClick}
              size="small"
              aria-controls={open ? "demo-positioned-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Avatar
                src={currentUser?.photoURL}
                sx={{ width: 32, height: 32 }}
              />
            </IconButton>
          </Box>
        </Toolbar>

        <div>
          <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <MenuItem
              onClick={() => {
                navigate("/my-profile");
                handleClose();
              }}
            >
              My Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </Container>
    </AppBar>
  );
};
