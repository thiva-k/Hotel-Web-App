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
  Button
} from "@mui/material";

import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../lib/firebase";
import { MaterialUISwitch } from "./Switch";
import { signInWithPopup } from "firebase/auth";
import { provider, db } from "../lib/firebase";

export const Navbar = () => {
  const { currentUser, setDarkMode } = useContext(AuthContext);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    setAnchorEl(null); 
    await auth.signOut().then(() => navigate("/"));
  };

  const handleLogin = async () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;
        if (user) {
          await setDoc(doc(db, "webCustomers", user.uid), {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          });
        }
      })
      .catch((error) => {
        const errorMessage = error.message;
        toast.error(errorMessage);
      });
  };

  const tabs = [
    { label: "Book Rooms", path: "/rooms" },
    { label: "View Menu", path: "/menu" },
    { label: "Reserve Table", path: "/reserve" },
    { label: "Contact Us", path: "/chat" },
    { label: "About Us", path: "/about" },
  ];

  if(currentUser){
   return( 
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <img
              src="/crown_logo.svg"
              alt="Crown Logo"
              style={{
                width: 60,
                marginRight: 20,
                filter: "invert(1)",
              }}
            />
            {tabs.map((tab) => (
              <Typography
                key={tab.path}
                onClick={() => navigate(tab.path)}
                style={{
                  cursor: "pointer",
                  transition: "transform 1s",
                  padding: "0.75rem",
                  border: "2px solid transparent",
                  fontWeight: "bold",
                  ...(location.pathname === tab.path
                    ? {
                        transform: "scale(1.15)",
                        backgroundColor: "#D3D1D0",
                        color: "#000000",
                      }
                    : {}),
                }}
                variant="h7"
                color="inherit"
                component="div"
              >
                {tab.label}
              </Typography>
            ))}
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
              onClick={() => navigate("/my-profile")}
              style={{ cursor: "pointer" }}
              fontSize={15}
              variant="h6"
              color="inherit"
              component="a"
            >
              My Profile
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
   ) 
  }else{

  return(<> 
   
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <img
              src="/crown_logo.svg"
              alt="Crown Logo"
              style={{
                width: 60,
                marginRight: 20,
                filter: "invert(1)",
              }}
            />
            
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
            <Button onClick={handleLogin} variant="outlined" color="primary" sx={{ }}>
             Login
           </Button>

        </Box>    

        
        </Toolbar>

        
      </Container>
      
    </AppBar>
    
    
    
    
    
    
    
    
    </>)
   }
}
