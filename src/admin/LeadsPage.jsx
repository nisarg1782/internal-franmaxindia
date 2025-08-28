import React, { useState, useEffect, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { FaPlusCircle } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

import Sidebar from './Sidebar';
import AssignModal from './AssignModal'; // New modal component for assignment
import './InvestorPage.css';
import './DashboardLayout.css';

import { getApiUrl } from '../utils/api';

export default function InvestorTable() {
    const [investors, setInvestors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedInvestor, setSelectedInvestor] = useState(null);

    const fetchInvestors = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(getApiUrl('get-generic-inquiries.php'));
            const result = await response.json();
            if (result.success) {
                setInvestors(result.data);
                setError(null);
            } else {
                toast.error(result.message || 'Failed to fetch inquiries.');
                setError(result.message);
            }
        } catch (e) {
            toast.error('Network error. Please check your server connection.');
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInvestors();
    }, [fetchInvestors]);

    const openAssignModal = (investor) => {
        setSelectedInvestor(investor);
        setShowAssignModal(true);
    };

    const closeAssignModal = () => {
        setSelectedInvestor(null);
        setShowAssignModal(false);
    };

    const handleAssignmentSuccess = () => {
        toast.success("Investor Assigned Successfully!");
        fetchInvestors();
        closeAssignModal();
    };

    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="main-content">
                <ToastContainer position="top-right" autoClose={3000} />
                <div className="investor-table-container">
                    <div className="table-header">
                        <h2 className="table-title">All Inquiries</h2>
                    </div>
                    {loading ? (
                        <div className="loading">Loading inquiries...</div>
                    ) : error ? (
                        <div className="error">Error: {error}</div>
                    ) : investors.length === 0 ? (
                        <div className="no-data">No Inquiries found.</div>
                    ) : (
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Person Name</th>
                                        <th>Phone</th>
                                        <th>Email</th>
                                        <th>State</th>
                                        <th>City</th>
                                        <th>Message</th>
                                        <th>Assign</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {investors.map((inv) => (
                                        <tr key={inv.id}>
                                            <td>{inv.name}</td>
                                            <td>{inv.phone}</td>
                                            <td>{inv.email}</td>
                                            <td>{inv.state_name}</td>
                                            <td>{inv.city_name}</td>
                                            <td>{inv.message}</td>
                                            <td>
                                                <button
                                                    className="assign-btn"
                                                    onClick={() => openAssignModal(inv)}
                                                >
                                                    Assign
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                {showAssignModal && (
                    <AssignModal
                        investor={selectedInvestor}
                        onClose={closeAssignModal}
                        onAssign={handleAssignmentSuccess}
                    />
                )}
            </div>
        </div>
    );
}