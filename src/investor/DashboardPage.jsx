import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './DashboardPage.css'; // Correctly import the CSS file

export default function InvestorDashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for user session data in localStorage
    const sessionData = localStorage.getItem('investor_session');
    if (sessionData) {
      const userData = JSON.parse(sessionData);
      // Validate that the user is an 'investor'
      if (userData.user_type === 'investor') {
        setUser(userData);
      } else {
        // Redirect if user type is not 'investor'
        navigate('/');
      }
    } else {
      // Redirect if no session data is found
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('investor_session');
    navigate('/');
  };

  if (!user) {
    // Return null or a loading indicator while checking session
    return <div>Loading...</div>;
  }

  return (
    // Updated container class to match the CSS
    <div className="app-container">
      <Sidebar onLogout={handleLogout} />
      {/* Updated dashboard content class to match the CSS */}
      <div className="dashboard-page">
        {/* Header content moved into a div to match the CSS styling */}
        <div className="dashboard-header">
          <h1 className="text-3xl font-bold mb-6">Welcome to the Investor Dashboard, {user.name}!</h1>
          <p>This is where you can view your investment opportunities and portfolio.</p>
        </div>
        {/* Placeholder for other dashboard content */}
        <div className="metrics-grid">
            {/* Example metric card */}
            <div className="metric-card">
                <div className="metric-info">
                    <span className="value">15</span>
                    <span className="title">Active Investments</span>
                </div>
            </div>
            <div className="metric-card">
                <div className="metric-info">
                    <span className="value">₹5M</span>
                    <span className="title">Total Capital</span>
                </div>
            </div>
        </div>
        <div className="charts-and-table">
            <div className="card">
                <h2>Recent Activity</h2>
                <table className="activity-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>2024-07-28</td>
                            <td>Invested in NewCo</td>
                            <td><span className="tag investment">Investment</span></td>
                        </tr>
                        <tr>
                            <td>2024-07-25</td>
                            <td>Viewed ABC Franchise</td>
                            <td><span className="tag new-opening">New Opening</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
}
