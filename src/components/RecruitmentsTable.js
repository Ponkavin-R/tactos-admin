import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { Pencil, Trash2 } from 'lucide-react';

const RecruitmentsTable = () => {
  const [recruitments, setRecruitments] = useState([]);
  const [search, setSearch] = useState('');
  const [filterBy, setFilterBy] = useState('name');
  const [statusFilter, setStatusFilter] = useState('');
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ name: '', email: '', phone: '', status: '' });
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/recruitments`).then(res => {
      setRecruitments(res.data);
    });
  }, []);

  const handleEdit = (id, data) => {
    setEditId(id);
    setEditData(data);
  };

  const handleSave = (id) => {
    axios.put(`${process.env.REACT_APP_API_URL}/api/recruitments/${id}`, editData).then(() => {
      setRecruitments(recruitments.map(r => r._id === id ? { ...r, ...editData } : r));
      setEditId(null);
    });
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    axios.delete(`${process.env.REACT_APP_API_URL}/api/recruitments/${deleteId}`).then(() => {
      setRecruitments(recruitments.filter(r => r._id !== deleteId));
      setShowConfirm(false);
      setDeleteId(null);
    });
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setDeleteId(null);
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(recruitments);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Recruitments');
    XLSX.writeFile(workbook, 'recruitments.xlsx');
  };

  const filteredRecruitments = recruitments.filter(r => {
    const value = r[filterBy]?.toLowerCase() || '';
    return (
      value.includes(search.toLowerCase()) &&
      (statusFilter ? r.status === statusFilter : true)
    );
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-gray-800 relative">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Job Applied</h2>

      {/* Filters and download */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="flex gap-2 items-center">
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md bg-white shadow-sm"
          >
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="status">Status</option>
          </select>

          <input
            type="text"
            placeholder={`Search by ${filterBy}`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-md bg-white shadow-sm"
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="viewed">Viewed</option>
          <option value="shortlisted">Shortlisted</option>
        </select>

        <button
          onClick={downloadExcel}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Download Excel
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3">Job Title</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Resume</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRecruitments.map((r) => (
              <tr key={r._id}>
                <td className="px-6 py-4">{r.jobId?.role || 'N/A'}</td>
                <td className="px-6 py-4">
                  {editId === r._id ? (
                    <input
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    r.name
                  )}
                </td>
                <td className="px-6 py-4">
                  {editId === r._id ? (
                    <input
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    r.email
                  )}
                </td>
                <td className="px-6 py-4">
                  {editId === r._id ? (
                    <input
                      value={editData.phone}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    r.phone
                  )}
                </td>
                <td className="px-6 py-4 text-blue-600 underline">
                  <a href={r.resumeUrl} target="_blank" rel="noopener noreferrer">Download</a>
                </td>
                <td className="px-6 py-4">
                  {editId === r._id ? (
                    <select
                      value={editData.status}
                      onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                      className="w-full px-2 py-1 border rounded"
                    >
                      <option value="new">New</option>
                      <option value="viewed">Viewed</option>
                      <option value="shortlisted">Shortlisted</option>
                    </select>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                      r.status === 'new'
                        ? 'bg-blue-100 text-blue-700'
                        : r.status === 'viewed'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {r.status}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 flex gap-2">
                  {editId === r._id ? (
                    <button
                      onClick={() => handleSave(r._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(r._id, r)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-4">Are you sure you want to delete this record?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruitmentsTable;
