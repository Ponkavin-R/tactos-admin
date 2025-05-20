import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Typography, Button, Grid, TextField, Select, MenuItem,Paper} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

const STATUS_COLORS = {
  Approved: "bg-green-200 text-green-800",
  Rejected: "bg-red-200 text-red-800",
  Pending: "bg-yellow-200 text-yellow-800",
};

const filterOptions = [
  { label: "All", value: "" },
  { label: "Full Name", value: "fullName" },
  { label: "Email", value: "email" },
  { label: "Phone", value: "phone" },
  { label: "Location", value: "location" },
  { label: "Business Name", value: "businessName" },
  { label: "Industry", value: "industry" },
  { label: "Stage", value: "businessStage" },
  { label: "Website", value: "website" },
];
const initialFilters = {
  fullName: "",
  email: "",
  phone: "",
  businessName: "",
  industry: "",
  status: "",
  startDate: "",
  endDate: "",
};

export default function BusinessConsultation() {
  const [businesses, setBusinesses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [loading, setLoading] = useState(false);
  const [showDescriptionPopup, setShowDescriptionPopup] = useState(false);
const [selectedDescription, setSelectedDescription] = useState("");
const [editingStatusId, setEditingStatusId] = useState(null);
const [newStatus, setNewStatus] = useState("");

const handleStatusChange = async (id, status) => {
  try {
    // Update on the backend
    await axios.put(`${process.env.REACT_APP_API_URL}/api/businessconsultation/${id}`, { status });

    // Update the local state for immediate UI feedback
    setBusinesses((prevBusinesses) =>
      prevBusinesses.map((item) =>
        item._id === id ? { ...item, status } : item
      )
    );

    setEditingStatusId(null);
  } catch (error) {
    console.error("Failed to update status", error);
  }
};



  // Fetch data
  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/businessesconsulation`
      );
      setBusinesses(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setBusinesses([]);
    }
    setLoading(false);
  };
  

  // Delete business
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/businessesconsultation/${selectedItem}`
      );
      setDeleteDialogOpen(false);
      setSelectedItem(null);
      fetchBusinesses();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Export to Excel
  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(businesses);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Consultation");
    XLSX.writeFile(workbook, "Business_Consultation_List.xlsx");
  };

  // Filtering logic
  // Clear all filters
  const handleClearFilters = () => {
    setFilter(initialFilters);
  };

  // Filter data based on all individual filters
    const filteredBusinesses = businesses.filter((item) => {
      // Check each filter if present
      if (
        filter.fullName &&
        !item.fullName?.toLowerCase().includes(filter.fullName.toLowerCase())
      )
        return false;

      if (
        filter.email &&
        !item.email?.toLowerCase().includes(filter.email.toLowerCase())
      )
        return false;

      if (
        filter.phone &&
        !item.phone?.toLowerCase().includes(filter.phone.toLowerCase())
      )
        return false;
          // ✅ Location filter
  if (
    filter.location &&
    item.location?.toLowerCase() !== filter.location.toLowerCase()
  )
    return false;

      if (
        filter.businessName &&
        !item.businessName
          ?.toLowerCase()
          .includes(filter.businessName.toLowerCase())
      )
        return false;

      if (
        filter.industry &&
        !item.industry?.toLowerCase().includes(filter.industry.toLowerCase())
      )
        return false;

      if (filter.status && item.status !== filter.status) return false;

      if (filter.startDate) {
        const itemDate = new Date(item.registeredAt);
        const start = new Date(filter.startDate);
        if (itemDate < start) return false;
      }

      if (filter.endDate) {
        const itemDate = new Date(item.registeredAt);
        const end = new Date(filter.endDate);
        if (itemDate > end) return false;
      }

      return true;
    });

  const totalPages = Math.ceil(filteredBusinesses.length / recordsPerPage);
  const paginated = filteredBusinesses.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const formatDateTime = (timestamp) => {
    if (!timestamp) return "—";
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };
  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    hover: { scale: 1.02, boxShadow: "0 4px 14px rgba(0,0,0,0.1)" },
  };
  const paginationVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  // Remove chip filter
  const removeFilterChip = () => {
    setFilter("");
    setSearchTerm("");
  };
  // Tamil Nadu districts array
