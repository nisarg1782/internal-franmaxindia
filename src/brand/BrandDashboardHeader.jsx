import React, { useState, useEffect } from 'react';
import './brandDashboard.css';
import { useNavigate } from 'react-router-dom';

const BrandDashboardHeader = () => {
    // State to store the brand name, with a default fallback value.
    const [brandName, setBrandName] = useState('Brand');
      const navigate = useNavigate();

    useEffect(() => {
        try {
            // Retrieve the session data from localStorage.
            const sessionString = localStorage.getItem('userSession');
            
            if (sessionString) {
                // If a session string exists, parse it.
                const sessionData = JSON.parse(sessionString);
                
                // Check if the parsed data is valid and contains a name.
                // The '|| "Brand"' part is a safeguard. If sessionData.name is undefined, null,
                // or an empty string, it will default to "Brand".
                setBrandName(sessionData.name || 'Brand');
            }
            else{
                navigate("/")
            //    setBrandName( 'Brand');
            }
        } catch (error) {
            // Handle cases where localStorage is not accessible or the JSON is malformed.
            console.error("Failed to retrieve or parse user session:", error);
            // In case of an error, the state will remain its default value of 'Brand'.
        }
    }, []); // The empty dependency array ensures this effect runs only once on component mount.

    return (
        <header className="brand-header">
            {/* Display the personalized greeting using the state variable */}
            <h1>Welcome, {brandName}!</h1>
        </header>
    );
};

export default BrandDashboardHeader;