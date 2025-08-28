// File: src/components/BuyPropertyInquiries.jsx
import React, { useEffect, useState } from 'react';
import './SellBusinessInquiries.css'; // Ensure this path is correct
import Sidebar from './Sidebar';
import { getApiUrl } from '../utils/api';

const BuyPropertyInquiries = () => {
    const [inquiries, setInquiries] = useState([]);
    const [expandedRowId, setExpandedRowId] = useState(null);

    useEffect(() => {
        fetch(getApiUrl('get-sell-business-inquiries.php'))
            .then(res => res.json())
            .then(data => {
                if (data.status === "success") {
                    setInquiries(data.inquiries);
                }
            });
    }, []);

    const toggleDetails = (id) => {
        setExpandedRowId(expandedRowId === id ? null : id);
    };

    return (
        <div className="snb-buyprop-page">
            <Sidebar />
            <div className="snb-buyprop-content">
                <h2 className="snb-buyprop-title">Sell Business Inquiries</h2>
                <div className="snb-buyprop-table-wrapper">
                    <table className="snb-buyprop-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Business Name</th>
                                <th>Full Name</th>
                                <th>Contact</th>
                                <th>Inquiry Date</th>
                                <th>View Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inquiries.length > 0 ? (
                                inquiries.map((inq, idx) => (
                                    <React.Fragment key={inq.id}>
                                        <tr className="snb-overview-row">
                                            <td>{idx + 1}</td>
                                            <td>{inq.business_name}</td>
                                            <td>{inq.full_name}</td>
                                            <td>{inq.contact}</td>
                                            <td>{inq.created_at}</td>
                                            <td className="snb-details-toggle">
                                                <button onClick={() => toggleDetails(inq.id)}>
                                                    {expandedRowId === inq.id ? 'Hide Details' : 'View Details'}
                                                </button>
                                            </td>
                                        </tr>
                                        {expandedRowId === inq.id && (
                                            <tr className="snb-detailed-row">
                                                <td colSpan="6">
                                                    <div className="snb-details-content">
                                                        <p><strong>Email:</strong> {inq.email}</p>
                                                        <p><strong>Address:</strong> {inq.full_address}</p>
                                                        <p><strong>Asking Price:</strong> {inq.expected_amount}</p>
                                                        <p><strong>State:</strong> {inq.state_name}</p>
                                                        <p><strong>City:</strong> {inq.city_name}</p>
                                                        <p><strong>Message:</strong> {inq.description}</p>
                                                        <p><strong>Sector:</strong> {inq.sector_name}</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center' }}>No inquiries found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BuyPropertyInquiries;