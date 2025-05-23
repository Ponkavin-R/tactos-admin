import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { MdMenu, MdClose } from "react-icons/md";
import { FiHome } from "react-icons/fi";
import { AiOutlineSolution, AiOutlineTeam, AiOutlineBulb, AiOutlineFundProjectionScreen } from "react-icons/ai";
import { FaRegCalendarAlt, FaUserTie, FaHandshake } from "react-icons/fa";
import { MdBusinessCenter, MdOutlineRateReview ,MdLibraryAdd} from "react-icons/md";
import { BsFillPersonBadgeFill } from "react-icons/bs";
import { RiAdminLine } from "react-icons/ri";


const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [activeTab, setActiveTab] = useState("/");
  const location = useLocation();

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <motion.aside
      animate={{ width: isSidebarOpen ? "16rem" : "5rem" }}
      className="fixed top-0 left-0 h-screen overflow-y-auto bg-gray-900 text-white p-4 shadow-lg z-50 flex flex-col transition-all duration-300"
    >
      <button
        onClick={toggleSidebar}
        className="text-white text-2xl self-end mb-4"
      >
        {isSidebarOpen ? <MdClose /> : <MdMenu />}
      </button>

      <nav className="flex flex-col space-y-2 text-sm">
  <NavItem
    to="/"
    icon={<FiHome />}
    label="Home"
    activeTab={activeTab}
    setActiveTab={setActiveTab}
    isSidebarOpen={isSidebarOpen}
  />
  <NavItem
    to="/solutions"
    icon={<AiOutlineSolution />}
    label="Tech Support"
    activeTab={activeTab}
    setActiveTab={setActiveTab}
    isSidebarOpen={isSidebarOpen}
  />
  <NavItem
    to="/events"
    icon={<FaRegCalendarAlt />}
    label="Events"
    activeTab={activeTab}
    setActiveTab={setActiveTab}
    isSidebarOpen={isSidebarOpen}
  />
  <NavItem
    to="/career"
    icon={<MdBusinessCenter />}
    label="Jobs"
    activeTab={activeTab}
    setActiveTab={setActiveTab}
    isSidebarOpen={isSidebarOpen}
  />
  <NavItem
    to="/startup-reg"
    icon={<AiOutlineTeam />}
    label="Startup Registration"
    activeTab={activeTab}
    setActiveTab={setActiveTab}
    isSidebarOpen={isSidebarOpen}
  />
  <NavItem
    to="/cofounder-reg"
    icon={<FaUserTie />}
    label="Cofounder Registration"
    activeTab={activeTab}
    setActiveTab={setActiveTab}
    isSidebarOpen={isSidebarOpen}
  />
  <NavItem
    to="/business-idea-hub"
    icon={<AiOutlineBulb />}
    label="Business Ideation Hub"
    activeTab={activeTab}
    setActiveTab={setActiveTab}
    isSidebarOpen={isSidebarOpen}
  />
  <NavItem
    to="/business-consultation"
    icon={<FaHandshake />}
    label="Business Consultation"
    activeTab={activeTab}
    setActiveTab={setActiveTab}
    isSidebarOpen={isSidebarOpen}
  />
  <NavItem
    to="/fundings"
    icon={<AiOutlineFundProjectionScreen />}
    label="Fundings"
    activeTab={activeTab}
    setActiveTab={setActiveTab}
    isSidebarOpen={isSidebarOpen}
  />
  <NavItem
    to="/admin-testimonial"
    icon={<MdOutlineRateReview />}
    label="Testimonial"
    activeTab={activeTab}
    setActiveTab={setActiveTab}
    isSidebarOpen={isSidebarOpen}
  />
  <NavItem
    to="/admin-investors"
    icon={<BsFillPersonBadgeFill />}
    label="Investors"
    activeTab={activeTab}
    setActiveTab={setActiveTab}
    isSidebarOpen={isSidebarOpen}
  />
  <NavItem
    to="/addadmin"
    icon={<RiAdminLine />}
    label="Add Admin"
    activeTab={activeTab}
    setActiveTab={setActiveTab}
    isSidebarOpen={isSidebarOpen}
  />
   <NavItem
    to="/datamanager"
    icon={<MdLibraryAdd />}
    label="Add Data"
    activeTab={activeTab}
    setActiveTab={setActiveTab}
    isSidebarOpen={isSidebarOpen}
  />
</nav>
    </motion.aside>
  );
};

const NavItem = ({ to, icon, label, activeTab, setActiveTab, isSidebarOpen }) => {
  const isActive = activeTab === to;

  return (
    <motion.div whileTap={{ scale: 0.95 }} className="flex items-center">
      <Link
        to={to}
        onClick={() => setActiveTab(to)}
        className={`flex items-center px-3 py-2 rounded-lg transition-all w-full ${
          isActive ? "bg-blue-700 text-white" : "text-gray-300 hover:bg-gray-700"
        }`}
      >
        <span className="text-xl">{icon}</span>
        {isSidebarOpen && <span className="ml-3 font-medium">{label}</span>}
      </Link>
    </motion.div>
  );
};

export default Navbar;
