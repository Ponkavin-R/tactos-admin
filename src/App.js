import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Navbar} from './components';

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

function App() { 
  const { activeMenu, currentMode } = useStateContext();


  return (
    <div className={currentMode === "Dark" ? "dark" : ''}>
      <BrowserRouter>
        <div className='flex relative dark:bg-main-dark-bg'>

          {/* Floating Settings Button */}
          {/* <div className='fixed bottom-4 right-4' style={{ zIndex: 1000 }}>
            <TooltipComponent content="Settings" position='TopCenter'>
              <button 
                type='button' 
                className='p-3 text-3xl hover:drop-shadow-xl hover:bg-light-gray text-white' 
                style={{ background: currentColor, borderRadius: '50%' }}
                onClick={() => setThemeSetting(!themeSetting)}
              >
                <FiSettings />
              </button>
            </TooltipComponent>
          </div> */}

          {/* Sidebar */}
          <div className={`fixed dark:bg-secondary-dark-bg bg-white h-screen transition-all duration-300 ${activeMenu ? "w-72" : "w-20"}`}>
          </div>

          {/* Main Content Section */}
          <div className={`flex-1 min-h-screen transition-all duration-300 ${activeMenu ? 'ml-72' : 'ml-20'}`}>

            {/* Navbar */}
            <div className='fixed md:static bg-main-bg dark:bg-main-dark-bg w-full z-40 shadow-md'>
              <Navbar />
            </div>

            {/* Page Content Below Navbar */}
            <div className="mt-16 p-5">
              
              <Routes>
                {/* Dashboard */}
                <Route path='/' element={<Ecommerce />} />
                <Route path='/solutions' element={<SolutionsTable/>} />
                <Route path='/startup-reg' element={<StartupTable />} />
                <Route path='/career' element={<AdminCareers/>} />
                <Route path='/events' element={<EventDashboard />} />
                <Route path='/cofounder-reg' element={<CofounderTable/>} />
                <Route path='/business-idea-hub' element={<BusinessesTable />} />
                <Route path='/business-consultation' element={<BusinessTableConsultation />} />

              </Routes>
            </div>

          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
