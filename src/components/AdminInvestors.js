import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminInvestors = () => {
  const [investors, setInvestors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ type: "", name: "", image: "" });
  const [editingId, setEditingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch investors
  const fetchInvestors = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/ourinvestors`);
    setInvestors(res.data);
  };

  useEffect(() => {
    fetchInvestors();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/ourinvestors/${editingId}`, formData);
    } else {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/ourinvestors`, formData);
    }
    setFormData({ type: "", name: "", image: "" });
    setShowForm(false);
    setEditingId(null);
    fetchInvestors();
  };

  const handleEdit = (investor) => {
    setFormData(investor);
    setEditingId(investor._id);
    setShowForm(true);
  };

  const handleDeleteConfirm = (id) => {
    setShowDeleteConfirm(true);
    setDeleteId(id);
  };

  const handleDelete = async () => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/api/ourinvestors/${deleteId}`);
    setShowDeleteConfirm(false);
    setDeleteId(null);
    fetchInvestors();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Investors</h1>
        <button
          onClick={() => {
            setFormData({ type: "", name: "", image: "" });
            setEditingId(null);
            setShowForm(true);
          }}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + New Investor
        </button>
      </div>

      {/* Investor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {investors.map((investor) => (
          <div key={investor._id} className="bg-white p-6 rounded-xl shadow-lg flex flex-col">
            <img src={investor.image} alt={investor.name} className="h-40 object-cover rounded-lg mb-4" />
            <h2 className="text-xl font-semibold">{investor.name}</h2>
            <p className="text-gray-600 mt-2">{investor.type}</p>
            <div className="flex mt-4 space-x-2">
              <button
                onClick={() => handleEdit(investor)}
                className="bg-yellow-400 px-4 py-2 rounded-full text-white hover:bg-yellow-500 transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteConfirm(investor._id)}
                className="bg-red-500 px-4 py-2 rounded-full text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form Popup */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <form onSubmit={handleFormSubmit} className="bg-white p-8 rounded-lg shadow-2xl w-[90%] max-w-lg">
            <h2 className="text-2xl font-bold mb-6">{editingId ? "Edit Investor" : "New Investor"}</h2>

            {/* Type Dropdown */}
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="border p-2 mb-4 w-full rounded-lg"
              required
            >
              <option value="">Select Type</option>
              <option value="Our Key Partner">Our Key Partner</option>
              <option value="Our Partner">Our Partner</option>
              <option value="Our Investor">Our Investor</option>
            </select>

            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              className="border p-2 mb-4 w-full rounded-lg"
              required
            />
            <input
              type="text"
              name="image"
              placeholder="Image URL"
              value={formData.image}
              onChange={handleInputChange}
              className="border p-2 mb-4 w-full rounded-lg"
              required
            />
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-700"
              >
                {editingId ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-2xl text-center">
            <h2 className="text-xl font-semibold mb-4">Are you sure?</h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-6 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInvestors;
