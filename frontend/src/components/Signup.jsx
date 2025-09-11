import React from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";

function Signup() {
  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: "auto", mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        Signup
      </Typography>
      <Box component="form">
        <TextField
          fullWidth
          margin="normal"
          label="First Name"
        />
        <TextField
          fullWidth
          margin="normal"
          label="Last Name"
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          type="email"
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          type="password"
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Signup
        </Button>
      </Box>
    </Paper>
  );
}

export default Signup;
