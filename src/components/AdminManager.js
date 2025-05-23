import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminManager() {
  const [admins, setAdmins] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingEmail, setEditingEmail] = useState("");
  const [editingPassword, setEditingPassword] = useState("");

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admins`);
      setAdmins(res.data);
    } catch (err) {
      setError("Failed to fetch admins");
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setAdding(true);
    setError("");
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/admins`, { email, password });
      setAdmins((prev) => [res.data, ...prev]);
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add admin");
    } finally {
      setAdding(false);
    }
  };

  const handleEdit = (admin) => {
    setEditingId(admin._id);
    setEditingEmail(admin.email);
    setEditingPassword(admin.password);
  };

  const handleSave = async (id) => {
    try {
      const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/admins/${id}`, {
        email: editingEmail,
        password: editingPassword,
      });
      setAdmins((prev) =>
        prev.map((admin) => (admin._id === id ? res.data : admin))
      );
      setEditingId(null);
    } catch (err) {
      setError("Failed to update admin");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/admins/${id}`);
      setAdmins((prev) => prev.filter((admin) => admin._id !== id));
    } catch {
      setError("Failed to delete admin");
    }
  };

  return (
    <div className="max-w-full mx-auto p-8 bg-white rounded-3xl shadow-2xl">
      <h2 className="text-3xl font-bold mb-10 text-indigo-900 tracking-wide">
        Admin Management
      </h2>

      <form
        onSubmit={handleAddAdmin}
        className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <input
          type="email"
          className="border border-indigo-300 rounded-lg px-4 py-2 text-sm"
          placeholder="admin@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="border border-indigo-300 rounded-lg px-4 py-2 text-sm"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={adding}
          className="bg-indigo-700 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-800 transition"
        >
          {adding ? "Adding..." : "Add Admin"}
        </button>
      </form>

      {error && (
        <p className="text-red-500 font-medium mb-6 text-sm">{error}</p>
      )}

      <div className="bg-indigo-50 rounded-xl shadow p-6">
        <h3 className="text-xl font-semibold text-indigo-900 mb-4">
          Existing Admins ({admins.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm bg-white rounded-lg overflow-hidden">
            <thead className="bg-indigo-100 text-indigo-700 text-left uppercase">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Password</th>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              <AnimatePresence>
                {admins.map((admin) => (
                  <motion.tr
                    key={admin._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    {editingId === admin._id ? (
                      <>
                        <td className="px-4 py-2">
                          <input
                            className="border px-2 py-1 rounded text-sm w-full"
                            value={editingEmail}
                            onChange={(e) => setEditingEmail(e.target.value)}
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            className="border px-2 py-1 rounded text-sm w-full"
                            value={editingPassword}
                            onChange={(e) => setEditingPassword(e.target.value)}
                          />
                        </td>
                        <td className="px-4 py-2 text-gray-400 text-xs">
                          {admin._id}
                        </td>
                        <td className="px-4 py-2 space-x-3">
                          <button
                            onClick={() => handleSave(admin._id)}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-gray-600 hover:underline text-sm"
                          >
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-2">{admin.email}</td>
                        <td className="px-4 py-2">{admin.password}</td>
                        <td className="px-4 py-2 text-gray-400 text-xs">
                          {admin._id}
                        </td>
                        <td className="px-4 py-2 space-x-3">
                          <button
                            onClick={() => handleEdit(admin)}
                            className="text-blue-600 hover:underline text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(admin._id)}
                            className="text-red-600 hover:underline text-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
