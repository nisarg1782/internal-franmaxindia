import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import "./design/FranchiseListing.css";
import InquiryForm from "./EnquiryForm";
import "./design/ListingInquiry.css";
import { getImageUrl, getApiUrl } from "../utils/api"; // Assuming you have these utility functions

export default function CategoryPage() {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
  const params = new URLSearchParams(location.search);
  const mas_cat = params.get("mas_cat");
  const cat = params.get("cat");
  const sub = params.get("sub");

  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      setError(null); // Clear any previous errors

      let url = getApiUrl("get-filtered-brands.php?");
      if (mas_cat) url += `mas_cat=${mas_cat}&`;
      if (cat) url += `cat=${cat}&`;
      if (sub) url += `sub=${sub}&`;

      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await res.json();
        // The API response structure might be different, so we adjust here.
        // Assuming your get-filtered-brands.php returns an array of brands directly
        // or a structure like { success: true, brands: [...] }
        if (Array.isArray(data)) {
          setBrands(data);
        } else if (data.success && Array.isArray(data.brands)) {
          setBrands(data.brands);
        } else {
         
          setError(data.message || "No brands found with these filters.");
        }
      } catch (err) {
        console.error("Error fetching brands:", err);
        setError("Failed to fetch brands. Please try again.");
        setBrands([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [mas_cat, cat, sub]);

  const handleKnowMore = (register_id) => {
    navigate(`/brand/${register_id}`); // Navigate to the specific brand page
  };

  if (loading) {
    return <div className="loading-message">Loading franchises...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (brands.length === 0) {
    return (
      <div className="no-brands-message">
        No franchises found matching your criteria.
      </div>
    );
  }

  return (
    <div className="franchise-listing-container">
      <div className="franchise-listing-main">
        <div className="franchise-listing-header">
          <h2 className="syb-heading">Franchises</h2>
        </div>

        <div className="franchise-grid">
          {brands.map((brand, i) => (
            <div className="franchise-card" key={brand.id || i}>
              <div className="franchise-img-wrap">
                <img
                  src={getImageUrl(brand.logo) || "https://via.placeholder.com/200"}
                  alt={brand.name || "Brand"}
                />
              </div>
              <div className="franchise-content">
                <h3>{brand.name || "Unknown Brand"}</h3>
                <div className="franchise-detail">
                  <div className="biz-field">
                    <span className="label">Sector:</span>
                    <span className="value">{brand.sector || "—"}</span>
                  </div>
                  <div className="biz-field">
                    <span className="label">Investment:</span>
                    <span className="value">
                      ₹{brand.min_investment} - {brand.max_investment}
                    </span>
                  </div>
                  <div className="biz-field">
                    <span className="label">Area:</span>
                    <span className="value">
                      {brand.min_area || 0} - {brand.max_area || 0} sq.ft
                    </span>
                  </div>
                  <div className="biz-field">
                    <span className="label">Outlets:</span>
                    <span className="value">{brand.total_outlets || 0}</span>
                  </div>
                </div>

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
}