import React, { useEffect, useState } from 'react';
import './LeaseProperties.css';
import Sidebar from './Sidebar';
import { getApiUrl } from '../utils/api';

const LeaseProperties = () => {
    // State to hold the fetched data
    const [properties, setProperties] = useState([]);
    // State to manage which row's details are expanded
    const [expandedRowId, setExpandedRowId] = useState(null);
    // State to handle loading and errors
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch data from the API on component mount
    useEffect(() => {
        const apiUrl = getApiUrl('get-lease-properties.php');

        fetch(apiUrl)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(data => {
                if (data.status === "success" && Array.isArray(data.data)) {
                    setProperties(data.data);
                } else {
                    setProperties([]);
                }
            })
            .catch(err => {
                console.error("Error fetching lease properties:", err);
                setError(err.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    // Function to toggle the expanded details of a row
    const toggleDetails = (propertyKey) => {
        setExpandedRowId(expandedRowId === propertyKey ? null : propertyKey);
    };

    return (
        <div className="lease-properties-page">
            <Sidebar />
            <div className="lease-properties-content">
                <h2 className="lease-properties-title">Lease Property Inquiries</h2>
                
                {isLoading ? (
                    <div className="text-center text-lg text-gray-500">Loading...</div>
                ) : error ? (
                    <div className="text-center text-lg text-red-500">Error: {error}</div>
                ) : (
                    <div className="lease-properties-table-wrapper">
                        <table className="lease-properties-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Owner Name</th>
                                    <th>Contact</th>
                                    <th>Expected Rent</th>
                                    <th>Property Type</th>
                                    <th>View Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {properties.length > 0 ? (
                                    properties.map((prop, idx) => (
                                        <React.Fragment key={prop.property_key}>
                                            <tr className="hover:bg-gray-100 transition-colors duration-200">
                                                <td>{idx + 1}</td>
                                                <td>{prop.owner_name}</td>
                                                <td>{prop.contact}</td>
                                                <td>₹{prop.expected_rent}</td>
                                                <td>{prop.property_type}</td>
                                                <td>
                                                    <button 
                                                        onClick={() => toggleDetails(prop.property_key)}
                                                        className="details-toggle-button"
                                                    >
                                                        {expandedRowId === prop.property_key ? 'Hide Details' : 'View Details'}
                                                    </button>
                                                </td>
                                            </tr>
                                            {expandedRowId === prop.property_key && (
                                                <tr className="detailed-row">
                                                    <td colSpan="6" className="p-4">
                                                        <div className="detailed-content">
                                                            <p><strong>Email:</strong> {prop.email}</p>
                                                            <p><strong>Address:</strong> {prop.address}</p>
                                                            <p><strong>SQFT:</strong> {prop.sqft}</p>
                                                            <p><strong>Floor Type:</strong> {prop.floor_type}</p>
                                                            <p><strong>State:</strong> {prop.state_name}</p>
                                                            <p><strong>City:</strong> {prop.city_name}</p>
                                                            <p><strong>Message:</strong> {prop.message}</p>
                                                            <p><strong>Created At:</strong> {prop.created_at}</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 text-gray-500">No lease properties found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaseProperties;
