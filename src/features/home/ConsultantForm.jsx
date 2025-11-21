import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  Alert,
} from "@mui/material";

import { addConsultant, updateConsultant } from "../../services/consultant.js";

const ConsultantForm = ({ open, consultant, onClose }) => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    legal_status: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (consultant) {
      setFormData({
        firstname: consultant.firstname,
        lastname: consultant.lastname,
        email: consultant.email,
        phone: consultant.phone,
        legal_status: consultant.legal_status,
      });
    } else {
      setFormData({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        legal_status: "",
      });
    }

    setErrors({});
    setTouched({});
    setApiError("");
  }, [consultant, open]);

  const validateField = (name, value) => {
    switch (name) {
      case "firstname":
        if (!value) return "First name is required";
        if (!/^[a-zA-Z\s]+$/.test(value)) return "Only letters allowed";
        return "";
      case "lastname":
        if (!value) return "Last name is required";
        if (!/^[a-zA-Z\s]+$/.test(value)) return "Only letters allowed";
        return "";
      case "email":
        if (!value) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email";
        return "";
      case "phone":
        if (!value) return "Phone number is required";
        if (!/^\d{10}$/.test(value)) return "Phone must be 10 digits";
        return "";
      case "legal_status":
        if (!value) return "Legal status is required";
        return "";
      default:
        return "";
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });

    const error = validateField(name, formData[name]);
    setErrors({ ...errors, [name]: error });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    if (apiError) setApiError("");

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors({ ...errors, [name]: error });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      newErrors[key] = validateField(key, formData[key]);
    });

    setErrors(newErrors);
    setTouched({
      firstname: true,
      lastname: true,
      email: true,
      phone: true,
      legal_status: true,
    });

    return Object.values(newErrors).every((x) => !x);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      let response;
      if (consultant) {
        response = await updateConsultant({ ...formData, id: consultant.id });
      } else {
        response = await addConsultant(formData);
      }

      if (response.errorCode && response.errorCode !== "SUCCESS") {
        setApiError(response.errorMessage || "An error occurred");
        return;
      }

      onClose();
    } catch (error) {
      console.error("Error saving consultant:", error);
      setApiError("Error saving consultant: " + error.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {consultant ? "Edit Consultant" : "Add Consultant"}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {apiError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {apiError}
            </Alert>
          )}

          <Typography variant="h6" gutterBottom>
            Consultant Information
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="firstname"
                label="First Name"
                value={formData.firstname}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.firstname}
                helperText={errors.firstname}
                required
                disabled={!!consultant}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="lastname"
                label="Last Name"
                value={formData.lastname}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.lastname}
                helperText={errors.lastname}
                required
                disabled={!!consultant}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="email"
                label="Email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.email}
                helperText={errors.email}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="phone"
                label="Phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.phone}
                helperText={errors.phone}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="legal_status"
                label="Legal Status"
                value={formData.legal_status}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.legal_status}
                helperText={errors.legal_status}
                required
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {consultant ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConsultantForm;
