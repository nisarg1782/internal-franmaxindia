import React, { useState, useEffect } from 'react';
import './BrandInquiries.css';
import Sidebar from './Sidebar';
import { getApiUrl } from '../utils/api';

export default function InquiryTable() {
  const [inquiries, setInquiries] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const res = await fetch(getApiUrl('get-all-brand-inquiries.php'));
        const data = await res.json();
        setInquiries(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch inquiries.');
        setLoading(false);
      }
    };
    fetchInquiries();
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <h2 className="table-title">Investor Inquiries</h2>

        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error">{error}</div>}

        {!loading && !error && (
          <div className="table-wrapper">
            <table className="inquiry-table">
              <thead>
                <tr>
                  <th>Brand Name</th>
                  <th>Person Name</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inquiry) => (
                  <React.Fragment key={inquiry.id}>
                    <tr className="summary-row">
                      <td>{inquiry.brand_name}</td>
                      <td>{inquiry.name}</td>
                      <td>{inquiry.phone}</td>
                      <td>{inquiry.status}</td>
                      <td>
                        <button onClick={() => toggleExpand(inquiry.id)} className="expand-btn">
                          {expandedId === inquiry.id ? 'Hide Details' : 'View Details'}
                        </button>
                      </td>
                    </tr>
                    {expandedId === inquiry.id && (
                      <tr className="details-row">
                        <td colSpan="5">
                          <div className="details-box">
                            <p><strong>Email:</strong> {inquiry.email}</p>
                            <p><strong>Message:</strong> {inquiry.message}</p>
                            <p><strong>Date:</strong> {inquiry.date}</p>
                            <p><strong>Remark:</strong> {inquiry.remark}</p>
                            <p><strong>Comment:</strong> {inquiry.comment || 'N/A'}</p>
                            <p><strong>Last Updated:</strong> {inquiry.updated_at}</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
