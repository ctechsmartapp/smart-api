import React, { useState } from "react";
import { FormControl, FormLabel, Input, Button, Typography } from "@mui/joy";
import { signup } from "../services/auth";
import { useNavigate } from "react-router-dom";

export default function SignupForm({ onToggle, onAuth }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      const data = await signup(
        form.email,
        form.password,
        form.firstname,
        form.lastname
      );
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      onAuth(data.accessToken);
      navigate("/home"); // redirect after signup
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <Typography level="h4" component="h1">
        Create Account
      </Typography>
      <Typography level="body-sm">Sign up to get started.</Typography>

      <FormControl>
        <FormLabel>First Name</FormLabel>
        <Input
          name="firstname"
          value={form.firstname}
          onChange={handleChange}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Last Name</FormLabel>
        <Input
          name="lastname"
          value={form.lastname}
          onChange={handleChange}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Password</FormLabel>
        <Input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />
      </FormControl>

      <Button sx={{ mt: 1 }} onClick={handleSubmit}>
        Sign up
      </Button>

      <Typography
        fontSize="sm"
        sx={{ alignSelf: "center", cursor: "pointer" }}
        onClick={onToggle}
      >
        Already have an account? Log in
      </Typography>
    </>
  );
}
