import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import {
  FaUsers, FaChartLine, FaBriefcase, FaHandshake, FaRegCalendarAlt,
} from 'react-icons/fa';
import { MdBusinessCenter } from 'react-icons/md';
import { AiOutlineSolution } from 'react-icons/ai';
import axios from 'axios';
import DashboardSolution from '../components/Dashboardsolution';
import JobApplicants from '../components/JobApplicants';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#0ea5e9', '#a855f7', '#f43f5e'];

const iconList = [
  <FaUsers />, <FaHandshake />, <FaBriefcase />, <FaChartLine />,
  <MdBusinessCenter />, <FaRegCalendarAlt />, <AiOutlineSolution />,
];

const Ecommerce = () => {
  const [stats, setStats] = useState({
    startupCount: 0,
    cofounderCount: 0,
    businessCount: 0,
    consultationCount: 0,
    careerCount: 0,
    eventCount: 0,
    solutionCount: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/stats`);
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const pieData = Object.entries(stats).map(([key, value], index) => ({
    name: key.replace('Count', ''),
    value,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div className="p-6 md:p-8 bg-gray-100 min-h-screen font-sans">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {pieData.map((item, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition duration-300 flex items-center gap-4"
          >
            <div
              className="w-12 h-12 flex items-center justify-center rounded-full text-white text-xl"
              style={{ backgroundColor: item.color }}
            >
              {iconList[index]}
            </div>
            <div>
              <p className="text-sm text-gray-500 capitalize">{item.name}</p>
              <p className="text-lg font-bold text-gray-800">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Form + Applicants */}
        <div className="col-span-2 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm h-[300px] overflow-y-auto">
            <DashboardSolution />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm max-h-[320px] overflow-y-auto">
            <JobApplicants />
          </div>
        </div>

        {/* Right: Charts */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Business Overview</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={pieData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Category Distribution</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ecommerce;
