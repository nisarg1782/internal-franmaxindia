// File: src/components/LeaseDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './design/LeaseDetails.css';
import EnquiryModal from './LeasingEnquiryModal';
import { getApiUrl , getImageUrl } from '../utils/api';

const LeaseDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch(getApiUrl(`get-lease-property-detail.php?id=${id}`))
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && data.data) {
          setProperty(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading property details", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!property) return <div>Property not found.</div>;

  return (
    <div className="lease-detail-container">
      <h2>Lease Property Details</h2>
      <div className="lease-quote">
        “Smart entrepreneurs lease – owning space doesn't build your business, opportunity does.”
      </div>
      <div className="lease-info-box">
        <div className="lease-image-side">
          <img
            src={getImageUrl(`${property.image_path}`)}
            alt="Lease Property"
            className="lease-img"
          />
        </div>
        <div className="lease-detail-side">
          <p><strong>Property Type:</strong> {property.property_type}</p>
          <p><strong>Expected Rent:</strong> ₹{property.expected_rent}</p>
          <p><strong>Area:</strong> {property.sqft} sqft</p>
          <p><strong>Floor:</strong> {property.floor_type}</p>
          <p><strong>City:</strong> {property.city_name}, {property.state_name}</p>
          <p><strong>Description:</strong> {property.message || 'N/A'}</p>
        </div>
      </div>
      <div className="lease-benefits">
        <h3>Why Lease a Property?</h3>
        <ul>
          <li>🔑 Lower upfront investment compared to buying</li>
          <li>📍 Flexibility to change locations as your business grows</li>
          <li>🛠 Maintenance often covered by the owner</li>
          <li>🚀 Faster setup and launch for startups</li>
          <li>💰 Keep capital free for other business investments</li>
        </ul>
      </div>
      <div className="lease-back">
        <button onClick={() => setShowModal(true)} className="enquire-now-btn">Enquire Now</button>
      </div>
      {showModal && (
        <EnquiryModal onClose={() => setShowModal(false)} property_key={property.property_key} />
      )}
    </div>
  );
};

export default LeaseDetails;
