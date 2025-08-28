import React from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
/**
 * A wrapper component to protect routes, ensuring only authenticated
 * 'brand' users can access them.
 *
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - The child components to render if the user is authenticated.
 * @returns {React.ReactNode} The protected children or a redirection component.
 */
const ProtectedRoute = ({ children }) => {
    const sessionString = localStorage.getItem('userSession');
    let user = null;
    let isAuthenticated = false;

    try {
        if (sessionString) {
            const sessionData = JSON.parse(sessionString);
            // Check for the specific 'brand' user type
            if (sessionData && sessionData.user_type === 'brand') {
                user = sessionData;
                isAuthenticated = true;
                console.log("logged in");
            }
        }
    } catch (error) {
        console.error("Failed to parse user session from localStorage:", error);
    }

    if (!isAuthenticated) {
        toast.error("You need to log in as a brand to access this page.");
        // Redirect to the login page
        return <Navigate to="/" replace />;
    }

    // Pass the user data down to the child component
    return React.cloneElement(children, { user });
};

export default ProtectedRoute;
