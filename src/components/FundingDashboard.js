import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes, FaWhatsapp, FaFacebookF, FaLink } from 'react-icons/fa';

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
              <img src={funding.logoUrl} alt={funding.sector} className="w-full h-48 object-cover mb-4 rounded" />
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

      {/* Popup */}
      {showPopup && selectedFunding && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 overflow-auto">
          <div className="bg-white rounded-lg shadow-lg w-full h-screen max-w-5xl relative flex flex-col md:flex-row p-6 gap-8">

            {/* Close Button */}
            <button onClick={handleClosePopup} className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-gray-900">
              <FaTimes />
            </button>

            {/* Left Side: Video and Long Description */}
            <div className="md:w-2/3">
              {selectedFunding.youtube ? (
                <iframe
                  src={getEmbedUrl(selectedFunding.youtube)}
                  title="Startup Video"
                  className="w-full h-2/3 rounded-md mb-4"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-80 flex items-center justify-center bg-gray-100 text-gray-400 mb-4">
                  No Video Available
                </div>
              )}
              <p className="text-gray-700 text-base">{selectedFunding.longDescription}</p>
            </div>

            {/* Right Side: Logo and Info */}
            <div className="md:w-1/3 flex flex-col items-center text-center gap-4">
              <img src={selectedFunding.logoUrl} alt="Logo" className="w-36 h-36 object-cover rounded-full shadow-md" />
              <h2 className="text-2xl font-bold">{selectedFunding.sector}</h2>
              <p className="text-blue-600">{selectedFunding.location}</p>
              <p className="text-gray-600">{selectedFunding.shortDescription}</p>

              {/* Social Share */}
             
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default FundingDashboard;
