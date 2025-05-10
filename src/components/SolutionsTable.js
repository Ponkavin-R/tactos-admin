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
  MenuItem,
} from "@mui/material";
import { Delete, Download } from "@mui/icons-material";

const SolutionsTable = () => {
  const [solutions, setSolutions] = useState([]);
  const [filter, setFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;

  useEffect(() => {
    fetchSolutions();
  }, []);

  const fetchSolutions = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/solutions`);
      setSolutions(response.data);
    } catch (error) {
      console.error("Error fetching solutions:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/api/solutions/${selectedItem}`);
    setDeleteDialogOpen(false);
    fetchSolutions();
  };

  const handleDownloadExcel = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/solutions/export`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "solutions.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleEdit = (solution) => {
    setSelectedItem({ ...solution });
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    await axios.put(`${process.env.REACT_APP_API_URL}/api/solutions/${selectedItem._id}`, selectedItem);
    setEditDialogOpen(false);
    fetchSolutions();
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
    <Paper className="p-4 mt-6 rounded-2xl shadow-md bg-white">
    <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-6 px-4 py-3 bg-white shadow rounded-xl border border-gray-200">
  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
     <span>Tech Support</span>
  </h2>

  <Button
    variant="contained"
    color="success"
    startIcon={<Download />}
    onClick={handleDownloadExcel}
    sx={{
      borderRadius: '9999px', // fully rounded
      textTransform: 'none',
      fontWeight: 'bold',
      paddingX: 2.5,
      paddingY: 1,
    }}
  >
    Download Excel
  </Button>
</div>


      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full sm:w-1/4 px-4 py-2 border border-gray-300 rounded-full focus:outline-none"
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
          placeholder="🔍 Search..."
          className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none"
        />
      </div>

      <div className="overflow-x-auto">
        <TableContainer component={Paper} className="rounded-lg shadow-sm">
          <Table>
            <TableHead className="bg-gray-100">
              <TableRow>
                {["Startup", "Founder", "Email", "Phone", "Services", "Total Quote", "Status", "Registered", "Actions"].map(
                  (header, idx) => (
                    <TableCell key={idx} className="font-semibold text-sm text-gray-700">
                      {header}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedSolutions.map((solution) => (
                <TableRow key={solution._id} hover>
                  <TableCell>{solution.startupName}</TableCell>
                  <TableCell>{solution.founderName}</TableCell>
                  <TableCell>{solution.email}</TableCell>
                  <TableCell>{solution.phoneNumber}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-sm">
                      {solution.services?.map((s, idx) => (
                        <div key={idx} className="truncate">
                          {s.name.split(" ")[0]} - ₹{s.quote}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>₹{solution.services?.reduce((acc, curr) => acc + (curr.quote || 0), 0)}</TableCell>
                  <TableCell>{solution.status}</TableCell>
                  <TableCell>{new Date(solution.registeredAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2 flex-wrap">
                      <Button variant="outlined" size="small" onClick={() => handleEdit(solution)}>
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        startIcon={<Delete />}
                        onClick={() => {
                          setSelectedItem(solution._id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
          ⬅️ Previous
        </Button>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
          Next ➡️
        </Button>
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>⚠️ Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this record? This action <b>cannot be undone</b>.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDeleteConfirm}>
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>📝 Edit Solution</DialogTitle>
        <DialogContent className="flex flex-col gap-4 mt-2">
          <TextField
            label="Startup Name"
            value={selectedItem?.startupName || ""}
            onChange={(e) => setSelectedItem({ ...selectedItem, startupName: e.target.value })}
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Founder Name"
            value={selectedItem?.founderName || ""}
            onChange={(e) => setSelectedItem({ ...selectedItem, founderName: e.target.value })}
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Email"
            value={selectedItem?.email || ""}
            onChange={(e) => setSelectedItem({ ...selectedItem, email: e.target.value })}
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Phone Number"
            value={selectedItem?.phoneNumber || ""}
            onChange={(e) => setSelectedItem({ ...selectedItem, phoneNumber: e.target.value })}
            fullWidth
            variant="outlined"
          />
          <TextField
            select
            label="Status"
            value={selectedItem?.status || "new"}
            onChange={(e) => setSelectedItem({ ...selectedItem, status: e.target.value })}
            fullWidth
            variant="outlined"
          >
            <MenuItem value="new">New</MenuItem>
            <MenuItem value="updated">Updated</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default SolutionsTable;
