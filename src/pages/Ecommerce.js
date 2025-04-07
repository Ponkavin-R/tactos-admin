import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { FaUsers, FaChartLine, FaBriefcase, FaHandshake } from 'react-icons/fa';
import axios from 'axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const Ecommerce = () => {
  const [stats, setStats] = useState({
    startupCount: 0,
    cofounderCount: 0,
    businessCount: 0,
    consultationCount: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('https://tactos-backend.onrender.com/api/stats');
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
    <div className='p-6 bg-gray-100 min-h-screen'>
      {/* Dashboard Header */}
      <h2 className='text-3xl font-bold text-gray-800 mb-6'>Admin Dashboard</h2>

      {/* Cards Section */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6'>
        {pieData.map((item, index) => (
          <div key={index} className='bg-white shadow-md rounded-lg p-6 flex items-center gap-4'>
            <div className={`p-4 rounded-full text-white`} style={{ backgroundColor: item.color }}>
              {index === 0 && <FaUsers size={24} />}
              {index === 1 && <FaHandshake size={24} />}
              {index === 2 && <FaBriefcase size={24} />}
              {index === 3 && <FaChartLine size={24} />}
            </div>
            <div>
              <h3 className='text-xl font-semibold text-gray-700'>{item.name}</h3>
              <p className='text-2xl font-bold text-gray-900'>{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Bar Graph */}
        <div className='bg-white shadow-md rounded-lg p-6'>
          <h3 className='text-xl font-semibold text-gray-700 mb-4'>Business Statistics</h3>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={pieData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Bar dataKey='value' fill='#4F46E5' />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Charts */}
        <div className='bg-white shadow-md rounded-lg p-6'>
          <h3 className='text-xl font-semibold text-gray-700 mb-4'>Category Distribution</h3>
          <ResponsiveContainer width='100%' height={300}>
            <PieChart>
              <Pie data={pieData} cx='50%' cy='50%' outerRadius={100} fill='#8884d8' dataKey='value'>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Ecommerce;