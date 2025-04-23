import React, { useEffect, useState } from 'react';
import axios from 'axios';

const JobApplicants = () => {
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/applicants`);
        const filtered = response.data.filter(app => app.status === 'new');
        setApplicants(filtered);
      } catch (error) {
        console.error('Error fetching applicants:', error);
      }
    };

    fetchApplicants();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-xl border border-gray-200 p-6">
       <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">New Job Applications</h2>
        <span style={{
                      backgroundColor: "#e0f7fa",
                      color: "#00796b",
                      padding: "4px 12px",
                      borderRadius: "12px",
                      fontWeight: "bold",
                      display: "inline-block",
                    }}>
          Total: {applicants.length}
        </span>
      </div>

      <div className="overflow-x-auto max-h-[500px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-blue-50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Name</th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Job Role</th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Email</th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Phone</th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {applicants.map((applicant) => (
              <tr key={applicant._id} className="hover:bg-gray-50 transition duration-200">
                <td className="px-6 py-4 text-gray-800 font-medium">{applicant.name}</td>
                <td className="px-6 py-4 text-gray-600">{applicant.jobId?.role || 'N/A'}</td>
                <td className="px-6 py-4 text-gray-600">{applicant.email}</td>
                <td className="px-6 py-4 text-gray-600">{applicant.phone}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 capitalize">
                    {applicant.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {applicants.length === 0 && (
          <div className="text-center text-gray-500 py-6 text-sm">No new applications.</div>
        )}
      </div>
    </div>
  );
};

export default JobApplicants;
