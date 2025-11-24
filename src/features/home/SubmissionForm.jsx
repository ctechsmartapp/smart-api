import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { addSubmission, updateSubmission } from "../../services/submission.js";
import { getAllConsultants } from "../../services/user.js";

const SubmissionForm = ({ open, onClose, submission }) => {
  const [formData, setFormData] = useState({
    technology: "",
    consultant: "",
    vendor: "",
    client: "",
    interview_date: "",
    comments: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [consultants, setConsultants] = useState([]);

  // Load all consultants once on mount
  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        const data = await getAllConsultants();
        // console.log(data);
        setConsultants(
          Array.isArray(data.consultants)
            ? data.consultants
            : data?.data.consultants || []
        );
      } catch (err) {
        console.error("Error fetching consultants:", err);
        setApiError("Failed to load consultants");
      }
    };
    fetchConsultants();
  }, []);

  // Load existing submission data in edit mode
  useEffect(() => {
    if (submission) {
      setFormData({
        technology: submission.technology || "",
        consultant: submission.consultant || "",
        vendor: submission.vendor || "",
        client: submission.client || "",
        interview_date: submission.interview_date
          ? submission.interview_date.split(" ")[0]
          : "",
        comments: submission.comments || "",
      });
    } else {
      setFormData({
        technology: "",
        consultant: "",
        vendor: "",
        client: "",
        interview_date: "",
        comments: "",
      });
    }
    setErrors({});
    setApiError("");
  }, [submission]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    ["technology", "consultant", "vendor", "client", "interview_date"].forEach(
      (field) => {
        if (!formData[field]) newErrors[field] = "This field is required";
      }
    );
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      if (submission) {
        // Edit
        await updateSubmission(submission.id, {
          ...formData,
        });
      } else {
        // Add
        await addSubmission({
          ...formData,
          consultant_id: formData.consultant,
        });
      }
      onClose();
    } catch (err) {
      console.error("Error saving submission:", err);
      setApiError(err.message || "Failed to save submission");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {submission ? "Edit Submission" : "Add Submission"}
      </DialogTitle>
      <DialogContent>
        {apiError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {apiError}
          </Alert>
        )}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Technology"
              name="technology"
              value={formData.technology}
              onChange={handleChange}
              error={!!errors.technology}
              helperText={errors.technology}
              required
            />
          </Grid>

          {/* Consultant dropdown */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.consultant} required>
              <InputLabel id="consultant-label">Consultant</InputLabel>
              <Select
                labelId="consultant-label"
                name="consultant"
                value={formData.consultant || ""} // will store the id
                onChange={handleChange}
              >
                {consultants.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.firstname + " " + c.lastname}{" "}
                    {/* Display name, value is id */}
                  </MenuItem>
                ))}
              </Select>
              {errors.consultant && (
                <p
                  style={{
                    color: "#d32f2f",
                    margin: "3px 14px 0 14px",
                    fontSize: "0.75rem",
                  }}
                >
                  {errors.consultant}
                </p>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Vendor"
              name="vendor"
              value={formData.vendor}
              onChange={handleChange}
              error={!!errors.vendor}
              helperText={errors.vendor}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Client"
              name="client"
              value={formData.client}
              onChange={handleChange}
              error={!!errors.client}
              helperText={errors.client}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="date"
              label="Interview Date"
              name="interview_date"
              value={formData.interview_date}
              onChange={handleChange}
              error={!!errors.interview_date}
              helperText={errors.interview_date}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Comments"
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {submission ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubmissionForm;
