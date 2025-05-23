import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { Popover, Box, Typography, Grid, TextField, IconButton } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';


const JobApplicants = () => {
  const { id: jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', phone: '' });
  const [anchorEl, setAnchorEl] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const applicantsPerPage = 10;
  const [jobDetails, setJobDetails] = useState({ company: '', role: '' });

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const [applicantsRes, jobRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/jobapplied/${jobId}`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/jobs/${jobId}`)
        ]);

        setApplicants(applicantsRes.data);
        setJobDetails(jobRes.data);
      } catch (error) {
        console.error('Error fetching applicants or job details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) fetchApplicants();
  }, [jobId]);

  const handleFilterChange = (e, key) => {
    setFilters(prev => ({
      ...prev,
      [key]: e.target.value.toLowerCase()
    }));
    setCurrentPage(1);
  };

  const filteredApplicants = applicants.filter(app =>
    app.name?.toLowerCase().includes(filters.name) &&
    app.email?.toLowerCase().includes(filters.email) &&
    app.phone?.toLowerCase().includes(filters.phone)
  );

  const indexOfLast = currentPage * applicantsPerPage;
  const indexOfFirst = indexOfLast - applicantsPerPage;
  const currentApplicants = filteredApplicants.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredApplicants.length / applicantsPerPage);

  return (
    <div className="bg-white shadow-xl rounded-xl border border-gray-200 p-8 max-w-full mx-auto mt-10">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div>
        <div className="flex items-center gap-2">
  <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
    Applications for: <span className="text-indigo-700">{jobDetails.role}</span>
  </h2>
  <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small">
    <InfoOutlinedIcon fontSize="small" className="text-blue-600" />
  </IconButton>
</div>

          <p className="text-gray-600 mt-1">Company: <span className="text-green-700 font-medium">{jobDetails.company}</span></p>
        </div>
        <span className="bg-indigo-100 text-indigo-800 px-4 py-1 rounded-full font-semibold mt-4 md:mt-0">
          Total Applicants: {filteredApplicants.length}
        </span>
      </div>

      <div className="overflow-x-auto max-h-[600px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <table className="min-w-full divide-y divide-gray-200 text-sm bg-white">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              {['Name', 'Email', 'Phone', 'Resume'].map((label, idx) => (
                <th key={idx} className="px-6 py-3 text-left font-semibold text-gray-700">
                  {label !== 'Resume' ? (
                    <div className="flex flex-col">
                      <span>{label}</span>
                      <input
                        type="text"
                        className="mt-1 px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200"
                        placeholder={`Search ${label.toLowerCase()}`}
                        onChange={(e) => handleFilterChange(e, label.toLowerCase())}
                      />
                    </div>
                  ) : (
                    <span>{label}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <AnimatePresence>
            <tbody className="divide-y divide-gray-100">
              {currentApplicants.map((applicant) => (
                <motion.tr
                  key={applicant._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50 transition duration-200"
                >
                  <td className="px-6 py-4 text-gray-900 font-medium">{applicant.name}</td>
                  <td className="px-6 py-4 text-indigo-600">{applicant.email}</td>
                  <td className="px-6 py-4 text-amber-600">{applicant.phone}</td>
                  <td className="px-6 py-4">
                    {applicant.resumeUrl ? (
                      <a
                      href={applicant.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                        className="text-indigo-600 underline hover:text-indigo-800"
                      >
                        View Resume
                      </a>
                    ) : (
                      <span className="text-gray-400">No Resume</span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </AnimatePresence>
        </table>

        {filteredApplicants.length === 0 && !loading && (
          <div className="text-center text-gray-500 py-6 text-sm">No matching applications found.</div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded font-medium ${
                currentPage === i + 1
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
      <Popover
  open={Boolean(anchorEl)}
  anchorEl={anchorEl}
  onClose={() => setAnchorEl(null)}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
  transformOrigin={{ vertical: 'top', horizontal: 'left' }}
>
  <Box
    p={3}
    sx={{
      maxWidth: 700,
      bgcolor: '#f9fafb',
      borderRadius: 2,
      boxShadow: 3,
    }}
  >
        <Typography variant="h6" gutterBottom>
          Job Details
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField label="Company" value={jobDetails.company || ''} variant="outlined" size="small" InputProps={{ readOnly: true }} fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Role" value={jobDetails.role || ''} variant="outlined" size="small" InputProps={{ readOnly: true }} fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Position" value={jobDetails.position || ''} variant="outlined" size="small" InputProps={{ readOnly: true }} fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Level" value={jobDetails.level || ''} variant="outlined" size="small" InputProps={{ readOnly: true }} fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Contract" value={jobDetails.contract || ''} variant="outlined" size="small" InputProps={{ readOnly: true }} fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField label="District" value={jobDetails.district || ''} variant="outlined" size="small" InputProps={{ readOnly: true }} fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Salary" value={jobDetails.salary || ''} variant="outlined" size="small" InputProps={{ readOnly: true }} fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Experience" value={jobDetails.experience || ''} variant="outlined" size="small" InputProps={{ readOnly: true }} fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Date Of Joining" value={jobDetails.dateOfJoining || ''} variant="outlined" size="small" InputProps={{ readOnly: true }} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Languages"
              value={Array.isArray(jobDetails.languages) ? jobDetails.languages.join(', ') : ''}
              variant="outlined"
              size="small"
              InputProps={{ readOnly: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Tools"
              value={Array.isArray(jobDetails.tools) ? jobDetails.tools.join(', ') : ''}
              variant="outlined"
              size="small"
              InputProps={{ readOnly: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Short Description"
              value={jobDetails.shortDescription || ''}
              variant="outlined"
              size="small"
              multiline
              rows={3}
              InputProps={{ readOnly: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Long Description"
              value={jobDetails.longDescription || ''}
              variant="outlined"
              size="small"
              multiline
              rows={4}
              InputProps={{ readOnly: true }}
              fullWidth
            />
          </Grid>
        </Grid>
  </Box>
</Popover>

    </div>
  );
};

export default JobApplicants;
