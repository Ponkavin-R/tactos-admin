import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ApplicationDetail = () => {
  const { jobId } = useParams(); // Get the jobId from the URL parameters
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/jobapplied/${jobId}`);
        setApplications(response.data); // Set the applications data
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch applications", error);
        setLoading(false);
      }
    };

    fetchApplications();
  }, [jobId]); // Fetch applications whenever jobId changes

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 via-indigo-200 to-pink-200 px-6 py-10">
        <div className="text-center text-gray-700 text-lg font-medium">Loading applications...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 via-gray-100 to-white px-6 py-10">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-xl shadow-xl shadow-indigo-300">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">Job Applications</h2>

        {applications.length === 0 ? (
          <p className="text-center text-gray-500">No applications for this job.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((application) => (
              <div
                key={application._id}
                className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-indigo-400"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-indigo-600">{application.name}</h3>
                    <span className="text-xs text-gray-400">{new Date(application.appliedAt).toLocaleDateString()}</span>
                  </div>

                  <p className="text-sm text-gray-500 mb-2">Email: {application.email}</p>
                  <p className="text-sm text-gray-500 mb-2">Phone: {application.phone}</p>
                  <p className="text-sm text-gray-500 mb-2">Company: {application.company}</p>

                  <div className="flex items-center justify-between mt-4">
                    <a
                      href={application.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      <i className="fas fa-file-pdf mr-2"></i> View Resume
                    </a>
                    <span
                      className={`inline-block py-1 px-3 text-xs font-semibold rounded-full ${application.status === 'Approved' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}
                    >
                      {application.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationDetail;
