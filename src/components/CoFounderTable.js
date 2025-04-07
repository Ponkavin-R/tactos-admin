// CofounderTable.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  TableContainer, Paper, Button, Dialog,
  DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import { Delete, Download } from "@mui/icons-material";

const CofounderTable = () => {
  const [cofounders, setCofounders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;

  useEffect(() => {
    fetchCofounders();
  }, []);

  const fetchCofounders = async () => {
    try {
      const response = await axios.get("https://tactos-backend.onrender.com/api/cofounders");
      setCofounders(response.data);
    } catch (error) {
      console.error("Error fetching cofounders:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`https://tactos-backend.onrender.com/api/cofounders/${selectedItem}`);
      setDeleteDialogOpen(false);
      fetchCofounders();
    } catch (error) {
      console.error("Error deleting cofounder:", error);
    }
  };

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(cofounders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cofounders");
    XLSX.writeFile(workbook, "Cofounder_List.xlsx");
  };

  const filteredCofounders = cofounders.filter((item) => {
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

  const totalPages = Math.ceil(filteredCofounders.length / recordsPerPage);
  const displayedCofounders = filteredCofounders.slice(
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
          <option value="expertise">Expertise</option>
          <option value="experience">Experience</option>
          <option value="industries">Industries</option>
          <option value="investmentCapacity">Investment Capacity</option>
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
              <TableCell>Expertise</TableCell>
              <TableCell>Experience</TableCell>
              <TableCell>Industries</TableCell>
              <TableCell>Investment Capacity</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedCofounders.map((cf) => (
              <TableRow key={cf._id} hover>
                <TableCell>{cf.fullName || "—"}</TableCell>
                <TableCell>{cf.email || "—"}</TableCell>
                <TableCell>{cf.phone || "—"}</TableCell>
                <TableCell>{cf.location || "—"}</TableCell>
                <TableCell>{cf.role || "—"}</TableCell>
                <TableCell>{cf.expertise || "—"}</TableCell>
                <TableCell>{cf.experience || "—"}</TableCell>
                <TableCell>{cf.industries?.join(", ") || "—"}</TableCell>
                <TableCell>₹{cf.investmentCapacity || "—"}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => {
                      setSelectedItem(cf._id);
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
        <DialogContent>Are you sure you want to delete this cofounder?</DialogContent>
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

export default CofounderTable;
