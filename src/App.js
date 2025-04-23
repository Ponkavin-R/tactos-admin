import { BrowserRouter, Route, Routes } from 'react-router-dom';
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

function App() {
  const { currentMode } = useStateContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className={currentMode === "Dark" ? "dark" : ''}>
      <BrowserRouter>
        <div className="flex relative dark:bg-main-dark-bg">

          {/* Sidebar Area */}
          <div
            className={`fixed h-screen transition-all duration-300 bg-white dark:bg-secondary-dark-bg 
              ${isSidebarOpen ? 'w-64' : 'w-20'}`}
          >
            {/* Navbar inside sidebar area */}
            <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg w-full z-40 shadow-md">
              <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            </div>
          </div>

          {/* Main Content Area */}
          <div
            className={`min-h-screen transition-all duration-300 flex-1 
              ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}
          >
            {/* Page content */}
            <div className="mt-16 p-5">
              <Routes>
                <Route path='/' element={<Ecommerce />} />
                <Route path='/solutions' element={<SolutionsTable />} />
                <Route path='/startup-reg' element={<StartupTable />} />
                <Route path='/career' element={<AdminCareers />} />
                <Route path='/events' element={<EventDashboard />} />
                <Route path='/cofounder-reg' element={<CofounderTable />} />
                <Route path='/business-idea-hub' element={<BusinessesTable />} />
                <Route path='/business-consultation' element={<BusinessTableConsultation />} />
                <Route path='/careers-apply' element={<RecruitmentsTable />} />
              </Routes>
            </div>
          </div>

        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
