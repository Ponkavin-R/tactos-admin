import React, { useEffect, useState } from "react";
import axios from "axios";

const FundingTable = ({ userId }) => {
  const [fundings, setFundings] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchFundings = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/fundings/me?userId=${userId}`);
        setFundings(response.data);
      } catch (error) {
        console.error("Error fetching fundings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFundings();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead>
          <tr className="border-b bg-gray-100 text-left">
            <th className="py-3 px-4 text-sm font-medium text-gray-600">Startup Name</th>
            <th className="py-3 px-4 text-sm font-medium text-gray-600">Email</th>
            <th className="py-3 px-4 text-sm font-medium text-gray-600">Sector</th>
            <th className="py-3 px-4 text-sm font-medium text-gray-600">Stage</th>
            <th className="py-3 px-4 text-sm font-medium text-gray-600">Status</th>
            <th className="py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {fundings
            .filter(funding => funding.status === "waiting")
            .map(funding => (
              <tr key={funding._id} className="border-b">
                <td className="py-3 px-4 text-sm text-gray-800">{funding.userId?.startupName}</td>
                <td className="py-3 px-4 text-sm text-gray-800">{funding.userId?.email}</td>
                <td className="py-3 px-4 text-sm text-gray-800">{funding.sector}</td>
                <td className="py-3 px-4 text-sm text-gray-800">{funding.stage}</td>
                <td className="py-3 px-4 text-sm text-gray-800">{funding.status}</td>
                <td className="py-3 px-4 text-sm text-gray-800">
                  <button
                    className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600"
                    onClick={() => handleApprove(funding._id)}
                  >
                    Approve
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

const handleApprove = async (fundingId) => {
  try {
    await axios.put(`/api/fundings/approve/${fundingId}`);
    alert("Funding approved!");
    // Optionally, you can refresh the funding list or make another API call to fetch updated data.
  } catch (error) {
    console.error("Error approving funding:", error);
  }
};

export default FundingTable;
