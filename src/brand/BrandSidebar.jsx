// src/brand/BrandSidebar.jsx
import React, { useState } from 'react';
import './brandDashboard.css';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

const BrandSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className={`brand-sidebar ${isOpen ? 'open' : 'collapsed'}`}>
        <div className="sidebar-header">
          {isOpen ? 'Brand CRM' : ''}
          <button className="toggle-btn" onClick={toggleSidebar}>
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        <ul className="sidebar-menu">
          <li><Link to="/brand/dashboard">🏠 {isOpen && 'Dashboard'}</Link></li>
          <li><Link to="/brand/inquiries">📨 {isOpen && 'Inquiries'}</Link></li>
          
          {/* ✅ Upload Docs link */}
          <li><Link to="/brand/upload-docs">📁 {isOpen && 'Upload Docs'}</Link></li>


          <div className="sidebar-divider" /> {/* Divider line */}

          <li><Link to="/brand/profile">👤 {isOpen && 'Profile'}</Link></li>
          <li><Link to="/pricing">💼 {isOpen && 'Pricing'}</Link></li>
          <li>
            <a href="#" onClick={() => {
              localStorage.clear(); // or your logout logic
              window.location.href = '/'; // redirect
            }}>
              🚪 {isOpen && 'Logout'}
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default BrandSidebar;
