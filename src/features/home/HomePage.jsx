// src/components/HomePage.jsx
import React, { useState, useEffect } from "react";
import { getUserDetails } from "../../services/user";
import { Button, Grid, Typography } from "@mui/joy";
import { refreshToken } from "../../services/auth";
import { useNavigate } from "react-router-dom";

export default function HomePage() {

    const [user, setUser] = useState(null); // store user details

    const navigate = useNavigate();
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
        navigate("/");
        // onLogout();
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
  <div
    style={{
      padding: "1rem 2rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#f5f5f5",
      borderBottom: "1px solid #ddd",
    }}
  >
    {/* Greeting on the left */}
    <div>
      <Typography level="h4">
        Hi {user ? user.firstname : ""}
      </Typography>
    </div>

    {/* Buttons on the right */}
    <div style={{ display: "flex", gap: "0.75rem" }}>
      <Button sx={{ mt: 0 }} onClick={handleLogout}>
        Logout
      </Button>
      <Button sx={{ mt: 0 }} onClick={handleFetchUser}>
        Profile
      </Button>
      <Button sx={{ mt: 0 }} onClick={handleRefreshToken}>
        Refresh Token
      </Button>
    </div>
  </div>
);

}
