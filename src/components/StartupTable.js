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
  MenuItem,
  Select,
  TextField,
  FormControl,
  InputLabel,
  Chip,
  Stack,
  Box,
} from "@mui/material";
import { Delete, Download, Autorenew } from "@mui/icons-material";
import { FaEye } from "react-icons/fa";

const StartupTable = () => {
  const [startups, setStartups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;

  useEffect(() => {
    fetchStartups();
  }, []);

  const fetchStartups = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/startups`);
      setStartups(response.data);
    } catch (error) {
      console.error("Error fetching startups:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/startups/${selectedItem}`);
      setDeleteDialogOpen(false);
      fetchStartups();
    } catch (error) {
      console.error("Error deleting startup:", error);
    }
  };

  const handleStatusConfirm = async () => {
    try {
      const endpoint =
        selectedStatus === "Hold"
          ? `${process.env.REACT_APP_API_URL}/api/startups/hold/${selectedItem}`
          : `${process.env.REACT_APP_API_URL}/api/startups/activate/${selectedItem}`;
      await axios.put(endpoint);
  
      // Update status in local state without refetching
      setStartups((prevStartups) =>
        prevStartups.map((startup) =>
          startup._id === selectedItem
            ? { ...startup, status: selectedStatus }
            : startup
        )
      );
  
      setStatusDialogOpen(false);
    } catch (error) {
      console.error(`Error changing status:`, error);
    }
  };
  

  const handleStatusToggle = (id, currentStatus) => {
    setSelectedItem(id);
    setSelectedStatus(currentStatus === "Active" ? "Hold" : "Active");
    setStatusDialogOpen(true);
  };

  const handleDownloadPitchDeck = (pitchDeck) => {
    if (pitchDeck) window.open(`${process.env.REACT_APP_API_URL}${pitchDeck}`, "_blank");
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
<Paper
  sx={{
    p: 3,
    mt: 2,
    boxShadow: 3,
    borderRadius: 2,
    height: "calc(100vh - 100px)", // Full height minus navbar/header
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  }}
  className="relative"
>
  {/* Top Controls */}
  <Box
    className="flex flex-col sm:flex-row mb-4 gap-4 items-center justify-between"
    sx={{ flexWrap: "wrap" }}
  >
    <Stack direction="row" spacing={2} flexWrap="wrap">
    <h2 style={{ fontWeight: "bold", fontSize: "24px", marginBottom: "16px" }}>Startup Registration</h2>
      <FormControl sx={{ minWidth: 150 }}>
        
        <InputLabel>Filter By</InputLabel>
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          label="Filter By"
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="startupName">Startup Name</MenuItem>
          <MenuItem value="fullName">Founder Name</MenuItem>
          <MenuItem value="email">Email</MenuItem>
          <MenuItem value="phone">Phone</MenuItem>
          <MenuItem value="industry">Industry</MenuItem>
          <MenuItem value="stage">Stage</MenuItem>
          <MenuItem value="location">Location</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Search"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </Stack>

    <Button
      variant="contained"
      color="success"
      onClick={handleDownloadExcel}
      sx={{ whiteSpace: "nowrap" }}
    >
      <Download sx={{ mr: 1 }} />
      Download Excel
    </Button>
  </Box>

  {/* Scrollable Table Container */}
  <Box
  sx={{
    position: "relative",
    flexGrow: 1,
    height: "100%", // Full height of parent
    overflow: "hidden", // Prevent outer scroll
  }}
>
  <Box
    sx={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflowY: "auto",
      overflowX: "auto",
      WebkitOverflowScrolling: "touch",
      scrollbarWidth: "thin",
      zIndex: 0, // Ensures this scrollable area is behind the navbar
      "&::-webkit-scrollbar": {
        width: "8px",
        height: "8px",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#cbd5e1",
        borderRadius: "8px",
      },
    }}
  >
    <TableContainer sx={{ minWidth: "1200px" }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            {[
              "Date",
              "Time",
              "Startup Name",
              "Founder Name",
              "Email",
              "Phone",
              "Industry",
              "Stage",
              "Location",
              "Status",
              "Pitch Deck",
              "Actions",
            ].map((header, idx) => (
              <TableCell
                key={idx}
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#f1f5f9",
                  whiteSpace: "nowrap",
                }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {displayedStartups.map((startup) => {
            const dateTime = new Date(startup.createdAt);
            const date = dateTime.toLocaleDateString();
            const time = dateTime.toLocaleTimeString();
            return (
              <TableRow
                key={startup._id}
                hover
                sx={{
                  "&:nth-of-type(odd)": {
                    backgroundColor: "#f9fafb",
                  },
                }}
              >
                <TableCell>{date}</TableCell>
                <TableCell>{time}</TableCell>
                <TableCell>{startup.startupName}</TableCell>
                <TableCell>{startup.fullName}</TableCell>
                <TableCell>{startup.email}</TableCell>
                <TableCell>{startup.phone}</TableCell>
                <TableCell>{startup.industry}</TableCell>
                <TableCell>{startup.stage}</TableCell>
                <TableCell>{startup.location}</TableCell>
                <TableCell>
                  <Chip
                    label={startup.status || "Unknown"}
                    color={
                      startup.status === "Active"
                        ? "primary"
                        : startup.status === "Hold"
                        ? "warning"
                        : "default"
                    }
                  />
                </TableCell>
                <TableCell>
                  {startup.pitchDeck ? (
                    <Button
                      variant="outlined"
                      startIcon={<FaEye />}
                      onClick={() =>
                        handleDownloadPitchDeck(startup.pitchDeck)
                      }
                    >
                      View
                    </Button>
                  ) : (
                    <Chip label="Unavailable" color="warning" />
                  )}
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Button
                      variant="outlined"
                      color={
                        startup.status === "Active" ? "warning" : "success"
                      }
                      startIcon={<Autorenew />}
                      onClick={() =>
                        handleStatusToggle(startup._id, startup.status)
                      }
                    >
                      {startup.status === "Active" ? "Hold" : "Activate"}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => {
                        setSelectedItem(startup._id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
</Box>


  {/* Pagination Controls */}
  <Box className="flex justify-between items-center mt-4">
    <Button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage(currentPage - 1)}
    >
      Previous
    </Button>
    <span>
      Page {currentPage} of {totalPages}
    </span>
    <Button
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage(currentPage + 1)}
    >
      Next
    </Button>
  </Box>

  {/* Delete Dialog */}
  <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
    <DialogTitle>Confirm Deletion</DialogTitle>
    <DialogContent>
      Are you sure you want to delete this record?
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
      <Button color="error" variant="contained" onClick={handleDeleteConfirm}>
        Yes, Delete
      </Button>
    </DialogActions>
  </Dialog>

  {/* Status Toggle Dialog */}
  <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)}>
    <DialogTitle>Change Status</DialogTitle>
    <DialogContent>
      Are you sure you want to change the status to{" "}
      <strong>{selectedStatus}</strong>?
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
      <Button
        color={selectedStatus === "Hold" ? "warning" : "success"}
        variant="contained"
        onClick={handleStatusConfirm}
      >
        Yes, Change
      </Button>
    </DialogActions>
  </Dialog>
</Paper>


  );
};

export default StartupTable;
