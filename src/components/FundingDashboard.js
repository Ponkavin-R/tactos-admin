import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes, FaFacebook, FaWhatsapp, FaRegCopy } from 'react-icons/fa';
import { motion, AnimatePresence } from "framer-motion";
const FundingDashboard = () => {
  const [fundings, setFundings] = useState([]); // your list of funding objects

  const [filteredFundings, setFilteredFundings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [selectedFunding, setSelectedFunding] = useState(null);
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [isEditingAmount, setIsEditingAmount] = useState(false);
const [newAmountRaised, setNewAmountRaised] = useState(selectedFunding?.amountRaised || 0);

  const [showCancelPopup, setShowCancelPopup] = useState(null); // holds the funding ID to cancel

const [newStatus, setNewStatus] = useState("");

const STATUS_COLORS = {
  waiting: "bg-blue-200 text-blue-800",
  "on hold": "bg-yellow-200 text-yellow-800",
  approved: "bg-green-200 text-green-800",
  Pending: "bg-gray-200 text-gray-700",
};


const handleStatusChange = async (id, status) => {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/fundings/update-status/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    const data = await res.json();

    if (res.ok) {
      // Update local state to reflect status change
      const updatedFundings = fundings.map(f =>
        f._id === id ? { ...f, status } : f
      );
      setFundings(updatedFundings);
      applySearchFilter(searchTerm, updatedFundings);
      setEditingStatusId(null); // close dropdown
      console.log('Status updated:', data);
    } else {
      console.error(data.message);
    }
  } catch (error) {
    console.error('Error updating status:', error);
  }
};




  // Fetch funding data
  useEffect(() => {
    fetchFundings();
  }, []);

  const fetchFundings = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/fundings`);
      const fundingsData = response.data;
  
      // Fetch startup details for each funding's userId in parallel
      const fundingsWithStartup = await Promise.all(
        fundingsData.map(async (funding) => {
          try {
            const startupRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/startups/${funding.userId}`);
            return {
              ...funding,
              startupDetails: startupRes.data,  // attach startup info here
            };
          } catch (err) {
            console.error(`Error fetching startup for userId ${funding.userId}:`, err);
            // Return funding without startupDetails if error
            return funding;
          }
        })
      );
  
      setFundings(fundingsWithStartup);
      setFilteredFundings(fundingsWithStartup);
    } catch (error) {
      console.error('Error fetching fundings:', error);
    }
  };

  const handleUpdateAmount = async () => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/fundings/update-amount/${selectedFunding._id}`, {
        amountRaised: newAmountRaised,
      });
  
      if (response.status === 200) {
        const updatedFundings = fundings.map(f =>
          f._id === selectedFunding._id ? { ...f, amountRaised: newAmountRaised } : f
        );
        setFundings(updatedFundings);
        applySearchFilter(searchTerm, updatedFundings);
        setIsEditingAmount(false);
        alert("Amount updated successfully.");
      }
    } catch (error) {
      console.error("Error updating amountRaised:", error);
      alert("Failed to update amount.");
    }
  };
  
  

  // Handle approve funding
  const handleApprove = async (id) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/fundings/approve/${id}`);
      const updatedFundings = fundings.map(f => f._id === id ? { ...f, status: 'approved' } : f);
      setFundings(updatedFundings);
      applySearchFilter(searchTerm, updatedFundings);
    } catch (error) {
      console.error('Error approving funding:', error);
    }
  };

 // Your handleCancel here
 const handleCancel = async (id) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/fundings/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (response.ok) {
      setFundings(prevFundings => prevFundings.filter(funding => funding._id !== id));
    } else {
      alert(data.message || 'Failed to delete funding');
    }
  } catch (error) {
    console.error('Error deleting funding:', error);
    alert('An error occurred while deleting the funding.');
  }
};
  
  

  // Handle hold funding
  const handleHold = async (id) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/fundings/hold/${id}`);
      const updatedFundings = fundings.map(f => f._id === id ? { ...f, status: 'on hold' } : f);
      setFundings(updatedFundings);
      applySearchFilter(searchTerm, updatedFundings);
    } catch (error) {
      console.error('Error holding funding:', error);
    }
  };

  // Open popup
  const handleView = (funding) => {
    setSelectedFunding(funding);
    setNewAmountRaised(funding.amountRaised || 0);
    setShowPopup(true);
  };

  // Close popup
  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedFunding(null);
  };

  // Handle search filtering
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    applySearchFilter(value, fundings);
  };

  const applySearchFilter = (search, data) => {
    const filtered = data.filter(funding =>
      funding.sector?.toLowerCase().includes(search) ||
      funding.location?.toLowerCase().includes(search) ||
      funding.stage?.toLowerCase().includes(search)
    );
    setFilteredFundings(filtered);
  };

  const [filters, setFilters] = useState({
    sector: "",
    location: "",
    stage: "",
      startDate: "",
  endDate: ""
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ sector: "", location: "", stage: "", startDate: "",
      endDate: "" });
  };

  const filteredRows = filteredFundings.filter((funding) => {
    const createdAt = new Date(funding.createdAt);
    const start = filters.startDate ? new Date(filters.startDate) : null;
    const end = filters.endDate ? new Date(filters.endDate) : null;
  
    return (
      funding.sector.toLowerCase().includes(filters.sector.toLowerCase()) &&
      funding.location.toLowerCase().includes(filters.location.toLowerCase()) &&
      funding.stage.toLowerCase().includes(filters.stage.toLowerCase()) &&
      (!start || createdAt >= start) &&
      (!end || createdAt <= end)
    );
  });
  

  // Function to extract YouTube video ID and create an embed URL
  const getEmbedUrl = (url) => {
    if (!url) return '';
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname === 'youtu.be') {
        return `https://www.youtube.com/embed/${urlObj.pathname.slice(1)}`;
      }
      const videoId = urlObj.searchParams.get('v');
      return `https://www.youtube.com/embed/${videoId}`;
    } catch (error) {
      console.error('Invalid YouTube URL', error);
      return '';
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Funding Dashboard</h1>
{/* Filters */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
  <input
    type="text"
    name="sector"
    value={filters.sector}
    onChange={handleFilterChange}
    placeholder="Sector"
    className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  <input
    type="text"
    name="location"
    value={filters.location}
    onChange={handleFilterChange}
    placeholder="Location"
    className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  <input
    type="text"
    name="stage"
    value={filters.stage}
    onChange={handleFilterChange}
    placeholder="Stage"
    className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  <input
    type="date"
    name="startDate"
    value={filters.startDate}
    onChange={handleFilterChange}
    className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  <input
    type="date"
    name="endDate"
    value={filters.endDate}
    onChange={handleFilterChange}
    className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  <button
    onClick={clearFilters}
    className="bg-red-500 hover:bg-red-600 transition text-white font-medium rounded-md px-4 py-2"
  >
    Clear Filters
  </button>
</div>

{/* Table */}
<div className="overflow-x-auto rounded shadow-md">
  <table className="min-w-full bg-white border border-gray-200">
    <thead className="bg-gray-100 text-gray-700 text-sm font-semibold">
      <tr>
      <th className="py-3 px-4 border-b text-left">CreatedAt</th>
      <th className="py-3 px-4 border-b text-left">Startup Name</th>
        <th className="py-3 px-4 border-b text-left">Logo</th>
        <th className="py-3 px-4 border-b text-left">Sector</th>
        <th className="py-3 px-4 border-b text-left">Stage</th>
        <th className="py-3 px-4 border-b text-left">Description</th>
        <th className="py-3 px-4 border-b text-left">Location</th>
        <th className="py-3 px-4 border-b text-left">Stage</th>
        <th className="py-3 px-4 border-b text-left">Status</th>
        <th className="py-3 px-4 border-b text-center">Actions</th>
      </tr>
    </thead>
    <AnimatePresence component="tbody">
      {filteredRows.length > 0 ? (
        filteredRows.map((funding) => (
          <motion.tr
            key={funding._id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-gray-800 border-b hover:bg-gray-50"
          >
              <td className="py-3 px-4">
  {new Date(funding.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })}
</td>

             <td className="py-3 px-4">{funding.startupDetails?.startupName || "No Name"}</td>
            <td className="py-3 px-4">
              <img
                src={`${process.env.REACT_APP_API_URL}${funding.logoUrl}`}
                alt="Logo"
                className="h-10 w-10 object-cover rounded mx-auto"
              />
            </td>
            <td className="py-3 px-4">{funding.sector}</td>
            <td className="py-3 px-4">{funding.stage}</td>
            <td className="py-3 px-4 text-sm text-gray-600">
              {funding.shortDescription}
            </td>
            <td className="py-3 px-4">{funding.location}</td>
            <td className="py-3 px-4">{funding.stage}</td>

            {/* Status */}
            <td className="py-3 px-4">
            {editingStatusId === funding._id ? (
  <div className="flex items-center gap-2">
    <select
      className="border rounded px-2 py-1 text-sm bg-gray-100 focus:ring-1 focus:ring-blue-400"
      value={newStatus}
      onChange={(e) => setNewStatus(e.target.value)}
    >
      {["waiting", "on hold", "approved"].map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
    <button
      className="text-green-600 hover:text-green-800"
      onClick={() => handleStatusChange(funding._id, newStatus)}
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
      setEditingStatusId(funding._id);
      setNewStatus(funding.status || "waiting");
    }}
    className={`rounded-full px-3 py-1 text-xs font-medium select-none cursor-pointer transition ${
      STATUS_COLORS[funding.status] || "bg-gray-200 text-gray-700"
    }`}
  >
    {funding.status || "Pending"}
  </button>
)}

            </td>

            <td className="py-3 px-4 flex gap-2 justify-center flex-wrap">
  <button
    onClick={() => setShowCancelPopup(funding._id)}
    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition"
  >
    Cancel
  </button>
  <button
    onClick={() => handleView(funding)}
    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition"
  >
    View
  </button>
</td>

          </motion.tr>
        ))
      ) : (
        <motion.tr
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <td colSpan="7" className="p-6 text-gray-500">
            No results found.
          </td>
        </motion.tr>
      )}
    </AnimatePresence>
  </table>
</div>
{showCancelPopup && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
      <h2 className="text-lg font-semibold mb-4">Confirm Cancel</h2>
      <p className="mb-6">Are you sure you want to cancel this item?</p>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => {
            handleCancel(showCancelPopup);
            setShowCancelPopup(null);
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
        >
          Yes, Cancel
        </button>
        <button
          onClick={() => setShowCancelPopup(null)}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
        >
          No
        </button>
      </div>
    </div>
  </div>
)}



      {/* Popup Modal */}
       <AnimatePresence>
        {selectedFunding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center px-4 py-8"
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white w-full max-w-7xl rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] p-8 relative grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <button
                onClick={() => setSelectedFunding(null)}
                className="absolute top-5 right-6 text-gray-600 hover:text-black text-2xl"
              >
                <FaTimes />
              </button>
      
              {/* Left Section: Video + Long Description */}
              <div className="space-y-6">
                <div className="w-full h-64 md:h-[28rem] rounded-lg overflow-hidden">
                  <iframe
                    src={selectedFunding.youtube}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Startup Video"
                  />
                </div>
      
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">About the Startup</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {selectedFunding.longDescription}
                  </p>
                </div>
              </div>
      
              {/* Right Section: Company Info + Stats + Actions */}
              <div className="space-y-6">
                {/* Company Info */}
                <div className="flex flex-col items-center text-center space-y-2">
                  <img
                    src={`${process.env.REACT_APP_API_URL}${selectedFunding.logoUrl}`}
                    alt="Logo"
                    className="w-24 h-24 object-cover rounded-full border shadow"
                  />
                  <h2 className="text-2xl font-bold text-gray-800">{selectedFunding.companyName}</h2>
                  <p className="text-sm text-blue-600 font-medium">{selectedFunding.sector}</p>
                  <p className="text-sm text-gray-600">{selectedFunding.location}</p>
                  <p className="text-sm text-gray-700 italic">{selectedFunding.shortDescription}</p>
                </div>
      
                <hr className="border-t" />
      
                <h4 className="text-2xl font-bold text-blue-950 mb-6 flex items-center gap-2">
         <span>Funding Details</span>
      </h4>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-gray-700 text-sm">
        <div>
          <p className="font-semibold text-gray-600">Amount Seeking</p>
          <p className="text-lg font-medium text-green-700">
            ₹{selectedFunding?.amountSeeking?.toLocaleString?.() || 'N/A'}
          </p>
        </div>
      
        <div>
          <p className="font-semibold text-gray-600">Equity Offered</p>
          <p className="text-lg font-medium">{selectedFunding?.equityOffered ?? 'N/A'}%</p>
        </div>
      
        <div>
          <p className="font-semibold text-gray-600">Valuation</p>
          <p className="text-lg font-medium text-indigo-700">
            ₹{selectedFunding?.valuation?.toLocaleString?.() || 'N/A'}
          </p>
        </div>
      
        <div>
          <p className="font-semibold text-gray-600">Fund Usage</p>
          <p className="text-base">{selectedFunding?.fundUsage ?? 'N/A'}</p>
        </div>
      
        <div>
          <p className="font-semibold text-gray-600">Min Investment</p>
          <p className="text-lg font-medium">
            ₹{selectedFunding?.minimumInvestment?.toLocaleString?.() || 'N/A'}
          </p>
        </div>
      
        <div>
          <p className="font-semibold text-gray-600">Ticket Size</p>
          <p className="text-lg font-medium">
            ₹{selectedFunding?.ticketSize?.toLocaleString?.() || 'N/A'}
          </p>
        </div>
      
        <div className="col-span-1 sm:col-span-2">
          <p className="font-semibold text-gray-600">Role for Investors</p>
          <p className="text-base">{selectedFunding?.roleProvided ?? 'N/A'}</p>
        </div>
      
        {/* Amount Raised & Progress Bar */}
        <div className="col-span-1 sm:col-span-2 mt-4">
          <p className="font-semibold text-gray-600 mb-1">
            Amount Raised:
            <span className="ml-2 font-bold text-green-700">
              ₹{selectedFunding?.amountRaised?.toLocaleString?.() || '0'}
            </span>
          </p>
      
          <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${
                  Math.min(
                    ((selectedFunding?.amountRaised || 0) / (selectedFunding?.amountSeeking || 1)) * 100,
                    100
                  )
                }%`,
              }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
            />
          </div>
      
          <div className="flex items-center justify-between mt-1 text-sm text-gray-500">
          <div>
    {Math.min(
      (((newAmountRaised || 0) / (selectedFunding?.amountSeeking || 1)) * 100).toFixed(2),
      100
    )}% funded
  </div>
  <div>
    ₹{newAmountRaised?.toLocaleString() || 0} of ₹{selectedFunding?.amountSeeking?.toLocaleString() || 0} raised
  </div>

  {!isEditingAmount ? (
    <button
      onClick={() => setIsEditingAmount(true)}
      className="text-blue-600 hover:underline text-xs ml-2"
    >
      Edit
    </button>
  ) : (
    <div className="flex items-center gap-2">
      <input
        type="number"
        value={newAmountRaised}
        onChange={(e) => setNewAmountRaised(Number(e.target.value))}
        className="border border-gray-300 rounded px-2 py-1 text-xs w-24"
      />
<button
  onClick={async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/update-amount/${selectedFunding._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amountRaised: newAmountRaised }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        // Update local state to reflect the change
        const updatedFundings = fundings.map((funding) =>
          funding._id === selectedFunding._id
            ? { ...funding, amountRaised: newAmountRaised }
            : funding
        );

        setFundings(updatedFundings);
        setSelectedFunding((prev) => ({
          ...prev,
          amountRaised: newAmountRaised,
        }));
        setIsEditingAmount(false); // close edit mode
      } else {
        console.error(data.message || "Failed to update amountRaised");
      }
    } catch (error) {
      console.error("Error updating amountRaised:", error);
    }
  }}
  className="text-green-600 hover:underline text-xs"
>
  Save
</button>

    </div>
  )}
</div>

        </div>
      </div>
      
      
      
      
                <hr className="border-t" />
      
               
              </div>
            </motion.div>
      
      
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FundingDashboard;
