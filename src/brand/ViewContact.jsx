// src/components/ViewContact.jsx
import React, { useState } from 'react';
import { getApiUrl } from '../utils/api';
const ViewContact = ({ brandId, contactNumber, investorId }) => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleViewContact = async (inquiryId, brandId) => {
        try {
            const res = await fetch(getApiUrl('log-view-contact.php'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    brand_id: brandId,
                    investor_id: inquiryId, // or 101 if hardcoded
                }),
            });

            const data = await res.json(); // Wait for the JSON to be parsed
            console.log('Log response:', data);

            if (data.success) {
                // Optionally show success message or update state
            } else {
                console.error('Failed to log contact view:', data.error || 'Unknown error');
            }

        } catch (error) {
            console.error('Fetch error:', error);
        }
    };


    return (
        <div className="view-contact-box">
            {visible ? (
                <span className="visible-contact">{contactNumber}</span>
            ) : (
                <button className="view-contact-btn" onClick={handleViewContact} disabled={loading}>
                    {loading ? 'Loading...' : 'View Contact'}
                </button>
            )}
        </div>
    );
};
export default ViewContact;
