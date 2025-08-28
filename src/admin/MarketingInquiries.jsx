import React, { useEffect, useState } from 'react';
import './marketing.css';
import Sidebar from './Sidebar';
import { getApiUrl } from '../utils/api'; // ✅ Import helper

const MarketingInquiries = () => {
    const [inquiries, setInquiries] = useState([]);
    const [show, setShow] = useState({});
    const roleId = 1; // Replace with session or context
    const userId = 1; // Replace with session or context

    useEffect(() => {
        fetch(getApiUrl('get-marketing-inquiries.php')) // ✅ Use helper
            .then(res => res.json())
            .then(data => {
                if (data.status === "success") {
                    setInquiries(data.inquiries);
                }
            });
    }, []);

    const toggle = async (id, field) => {
        const alreadyShown = show[id]?.[field];

        if (!alreadyShown) {
            try {
                await fetch(getApiUrl('log-marketing-view.php'), { // ✅ Use helper
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        inquiry_id: id,
                        role_id: roleId,
                        user_id: userId,
                        field: field
                    }),
                });

                setShow(prev => ({
                    ...prev,
                    [id]: {
                        ...prev[id],
                        [field]: true
                    }
                }));

            } catch (err) {
                console.error("Failed to log view:", err);
            }
        }
    };

    return (
        <div className="snb-marketing-page">
            <Sidebar />
            <div className="snb-marketing-content">
                <h2 className="snb-marketing-title">Marketing Inquiries</h2>
                <div className="snb-marketing-table-wrapper">
                    <table className="snb-marketing-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Brand</th>
                                <th>State</th>
                                <th>City</th>
                                <th>Services</th>
                                <th>Contact</th>
                                <th>Email</th>
                                <th>Inquiry Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inquiries.map((inq, idx) => (
                                <tr key={inq.id}>
                                    <td>{idx + 1}</td>
                                    <td>{inq.name}</td>
                                    <td>{inq.brand_name}</td>
                                    <td>{inq.state_name}</td>
                                    <td>{inq.city_name}</td>
                                    <td>{inq.services}</td>
                                    <td>
                                        {show[inq.id]?.contact ? (
                                            inq.contact
                                        ) : (
                                            <button onClick={() => toggle(inq.id, "contact")} className="snb-show-btn">Show</button>
                                        )}
                                    </td>
                                    <td>
                                        {show[inq.id]?.email ? (
                                            inq.email
                                        ) : (
                                            <button onClick={() => toggle(inq.id, "email")} className="snb-show-btn">Show</button>
                                        )}
                                    </td>
                                    <td>{inq.created_at}</td>
                                </tr>
                            ))}
                            {inquiries.length === 0 && (
                                <tr><td colSpan="9" style={{ textAlign: 'center' }}>No inquiries found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MarketingInquiries;
