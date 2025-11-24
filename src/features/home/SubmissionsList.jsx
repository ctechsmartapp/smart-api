import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Grid,
} from "@mui/material";
import { Add, Edit, Delete, Visibility } from "@mui/icons-material";
import { ErrorBoundary } from "react-error-boundary";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { getAllSubmissions } from "../../services/submission.js";
import { deleteSubmission } from "../../services/submission.js";
import SubmissionForm from "./SubmissionForm.jsx";
import SubmissionDetails from "./SubmissionDetails.jsx";

const theme = createTheme({
  palette: { mode: "light" },
});

const SubmissionList = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);

  const [open, setOpen] = useState(false);
  const [editSubmission, setEditSubmission] = useState(null);

  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await getAllSubmissions();
      setSubmissions(
        Array.isArray(response.submissions) ? response.submissions : []
      );
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const viewDetails = (id) => {
    setSelectedSubmissionId(id);
  };

  const handleDelete = async () => {
    try {
      const response = await deleteSubmission(deleteConfirm.id);

      if (response.errorCode && response.errorCode !== 200) {
        alert(response.errorMessage || "Failed to delete submission");
        return;
      }

      setDeleteConfirm(null);
      fetchSubmissions();
    } catch (error) {
      console.error("Error deleting submission:", error);
      alert("Failed to delete submission");
    }
  };

  const handleFormClose = () => {
    setOpen(false);
    setEditSubmission(null);
    fetchSubmissions();
  };

  if (selectedSubmissionId) {
    return (
      <SubmissionDetails
        submissionId={selectedSubmissionId}
        onBack={() => setSelectedSubmissionId(null)}
        onRefresh={fetchSubmissions}
        onEdit={(submission) => {
          setEditSubmission(submission);
          setOpen(true);
        }}
      />
    );
  }

  if (loading)
    return <Typography sx={{ mt: 4 }}>Loading submissions...</Typography>;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary fallback={<div>Something went wrong.</div>}>
        <Box sx={{ p: 3, width: "100%", maxWidth: "100%" }}>
          <Grid container alignItems="center" sx={{ mb: 2 }} spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" fontWeight="bold">
                Submissions List
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              md={4}
              sx={{ textAlign: { xs: "left", md: "center" } }}
            >
              <Typography variant="subtitle2">
                Showing {submissions.length} submissions
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              md={4}
              sx={{ textAlign: { xs: "left", md: "right" } }}
            >
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => {
                  setEditSubmission(null);
                  setOpen(true);
                }}
              >
                Add Submission
              </Button>
            </Grid>
          </Grid>

          {submissions.length > 0 && (
            <TableContainer
              component={Paper}
              sx={{
                border: "1px solid #ccc",
                borderRadius: 2,
                width: "100%",
                overflowX: "auto",
              }}
            >
              <Table size="small" sx={{ minWidth: 900, width: "100%" }}>
                <TableHead sx={{ backgroundColor: "#78909c" }}>
                  <TableRow>
                    <TableCell>
                      <strong>Sr.</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Technology</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Consultant</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Vendor</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Client</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Interview Date</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Created At</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Actions</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {submissions.map((submission, i) => (
                    <TableRow key={submission.id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{submission.technology}</TableCell>
                      <TableCell>
                        {submission.Consultant.firstname +
                          " " +
                          submission.Consultant.lastname}
                      </TableCell>
                      <TableCell>{submission.vendor}</TableCell>
                      <TableCell>{submission.client}</TableCell>
                      <TableCell>
                        {submission.interview_date
                          ? new Date(
                              submission.interview_date.replace(" ", "T")
                            ).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {submission.created_at
                          ? new Date(
                              submission.created_at.replace(" ", "T")
                            ).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => viewDetails(submission.id)}>
                          <Visibility />
                        </IconButton>

                        <IconButton
                          onClick={() => {
                            setEditSubmission(submission);
                            setOpen(true);
                          }}
                        >
                          <Edit />
                        </IconButton>

                        <IconButton
                          onClick={() => setDeleteConfirm(submission)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* DELETE CONFIRM DIALOG */}
          <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              Are you sure you want to delete the submission for{" "}
              <strong>{deleteConfirm?.technology}</strong>?
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
              <Button color="error" onClick={handleDelete}>
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          {/* ADD / EDIT FORM */}
          <SubmissionForm
            open={open}
            submission={editSubmission}
            onClose={handleFormClose}
          />
        </Box>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default SubmissionList;
