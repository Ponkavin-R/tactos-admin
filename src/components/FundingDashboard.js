import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes, FaFacebook, FaWhatsapp, FaRegCopy } from 'react-icons/fa';
import { motion, AnimatePresence } from "framer-motion";
const FundingDashboard = () => {
  const [fundings, setFundings] = useState([]);
  const [filteredFundings, setFilteredFundings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [selectedFunding, setSelectedFunding] = useState(null);

  // Fetch funding data
  useEffect(() => {
    fetchFundings();
  }, []);

  const fetchFundings = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/fundings`);
      setFundings(response.data);
      setFilteredFundings(response.data);
    } catch (error) {
      console.error('Error fetching fundings:', error);
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

      {/* Search Filter */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by sector, location, or stage"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Funding Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredFundings.length > 0 ? (
          filteredFundings.map((funding) => (
            <div key={funding._id} className="bg-white p-4 rounded-lg shadow-md">
              <motion.img
          src={`${process.env.REACT_APP_API_URL}${funding.logoUrl}`}
          alt="Startup Logo"
          className="w-full h-40 object-cover"
        />
              <h2 className="text-xl font-semibold mb-1">{funding.sector}</h2>
              <p className="text-gray-600 text-sm mb-1">{funding.shortDescription}</p>
              <p className="text-gray-500 text-sm">Location: {funding.location}</p>
              <p className="text-gray-500 text-sm">Stage: {funding.stage}</p>
              <p className="text-gray-500 text-sm font-semibold">Status: {funding.status || 'Pending'}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded text-sm"
                  onClick={() => handleApprove(funding._id)}
                >
                  Approve
                </button>
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded text-sm"
                  onClick={() => handleHold(funding._id)}
                >
                  Hold
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded text-sm"
                  onClick={() => handleView(funding)}
                >
                  View
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No results found.</p>
        )}
      </div>

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
      
          <div className="text-right text-sm text-gray-500 mt-1">
            {Math.min(
              (((selectedFunding?.amountRaised || 0) / (selectedFunding?.amountSeeking || 1)) * 100).toFixed(2),
              100
            )}% funded
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
