import React from 'react';
import { FaBan } from 'react-icons/fa';
import Sidebar from './Sidebar'; // Make sure the path is correct
import './DeniedPage.css'; // Optional: separate CSS file for styling

const DeniedPage = () => {
  return (
    <div className="denied-page-container">
      <Sidebar />

      <div className="denied-content">
        <div className="denied-box">
          <FaBan className="denied-icon" />
          <h1>Access Denied</h1>
          <p>You do not have permission to view this page.</p>
          <p>Please contact your administrator if you believe this is a mistake.</p>
        </div>
      </div>
    </div>
  );
};

export default DeniedPage;
