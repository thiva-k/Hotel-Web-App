import React, { useEffect } from "react";
import { Container, Button, Typography, Box } from "@mui/material";
import { signInWithPopup } from "firebase/auth";
import { auth, provider, db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";



export default function Login() {
  const navigate = useNavigate();

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

  useEffect(() => {
    auth.onAuthStateChanged((user) => user && navigate("/about"));
  });

  return (
  
    <>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column", 
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
        maxWidth="md"
      >
        
        <img
          src="/crown_logo.svg"
          alt="Crown Logo"
          style={{
            width: "175px",
            height: "auto",
            marginBottom: "75px", 
            filter: "invert(1)",
          }}
        />

        
        <Typography textAlign={"center"} variant="h4" sx={{ marginBottom: 4 }}>
          Welcome to Crown Hotels ®
        </Typography>

        
        <Button onClick={handleLogin} variant="outlined" color="primary" sx={{ marginBottom: 20 }}>
          Login
        </Button>
      </Container>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 1500,
          style: {
            fontSize: 14,
          },
        }}
      />
    </>
    
  
  );
}
