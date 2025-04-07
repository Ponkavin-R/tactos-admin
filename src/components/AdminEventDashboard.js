import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const AdminEventDashboard = () => {
  const [activeTab, setActiveTab] = useState("Free");
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    type: "Free",
    status: "New",
    amount: "",
    paymentLink: "",
    mode: "Online",
    date: "",
    time: "",
    link: "",
    location: "",
    logo: "",
  });
  const [editIndex, setEditIndex] = useState(null); // will store _id

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await axios.get("https://tactos-backend.onrender.com/api/events");
    setEvents(res.data);
  };

  const handleTabChange = (tab) => setActiveTab(tab);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editIndex !== null) {
        await axios.put(`https://tactos-backend.onrender.com/api/events/${editIndex}`, formData);
      } else {
        await axios.post("https://tactos-backend.onrender.com/api/events", formData);
      }
      fetchEvents();
      setShowForm(false);
      setFormData({
        name: "",
        title: "",
        description: "",
        type: "Free",
        status: "New",
        amount: "",
        paymentLink: "",
        mode: "Online",
        date: "",
        time: "",
        link: "",
        location: "",
        logo: "",
      });
      setEditIndex(null);
    } catch (err) {
      console.error("Form submit failed:", err);
    }
  };

  const handleEdit = (event) => {
    setFormData(event);
    setEditIndex(event._id);
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === "logo" && files.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://tactos-backend.onrender.com/api/events/${id}`);
      fetchEvents();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleStatusChange = async (id) => {
    try {
      await axios.patch(`https://tactos-backend.onrender.com/api/events/${id}`, { status: "Completed" });
      fetchEvents();
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const filteredEvents = events.filter((e) => {
    if (activeTab === "Completed") return e.status === "Completed";
    return e.status !== "Completed" && e.type === activeTab;
  });
  

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Event Dashboard</h1>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
            onClick={() => setShowForm(true)}
          >
            Add New Event
          </button>
        </div>

        <div className="flex space-x-4 mb-6">
          {["Free", "Paid", "Completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-2 rounded-full ${
                activeTab === tab ? "bg-blue-600 text-white" : "bg-white text-gray-700 border"
              }`}
            >
              {tab} Events
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((event) => (
            <div key={event._id} className="bg-white shadow p-4 rounded-lg">
              <div className="flex items-center justify-between">
                {event.logo && (
                  <img
                    src={event.logo}
                    alt="event"
                    className="w-12 h-12 object-contain rounded"
                  />
                )}
                <h2 className="text-xl font-semibold text-gray-800">{event.name}</h2>
                <span
                  className={`text-sm px-2 py-1 rounded-full ${
                    event.status === "Completed"
                      ? "bg-green-200 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {event.status}
                </span>
              </div>
              <p className="text-gray-600 mt-2">{event.description}</p>
              <p className="text-sm text-gray-500 mt-1">Type: {event.type}</p>
              <p className="text-sm text-gray-500">Mode: {event.mode}</p>
              <p className="text-sm text-gray-500">
                Date: {event.date} | Time: {event.time}
              </p>
              {event.mode === "Online" ? (
                <p className="text-sm text-blue-600">
                  Join Link:{" "}
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {event.link}
                  </a>
                </p>
              ) : (
                <p className="text-sm text-gray-600">Location: {event.location}</p>
              )}
              {event.type === "Paid" && (
                <>
                  <p className="text-sm text-gray-700 font-semibold mt-1">
                    Amount: ₹{event.amount}
                  </p>
                  <a
                    href={event.paymentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Payment Link
                  </a>
                </>
              )}
              <div className="mt-3 flex space-x-2">
                <button
                  onClick={() => handleEdit(event)}
                  className="text-blue-500 hover:underline text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(event._id)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Delete
                </button>
                {event.status !== "Completed" && (
                  <button
                    onClick={() => handleStatusChange(event._id)}
                    className="text-green-500 hover:underline text-sm"
                  >
                    Mark Completed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Popup Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto p-4">
            <div className="bg-white p-8 rounded-xl w-full max-w-4xl relative shadow-lg">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditIndex(null);
                }}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-xl"
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold mb-6 text-center">
                {editIndex !== null ? "Edit Event" : "Create New Event"}
              </h2>
              <form
                onSubmit={handleFormSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Event Name"
                  className="border px-4 py-2 rounded-lg shadow-sm"
                  required
                />
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Title"
                  className="border px-4 py-2 rounded-lg shadow-sm"
                  required
                />
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="border px-4 py-2 rounded-lg shadow-sm"
                >
                  <option value="Free">Free</option>
                  <option value="Paid">Paid</option>
                </select>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="border px-4 py-2 rounded-lg shadow-sm"
                >
                  <option value="New">New</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
                {formData.type === "Paid" && (
                  <>
                    <input
                      type="text"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      placeholder="Amount"
                      className="border px-4 py-2 rounded-lg shadow-sm"
                    />
                    <input
                      type="text"
                      name="paymentLink"
                      value={formData.paymentLink}
                      onChange={handleInputChange}
                      placeholder="Payment Link"
                      className="border px-4 py-2 rounded-lg shadow-sm"
                    />
                  </>
                )}
                <select
                  name="mode"
                  value={formData.mode}
                  onChange={handleInputChange}
                  className="border px-4 py-2 rounded-lg shadow-sm"
                >
                  <option value="Online">Online</option>
                  <option value="Physical">Physical</option>
                </select>
                {formData.mode === "Online" ? (
                  <input
                    type="text"
                    name="link"
                    value={formData.link}
                    onChange={handleInputChange}
                    placeholder="Online Meeting Link"
                    className="border px-4 py-2 rounded-lg shadow-sm"
                  />
                ) : (
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Event Location"
                    className="border px-4 py-2 rounded-lg shadow-sm"
                  />
                )}
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="border px-4 py-2 rounded-lg shadow-sm"
                />
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="border px-4 py-2 rounded-lg shadow-sm"
                />
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-1 block">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                    className="w-full border px-4 py-2 rounded-lg shadow-sm resize-none h-24"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-1 block">Event Image</label>
                  <input
                    type="file"
                    name="logo"
                    accept="image/*"
                    className="text-sm"
                    onChange={handleChange}
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                  >
                    {editIndex !== null ? "Update Event" : "Create Event"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEventDashboard;
