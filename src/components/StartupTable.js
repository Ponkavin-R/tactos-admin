import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
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
import { Delete, Download, ViewAgenda } from "@mui/icons-material";
import { FaEye } from "react-icons/fa";

const StartupTable = () => {
  const [startups, setStartups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;

  useEffect(() => {
    fetchStartups();
  }, []);

  const fetchStartups = async () => {
    try {
      const response = await axios.get("https://tactos-backend.onrender.com/api/startups");
      setStartups(response.data);
    } catch (error) {
      console.error("Error fetching startups:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    await axios.delete(`https://tactos-backend.onrender.com/api/startups/${selectedItem}`);
    setDeleteDialogOpen(false);
    fetchStartups();
  };

  const handleDownloadPitchDeck = (pitchDeck) => {
    window.open(`https://tactos-backend.onrender.com${pitchDeck}`, "_blank");
  };

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(startups);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Startups");
    XLSX.writeFile(workbook, "Startup_List.xlsx");
  };

  const filteredStartups = startups.filter((item) =>
    filter
      ? item[filter]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      : Object.values(item).some((val) =>
          val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
  );

  const totalPages = Math.ceil(filteredStartups.length / recordsPerPage);
  const displayedStartups = filteredStartups.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  return (
    <Paper sx={{ p: 3, mt: 2, boxShadow: 3, borderRadius: 2 }}>
      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row mb-4 gap-2 items-center">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded w-full sm:w-auto"
        >
          <option value="">All</option>
          <option value="startupName">Startup Name</option>
          <option value="fullName">Founder Name</option>
          <option value="email">Email</option>
          <option value="phone">Phone</option>
          <option value="industry">Industry</option>
          <option value="stage">Stage</option>
          <option value="location">Location</option>
          <option value="pitchDeck">Pitch Deck</option>
        </select>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          className="border p-2 rounded w-full"
        />
        <Button variant="contained" color="success" onClick={handleDownloadExcel}>
          Download Excel
        </Button>
      </div>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Startup Name</TableCell>
              <TableCell>Founder Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Industry</TableCell>
              <TableCell>Stage</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Pitch Deck</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedStartups.map((startup) => (
              <TableRow key={startup._id} hover>
                <TableCell>{startup.startupName}</TableCell>
                <TableCell>{startup.fullName}</TableCell>
                <TableCell>{startup.email}</TableCell>
                <TableCell>{startup.phone}</TableCell>
                <TableCell>{startup.industry}</TableCell>
                <TableCell>{startup.stage}</TableCell>
                <TableCell>{startup.location}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<FaEye />}
                    onClick={() => handleDownloadPitchDeck(startup.pitchDeck)}
                  >
                    View
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => {
                      setSelectedItem(startup._id);
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
          Page {currentPage} of {totalPages}
        </span>
        <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
          Next
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this record? This action cannot be undone.
        </DialogContent>
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

export default StartupTable;
