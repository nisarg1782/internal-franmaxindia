import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import { toast } from 'react-toastify'; // Import toast for logout message
import './sidebar.css'; // Ensure this path is correct
import {
  FaChevronDown, FaChevronRight, FaBuilding, FaUserTie,
  FaBullhorn, FaCity, FaUsers, FaUserCircle, FaThLarge, FaBars, FaTimes
} from 'react-icons/fa';

const Sidebar = () => {
  // State to manage the collapse/expand status of each menu section
  const [sectionCollapsed, setSectionCollapsed] = useState({
    master: false, // Set initial state to open for better visibility
    franchising: false, 
    marketing: false,
    leasing: false,
    admin: false,
  });

  // State to manage the overall collapse/expand status of the sidebar itself
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // States to hold admin user's name and email from localStorage
  const [adminName, setAdminName] = useState('Guest');
  const [adminEmail, setAdminEmail] = useState('');

  // Hook from react-router-dom for programmatic navigation
  const navigate = useNavigate();

  // Effect to read admin information from localStorage when the component mounts
  useEffect(() => {
    const storedAdminName = localStorage.getItem('adminName');
    const storedAdminEmail = localStorage.getItem('adminEmail');
    if (storedAdminName) {
      setAdminName(storedAdminName);
    }
    if (storedAdminEmail) {
      setAdminEmail(storedAdminEmail);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Toggles the collapse/expand state of a specific menu section
  const toggleSection = (section) => {
    setSectionCollapsed((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handles the logout action
  const handleLogout = () => {
    // ✅ This is where localStorage items are removed
    localStorage.removeItem('adminId');
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminEmail');
    
    toast.info('You have been logged out.'); // Show a logout message
    navigate('/admin/login'); // Redirect to the login page
  };

  return (
    <aside className={`snbs-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="snbs-sidebar-header">
        <div className="snbs-logo">
          {!sidebarCollapsed && (
            <>
              <h2>FRANMAX INDIA</h2>
              {/* Display admin's name and email */}
              <p className="snbs-role">Welcome, {adminName}</p>
              {adminEmail && <p className="snbs-email">{adminEmail}</p>}
            </>
          )}
        </div>
        {/* Button to toggle sidebar collapse/expand */}
        <button
          className="snbs-toggle-btn"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          {sidebarCollapsed ? <FaBars /> : <FaTimes />}
        </button>
      </div>

      <nav className="snbs-menu">
        {/* Master Section */}
        
        {/* Franchising Section */}
        <div className="snbs-section">
          <div className="snbs-section-header" onClick={() => toggleSection('franchising')}>
            <span>FRANCHISING</span>
            {sectionCollapsed.franchising ? <FaChevronDown /> : <FaChevronRight />}
          </div>
          {sectionCollapsed.franchising && !sidebarCollapsed && (
            <>
              <Link to="/admin/brand-list" className="snbs-link"><FaBuilding /> Brand</Link>
              <Link to="/admin/investors" className="snbs-link"><FaUserTie /> Investor</Link>
              <Link to="/admin/leads" className="snbs-link"><FaUserTie />Generic Inquiries</Link>
              <Link to="/admin/brand-inquiries" className="snbs-link"><FaUserTie />Brand Specific Inquiries</Link>
              <Link to="/admin/partner-inquiries" className="snbs-link"><FaUserTie />Partner Inquiries</Link>
               <Link to="/admin/newsletter" className="snbs-link"><FaUserTie />Newsletter</Link>
                <Link to="/admin/faq" className="snbs-link"><FaUserTie />FAQ</Link>
                <Link to="/admin/event"  className="snbs-link"><FaUserTie />Event</Link>
            </>
          )}
        </div>
        
        {/* Marketing Section */}
        <div className="snbs-section">
          <div className="snbs-section-header" onClick={() => toggleSection('marketing')}>
            <span>MARKETING</span>
            {sectionCollapsed.marketing ? <FaChevronDown /> : <FaChevronRight />}
          </div>
          {sectionCollapsed.marketing && !sidebarCollapsed && (
            <Link to="/admin/marketing-inquiries" className="snbs-link"><FaBullhorn /> Marketing</Link>
          )}
        </div>

        {/* Leasing Section */}
        <div className="snbs-section">
          <div className="snbs-section-header" onClick={() => toggleSection('leasing')}>
            <span>LEASING</span>
            {sectionCollapsed.leasing ? <FaChevronDown /> : <FaChevronRight />}
          </div>
          {sectionCollapsed.leasing && !sidebarCollapsed && (
            <>
              <Link to="#" className="snbs-link"><FaCity /> Buy Lease Property inquiries</Link>
              <Link to="/admin/lease-properties" className="snbs-link"><FaCity /> Lease Property inquiries</Link>
              
              <Link to="#" className="snbs-link"><FaCity /> Sell Property</Link>
              <Link to="/admin/buy-business-inquiries" className="snbs-link"><FaCity />Buy Business Inquiry</Link>
              <Link to="/admin/sell-business-inquiries" className="snbs-link"><FaCity /> Sell Business</Link>
            </>
          )}
        </div>

        {/* Admin Section */}
        <div className="snbs-section">
          <div className="snbs-section-header" onClick={() => toggleSection('admin')}>
            <span>ADMIN</span>
            {sectionCollapsed.admin ? <FaChevronDown /> : <FaChevronRight />}
          </div>
          {sectionCollapsed.admin && !sidebarCollapsed && (
            <>
              <Link to="/user-list" className="snbs-link"><FaUsers /> Users</Link>
          
              {/* Logout link calls the handleLogout function */}
              <Link to="#" onClick={handleLogout} className="snbs-link"><FaThLarge /> Logout</Link>
            </>
          )}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