const tamilNaduDistricts = [
  "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore",
  "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram",
  "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai",
  "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai",
  "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi",
  "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli",
  "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur",
  "Vellore", "Viluppuram", "Virudhunagar"
];
const STATUS_COLORS = {
  new: "bg-blue-100 text-blue-800",
  Processing: "bg-yellow-100 text-yellow-800",
  Accepted: "bg-green-100 text-green-800",
};


  return (
    <Paper sx={{ p: 3, borderRadius: 4 }}>
      <motion.section
        className=" mx-auto bg-white/30 backdrop-blur-lg rounded-3xl p-6 shadow-lg"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
{/* Heading and Download button */}
<>
<Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={600}>
          Business Consultation List
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<DownloadIcon />}
          onClick={handleDownloadExcel}
        >
          Export Excel
        </Button>
      </Box>

      {/* Filters */}


<Grid container spacing={2} mb={3}>
  {[
    { label: "Full Name", name: "fullName" },
    { label: "Email", name: "email" },
    { label: "Phone", name: "phone" },
    { label: "Business Name", name: "businessName" },
    { label: "District", name: "location" },
  ].map(({ label, name }) => (
    <Grid item xs={8} sm={5} md={2.4} key={name}>
      {name === "location" ? (
        <TextField
          size="small"
          select
          label={label}
          variant="outlined"
          fullWidth
          value={filter[name]}
          onChange={(e) =>
            setFilter((prev) => ({
              ...prev,
              [name]: e.target.value,
            }))
          }
        >
          <MenuItem value="">All</MenuItem>
          {tamilNaduDistricts.map((district) => (
            <MenuItem key={district} value={district}>
              {district}
            </MenuItem>
          ))}
        </TextField>
      ) : (
        <TextField
          size="small"
          label={label}
          variant="outlined"
          fullWidth
          value={filter[name]}
          onChange={(e) =>
            setFilter((prev) => ({
              ...prev,
              [name]: e.target.value,
            }))
          }
        />
      )}
    </Grid>
  ))}


          {/* Status filter */}
          <Grid item xs={12} md={1.7}>
  <Select
    size="small"
    fullWidth
    displayEmpty
    value={filter.status ?? ""}
    onChange={(e) => setFilter({ ...filter, status: e.target.value })}
    renderValue={(selected) => {
      if (!selected) {
        return "All Status";
      }
      return selected;
    }}
  >
    <MenuItem value="">All Status</MenuItem>
    <MenuItem value="new">New</MenuItem>
    <MenuItem value="Processing">Processing</MenuItem>
    <MenuItem value="Accepted">Accepted</MenuItem>
  </Select>
</Grid>


          {/* Start Date & Time */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Start Date & Time"
              type="datetime-local"
              size="small"
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={filter.startDate}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, startDate: e.target.value }))
              }
            />
          </Grid>

          {/* End Date & Time */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="End Date & Time"
              type="datetime-local"
              size="small"
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={filter.endDate}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, endDate: e.target.value }))
              }
            />
          </Grid>

          {/* Clear filters button */}
          <Grid item xs={12} sm={6} md={2}>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
             
