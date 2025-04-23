import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  TableContainer, Paper, Button, Dialog,
  DialogTitle, DialogContent, DialogActions,
  Typography, Box, TextField, Select, MenuItem,
  InputLabel, FormControl, Stack
} from "@mui/material";
import { Delete, Download } from "@mui/icons-material";

const BusinessTableConsultation = () => {
  const [businesses, setBusinesses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/businessesconsulation`);
      setBusinesses(response.data);
    } catch (error) {
      console.error("Error fetching businesses:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/businessesconsultation/${selectedItem}`);
      setDeleteDialogOpen(false);
      fetchBusinesses();
    } catch (error) {
      console.error("Error deleting business:", error);
    }
  };

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(businesses);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Businesses");
    XLSX.writeFile(workbook, "Business_Consultation_List.xlsx");
  };

  const filteredBusinesses = businesses.filter((item) => {
    const term = searchTerm.toLowerCase();
    if (!filter) {
      return Object.values(item).some((val) =>
        Array.isArray(val)
          ? val.join(" ").toLowerCase().includes(term)
          : val?.toString().toLowerCase().includes(term)
      );
    }
    const fieldValue = item[filter];
    if (Array.isArray(fieldValue)) {
      return fieldValue.join(" ").toLowerCase().includes(term);
    }
    return fieldValue?.toString().toLowerCase().includes(term);
  });

  const totalPages = Math.ceil(filteredBusinesses.length / recordsPerPage);
  const displayedBusinesses = filteredBusinesses.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" textAlign="start" gutterBottom color="primary">
        Business Consultation
      </Typography>

      <Paper elevation={4} sx={{ p: 3, mt: 2, borderRadius: 3 }}>
        {/* Filters & Search */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filter by</InputLabel>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              label="Filter by"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="fullName">Full Name</MenuItem>
              <MenuItem value="email">Email</MenuItem>
              <MenuItem value="phone">Phone</MenuItem>
              <MenuItem value="location">Location</MenuItem>
              <MenuItem value="businessName">Business Name</MenuItem>
              <MenuItem value="industry">Industry</MenuItem>
              <MenuItem value="businessStage">Business Stage</MenuItem>
              <MenuItem value="website">Website</MenuItem>
            </Select>
          </FormControl>

          <TextField
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            label="Search"
            fullWidth
          />

          <Button
            variant="contained"
            color="success"
            onClick={handleDownloadExcel}
            startIcon={<Download />}
          >
            Download Excel
          </Button>
        </Stack>

        {/* Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f3f4f6" }}>
              <TableRow>
                <TableCell><strong>Full Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Phone</strong></TableCell>
                <TableCell><strong>Location</strong></TableCell>
                <TableCell><strong>Business Name</strong></TableCell>
                <TableCell><strong>Industry</strong></TableCell>
                <TableCell><strong>Stage</strong></TableCell>
                <TableCell><strong>Website</strong></TableCell>
                <TableCell><strong>Needs</strong></TableCell>
                <TableCell><strong>Mentorship</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedBusinesses.map((item) => (
                <TableRow key={item._id} hover>
                  <TableCell>{item.fullName || "—"}</TableCell>
                  <TableCell>{item.email || "—"}</TableCell>
                  <TableCell>{item.phone || "—"}</TableCell>
                  <TableCell>{item.location || "—"}</TableCell>
                  <TableCell>{item.businessName || "—"}</TableCell>
                  <TableCell>{item.industry || "—"}</TableCell>
                  <TableCell>{item.businessStage || "—"}</TableCell>
                  <TableCell>{item.website || "—"}</TableCell>
                  <TableCell>{item.consultationNeeds?.join(", ") || "—"}</TableCell>
                  <TableCell>{item.mentorship || "—"}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<Delete />}
                      onClick={() => {
                        setSelectedItem(item._id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box className="flex justify-between items-center mt-4">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </Button>
          <Typography>
            Page {currentPage} of {totalPages || 1}
          </Typography>
          <Button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </Button>
        </Box>

        {/* Delete Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this business consultation?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button color="error" variant="contained" onClick={handleDeleteConfirm}>
              Yes, Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default BusinessTableConsultation;
