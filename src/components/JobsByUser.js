import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const JobsByUser = () => {
  const { userId } = useParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startupName, setStartupName] = useState("");
  const startupid=userId;
  const navigate = useNavigate();
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/jobs`);
        const filtered = res.data.filter((job) => job.userId === userId);
        setJobs(filtered);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch jobs", err);
        setLoading(false);
      }
    };

    const fetchStartupName = async () => {
      try {
        // Assuming there's a way to fetch the startup name (you can replace this with the actual call if needed)
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/startups/${startupid}`);
        setStartupName(res.data.startupName);
      } catch (err) {
        console.error("Failed to fetch startup name", err);
      }
    };

    fetchJobs();
    fetchStartupName();
  }, [userId]);

  if (loading) return <p className="text-center py-10 text-gray-500">Loading jobs...</p>;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      {/* Main Heading and Startup Name */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-8 px-4 py-3 bg-white shadow-xl rounded-xl border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          Jobs Posted By <span className="font-medium text-indigo-600">{startupName}</span>
        </h2>
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <span>{jobs.length} Jobs Available</span>
        </div>
      </div>

      {jobs.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No jobs found for this user.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs.map((job) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white border border-gray-200 rounded-xl shadow-xl p-6 space-y-4 hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-between">
                <img src={job.logo} alt={job.company} className="h-12 w-12 object-contain" />
                <div className="flex gap-2">
                  {job.isNew && (
                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full shadow-md">
                      New
                    </span>
                  )}
                  {job.featured && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full shadow-md">
                      Featured
                    </span>
                  )}
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-indigo-600 hover:underline cursor-pointer">{job.position}</h2>
                <p className="text-sm text-gray-700">{job.company}</p>
                <div className="text-sm text-gray-500 mt-1">
                  <span>{job.contract}</span> • <span>{job.district}</span>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p>Experience: {job.experience}</p>
                <p>Salary: {job.salary}</p>
                <p>Joining: {job.dateOfJoining}</p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs mt-2">
                {job.languages.map((lang, i) => (
                  <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full shadow-md">
                    {lang}
                  </span>
                ))}
                {job.tools.map((tool, i) => (
                  <span key={i} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full shadow-md">
                    {tool}
                  </span>
                ))}
              </div>
              <div className="mt-4">
                <button
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                  onClick={() => navigate(`/admin/application/${job._id}`)}
                >
                  View Job Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsByUser;
