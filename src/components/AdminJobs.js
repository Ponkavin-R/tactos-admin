// --- React Component: AdminCareers.js ---
import React, { useEffect, useState } from "react";
import axios from "axios";

const initialForm = {
  company: "",
  logo: "",
  isNew: false,
  featured: false,
  position: "",
  role: "",
  level: "",
  postedAt: "",
  contract: "",
  location: "",
  salary: "",
  experience: "",
  dateOfJoining: "",
  languages: "",
  tools: "",
};

const AdminJobs = () => {
  const [careers, setCareers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/jobs`);
    setCareers(res.data);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      languages: formData.languages.split(",").map((x) => x.trim()),
      tools: formData.tools.split(",").map((x) => x.trim()),
    };

    if (editingId) {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/jobs/${editingId}`, payload);
    } else {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/jobs`, payload);
    }

    setFormData(initialForm);
    setEditingId(null);
    setShowModal(false);
    fetchCareers();
  };

  const handleEdit = (career) => {
    setFormData({
      ...career,
      languages: career.languages.join(", "),
      tools: career.tools.join(", "),
    });
    setEditingId(career._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/api/jobs/${id}`);
    fetchCareers();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Admin Careers</h2>
        <button
          onClick={() => {
            setFormData(initialForm);
            setEditingId(null);
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Add New Career
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {careers.map((career) => (
          <div key={career._id} className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500 space-y-2">
            <div className="flex items-start gap-4">
              <img src={career.logo} alt="logo" className="w-12 h-12 object-contain rounded" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{career.company}</h3>
                  {career.isNew && <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs">NEW!</span>}
                  {career.featured && <span className="bg-black text-white px-2 py-1 rounded-full text-xs">FEATURED</span>}
                </div>
                <p className="text-blue-700 font-medium">{career.position}</p>
                <p className="text-sm text-gray-600">{career.role} • {career.level}</p>
                <p className="text-sm text-gray-600">{career.postedAt} • {career.contract} • {career.location}</p>
                <p className="text-sm text-gray-600">Salary: {career.salary}</p>
                <p className="text-sm text-gray-600">Experience: {career.experience}</p>
                <p className="text-sm text-gray-600">Joining: {career.dateOfJoining}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {career.languages.map((lang, i) => <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{lang}</span>)}
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {career.tools.map((tool, i) => <span key={i} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">{tool}</span>)}
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <button onClick={() => handleEdit(career)} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded">Edit</button>
              <button onClick={() => handleDelete(career._id)} className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start pt-20 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editingId ? "Edit Career" : "Add New Career"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {[
    ["company", "Company"],
    ["position", "Position"],
    ["role", "Role"],
    ["location", "Location"],
    ["salary", "Salary (Year)"],
    ["experience", "Experience"],
    ["dateOfJoining", "Joining Date"],
    ["postedAt", "Posted At"],
    ["languages", "Languages (comma-separated)"],
    ["tools", "Tools (comma-separated)"],
  ].map(([name, label]) => (
    <div key={name}>
      <label className="text-sm font-medium block">{label}</label>
      <input
        type={name === "dateOfJoining" || name === "postedAt" ? "date" : "text"}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
      />
    </div>
  ))}

  {/* Level Dropdown */}
  <div>
    <label className="text-sm font-medium block">Level</label>
    <select
      name="level"
      value={formData.level}
      onChange={handleChange}
      className="w-full border rounded px-3 py-2"
    >
      <option value="">Select Level</option>
      <option value="Senior">Senior</option>
      <option value="Intermediate">Intermediate</option>
      <option value="Fresher">Fresher</option>
    </select>
  </div>

  {/* Contract Dropdown */}
  <div>
    <label className="text-sm font-medium block">Contract</label>
    <select
      name="contract"
      value={formData.contract}
      onChange={handleChange}
      className="w-full border rounded px-3 py-2"
    >
      <option value="">Select Contract Type</option>
      <option value="Full Time">Full Time</option>
      <option value="Part Time">Part Time</option>
      <option value="Internship">Internship</option>
    </select>
  </div>

  {/* Logo and checkboxes */}
  <div className="col-span-2 flex items-center gap-4">
    <label className="text-sm font-medium">Logo</label>
    <input
      type="file"
      name="logo"
      accept="image/*"
      onChange={handleChange}
      className="text-sm"
    />
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        name="isNew"
        checked={formData.isNew}
        onChange={handleChange}
      />{" "}
      New
    </label>
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        name="featured"
        checked={formData.featured}
        onChange={handleChange}
      />{" "}
      Featured
    </label>
  </div>

  {/* Submit Button */}
  <div className="col-span-2">
    <button
      type="submit"
      className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700"
    >
      {editingId ? "Update Career" : "Add Career"}
    </button>
  </div>
</form>



          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJobs;