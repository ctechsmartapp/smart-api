import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../services/auth";
// import your API service here
// import { requestPasswordReset } from "../services/auth";

export default function ForgotPasswordForm({ onBack }) {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  // const handleSubmit = async () => {
  //   try {
  //     console.log(email);
  //     const res = await forgotPassword(email);
  //     const status = res.status;
  //     if (status == 201) {
  //       navigate("/verify-otp", { state: { email } });
  //     }
  //   } catch (err) {
  //     setError(err.message);
  //   }
  // };
  const handleSubmit = async () => {
    try {
      const { status, data } = await forgotPassword(email);

      if (status === 201) {
        navigate("/verify-otp", { state: { email } });
      } else {
        setError(data?.error || "Failed to send OTP");
      }
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <>
      <Typography level="h4" component="h1">
        Reset Password
      </Typography>
      <Typography level="body-sm" sx={{ mb: 2 }}>
        Enter your email to receive reset instructions.
      </Typography>

      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="example@email.com"
        />
      </FormControl>

      <Button sx={{ mt: 2 }} onClick={handleSubmit}>
        Send Reset Link
      </Button>

      <Typography
        fontSize="sm"
        sx={{ alignSelf: "center", cursor: "pointer", mt: 2 }}
        onClick={() => navigate("/")}
      >
        Back to login
      </Typography>
    </>
  );
}
