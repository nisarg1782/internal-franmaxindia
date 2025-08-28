// File: src/components/PartnerInquiries.jsx
import React, { useEffect, useState } from 'react';
import './PartnerInquiries.css'; // Assuming the CSS file path is correct
import Sidebar from './Sidebar';
import { getApiUrl } from '../utils/api';

const PartnerInquiries = () => {
    // State to hold the inquiries data
    const [inquiries, setInquiries] = useState([]);
    // State to track which row's details are expanded
    const [expandedRowId, setExpandedRowId] = useState(null);

    useEffect(() => {
        // Fetch data from the PHP API.
        // NOTE: Make sure the URL 'get-franchise-inquiries.php' points to your actual PHP API file.
        fetch(getApiUrl('get-partner-inquiries.php'))
            .then(res => {
                // Check if the response is ok
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(data => {
                // The API returns an object with a 'data' key containing the array of inquiries.
                if (data && data.data) {
                    setInquiries(data.data);
                } else {
                    console.error("API response is missing 'data' key:", data);
                }
            })
            .catch(error => {
                console.error("Failed to fetch inquiries:", error);
            });
    }, []);

    // Function to toggle the expanded view of a row
    const toggleDetails = (id) => {
        setExpandedRowId(expandedRowId === id ? null : id);
    };

    return (
        <div className="partner-inquiry-page">
            <Sidebar />
            <div className="partner-inquiry-content">
                <h2 className="partner-inquiry-title">Partner Inquiries</h2>
                <div className="partner-inquiry-table-wrapper">
                    <table className="partner-inquiry-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Contact</th>
                                <th>Inquiry Date</th>
                                <th>View Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inquiries.length > 0 ? (
                                inquiries.map((inq, idx) => (
                                    <React.Fragment key={inq.id}>
                                        <tr className="partner-inquiry-overview-row">
                                            <td>{idx + 1}</td>
                                            <td>{inq.name}</td>
                                            <td>{inq.contact}</td>
                                            <td>{inq.created_at}</td>
                                            <td className="partner-inquiry-details-toggle">
                                                <button onClick={() => toggleDetails(inq.id)}>
                                                    {expandedRowId === inq.id ? 'Hide Details' : 'View Details'}
                                                </button>
                                            </td>
                                        </tr>
                                        {expandedRowId === inq.id && (
                                            <tr className="partner-inquiry-detailed-row">
                                                <td colSpan="5">
                                                    <div className="partner-inquiry-details-content">
                                                        <p><strong>Email:</strong> {inq.email}</p>
                                                        <p><strong>Interested in Franmax:</strong> {inq.interested_in_franmax}</p>
                                                        <p><strong>State:</strong> {inq.state_name}</p>
                                                        <p><strong>City:</strong> {inq.city_name}</p>
                                                        <p><strong>Message:</strong> {inq.message}</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center' }}>No inquiries found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default PartnerInquiries;