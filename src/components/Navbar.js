import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { FiHome } from "react-icons/fi";
import { AiOutlineTeam, AiOutlineBulb, AiOutlineSolution } from "react-icons/ai";
import { FaRegCalendarAlt, FaRegUser } from "react-icons/fa";
import { MdBusinessCenter, MdMenu, MdClose } from "react-icons/md";




  const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {

    const [activeTab, setActiveTab] = useState("/");
    const location = useLocation();
  
    useEffect(() => {
      setActiveTab(location.pathname);
    }, [location]);
  
    const toggleSidebar = () => {
      setIsSidebarOpen((prev) => !prev);  // <- This now calls the prop function from App
    };

  return (
    <motion.aside
      animate={{ width: isSidebarOpen ? "16rem" : "5rem" }}
      className="fixed top-0 left-0 h-full bg-gray-900 text-white p-5 shadow-lg z-50 flex flex-col transition-all duration-300"
    >
      <button onClick={toggleSidebar} className="text-white text-2xl self-end mb-4 lg:block">
        {isSidebarOpen ? <MdClose /> : <MdMenu />}
      </button>
      <nav className="flex flex-col space-y-4">
        <NavItem to="/" icon={<FiHome />} label="Home" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
        <NavItem to="/solutions" icon={<AiOutlineSolution />} label="Solutions" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
        <NavItem to="/events" icon={<FaRegCalendarAlt />} label="Events" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
        <NavItem to="/career" icon={<MdBusinessCenter />} label="Career" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
        <NavItem to="/startup-reg" icon={<AiOutlineTeam />} label="Startup Registration" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
        <NavItem to="/cofounder-reg" icon={<FaRegUser />} label="Cofounder Registration" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
        <NavItem to="/business-idea-hub" icon={<AiOutlineBulb />} label="Business Ideation Hub" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
        <NavItem to="/business-consultation" icon={<AiOutlineBulb />} label="Business Consultation" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
        <NavItem to="/careers-apply" icon={<MdBusinessCenter />} label="Jobs Applied" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
      </nav>
    </motion.aside>
  );
};

const NavItem = ({ to, icon, label, activeTab, setActiveTab, isSidebarOpen }) => {
  const isActive = activeTab === to;

  return (
    <motion.div whileTap={{ scale: 0.9 }} className="flex items-center space-x-2">
      <Link
        to={to}
        onClick={() => setActiveTab(to)}
        className={`flex items-center px-4 py-3 rounded-lg transition-all w-full ${
          isActive ? "bg-blue-700 text-white" : "text-gray-300 hover:bg-gray-700"
        }`}
      >
        <span className="text-xl">{icon}</span>
        {isSidebarOpen && <span className="ml-2 font-medium">{label}</span>}
      </Link>
    </motion.div>
  );
};

export default Navbar;
    