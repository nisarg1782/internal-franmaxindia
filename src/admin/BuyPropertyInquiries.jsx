// File: src/components/BuyPropertyInquiries.jsx
import React, { useEffect, useState } from 'react';
import './buyProperty.css';
import Sidebar from './Sidebar';
import { getApiUrl } from '../utils/api'; // ✅ Import the global API utility

const BuyPropertyInquiries = () => {
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    fetch(getApiUrl('get-buy-property-inquiries.php')) // ✅ Use the helper here
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          setInquiries(data.inquiries);
        }
      });
  }, []);

  return (
    <div className="snb-buyprop-page">
      <Sidebar />
      <div className="snb-buyprop-content">
        <h2 className="snb-buyprop-title">Buy Running Business Inquiries</h2>
        <div className="snb-buyprop-table-wrapper">
          <table className="snb-buyprop-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Business Name</th>
                <th>Full Name</th>
                <th>Contact</th>
                <th>Email</th>
                <th>State</th>
                <th>City</th>
                <th>Message</th>
                <th>Inquiry Date</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inq, idx) => (
                <tr key={inq.id}>
                  <td>{idx + 1}</td>
                  <td>{inq.business_name}</td>
                  <td>{inq.name}</td>
                  <td>{inq.number}</td>
                  <td>{inq.email}</td>
                  <td>{inq.state_name}</td>
                  <td>{inq.city_name}</td>
                  <td>{inq.message}</td>
                  <td>{inq.created_at}</td>
                </tr>
              ))}
              {inquiries.length === 0 && (
                <tr><td colSpan="12" style={{ textAlign: 'center' }}>No inquiries found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BuyPropertyInquiries;
