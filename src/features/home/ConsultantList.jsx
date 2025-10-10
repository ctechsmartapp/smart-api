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
  Grid,
  IconButton,
} from "@mui/material";
import { Edit, Delete, Add, Visibility } from "@mui/icons-material";
import { ErrorBoundary } from "react-error-boundary";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  getAllConsultants,
  getUserDetails,
  getUserDetailsById,
} from "../../services/user.js";
const theme = createTheme({
  palette: {
    mode: "light",
  },
});

const ConsultantList = () => {
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        setLoading(true);
        const response = await getAllConsultants();
        const data = Array.isArray(response.consultants)
          ? response.consultants
          : [];
        setConsultants(data);
      } catch (error) {
        console.error("Error fetching consultants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultants();
  }, []);

  const viewDetails = async (id) => {
    try {
      setLoading(true);
      const response = await getUserDetailsById(id);
      console.log(response);
    } catch (error) {
      console.error("Error fetching consultant:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      // await deleteConsultant(deleteConfirm.id);
      // setConsultants(prev => prev.filter(c => c.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting consultant:", error);
      alert("Failed to delete consultant");
    }
  };

  if (loading)
    return (
      <Typography variant="body1" sx={{ mt: 4 }}>
        Loading consultants...
      </Typography>
    );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary fallback={<div>Something went wrong.</div>}>
        <Box sx={{ p: 3 }}>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography variant="h5" fontWeight="bold">
              Consultant List
            </Typography>
            <Typography variant="subtitle2">
              Showing {consultants.length} consultants
            </Typography>
          </Grid>

          {consultants.length > 0 && (
            <TableContainer
              component={Paper}
              sx={{ border: "1px solid #ccc", borderRadius: 2 }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {consultants.map((consultant, i) => (
                    <TableRow key={consultant.id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>
                        {consultant.firstname} {consultant.lastname}
                      </TableCell>
                      <TableCell>{consultant.email}</TableCell>
                      <TableCell>
                        {new Date(consultant.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => {
                            console.log(viewDetails(consultant.id));
                          }}
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton onClick={() => setEditCustomer(consultant)}>
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => setDeleteConfirm(consultant)}
                          sx={{
                            "&:hover": {
                              backgroundColor: "rgba(0, 0, 0, 0.04)",
                            },
                          }}
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

          <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              Are you sure you want to delete{" "}
              <strong>
                {deleteConfirm?.firstname} {deleteConfirm?.lastname}
              </strong>
              ?
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
              <Button color="error" onClick={handleDelete}>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default ConsultantList;
