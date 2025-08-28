// File: src/components/EventRegisterPage.jsx
import React, { useEffect, useState } from 'react';
import './buyProperty.css';
import Sidebar from './Sidebar';
import { getApiUrl } from '../utils/api';
import * as XLSX from 'xlsx';

const EventRegisterPage = () => {
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    fetch(getApiUrl('get-event-registration.php'))
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setInquiries(data.data);
        }
      })
      .catch(err => console.error("Failed to fetch event registrations:", err));
  }, []);

  const exportExcel = () => {
    // Prepare table data
    const worksheetData = [
      ['ID', 'Full Name', 'Contact', 'Email', 'State', 'City', 'Registration Date',"Register_User_Id"],
      ...inquiries.map((inq, idx) => [
        inq.id,
        inq.name,
        inq.contact,
        inq.email,
        inq.state_name,
        inq.city_name,
        inq.register_date,
       inq.register_user_id + inq.id,
      ]),
    ];

    // Create worksheet and workbook
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Event Registrations');

    // Export to file
    XLSX.writeFile(workbook, 'event-registrations.xlsx');
  };

  return (
    <div className="snb-buyprop-page">
      <Sidebar />
      <div className="snb-buyprop-content">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h2 className="snb-buyprop-title">Event Registration Inquiries</h2>
          <button onClick={exportExcel} className="export-btn">Export to Excel</button>
        </div>

        <div className="snb-buyprop-table-wrapper">
          <table className="snb-buyprop-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Contact</th>
                <th>Email</th>
                <th>State</th>
                <th>City</th>
                <th>Source</th>
                <th>Registration Date</th>
                <th>Register_User_Id</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inq, idx) => (
                <tr key={inq.id}>
                  <td>{inq.id}</td>
                  <td>{inq.name}</td>
                  <td>{inq.contact}</td>
                  <td>{inq.email}</td>
                  <td>{inq.state_name}</td>
                  <td>{inq.city_name}</td>
                  <td>{inq.source}</td>
                  <td>{inq.register_date}</td>
                  <td>{inq.register_user_id}.{inq.id}</td>
                </tr>
              ))}
              {inquiries.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>
                    No inquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EventRegisterPage;
