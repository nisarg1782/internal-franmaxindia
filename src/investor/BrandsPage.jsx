import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './BrandsPage.css';
import { DollarSign, MapPin, Store } from 'lucide-react';
import { getApiUrl } from '../utils/api';

const BrandsPage = () => {
    const [brandsData, setBrandsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const response = await fetch(getApiUrl('get_premium_brands.php'));
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setBrandsData(data.brands);
            } catch (e) {
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBrands();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('investor_session');
        window.location.href = '/';
    };

    const handleLearnMore = async (brandId) => {
        const userSession = localStorage.getItem('investor_session');
        if (!userSession) {
            alert('Please log in first.');
            return;
        }

        // Auto-detect session format (JSON or raw ID string)
        let userId;
        try {
            const parsed = JSON.parse(userSession);
            userId = parsed.id ? parsed.id : parsed; 
        } catch {
            userId = userSession; 
        }

        console.log("DEBUG brandId:", brandId);
        console.log("DEBUG userId:", userId);

        try {
            const apiUrl = getApiUrl(`brand_learn_more.php?brand_id=${brandId}&user_id=${userId}`);
            console.log("DEBUG API URL:", apiUrl);

            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`Failed to send data. Status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Learn More API Response:', result);

            if (result.status === 'success' && result.bde_manager) {
                alert(
                    `Your interest has been recorded!\n\n` +
                    `BDE Manager Details:\n` +
                    `Name: ${result.bde_manager.name}\n` +
                    `Contact: ${result.bde_manager.contact}\n` +
                    `Email: ${result.bde_manager.email}\n\n` +
                    `Remaining Limit: ${result.remaining_limit}`
                );
            } else {
                alert(result.message || 'Unable to fetch details.');
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Something went wrong. Please try again.');
        }
    };

    if (isLoading) {
        return (
            <div className="brands-container">
                <Sidebar onLogout={handleLogout} />
                <main className="brands-content loading-state">
                    <h1>Loading Brands...</h1>
                    <p>Please wait while we fetch the latest opportunities.</p>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="brands-container">
                <Sidebar onLogout={handleLogout} />
                <main className="brands-content error-state">
                    <h1>Error</h1>
                    <p>Failed to load brands: {error}</p>
                    <p>Please try again later.</p>
                </main>
            </div>
        );
    }

    return (
        <div className="brands-container">
            <Sidebar onLogout={handleLogout} />
            <main className="brands-content">
                <header className="brands-header">
                    <h1>Explore Brands</h1>
                    <p>Discover exciting franchise opportunities that fit your investment goals.</p>
                </header>
                <div className="brands-grid">
                    {brandsData.map((brand) => (
                        <div key={brand.id} className="brand-card">
                            <div className="brand-logo-container">
                                <img src={brand.logo} alt={`${brand.name} logo`} className="brand-logo" />
                            </div>
                            <div className="brand-info">
                                <h2>{brand.name}</h2>
                                <p className="brand-tagline">{brand.tagline}</p>
                                <div className="brand-details-grid">
                                    <div className="detail-item">
                                        <DollarSign size={20} className="detail-icon" />
                                        <div className="detail-text">
                                            <span className="detail-label">Investment</span>
                                            <span className="detail-value">
                                                {brand.min_investment}-{brand.max_investment}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="detail-item">
                                        <MapPin size={20} className="detail-icon" />
                                        <div className="detail-text">
                                            <span className="detail-label">Area Required</span>
                                            <span className="detail-value">
                                                {brand.min_area}-{brand.max_area} SQFT
                                            </span>
                                        </div>
                                    </div>
                                    <div className="detail-item">
                                        <Store size={20} className="detail-icon" />
                                        <div className="detail-text">
                                            <span className="detail-label">Outlets</span>
                                            <span className="detail-value">{brand.total_outlets}</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="brand-description"> Sector : {brand.sector}</p>
                            </div>
                            <div className="brand-actions">
                                <button 
                                    className="learn-more-btn" 
                                    onClick={() => handleLearnMore(brand.register_id)}
                                >
                                    Learn More
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default BrandsPage;
