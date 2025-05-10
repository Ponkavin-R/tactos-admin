import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  TableContainer, Paper, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, Typography
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
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/businesses`);
      setBusinesses(response.data);
    } catch (error) {
      console.error("Error fetching businesses:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/businesses/${selectedItem}`);
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
    <div className="p-4">

      <Paper sx={{ p: 3, boxShadow: 5, borderRadius: 4 }}>
        {/* Filter and Search */}

 <div className="flex flex-col sm:flex-row mb-4 gap-2 items-center">
          <h2 style={{ fontWeight: "bold", fontSize: "24px", marginBottom: "16px" }}>Business Ideation Hub</h2>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 p-2 rounded-md w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-400"
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
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell><strong>Full Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Phone</strong></TableCell>
                <TableCell><strong>Location</strong></TableCell>
                <TableCell><strong>Role</strong></TableCell>
                <TableCell><strong>Industry</strong></TableCell>
                <TableCell><strong>Experience</strong></TableCell>
                <TableCell><strong>Field</strong></TableCell>
                <TableCell><strong>Budget</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
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
                      variant="outlined"
                      color="error"
                      size="small"
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
          <Button
            variant="outlined"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages || 1}
          </span>
          <Button
            variant="outlined"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
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
    </div>
  );
};

export default BusinessesTable;
