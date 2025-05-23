import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { Navbar } from './components';

import { useStateContext } from './contexts/ContextProvider';
import './App.css';

import SolutionsTable from './components/SolutionsTable';
import StartupTable from './components/StartupTable';
import AdminCareers from './components/AdminCarrers';
import EventDashboard from './components/AdminEventDashboard';
import CofounderTable from './components/CoFounderTable';
import BusinessesTable from './components/BusinessesTable';
import BusinessTableConsultation from './components/BusinessConsultationTable';
import Ecommerce from './pages/Ecommerce';
import RecruitmentsTable from './components/RecruitmentsTable';
import AdminTestimonials from './components/AdminTestimonials';
import AdminInvestors from './components/AdminInvestors';
import FundingDashboard from './components/FundingDashboard';
import JobsDashboard from './components/JobsDashboard';
import JobsByUser from './components/JobsByUser';
import ApplicationDetail from './components/ApplicationDetail';

import Login from './components/Login'; // Import your Login component
import AdminManager from './components/AdminManager';
import RegistrationTable from './components/EventRegistrationTable';
import StageSectorIndustryUI from './components/StageSectorIndustryUI';

function ProtectedRoute({ isAuthenticated, children }) {
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  const { currentMode } = useStateContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // ⚠️ Replace this with your actual auth logic (e.g., Context, Redux, etc.)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
<div className={currentMode === "Dark" ? "dark" : ''}>
      <BrowserRouter>
        <div className="flex relative dark:bg-main-dark-bg">
          {isAuthenticated && (
            <div className={`fixed h-screen transition-all duration-300 bg-white dark:bg-secondary-dark-bg 
              ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
              <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg w-full z-40 shadow-md">
                <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
              </div>
            </div>
          )}

          <div className={`min-h-screen transition-all duration-300 flex-1 
            ${isAuthenticated ? (isSidebarOpen ? 'ml-64' : 'ml-20') : 'ml-0'}`}>
            <div className="mt-16 p-5">
              <Routes>
                <Route path="/" element={
                  isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
                } />
                <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                
                <Route path="/dashboard" element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <Ecommerce />
                  </ProtectedRoute>
                } />
                <Route path="/solutions" element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <SolutionsTable />
                  </ProtectedRoute>
                } />
                <Route path="/startup-reg" element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <StartupTable />
                  </ProtectedRoute>
                } /> 
                <Route path="/career" element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <JobsDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/events" element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <EventDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/cofounder-reg" element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <CofounderTable />
                  </ProtectedRoute>
                } />
                <Route path="/business-idea-hub" element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <BusinessesTable />
                  </ProtectedRoute>
                } />
                <Route path="/business-consultation" element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <BusinessTableConsultation />
                  </ProtectedRoute>
                } />
                <Route path="/careers-apply" element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <RecruitmentsTable />
                  </ProtectedRoute>
                } />
                <Route path="/admin-testimonial" element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <AdminTestimonials />
                  </ProtectedRoute>
                } />
                <Route path="/admin-investors" element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <AdminInvestors />
                  </ProtectedRoute>
                } />
                <Route path="/fundings" element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <FundingDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/jobs/:userId" element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <JobsByUser />
                  </ProtectedRoute>
                } />
                <Route path="/admin/application/:id" element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <ApplicationDetail />
                  </ProtectedRoute>
                } />
                <Route path="/addadmin" element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <AdminManager />
                  </ProtectedRoute>
                } />
                 <Route path="/registrations/:eventId" element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <RegistrationTable />
                  </ProtectedRoute>
                } />
                 <Route path="/datamanager" element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <StageSectorIndustryUI />
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
