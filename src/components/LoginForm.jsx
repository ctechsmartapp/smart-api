import React, { useState } from "react";
import { FormControl, FormLabel, Input, Button, Typography } from "@mui/joy";
import { login } from "../services/auth";
import { useNavigate } from "react-router-dom";

export default function LoginForm({ onToggle, onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      const data = await login(email, password);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      onAuth(data.accessToken);
    
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <Typography level="h4" component="h1">
        Welcome!
      </Typography>
      <Typography level="body-sm">Sign in to continue.</Typography>

      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="example@email.com"
        />
      </FormControl>

      <FormControl>
        <FormLabel>Password</FormLabel>
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="password"
        />
      </FormControl>

      <Button sx={{ mt: 1 }} onClick={handleSubmit}>
        Log in
      </Button>

      <Typography
        fontSize="sm"
        sx={{ alignSelf: "center", cursor: "pointer" }}
        onClick={onToggle}
      >
        Don’t have an account? Sign up
      </Typography>
    </>
  );
}
