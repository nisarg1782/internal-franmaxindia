import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // <-- added useNavigate
import './design/FranchiseListing.css';
import InquiryForm from './EnquiryForm';
import './design/ListingInquiry.css';
import { getImageUrl, getApiUrl } from '../utils/api';

const FranchiseListing = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate(); // <-- initialize navigate
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = getApiUrl(`get-brands-by-category.php?category_id=${categoryId}`);

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error('Network response was not ok');

        const data = await res.json();
        if (data.success && Array.isArray(data.brands)) {
          setBrands(data.brands);
          setError(null);
        } else {
          setBrands([]);
          setError(data.message || 'No brands found for this category.');
        }
      } catch (err) {
        console.error("Error fetching brands:", err);
        setError("Failed to fetch brands. Please try again.");
        setBrands([]);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) fetchBrands();
  }, [categoryId, apiUrl]);

  const handleKnowMore = (register_id) => {
    navigate(`/brand/${register_id}`);  // Must match the route in App.js
  };
  if (loading) return <div className="loading-message">Loading brands...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (brands.length === 0) return <div className="no-brands-message">No franchises found in this category.</div>;
  return (
    <div className="franchise-listing-container">
      <div className="franchise-listing-main">
        <div className="franchise-listing-header">
          <h2 className="syb-heading">All Franchises in Category</h2>
        </div>

        <div className="franchise-grid">
          {brands.map((brand, i) => (
            <div className="franchise-card" key={brand.id || i}>
              <div className="franchise-img-wrap">
                <img
                  src={getImageUrl(brand.logo) || 'https://via.placeholder.com/200'}
                  alt={brand.name || 'Brand'}
                />
              </div>
              <div className="franchise-content">
                <h3>{brand.name || 'Unknown Brand'}</h3>
                <div className="franchise-detail">
                  <div className="biz-field">
                    <span className="label">Sector:</span>
                    <span className="value">{brand.sector || '—'}</span>
                  </div>
                  <div className="biz-field">
                    <span className="label">Investment:</span>
                    <span className="value">₹{brand.min_investment} - {brand.max_investment}</span>
                  </div>
                  <div className="biz-field">
                    <span className="label">Area:</span>
                    <span className="value">{brand.min_area || 0} - {brand.max_area || 0} sq.ft</span>
                  </div>
                  <div className="biz-field">
                    <span className="label">Outlets:</span>
                    <span className="value">{brand.total_outlets || 0}</span>
                  </div>
                </div>

                {/* Navigate to product detail page */}
                <button
                  className="franchise-btn"
                  onClick={() => handleKnowMore(brand.register_id)}
                >
                  Know More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="franchise-listing-sidebar">
        <InquiryForm />
      </div>
    </div>
  );
};
export default FranchiseListing;
