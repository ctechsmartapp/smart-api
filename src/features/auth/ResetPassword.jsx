import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Typography,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { resetPassword } from "../../services/auth";

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const handleSubmit = async () => {
    setError("");

    if (!password || !confirmPassword) {
      setError("Please fill in both fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await resetPassword(email, password);
      alert("Password reset successful!");
      navigate("/"); // go back to login
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
        Reset Password
      </Typography>

      <Typography level="body-sm" sx={{ mb: 2 }}>
        Set a new password for <strong>{email}</strong>.
      </Typography>

      <FormControl>
        <FormLabel>New Password</FormLabel>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
        />
      </FormControl>

      <FormControl sx={{ mt: 2 }}>
        <FormLabel>Confirm Password</FormLabel>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
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
        disabled={!password || !confirmPassword}
      >
        Reset Password
      </Button>
    </div>
  );
}
