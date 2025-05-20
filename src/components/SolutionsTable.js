import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Typography,
  IconButton,
  Box,
  MenuItem,
  Select,
} from "@mui/material";
import { Cancel, Download, Edit, CheckCircle, InfoOutlined, Close } from "@mui/icons-material";

const statusStyles = {
  new: { color: "#1565c0", backgroundColor: "#e3f2fd" },
  Processing: { color: "#f57c00", backgroundColor: "#fff3e0" },
  Accepted: { color: "#2e7d32", backgroundColor: "#e8f5e9" },
};

const SolutionsTable = () => {
  const [solutions, setSolutions] = useState([]);
  const [filters, setFilters] = useState({
    startup: "",
    founder: "",
    email: "",
    phone: "",
    status: "",
    startDate: "",
    endDate: "",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // New state for info popup
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [infoData, setInfoData] = useState(null);

  useEffect(() => {
    fetchSolutions();
  }, []);
  const totalRecords = solutions.length;

  const fetchSolutions = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/solutions`
      );
      const sorted = response.data.sort(
        (a, b) => new Date(b.registeredAt) - new Date(a.registeredAt)
      );
      setSolutions(sorted);
    } catch (error) {
      console.error("Error fetching solutions:", error);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/solutions/${id}`, {
        status,
      });
      setSolutions((prev) =>
        prev.map((sol) =>
          sol._id === id
            ? {
                ...sol,
                status,
              }
            : sol
        )
      );
      setEditingStatusId(null);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleCancel = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/solutions/${selectedItem}`
      );
      setDeleteDialogOpen(false);
      setSolutions((prev) => prev.filter((sol) => sol._id !== selectedItem));
    } catch (err) {
      console.error("Error cancelling:", err);
    }
  };

  const handleDownloadExcel = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/solutions/export`
    );
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "solutions.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleClearFilters = () => {
    setFilters({
      startup: "",
      founder: "",
      email: "",
      phone: "",
      status: "",
      startDate: "",
      endDate: "",
    });
  };

  const filteredSolutions = solutions.filter((item) => {
    const { startup, founder, email, phone, status, startDate, endDate } =
      filters;
    const regDate = new Date(item.registeredAt);
    return (
      (!startup ||
        item.startupName?.toLowerCase().includes(startup.toLowerCase())) &&
      (!founder ||
        item.founderName?.toLowerCase().includes(founder.toLowerCase())) &&
      (!email || item.email?.toLowerCase().includes(email.toLowerCase())) &&
      (!phone || item.phoneNumber?.toLowerCase().includes(phone.toLowerCase())) &&
      (!status || item.status === status) &&
      (!startDate || regDate >= new Date(startDate)) &&
      (!endDate || regDate <= new Date(endDate))
    );
  });

  const totalPages = Math.ceil(filteredSolutions.length / recordsPerPage);
  const displayedSolutions = filteredSolutions.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  // Handle opening info dialog with data
  const openInfoDialog = (sol) => {
    setInfoData(sol);
    setInfoDialogOpen(true);
  };

  const closeInfoDialog = () => {
    setInfoDialogOpen(false);
    setInfoData(null);
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" fontWeight={600}>
          Tech Support
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<Download />}
          onClick={handleDownloadExcel}
        >
          Download Excel
        </Button>
      </Box>

      <Grid container spacing={2} mb={2}>
  {["startup", "founder", "email", "phone"].map((field) => (
    <Grid item xs={12} md={1.7} key={field}>
      <TextField
        size="small"
        label={field.charAt(0).toUpperCase() + field.slice(1)}
        value={filters[field]}
        onChange={(e) => setFilters({ ...filters, [field]: e.target.value })}
        fullWidth
      />
    </Grid>
  ))}
  <Grid item xs={12} md={1.7}>
    <Select
      size="small"
      fullWidth
      displayEmpty
      value={filters.status}
      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
    >
      <MenuItem value="">All Status</MenuItem>
      <MenuItem value="new">New</MenuItem>
      <MenuItem value="Processing">Processing</MenuItem>
      <MenuItem value="Accepted">Accepted</MenuItem>
    </Select>
  </Grid>
  <Grid item xs={12} md={1.7}>
  <TextField
    size="small"
    type="datetime-local"
    label="Start Date & Time"
    placeholder="Start time"
    value={filters.startDate}
    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
    fullWidth
    InputLabelProps={{ shrink: true }}
  />
</Grid>
<Grid item xs={12} md={1.7}>
  <TextField
    size="small"
    type="datetime-local"
    label="End Date & Time"
    placeholder="End time"
    value={filters.endDate}
    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
    fullWidth
    InputLabelProps={{ shrink: true }}
  />
</Grid>

  <Grid item xs={12} md={1.1}>
    <Button
      variant="outlined"
      color="error"
      fullWidth
      onClick={handleClearFilters}
    >
      Clear
    </Button>
  </Grid>
