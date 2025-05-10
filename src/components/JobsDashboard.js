import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Briefcase, Mail, Building2 } from "lucide-react";

const JobsDashboard = () => {
  const [startups, setStartups] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/startups`);
        setStartups(res.data);
      } catch (err) {
        console.error("Failed to fetch startups", err);
      }
    };
    fetchStartups();
  }, []);

  const filteredStartups = startups.filter((startup) =>
    startup.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-6 py-10">
      {/* Main Heading and Admin Info */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-8 px-4 py-3 bg-white shadow-xl rounded-xl border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <Briefcase className="w-6 h-6 text-indigo-600" />
          Jobs Dashboard
        </h2>
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <span>Total Startups: {startups.length}</span>
        </div>
      </div>

      {/* Search Filter Section */}
      <div className="mb-10 max-w-lg w-full bg-white px-5 py-3 rounded-full shadow-lg flex items-center border border-gray-200">
        <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2a7.5 7.5 0 010 15z" />
        </svg>
        <input
          type="text"
          placeholder="Search by full name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full outline-none bg-transparent text-sm text-gray-700"
        />
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredStartups.map((startup) => (
          <motion.div
            key={startup._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 p-6"
          >
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-indigo-700 hover:underline cursor-pointer">{startup.fullName}</h2>
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <Mail className="w-4 h-4 mr-1" />
                {startup.email}
              </div>
              <div className="flex items-center text-sm text-gray-700 mt-2">
                <Building2 className="w-4 h-4 mr-1" />
                {startup.startupName}
              </div>
            </div>
            <button
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
              onClick={() => navigate(`/admin/jobs/${startup._id}`)}
            >
              View Jobs
            </button>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredStartups.length === 0 && (
        <p className="text-center text-gray-500 mt-16 text-sm">No startups found for the current search.</p>
      )}
    </div>
  );
};

export default JobsDashboard;
