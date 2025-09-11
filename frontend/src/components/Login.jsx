// src/components/Login.jsx
import React from "react";
import { TextField, Button, Paper, Typography, Box } from "@mui/material";

function Login() {
  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: "auto", mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        Login
      </Typography>
      <Box>
        <TextField fullWidth margin="normal" label="Email" type="email" />
        <TextField fullWidth margin="normal" label="Password" type="password" />
        <Button fullWidth variant="contained" sx={{ mt: 2 }}>
          Login
        </Button>
      </Box>
    </Paper>
  );
}

export default Login;
