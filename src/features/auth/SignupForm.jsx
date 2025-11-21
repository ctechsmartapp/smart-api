import React, { useState, useContext } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import { signup } from "../../services/auth";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function SignupForm() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    role: 3, // Default Consultant
  });

  const navigate = useNavigate();
  const { setToken } = useContext(AuthContext);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRoleChange = (_, value) => setForm({ ...form, role: value });

  const handleSubmit = async () => {
    try {
      const data = await signup(
        form.email,
        form.password,
        form.firstname,
        form.lastname,
        form.role
      );
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      setToken(data.accessToken);
      navigate("/home");
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
        <Input name="lastname" value={form.lastname} onChange={handleChange} />
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

      {/* <FormControl>
        <FormLabel>Role</FormLabel>
        <Select name="role" value={form.role} onChange={handleRoleChange}>
          <MenuItem value={1}>Admin</MenuItem>
          <MenuItem value={2}>Marketer</MenuItem>
          <MenuItem value={3}>Consultant</MenuItem>
        </Select>
      </FormControl> */}

      <Button sx={{ mt: 1 }} onClick={handleSubmit}>
        Sign up
      </Button>

      <Typography
        fontSize="sm"
        sx={{ alignSelf: "center", cursor: "pointer" }}
        onClick={() => navigate("/")}
      >
        Already have an account? Log in
      </Typography>
    </>
  );
}
