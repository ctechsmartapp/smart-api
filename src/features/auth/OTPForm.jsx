import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Typography,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyOtp } from "../../services/auth";

export default function OTPForm() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const handleSubmit = async () => {
    try {
      const data = await verifyOtp(email, otp);
      console.log("OTP Verified:", data);

      // redirect to reset password form
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "2rem auto",
        padding: "2rem",
        border: "1px solid #ddd",
        borderRadius: 8,
      }}
    >
      <Typography level="h4" component="h1" gutterBottom>
        Verify OTP
      </Typography>

      <Typography level="body-sm" sx={{ mb: 2 }}>
        Enter the OTP sent to <strong>{email}</strong>.
      </Typography>

      <FormControl>
        <FormLabel>OTP</FormLabel>
        <Input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
        />
      </FormControl>

      {error && (
        <Typography color="danger" level="body-sm" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}

      <Button
        sx={{ mt: 2, width: "100%" }}
        onClick={handleSubmit}
        disabled={!otp}
      >
        Verify OTP
      </Button>
    </div>
  );
}
