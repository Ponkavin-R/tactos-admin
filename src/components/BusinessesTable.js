// Frontend: BusinessesTable.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  TableContainer, Paper, Button, Dialog,
  DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import { Delete, Download } from "@mui/icons-material";

const BusinessesTable = () => {
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
      const response = await axios.get("https://tactos-backend.onrender.com/api/businesses");
      setBusinesses(response.data);
    } catch (error) {
      console.error("Error fetching businesses:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`https://tactos-backend.onrender.com/api/businesses/${selectedItem}`);
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
    XLSX.writeFile(workbook, "Business_List.xlsx");
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
    <Paper sx={{ p: 3, mt: 2, boxShadow: 3, borderRadius: 2 }}>
      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row mb-4 gap-2 items-center">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded w-full sm:w-auto"
        >
          <option value="">All</option>
          <option value="fullName">Full Name</option>
          <option value="email">Email</option>
          <option value="phone">Phone</option>
          <option value="location">Location</option>
          <option value="role">Role</option>
          <option value="industry">Industry</option>
          <option value="experience">Experience</option>
          <option value="fieldOfStudy">Field</option>
          <option value="budget">Budget</option>
        </select>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          className="border p-2 rounded w-full"
        />

        <Button variant="contained" color="success" onClick={handleDownloadExcel} startIcon={<Download />}>
          Download Excel
        </Button>
      </div>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Industry</TableCell>
              <TableCell>Experience</TableCell>
              <TableCell>Field</TableCell>
              <TableCell>Budget</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedBusinesses.map((b) => (
              <TableRow key={b._id} hover>
                <TableCell>{b.fullName || "—"}</TableCell>
                <TableCell>{b.email || "—"}</TableCell>
                <TableCell>{b.phone || "—"}</TableCell>
                <TableCell>{b.location || "—"}</TableCell>
                <TableCell>{b.role || "—"}</TableCell>
                <TableCell>{b.industry || "—"}</TableCell>
                <TableCell>{b.experience || "—"}</TableCell>
                <TableCell>{b.fieldOfStudy || "—"}</TableCell>
                <TableCell>₹{b.budget || "—"}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => {
                      setSelectedItem(b._id);
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
      <div className="flex justify-between items-center mt-4">
        <Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages || 1}
        </span>
        <Button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(currentPage + 1)}>
          Next
        </Button>
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this business?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDeleteConfirm}>
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default BusinessesTable;
