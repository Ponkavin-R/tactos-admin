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
} from "@mui/material";
import { Delete, Download } from "@mui/icons-material";

const SolutionsTable = () => {
  const [solutions, setSolutions] = useState([]);
  const [filter, setFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;

  useEffect(() => {
    fetchSolutions();
  }, []);

  const fetchSolutions = async () => {
    try {
      const response = await axios.get("https://tactos-backend.onrender.com/api/solutions");
      setSolutions(response.data);
    } catch (error) {
      console.error("Error fetching solutions:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    await axios.delete(`https://tactos-backend.onrender.com/api/solutions/${selectedItem}`);
    setDeleteDialogOpen(false);
    fetchSolutions();
  };

  const handleDownloadExcel = async () => {
    const response = await fetch("https://tactos-backend.onrender.com/api/solutions/export");
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "solutions.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const filteredSolutions = solutions.filter((item) => {
    if (!filter && !searchTerm.trim()) return true;
    return (
      (!filter || item[filter]?.toString().toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!searchTerm || Object.values(item).some((val) => val?.toString().toLowerCase().includes(searchTerm.toLowerCase())))
    );
  });

  const totalPages = Math.ceil(filteredSolutions.length / recordsPerPage);
  const displayedSolutions = filteredSolutions.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

  return (
    <Paper sx={{ p: 3, mt: 2, boxShadow: 3, borderRadius: 2 }}>
            <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">IT Solutions Data</h2>
        <Button variant="contained" color="success" startIcon={<Download />} onClick={handleDownloadExcel}>
          Download Excel
        </Button>
      </div>
      <div className="flex flex-col sm:flex-row mb-4 gap-2 items-center">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded w-full sm:w-auto"
        >
          <option value="">All</option>
          <option value="startupName">Startup Name</option>
          <option value="founderName">Founder Name</option>
          <option value="email">Email</option>
          <option value="phoneNumber">Phone Number</option>
          <option value="service">Service</option>
          <option value="quoteAmount">Amount</option>
        </select>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          className="border p-2 rounded w-full"
        />
      </div>

      <TableContainer component={Paper} className="overflow-x-auto">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Startup Name</TableCell>
              <TableCell>Founder Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Quote</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedSolutions.map((solution) => (
              <TableRow key={solution._id} hover>
                <TableCell>{solution.startupName}</TableCell>
                <TableCell>{solution.founderName}</TableCell>
                <TableCell>{solution.email}</TableCell>
                <TableCell>{solution.phoneNumber}</TableCell>
                <TableCell>{solution.service?.join(", ")}</TableCell>
                <TableCell>{solution.needQuote ? "Yes" : "No"}</TableCell>
                <TableCell>${solution.quoteAmount}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => {
                      setSelectedItem(solution._id);
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
      <div className="flex justify-between items-center mt-4">
        <Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
          Next
        </Button>
      </div>
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this record? This action cannot be undone.</DialogContent>
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

export default SolutionsTable;
