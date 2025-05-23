// RegistrationTable.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import { Popover, IconButton, TextField, Button,Box, Typography, Grid } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";

const RegistrationTable = () => {
  const { eventId } = useParams();
  const [registrations, setRegistrations] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    phone: "",
    startDate: "",
    endDate: ""
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/eventregistrations/${eventId}`);
        setRegistrations(res.data);
      } catch (err) {
        console.error("Failed to fetch registrations:", err);
      }
    };
    fetchRegistrations();
  }, [eventId]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/eventregistrations/${id}`);
      setRegistrations(registrations.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const openPopover = async (event, registration) => {
    setAnchorEl(event.currentTarget);
  
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/events/${registration.eventId}`);
      setSelectedEvent(response.data);
    } catch (err) {
      console.error("Failed to fetch event details:", err);
      setSelectedEvent({ name: "Not found" });
    }
  };
  

  const closePopover = () => {
    setAnchorEl(null);
    setSelectedEvent(null);
  };

  const filteredRegistrations = registrations.filter((reg) => {
    const date = new Date(reg.createdAt);
    const start = filters.startDate ? new Date(filters.startDate) : null;
    const end = filters.endDate ? new Date(filters.endDate) : null;

    return (
      reg.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      reg.email.toLowerCase().includes(filters.email.toLowerCase()) &&
      reg.phone.includes(filters.phone) &&
      (!start || date >= start) &&
      (!end || date <= end)
    );
  });

  return (
    <div className="min-h-screen bg-white p-6">
      <h2 className="text-3xl font-bold mb-6 text-indigo-600">Event Registrations</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        <TextField label="Name" size="small" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
        <TextField label="Email" size="small" value={filters.email} onChange={(e) => setFilters({ ...filters, email: e.target.value })} />
        <TextField label="Phone" size="small" value={filters.phone} onChange={(e) => setFilters({ ...filters, phone: e.target.value })} />
        <TextField type="date" size="small" label="Start Date" InputLabelProps={{ shrink: true }} value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} />
        <TextField type="date" size="small" label="End Date" InputLabelProps={{ shrink: true }} value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} />
      </div>

      <div className="bg-gray-50 shadow-xl rounded-xl p-4 overflow-auto">
        <table className="min-w-full table-auto text-left">
          <thead>
            <tr className="bg-indigo-100 text-indigo-800">
              <th className="p-3 font-semibold">Registered at</th>
              <th className="p-3 font-semibold">Event Name</th>
              <th className="p-3 font-semibold">Name</th>
              <th className="p-3 font-semibold">Email</th>
              <th className="p-3 font-semibold">Phone</th>
              <th className="p-3 font-semibold">Event Type</th>
              <th className="p-3 font-semibold">Action</th>
            </tr>
          </thead>
          <AnimatePresence>
            <tbody>
              {filteredRegistrations.map((reg) => (
                <motion.tr
                  key={reg._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="border-b hover:bg-indigo-50"
                >
                  <td className="p-3">{new Date(reg.createdAt).toLocaleString()}</td>
                  <td className="p-3 flex items-center gap-1">
                    {reg.eventName}
                    <IconButton size="small" onClick={(e) => openPopover(e, reg)}>

                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </td>
                  <td className="p-3">{reg.name}</td>
                  <td className="p-3">{reg.email}</td>
                  <td className="p-3">{reg.phone}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${reg.eventType === "Free" ? "bg-green-200 text-green-800" : "bg-yellow-200 text-yellow-800"}`}>
                      {reg.eventType}
                    </span>
                  </td>
                  <td className="p-3">
                    <IconButton color="error" onClick={() => handleDelete(reg._id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </AnimatePresence>
        </table>
        {filteredRegistrations.length === 0 && (
          <p className="text-center text-gray-500 py-4">No registrations found.</p>
        )}
      </div>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={closePopover}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box
      p={3}
      sx={{
        maxWidth: 700,
        bgcolor: '#f9fafb',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Event Details
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Name"
            value={selectedEvent?.name || ''}
            variant="outlined"
            size="small"
            InputProps={{ readOnly: true }}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Title"
            value={selectedEvent?.title || ''}
            variant="outlined"
            size="small"
            InputProps={{ readOnly: true }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Description"
            value={selectedEvent?.description || ''}
            variant="outlined"
            size="small"
            multiline
            rows={3}
            InputProps={{ readOnly: true }}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Type"
            value={selectedEvent?.type || ''}
            variant="outlined"
            size="small"
            InputProps={{ readOnly: true }}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Status"
            value={selectedEvent?.status || ''}
            variant="outlined"
            size="small"
            InputProps={{ readOnly: true }}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Amount"
            value={selectedEvent?.amount || 'Free'}
            variant="outlined"
            size="small"
            InputProps={{ readOnly: true }}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Payment Mode"
            value={selectedEvent?.mode || ''}
            variant="outlined"
            size="small"
            InputProps={{ readOnly: true }}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Date"
            value={selectedEvent?.date || ''}
            variant="outlined"
            size="small"
            InputProps={{ readOnly: true }}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Time"
            value={selectedEvent?.time || ''}
            variant="outlined"
            size="small"
            InputProps={{ readOnly: true }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Location"
            value={selectedEvent?.location || 'Online'}
            variant="outlined"
            size="small"
            InputProps={{ readOnly: true }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Link"
            value={selectedEvent?.link || ''}
            variant="outlined"
            size="small"
            InputProps={{ readOnly: true }}
            fullWidth
          />
        </Grid>
      </Grid>
    </Box>
      </Popover>
    </div>
  );
};

export default RegistrationTable;
