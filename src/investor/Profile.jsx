import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { CircleUserRound, Mail, User, Briefcase } from 'lucide-react';
import EditProfileModal from './EditProfile';
import './Profile.css'; // Make sure this CSS file exists and is imported

export default function InvestorProfile() {
    const [user, setUser] = useState(null);           // User data from session
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
    const navigate = useNavigate();

    // Load user data from localStorage when component mounts
    useEffect(() => {
        const sessionData = localStorage.getItem('investor_session');
        if (sessionData) {
            const userData = JSON.parse(sessionData);
            if (userData.user_type === 'investor') {
                setUser(userData);
            } else {
                // Wrong user type → redirect to homepage
                navigate('/');
            }
        } else {
            // No session → redirect to homepage
            navigate('/');
        }
    }, [navigate]);

    const handleLogout = () => {
        // Sidebar already handles localStorage.clear() or removeItem
        navigate('/');
    };

    // Show loading state while user is being fetched
    if (!user) {
        return (
            <div className="profile-layout">
                <Sidebar onLogout={handleLogout} />
                <div className="profile-content">
                    <p>Loading profile data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-layout">
            {/* Sidebar for navigation */}
            <Sidebar onLogout={handleLogout} />
            
            <div className="profile-content">
                {/* Profile Header */}
                <div className="profile-header">
                    <CircleUserRound size={64} className="profile-icon" />
                    <h1 className="profile-title">Investor Profile</h1>
                    <p className="profile-subtitle">
                        Your personal details and account information.
                    </p>
                </div>

                {/* Profile Card */}
                <div className="profile-card">
                    <h2 className="profile-card-title">Account Information</h2>
                    
                    <div className="profile-details-grid">
                        {/* Full Name */}
                        <div className="profile-detail-item">
                            <User size={20} className="detail-icon" />
                            <div>
                                <h3 className="detail-label">Full Name</h3>
                                <p className="detail-value">{user.name}</p>
                            </div>
                        </div>

                        {/* Email Address */}
                        <div className="profile-detail-item">
                            <Mail size={20} className="detail-icon" />
                            <div>
                                <h3 className="detail-label">Email Address</h3>
                                <p className="detail-value">{user.email}</p>
                            </div>
                        </div>

                        {/* User Type */}
                        <div className="profile-detail-item">
                            <Briefcase size={20} className="detail-icon" />
                            <div>
                                <h3 className="detail-label">User Type</h3>
                                <p className="detail-value capitalize">{user.user_type}</p>
                            </div>
                        </div>
                    </div>

                    {/* Edit Profile button */}
                    <button 
                        className="edit-profile-btn"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Edit Profile
                    </button>
                </div>
            </div>

            {/* Modal for Editing Profile */}
            {isModalOpen && (
                <EditProfileModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    user={user} 
                />
            )}
        </div>
    );
}
