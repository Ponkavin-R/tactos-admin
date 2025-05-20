import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";
const STATUS_COLORS = {
  new: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  accept: "bg-green-100 text-green-800",
};


const Filters = ({ filters, setFilters, clearFilters }) => (
  <div className="flex flex-wrap gap-3 mb-4">
    <input
      type="text"
      placeholder="Search by name/email/phone"
      value={filters.search}
      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
      className="p-2 border rounded shadow"
    />

    <select
      value={filters.employmentStatus}
      onChange={(e) => setFilters({ ...filters, employmentStatus: e.target.value })}
      className="p-2 border rounded shadow"
    >
      <option value="">Employment Status</option>
      <option value="Employed">Employed</option>
      <option value="Unemployed">Unemployed</option>
      <option value="Studying">Studying</option>
    </select>

    <select
      value={filters.status}
      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
      className="p-2 border rounded shadow"
    >
      <option value="">Status</option>
      <option value="new">New</option>
      <option value="processing">Processing</option>
      <option value="accept">Accepted</option>
    </select>

    <button
      onClick={clearFilters}
      className="bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 shadow"
    >
      Clear Filters
    </button>
  </div>
);

const BusinessesTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    employmentStatus: "",
    status: ""
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [editingStatusId, setEditingStatusId] = useState(null);
const [newStatus, setNewStatus] = useState("");

  const perPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/businesses`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/businesses/${id}`, { status: newStatus });
      setData((prev) => prev.map((item) => (item._id === id ? { ...item, status: newStatus } : item)));
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/businesses/${id}`);
      setData((prev) => prev.filter((item) => item._id !== id));
      setConfirmDeleteId(null);
    } catch (error) {
      console.error("Failed to delete record", error);
    }
  };

  const filteredData = data.filter((item) => {
    const matchSearch =
      item.fullName.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.phoneNumber.includes(filters.search);

    const matchEmployment =
      !filters.employmentStatus || item.employmentStatus === filters.employmentStatus;

    const matchStatus = !filters.status || item.status === filters.status;

    return matchSearch && matchEmployment && matchStatus;
  });

  const paginatedData = filteredData.slice((currentPage - 1) * perPage, currentPage * perPage);
  const totalPages = Math.ceil(filteredData.length / perPage);

  const clearFilters = () => setFilters({ search: "", employmentStatus: "", status: "" });

  return (
    <div className="p-4">
      <h1 className="text-3xl font-extrabold mb-6 text-indigo-600">Business Applications</h1>

      <Filters filters={filters} setFilters={setFilters} clearFilters={clearFilters} />

      {loading ? (
        <p className="text-center py-10">Loading...</p>
      ) : filteredData.length === 0 ? (
        <p className="text-center py-10">No matching records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 bg-white">
            <thead className="bg-indigo-50">
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Time</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Employment</th>
                <th className="px-4 py-2">LinkedIn</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {paginatedData.map((item) => (
                  <motion.tr
                    key={item._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-2">{moment(item.date).format("DD-MM-YYYY")}</td>
                    <td className="px-4 py-2">{moment(item.date).format("hh:mm A")}</td>
                    <td className="px-4 py-2 text-purple-700 font-medium">{item.fullName}</td>
                    <td className="px-4 py-2 text-blue-600">{item.email}</td>
                    <td className="px-4 py-2 text-pink-600">{item.phoneNumber}</td>
                    <td className="px-4 py-2 text-teal-600">{item.employmentStatus}</td>
                    <td className="px-4 py-2">
                      <a href={item.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                        LinkedIn
                      </a>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
  {editingStatusId === item._id ? (
    <div className="flex items-center gap-2">
      <select
        className="border rounded px-2 py-1 text-sm bg-gray-100"
        value={newStatus}
        onChange={(e) => setNewStatus(e.target.value)}
      >
        {["new", "processing", "accept",].map((status) => (
          <option key={status} value={status}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </option>
        ))}
      </select>
      <button
        className="text-green-600 hover:text-green-800"
        onClick={() => {
          handleStatusChange(item._id, newStatus);
          setEditingStatusId(null);
        }}
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

                    <td className="px-4 py-2">
                      <button
                        onClick={() => setConfirmDeleteId(item._id)}
                        className="bg-red-600 text-white hover:bg-red-700 transition rounded-md px-3 py-1"
                      >
                        Cancel
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}

      {/* Confirm Delete Popup */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="mb-4 text-lg font-semibold">Are you sure you want to delete this record?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {filteredData.length > perPage && (
        <div className="flex justify-center gap-4 mt-4">
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BusinessesTable;