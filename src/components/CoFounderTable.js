import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  TableContainer, Paper, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, Chip, Stack, Box
} from "@mui/material";
import { Delete, Download, Autorenew } from "@mui/icons-material";

const CofounderTable = () => {
  const [cofounders, setCofounders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusTarget, setStatusTarget] = useState(null);

  useEffect(() => {
    fetchCofounders();
  }, []);

  const fetchCofounders = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/cofounders`);
      setCofounders(response.data);
    } catch (error) {
      console.error("Error fetching cofounders:", error);
    }
  };

  const handleStatusDialogOpen = (cofounder) => {
    setStatusTarget(cofounder);
    setStatusDialogOpen(true);
  };

  const handleStatusUpdate = async () => {
    try {
      const updatedStatus = !statusTarget.hold;
      await axios.put(`${process.env.REACT_APP_API_URL}/api/cofounders/${statusTarget._id}/status`, {
        hold: updatedStatus,
      });
      setStatusDialogOpen(false);
      fetchCofounders();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/cofounders/${selectedItem}`);
      setDeleteDialogOpen(false);
      fetchCofounders();
    } catch (error) {
      console.error("Error deleting cofounder:", error);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "Active" ? "Hold" : "Active";
      await axios.put(`${process.env.REACT_APP_API_URL}/api/cofounders/${id}/status`, { status: newStatus });
      fetchCofounders();
    } catch (error) {
      console.error("Error updating status:", error);
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
        Array.isArray(val) ? val.join(" ").toLowerCase().includes(term) : val?.toString().toLowerCase().includes(term)
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
    <Box sx={{ position: "relative", height: "80vh", overflow: "hidden" }}>
      <Paper sx={{ position: "absolute", inset: 0, overflow: "auto", zIndex: 0, padding: 2 }}>
        <div className="flex flex-col sm:flex-row mb-4 gap-2 items-center">
          <h2 style={{ fontWeight: "bold", fontSize: "24px", marginBottom: "16px" }}>CoFounder Registration</h2>
          
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

        <TableContainer sx={{ maxHeight: "60vh", overflowY: "auto" }}>
          <Table stickyHeader size="small">
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
                <TableCell>Status</TableCell>
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
                    <Chip label={cf.hold ? "Hold" : "Active"} color={cf.hold ? "warning" : "primary"} />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Button
                        variant="outlined"
                        color={cf.hold ? "success" : "warning"}
                        startIcon={<Autorenew />}
                        onClick={() => handleStatusDialogOpen(cf)}
                      >
                        {cf.hold ? "Activate" : "Hold"}
                      </Button>

                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => {
                          setSelectedItem(cf._id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                    </Stack>
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
            Page {currentPage} of {totalPages || 1}
          </span>
          <Button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </Paper>

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

      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)}>
        <DialogTitle>Change Status</DialogTitle>
        <DialogContent>
          Are you sure you want to set this cofounder to{" "}
          <strong>{statusTarget?.hold ? "Active" : "Hold"}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button color="primary" variant="contained" onClick={handleStatusUpdate}>
            Yes, Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CofounderTable;