onClick={handleClearFilters}
sx={{ height: "100%" }}
>
Clear Filters
</Button>
</Grid>
</Grid>
    </>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl shadow-lg bg-white/40 backdrop-blur-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="sticky top-0 bg-white/80 backdrop-blur-md">
              <tr>
                {[
                  "Date & Time",
                  "Full Name",
                  "Email",
                  "Phone",
                  "Distict",
                  "Business Name",
                  "businessDescription",
                  "Website",
                  "Status",
                  "Actions",
                ].map((header) => (
                  <motion.th
                    key={header}
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider select-none"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                  >
                    {header}
                  </motion.th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={12}
                    className="text-center py-16 text-gray-500 italic font-semibold"
                  >
                    Loading...
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={12}
                    className="text-center py-16 text-gray-400 italic font-semibold"
                  >
                    No records found.
                  </td>
                </tr>
              ) : (
                paginated.map((item) => (
                  <motion.tr
                    key={item._id}
                    className="cursor-pointer even:bg-white/70 odd:bg-white/50 hover:bg-blue-100 rounded-xl"
                    initial="hidden"
                    animate="visible"
                    variants={rowVariants}
                    whileHover="hover"
                    transition={{ duration: 0.25 }}
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 font-medium">
                      {formatDateTime(item.createdAt || item.updatedAt)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 font-medium max-w-[120px] truncate">
                      {item.fullName || "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-700 max-w-[180px] truncate">
                      <a
                        href={`mailto:${item.email}`}
                        className="hover:underline"
                        title={item.email}
                      >
                        {item.email || "—"}
                      </a>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 max-w-[120px] truncate">
                      {item.phone || "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 max-w-[120px] truncate">
                      {item.location || "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 max-w-[140px] truncate">
                      {item.businessName || "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 max-w-[140px] truncate">
  {item.businessDescription ? (
    <>
      {item.businessDescription.length > 20
        ? (
            <>
              {item.businessDescription.slice(0, 20)}...
              <button
                onClick={() => {
                  setSelectedDescription(item.businessDescription);
                  setShowDescriptionPopup(true);
                }}
                className="ml-1 text-blue-600 underline hover:text-blue-800"
              >
                Read More
              </button>
            </>
          )
        : item.businessDescription}
    </>
  ) : (
    "—"
  )}
</td>


                   
<td className="px-4 py-3 whitespace-nowrap text-sm text-blue-700 max-w-[140px] truncate">
{item.website ? (
<a href={item.website} target="_blank" rel="noopener noreferrer" className="hover:underline" title={item.website} >
Website
</a>
) : (
"—"
)}
</td>

<td className="px-4 py-3 whitespace-nowrap text-sm">
  {editingStatusId === item._id ? (
    <div className="flex items-center gap-2">
      <select
        className="border rounded px-2 py-1 text-sm bg-gray-100"
        value={newStatus}
        onChange={(e) => setNewStatus(e.target.value)}
      >
        {["new", "Processing", "Accepted"].map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <button
        className="text-green-600 hover:text-green-800"
        onClick={() => handleStatusChange(item._id, newStatus)}
        disabled={!newStatus}
      >
        ✅
      </button>
      <button
        className="text-red-600 hover:text-red-800"
        onClick={() => setEditingStatusId(null)}
      >
        ❌
      </button>
    </div>
  ) : (
    <button
      onClick={() => {
        setEditingStatusId(item._id);
        setNewStatus(item.status);
      }}
      className={`inline-block rounded-full px-3 py-1 font-semibold select-none cursor-pointer ${
        STATUS_COLORS[item.status] || "bg-gray-200 text-gray-700"
      }`}
    >
      {item.status || "Pending"}
    </button>
  )}
</td>


<td className="px-4 py-3 whitespace-nowrap text-sm text-center">
  <button
    onClick={() => {
      setSelectedItem(item._id);
      setDeleteDialogOpen(true);
    }}
    className="bg-red-600 text-white hover:bg-red-700 transition rounded-md px-3 py-1"
    aria-label={`Cancel record of ${item.fullName}`}
    title={`Cancel ${item.fullName}`}
  >
    Cancel
  </button>
</td>

</motion.tr>
))
)}
</tbody>
</table>
</div>
    {/* Pagination */}
    <motion.nav
      className="flex justify-center items-center mt-6 space-x-2"
      initial="initial"
      animate="animate"
      variants={paginationVariants}
      transition={{ duration: 0.4 }}
      role="navigation"
      aria-label="Pagination Navigation"
    >
      <button
        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        className={`rounded-md px-3 py-1 font-semibold select-none transition ${
          currentPage === 1
            ? "cursor-not-allowed text-gray-400"
            : "hover:bg-blue-300 bg-blue-200 text-blue-900"
        }`}
        aria-label="Previous page"
      >
        &lt;
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`rounded-md px-3 py-1 font-semibold select-none transition ${
            currentPage === page
              ? "bg-blue-600 text-white shadow-md"
              : "hover:bg-blue-300 bg-blue-200 text-blue-900"
          }`}
          aria-current={currentPage === page ? "page" : undefined}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages || totalPages === 0}
        className={`rounded-md px-3 py-1 font-semibold select-none transition ${
          currentPage === totalPages || totalPages === 0
            ? "cursor-not-allowed text-gray-400"
            : "hover:bg-blue-300 bg-blue-200 text-blue-900"
        }`}
        aria-label="Next page"
      >
        &gt;
      </button>
    </motion.nav>

    {/* Delete Confirmation Modal */}
    <AnimatePresence>
      {deleteDialogOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal="true"
          role="dialog"
          aria-labelledby="modal-title"
        >
          <motion.div
            className="bg-white rounded-3xl max-w-md w-full p-6 mx-4 shadow-lg"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h2
              id="modal-title"
              className="text-xl font-bold text-gray-900 mb-4"
            >
              Confirm Deletion
            </h2>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete this consultation record? This
              action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setSelectedItem(null);
                }}
                className="rounded-full border border-gray-300 px-5 py-2 text-gray-700 font-semibold hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="rounded-full bg-red-600 px-5 py-2 text-white font-semibold hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    <AnimatePresence>
  {showDescriptionPopup && (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        <h2 className="text-lg font-semibold mb-4">Business Description</h2>
        <p className="text-gray-700 whitespace-pre-wrap">{selectedDescription}</p>
        <div className="mt-6 text-right">
          <button
            onClick={() => setShowDescriptionPopup(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

  </motion.section>
</Paper>
);
}
