// File: Dashboard.jsx
import React from 'react';
import Sidebar from './Sidebar';
import './dashboard.css';

const Dashboard = () => {
  return (
    <div className="snb-dashboard-container">
      <Sidebar />
      <main className="snb-dashboard-main">
        <h1>Admin Dashboard</h1>
        <div className="snb-card-grid">
          {[
            'Total Investors',
            'Total Brands',
            'Total Inquiries',
            'Marketing Inquiries',
            'Leasing Inquiries'
          ].map((title, idx) => (
            <div className="snb-card" key={idx}>
              <h2>{title}</h2>
              <p>{Math.floor(Math.random() * 500 + 50)}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
