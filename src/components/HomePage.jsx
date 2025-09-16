// src/components/HomePage.jsx
import React, { useState, useEffect } from "react";
import { getUserDetails } from "../services/user";
import { Button, Grid, Typography } from "@mui/joy";
import { refreshToken } from "../services/auth";

export default function HomePage({ onLogout }) {

    const [user, setUser] = useState(null); // store user details

    // Fetch user details once on mount
    useEffect(() => {
        const fetchUser = async () => {
        try {
            const data = await getUserDetails();
            setUser(data.user); 
        } catch (err) {
            console.error("Failed to fetch user details:", err);
        }
        };

        fetchUser();
    }, []);

    const handleFetchUser = async ()=>{
        try {
            const data = await getUserDetails(); 
            console.log(data);
        } catch (err) {
            alert("Failed to fetch user details: " + err.message);
        }
        handleClose();
    }

    const handleLogout = ()=>{
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        onLogout();
    }
    const handleRefreshToken = async() => {
        try {
            const data = await refreshToken(); 
            localStorage.setItem("accessToken", data.accessToken);
            console.log(data);
        } catch (err) {
            alert("Failed to refresh access token: " + err.message);
        }
        handleClose();
    }

  return (
    <div style={{ padding: "2rem", display: "flex", justifyContent: "flex-end", padding: "1rem" }}>
      <Typography level="h1">Hi {user ? user.firstname : ""}</Typography>
      <Grid>
        <Button
        sx={{ mt: 2 }}
        onClick={handleLogout}>
        Logout
      </Button>
      <Button 
        sx={{ mt: 2 }} 
        onClick = {handleFetchUser}>
        Profile
      </Button>
      <Button 
        sx={{ mt: 2 }} 
        onClick = {handleRefreshToken}>
        Refresh Token
      </Button>
      </Grid>
    </div>
  );
}
