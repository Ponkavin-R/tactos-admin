import React, { useEffect, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import moment from "moment";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Popover,
  Grid,
  TextField,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import InfoIcon from "@mui/icons-material/Info";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const tamilNaduDistricts = ["Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", /* ... */ "Virudhunagar"];

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [startups, setStartups] = useState({});
  const [filters, setFilters] = useState({ role: "", level: "", district: "", startDate: "", endDate: "" });
  const [grouped, setGrouped] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const jobRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/jobs`);
      const startupRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/startups`);
      const startupMap = {};
      startupRes.data.forEach((s) => { startupMap[s._id] = s; });
      setJobs(jobRes.data);
      setStartups(startupMap);
    };
    fetchData();
  }, []);

  const handleDownloadExcel = () => {
    const excelData = jobs.map((job) => ({
      Startup: startups[job.userId]?.startupName || "Startup",
      Position: `${job.position} (${job.level})`,
      District: job.district,
      Salary: job.salary,
      Experience: `${job.experience} yrs`,
      PostedAt: moment(job.postedAt).format("YYYY-MM-DD"),
    }));
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Jobs");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Jobs.xlsx");
  };

  const filteredJobs = jobs.filter((job) => {
    const postedAt = moment(job.postedAt);
    const start = filters.startDate ? moment(filters.startDate) : null;
    const end = filters.endDate ? moment(filters.endDate) : null;
    return (
      (!filters.role || job.role.toLowerCase().includes(filters.role.toLowerCase())) &&
      (!filters.level || job.level.toLowerCase().includes(filters.level.toLowerCase())) &&
      (!filters.district || job.district === filters.district) &&
      (!start || postedAt.isSameOrAfter(start)) &&
      (!end || postedAt.isSameOrBefore(end))
    );
  });

  const groupedByStartup = filteredJobs.reduce((acc, job) => {
    const startupName = startups[job.userId]?.startupName || "Unknown";
    acc[startupName] = acc[startupName] || [];
    acc[startupName].push(job);
    return acc;
  }, {});

  const handleToggleGroup = (startupName) => {
    setExpandedGroups((prev) => ({ ...prev, [startupName]: !prev[startupName] }));
  };

  const handleMenuOpen = (event) => setMenuAnchorEl(event.currentTarget);
  const handleMenuClose = () => setMenuAnchorEl(null);
  const handleGroupingToggle = () => { setGrouped(true); handleMenuClose(); };
  const handleClearGrouping = () => { setGrouped(false); handleMenuClose(); };
  const handleInfoClick = (event, startup) => { setPopoverAnchorEl(event.currentTarget); setSelectedStartup(startup); };
  const handlePopoverClose = () => { setPopoverAnchorEl(null); setSelectedStartup(null); };

  return (
    <div className="p-6 bg-white min-h-screen text-black">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={600} color="primary">Startup Job Listings</Typography>
        <Button variant="contained" color="success" startIcon={<DownloadIcon />} onClick={handleDownloadExcel}>
          Download Excel
        </Button>
      </Box>

      <Box width="100%" px={2} mb={4}>
  <Grid container spacing={3}>
    <Grid item xs={12} md={3}>
      <TextField
        fullWidth
        label="Role"
        variant="outlined"
        value={filters.role}
        onChange={(e) => setFilters({ ...filters, role: e.target.value })}
      />
    </Grid>

    <Grid item xs={12} md={4.5}>
    <FormControl fullWidth sx={{ minWidth: 240 }}>
  <InputLabel id="level-label">Level</InputLabel>
  <Select
    labelId="level-label"
    value={filters.level}
    label="Level"
    onChange={(e) => setFilters({ ...filters, level: e.target.value })}
    renderValue={(selected) => (selected === "" ? "All" : selected)}
  >
    <MenuItem value="">All</MenuItem>
    <MenuItem value="Senior">Senior</MenuItem>
    <MenuItem value="Intermediate">Intermediate</MenuItem>
  </Select>
</FormControl>
    </Grid>

    <Grid item xs={12} md={4.5}>

    <FormControl fullWidth sx={{ minWidth: 240 }}>
  <InputLabel id="district-label">District</InputLabel>
  <Select
    labelId="district-label"
    value={filters.district}
    label="District"
    onChange={(e) => setFilters({ ...filters, district: e.target.value })}
    renderValue={(selected) => (selected === "" ? "All" : selected)}
  >
    <MenuItem value="">All</MenuItem>
    {tamilNaduDistricts.map((dist) => (
      <MenuItem key={dist} value={dist}>
        {dist}
      </MenuItem>
    ))}
  </Select>
</FormControl>
    </Grid>

    <Grid item xs={12} md={4}>
      <TextField
        fullWidth
        type="date"
        label="Start Date"
        InputLabelProps={{ shrink: true }}
        onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
      />
    </Grid>

    <Grid item xs={12} md={4}>
      <TextField
        fullWidth
        type="date"
        label="End Date"
        InputLabelProps={{ shrink: true }}
        onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
      />
    </Grid>

    <Grid item xs={12} md={4}>
      <Button
        fullWidth
        variant="outlined"
        color="error"
        onClick={() =>
          setFilters({
            role: '',
            level: '',
            district: '',
            startDate: '',
            endDate: '',
          })
        }
      >
        Clear Filters
      </Button>
    </Grid>
  </Grid>
</Box>





      <table className="w-full border rounded-lg overflow-hidden">
        <thead className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
          <tr>
            <th className="py-3 px-4 text-left">Startup <IconButton onClick={handleMenuOpen} size="small" sx={{ color: "white", ml: 1 }}><MoreVertIcon /></IconButton><Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}><MenuItem onClick={handleGroupingToggle}>Group by Startup</MenuItem><MenuItem onClick={handleClearGrouping}>Ungroup</MenuItem></Menu></th>
            <th className="py-3 px-4 text-left">Position</th>
            <th className="py-3 px-4 text-left">Role</th>
            <th className="py-3 px-4 text-left">District</th>
            <th className="py-3 px-4 text-left">Salary</th>
            <th className="py-3 px-4 text-left">Experience</th>
            <th className="py-3 px-4 text-left">Posted</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {(grouped ? Object.entries(groupedByStartup) : [["All", filteredJobs]]).map(([startupName, groupJobs]) => (
              <React.Fragment key={startupName}>
                {grouped && (
<tr onClick={() => handleToggleGroup(startupName)} className="cursor-pointer">
  <td colSpan={7} className="py-2 px-4 font-bold bg-gray-100">
    <div className="flex justify-between items-center">
      <span>{startupName} ({groupJobs.length})</span>
      {expandedGroups[startupName] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
    </div>
  </td>
</tr>

               
                )}
                {(!grouped || expandedGroups[startupName]) && groupJobs.map((job, index) => (
                  <motion.tr
                    key={job._id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    whileHover={{ scale: 1.02, backgroundColor: "#f0f9ff" }}
                    transition={{ duration: 0.3 }}
                    className="border-b"
                  >
<td className="py-3 px-4 flex items-center justify-between">
  <span>{startups[job.userId]?.startupName || "Unknown"}</span>
  <IconButton size="small" onClick={(e) => handleInfoClick(e, startups[job.userId])}>
    <InfoIcon />
  </IconButton>
</td>

                    <td className="py-3 px-4">{job.position} ({job.level})</td>
                    <td className="py-3 px-4">{job.role}</td>
                    <td className="py-3 px-4">{job.district}</td>
                    <td className="py-3 px-4">{job.salary}</td>
                    <td className="py-3 px-4">{job.experience} yrs</td>
                    <td className="py-3 px-4">{moment(job.postedAt).format("YYYY-MM-DD")}</td>
                    <td className="py-3 px-4"><Button variant="outlined" color="primary" size="small">View</Button></td>
                  </motion.tr>
                ))}
              </React.Fragment>
            ))}
          </AnimatePresence>
        </tbody>
      </table>

      <Popover open={Boolean(popoverAnchorEl)} anchorEl={popoverAnchorEl} onClose={handlePopoverClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'left' }}>
      <Box
  p={3}
  sx={{
    maxWidth: 700,
    bgcolor: '#f9fafb',
    borderRadius: 2,
    boxShadow: 3,
    mx: 'auto',
  }}
>
  <Typography variant="h6" gutterBottom>
    {selectedStartup?.startupName || 'Startup Details'}
  </Typography>
  
  <Grid container spacing={2}>
    {/* Row 1 */}
    <Grid item xs={6}>
      <TextField
        fullWidth
        label="Full Name"
        value={selectedStartup?.fullName || ''}
        variant="outlined"
        size="small"
        InputProps={{ readOnly: true }}
      />
    </Grid>
    <Grid item xs={6}>
      <TextField
        fullWidth
        label="Email"
        value={selectedStartup?.email || ''}
        variant="outlined"
        size="small"
        InputProps={{ readOnly: true }}
      />
    </Grid>
    <Grid item xs={6}>
      <TextField
        fullWidth
        label="Phone"
        value={selectedStartup?.phone || ''}
        variant="outlined"
        size="small"
        InputProps={{ readOnly: true }}
      />
    </Grid>
    

    {/* Row 2 */}
    <Grid item xs={6}>
      <TextField
        fullWidth
        label="Startup Name"
        value={selectedStartup?.startupName || ''}
        variant="outlined"
        size="small"
        InputProps={{ readOnly: true }}
      />
    </Grid>
    <Grid item xs={6}>
      <TextField
        fullWidth
        label="Industry"
        value={selectedStartup?.industry || ''}
        variant="outlined"
        size="small"
        InputProps={{ readOnly: true }}
      />
    </Grid>
    <Grid item xs={6}>
      <TextField
        fullWidth
        label="Stage"
        value={selectedStartup?.stage || ''}
        variant="outlined"
        size="small"
        InputProps={{ readOnly: true }}
      />
    </Grid>
    <Grid item xs={6}>
      <TextField
        fullWidth
        label="Location"
        value={selectedStartup?.location || ''}
        variant="outlined"
        size="small"
        InputProps={{ readOnly: true }}
      />
    </Grid>
    <Grid item xs={6}>
      <TextField
        fullWidth
        label="Incubation"
        value={selectedStartup?.incubation || ''}
        variant="outlined"
        size="small"
        InputProps={{ readOnly: true }}
      />
    </Grid>
    <Grid item xs={6}>
      <TextField
        fullWidth
        label="Status"
        value={selectedStartup?.status || ''}
        variant="outlined"
        size="small"
        InputProps={{ readOnly: true }}
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        fullWidth
        label="Created At"
        value={selectedStartup?.createdAt ? new Date(selectedStartup.createdAt).toLocaleString() : ''}
        variant="outlined"
        size="small"
        InputProps={{ readOnly: true }}
      />
    </Grid>
  </Grid>
</Box>
      </Popover>
    </div>
  );
};

export default JobList;
