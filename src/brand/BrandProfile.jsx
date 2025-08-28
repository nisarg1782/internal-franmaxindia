import React, { useEffect, useState } from 'react';
import './BrandProfile.css';
import BrandSidebar from './BrandSidebar';
import EditProfileModal from './EditProfileModal';
import BrandDashboardHeader from './BrandDashboardHeader';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../utils/api';

const BrandProfile = () => {
    const [brandData, setBrandData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [brandId, setBrandId] = useState(null);
    const navigate = useNavigate();

    // Effect to get the brandId from the session on component load
    useEffect(() => {
        let idFromSession = null;
        try {
            const sessionString = localStorage.getItem('userSession');
            if (sessionString) {
                const sessionData = JSON.parse(sessionString);
                if (sessionData && sessionData.id) {
                    idFromSession = sessionData.id;
                }
            }
        } catch (error) {
            console.error("Failed to parse user session:", error);
        }

        if (idFromSession) {
            setBrandId(idFromSession);
        } else {
            // setBrandId(4);
            // If no valid brand ID is found in the session,
            // you should redirect the user to a login page or an error page.
            // console.error("No valid brand ID found. Redirecting to login.");
            navigate('/'); // Assuming you have a '/login' route
        }
    }, [navigate]);

    // Effect to fetch data, dependent on brandId being available
    useEffect(() => {
        const fetchData = async () => {
            if (!brandId) return; // Don't fetch if brandId isn't set yet

            try {
                const res = await fetch(getApiUrl(`get-brand-profile.php?brand_id=${brandId}`));
                const data = await res.json();
                
                if (data && !data.error) {
                    setBrandData(data);
                } else {
                    console.error('Fetch brand error:', data.error);
                }
            } catch (err) {
                console.error('Network or parsing error:', err);
            }
        };

        fetchData();
    }, [brandId]);

    if (!brandData) {
        return (
            <div className="brand-crm-container">
                <BrandSidebar />
                <div className="profile-main">
                    <p>Loading brand profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="brand-crm-container">
            <BrandSidebar />
            <div className="profile-main">
                <BrandDashboardHeader />
                <div className="profile-container">
                    <div className="profile-card">
                        <div className="profile-avatar">
                            {/* You can add an image here once you have the logo data */}
                            {/* <img src={`http://localhost/images/${brandData.logo}`} alt="Logo" /> */}
                        </div>
                        <div className="profile-info">
                            <h2>{brandData.name}</h2>
                            <div className="profile-fields">
                                <div><strong>Email:</strong> {brandData.email}</div>
                                <div><strong>Mobile:</strong> {brandData.mobile}</div>
                                <div><strong>State:</strong> {brandData.state_name}</div>
                                <div><strong>City:</strong> {brandData.city_name}</div>
                                <div><strong>Master Category:</strong> {brandData.master_category_name}</div>
                            </div>
                            <button className="edit-profile-btn" onClick={() => setShowModal(true)}>
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>
                {showModal && (
                    <EditProfileModal
                        brandData={brandData}
                        onClose={() => setShowModal(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default BrandProfile;