</Grid>


      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Startup</TableCell>
              <TableCell>Founder</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              {/* Removed Services column */}
              <TableCell>Total Quote</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedSolutions.map((sol) => {
              const totalQuote = sol.services?.reduce(
                (acc, curr) => acc + (curr.quote || 0),
                0
              );

              return (
                <TableRow key={sol._id}>
                  <TableCell>{new Date(sol.registeredAt).toLocaleString()}</TableCell>
                  <TableCell>{sol.startupName}</TableCell>
                  <TableCell>{sol.founderName}</TableCell>
                  <TableCell>{sol.email}</TableCell>
                  <TableCell>{sol.phoneNumber}</TableCell>

                  <TableCell>
  <Box display="flex" alignItems="center" justifyContent="space-between">
    <Typography variant="body2">₹{totalQuote}</Typography>
    <IconButton
      size="small"
      onClick={() => openInfoDialog(sol)}
      aria-label="Info"
    >
      <InfoOutlined fontSize="small" />
    </IconButton>
  </Box>
</TableCell>


                  <TableCell>
                    {editingStatusId === sol._id ? (
                      <Box display="flex" alignItems="center" gap={1}>
                        <Select
                          size="small"
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          sx={{ minWidth: 120, backgroundColor: "#f9f9f9", borderRadius: 1 }}
                        >
                          {["new", "Processing", "Accepted"].map((status) => (
                            <MenuItem key={status} value={status}>
                              {status}
                            </MenuItem>
                          ))}
                        </Select>
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleStatusChange(sol._id, newStatus)}
                          sx={{ backgroundColor: "#e0f2f1", borderRadius: 1 }}
                          disabled={!newStatus}
                        >
                          <CheckCircle fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => setEditingStatusId(null)}
                          sx={{ backgroundColor: "#ffebee", borderRadius: 1 }}
                          >
                          <Cancel fontSize="small" />
                          </IconButton>
                          </Box>
                          ) : (
                          <Button
                          size="small"
                          variant="outlined"
                          sx={{
                          ...statusStyles[sol.status],
                          borderRadius: 2,
                          textTransform: "capitalize",
                          fontWeight: 600,
                          fontSize: 12,
                          px: 1.5,
                          py: 0.4,
                          }}
                          onClick={() => {
                          setEditingStatusId(sol._id);
                          setNewStatus(sol.status);
                          }}
                          >
                          {sol.status}
                          </Button>
                          )}
                          </TableCell>
                          
                          
                          <TableCell align="center">
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => {
                    setDeleteDialogOpen(true);
                    setSelectedItem(sol._id);
                  }}
                  sx={{ borderRadius: 2 }}
                >
                  Cancel
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </TableContainer>

{/* Pagination controls */}
<Box mt={2} display="flex" flexDirection="column" alignItems="center" gap={1}>
  <Typography variant="body2" color="textSecondary">
    Total Records: {totalRecords}
  </Typography>
  
  <Box display="flex" justifyContent="center" gap={1}>
    {Array.from({ length: totalPages }, (_, i) => (
      <Button
        key={i + 1}
        variant={currentPage === i + 1 ? "contained" : "outlined"}
        onClick={() => setCurrentPage(i + 1)}
        size="small"
        sx={{ minWidth: 32 }}
      >
        {i + 1}
      </Button>
    ))}
  </Box>
</Box>


  {/* Delete Confirmation Dialog */}
  <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
    <DialogTitle>Confirm Cancel</DialogTitle>
    <DialogContent>
      Are you sure you want to cancel this solution?
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setDeleteDialogOpen(false)}>No</Button>
      <Button color="error" onClick={handleCancel}>
        Yes
      </Button>
    </DialogActions>
  </Dialog>

  <Dialog
  open={infoDialogOpen}
  onClose={closeInfoDialog}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: 4,
      p: 3,
      bgcolor: "#ffffff", // white background
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    },
  }}
>
  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
    <DialogTitle sx={{ p: 0, fontWeight: 700, color: "#1976d2" }}>
      Quote Details
    </DialogTitle>
    <IconButton onClick={closeInfoDialog} size="small">
      <Close />
    </IconButton>
  </Box>

  {infoData && (
    <>
      <Typography variant="subtitle1" fontWeight={600} mb={1} color="primary">
        Startup:{" "}
        <Box component="span" color="text.primary">
          {infoData.startupName}
        </Box>
      </Typography>

      <Typography variant="subtitle1" fontWeight={600} mb={1} color="secondary">
        Founder:{" "}
        <Box component="span" color="text.primary">
          {infoData.founderName}
        </Box>
      </Typography>

      <Typography variant="subtitle1" fontWeight={600} mb={2} sx={{ color: "green" }}>
        Total Quote: ₹
        <Box component="span" fontWeight={700} color="text.primary">
          {infoData.services?.reduce((acc, curr) => acc + (curr.quote || 0), 0)}
        </Box>
      </Typography>

      <Typography
        variant="subtitle2"
        fontWeight={700}
        mb={1}
        sx={{ color: "#673ab7", textTransform: "uppercase" }}
      >
        Services
      </Typography>

      {infoData.services?.length > 0 ? (
        infoData.services.map((service, index) => (
          <Box
            key={index}
            mb={1.5}
            p={2}
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              bgcolor: "#f9f9f9",
            }}
          >
            <Typography variant="body1" fontWeight={600} color="#3f51b5">
              {service.name || "Service"}:{" "}
              <Box component="span" fontWeight={600} color="text.primary">
                ₹{service.quote}
              </Box>
            </Typography>
            {service.description && (
              <Typography variant="caption" color="text.secondary">
                {service.description}
              </Typography>
            )}
          </Box>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary">
          No services listed.
        </Typography>
      )}
    </>
  )}
</Dialog>


</Paper>
);
};

export default SolutionsTable;                          
