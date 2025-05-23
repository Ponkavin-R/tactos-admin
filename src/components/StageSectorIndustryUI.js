import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Briefcase, Settings, Activity, TrendingUp } from 'lucide-react';

const API_ROUTES = [
  { title: 'Stages', path: 'stage', icon: <TrendingUp className="inline-block mr-2" /> },
  { title: 'Sectors', path: 'sector', icon: <Activity className="inline-block mr-2" /> },
  { title: 'Startup Stages', path: 'startupstage', icon: <Settings className="inline-block mr-2" /> },
  { title: 'Industries', path: 'industory', icon: <Briefcase className="inline-block mr-2" /> },
];

export default function StageSectorIndustryUI() {
  const [activeTab, setActiveTab] = useState('stage');
  const [data, setData] = useState([]);
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/${activeTab}`);
      setData(res.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/${activeTab}/${editingId}`, { stageName: input });
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/${activeTab}`, { stageName: input });
      }
      setInput('');
      setEditingId(null);
      fetchData();
    } catch (err) {
      alert('Error submitting data');
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    setInput(item.stageName);
    setEditingId(item._id);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/${activeTab}/${deleteId}`);
      fetchData();
      setDeleteId(null);
      setShowConfirm(false);
    } catch (err) {
      console.error('Error deleting data:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-100 to-white text-gray-800 p-8">
      <h1 className="text-4xl font-bold mb-10 text-gray-700">Add Data</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {API_ROUTES.map((route) => (
          <button
            key={route.path}
            onClick={() => {
              setActiveTab(route.path);
              setInput('');
              setEditingId(null);
            }}
            className={`flex items-center justify-center gap-2 p-4 rounded-xl transition-all duration-200 font-semibold shadow hover:scale-105 ${
              activeTab === route.path ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border hover:bg-blue-100'
            }`}
          >
            {route.icon}
            {route.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">
            {editingId ? 'Update' : 'Add'} {API_ROUTES.find((r) => r.path === activeTab)?.title}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Enter name"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium"
            >
              {editingId ? 'Update' : 'Add'}
            </button>
          </form>
        </div>

        {/* List */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border overflow-auto max-h-[80vh]">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">
            {API_ROUTES.find((r) => r.path === activeTab)?.title} List
          </h2>
          <table className="w-full text-sm">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{item.stageName}</td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(item._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan="2" className="text-center text-gray-400 py-4">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Are you sure you want to delete this item?</h3>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
