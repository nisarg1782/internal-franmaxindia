import React, { useState, useEffect, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { FaPlusCircle } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

import InvestorModal from './InvestorModal'; // Use the renamed modal component
import './InvestorPage.css';
import './DashboardLayout.css';
import Sidebar from './Sidebar';

// Import the API helper function
import { getApiUrl } from '../utils/api';

export default function InvestorTable() {
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInvestorModal, setShowInvestorModal] = useState(false); // Modal visibility state
  const [editingInvestor, setEditingInvestor] = useState(null); // State to store the investor being edited

  // Memoized function to fetch investor data
  const fetchInvestors = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(getApiUrl('get-offline-investors.php'));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.success) {
        setInvestors(result.data);
        setError(null);
      } else {
        toast.error(result.message || "Failed to fetch investors.");
        setError(result.message);
      }
    } catch (e) {
      toast.error("🚫 Network error. Please check your server connection.");
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvestors();
  }, [fetchInvestors]);

  // Handler for opening the modal to add a new investor
  const handleAddInvestorClick = () => {
    setEditingInvestor(null); // Clear any existing editing state
    setShowInvestorModal(true);
  };

  // Handler for opening the modal to edit an existing investor
  const handleEditInvestorClick = (investor) => {
    setEditingInvestor(investor);
    setShowInvestorModal(true);
  };

  // Handler to close the modal and reset editing state
  const handleCloseModal = () => {
    setShowInvestorModal(false);
    setEditingInvestor(null); // Clear the editing state
  };
  
  // This function is passed to the modal and is called upon successful form submission
  const handleFormSubmissionSuccess = () => {
    fetchInvestors(); // Refresh the table data
    handleCloseModal(); // Close the modal
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="main-content">
          <div className="investor-table-container">
            <h2 className="table-title">Offline Investors</h2>
            <div className="loading">Loading investors...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="main-content">
          <div className="investor-table-container">
            <h2 className="table-title">Offline Investors</h2>
            <div className="error">Error: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="investor-table-container">
          <div className="table-header">
            <h2 className="table-title">Offline Investors</h2>
            <button className="add-investor-btn" onClick={handleAddInvestorClick}>
              <FaPlusCircle className="btn-icon" />
              Add Investor
            </button>
          </div>
          {investors.length === 0 ? (
            <div className="no-data">No investors found.</div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Mobile</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Mode</th>
                   
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {investors.map((investor) => (
                    <tr key={investor.id}>
                      <td data-label="Name">{investor.name}</td>
                      <td data-label="Mobile">{investor.mobile}</td>
                      <td data-label="Email">{investor.email}</td>
                      <td data-label="Status" className={investor.status === 'active' ? 'status-active' : 'status-not-active'}>
                        {investor.status}
                      </td>
                        <td data-label="Mode">{investor.mode}</td>
                      <td data-label="Actions">
                        <button 
                          className="action-btn edit-btn"
                          onClick={() => handleEditInvestorClick(investor)}
                        >
                          Edit
                        </button>
                        <button className="action-btn delete-btn">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <InvestorModal 
          show={showInvestorModal} 
          onClose={handleCloseModal} 
          onFormSubmissionSuccess={handleFormSubmissionSuccess}
          editingInvestor={editingInvestor}
        />
      </div>
    </div>
  );
}
