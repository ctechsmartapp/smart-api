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
import { ArrowBack, Edit } from "@mui/icons-material";

import { getSubmissionById } from "../../services/submission.js";
import SubmissionForm from "./SubmissionForm.jsx";

const SubmissionDetails = ({ submissionId, onBack, onRefresh }) => {
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editOpen, setEditOpen] = useState(false);

  const fetchSubmission = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getSubmissionById(submissionId);

      if (response.errorCode && response.errorCode !== 200) {
        setError(response.errorMessage || "Failed to fetch submission details");
        return;
      }

      setSubmission(response.submission || response);
      setError("");
    } catch (err) {
      console.error("Error fetching submission:", err);
      setError("Failed to fetch submission: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [submissionId]);

  useEffect(() => {
    if (submissionId) fetchSubmission();
  }, [submissionId, fetchSubmission]);

  if (!submissionId) {
    return (
      <Alert severity="info">Please select a submission to view details.</Alert>
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

  if (!submission) return null;

  return (
    <Box>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Button startIcon={<ArrowBack />} onClick={onBack}>
          Back
        </Button>
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={() => setEditOpen(true)}
        >
          Edit
        </Button>
      </Grid>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              <strong>Submission Details</strong>
            </Typography>

            <Typography>
              <strong>Technology:</strong> {submission.technology}
            </Typography>

            <Typography>
              <strong>Consultant:</strong> {submission.consultant}
            </Typography>

            <Typography>
              <strong>Vendor:</strong> {submission.vendor}
            </Typography>

            <Typography>
              <strong>Client:</strong> {submission.client}
            </Typography>

            <Typography>
              <strong>Interview Date:</strong>{" "}
              {submission.interview_date
                ? new Date(
                    submission.interview_date.replace(" ", "T")
                  ).toLocaleDateString()
                : "N/A"}
            </Typography>

            <Typography>
              <strong>Created At:</strong>{" "}
              {submission.created_at
                ? new Date(
                    submission.created_at.replace(" ", "T")
                  ).toLocaleDateString()
                : "N/A"}
            </Typography>

            <Typography>
              <strong>Updated At:</strong>{" "}
              {submission.updated_at
                ? new Date(
                    submission.updated_at.replace(" ", "T")
                  ).toLocaleDateString()
                : "N/A"}
            </Typography>

            <Typography>
              <strong>Comments:</strong> {submission.comments || "N/A"}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* EDIT FORM */}
      {editOpen && (
        <SubmissionForm
          open={editOpen}
          submission={submission}
          onClose={() => {
            setEditOpen(false);
            fetchSubmission();
            onRefresh();
          }}
        />
      )}
    </Box>
  );
};

export default SubmissionDetails;
