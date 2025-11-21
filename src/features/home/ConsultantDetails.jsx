import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  Alert,
  CircularProgress,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { getConsultantById } from "../../services/consultant.js";

const ConsultantDetails = ({ consultantId, onBack, onRefresh }) => {
  const [consultant, setConsultant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchConsultant = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getConsultantById(consultantId);

      // backend returns { errorCode: 404/200, message, ... }
      if (response.errorCode && response.errorCode !== 200) {
        setError(response.errorMessage || "Failed to fetch consultant details");
        return;
      }

      setConsultant(response.consultant || response);
      setError("");
    } catch (err) {
      console.error("Error fetching consultant:", err);
      setError("Failed to fetch consultant: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [consultantId]);

  useEffect(() => {
    if (consultantId) fetchConsultant();
  }, [consultantId, fetchConsultant]);
  if (!consultantId) {
    return (
      <Alert severity="info">Please select a consultant to view details.</Alert>
    );
  }

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!consultant) return null;

  return (
    <Box>
      <Button startIcon={<ArrowBack />} onClick={onBack} sx={{ mb: 2 }}>
        Back
      </Button>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              <strong>Consultant Information</strong>
            </Typography>

            <Typography>
              <strong>Name:</strong> {consultant.firstname}{" "}
              {consultant.lastname}
            </Typography>

            <Typography>
              <strong>Email:</strong> {consultant.email}
            </Typography>

            <Typography>
              <strong>Phone:</strong> {consultant.phone}
            </Typography>

            <Typography>
              <strong>Legal Status:</strong> {consultant.legal_status}
            </Typography>

            <Typography>
              <strong>Created:</strong>{" "}
              {consultant.createdAt
                ? new Date(consultant.createdAt).toLocaleDateString()
                : "N/A"}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ConsultantDetails;
