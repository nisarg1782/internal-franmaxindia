// src/pages/BusinessDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EnquiryModal from '../components/EnquiryModal';
import './design/BusinessDetail.css';
import { getApiUrl } from '../utils/api';

const BusinessDetail = () => {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch(getApiUrl(`get-business-detail.php?uuid=${id}`))
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBusiness(data.business);
        }
      });
  }, [id]);

  if (!business) return <div className="loading">Loading...</div>;

  return (
    <div className="business-detail">
      <div className="business-info">
        <div className="business-image">
          <img src={business.image} alt="image not available" />
        </div>
        <div className="business-details">
          <p><strong>Expected Amount:</strong> ₹{business.expected_amount}</p>
          <p><strong>Location:</strong> {business.city_name}, {business.state_name}</p>
          <p><strong>Description:</strong></p>
          <p className="description">{business.description}</p>
          <button onClick={() => setShowModal(true)} className="enquire-now-btn">Enquire Now</button>
        </div>
      </div>

      <div className="business-quote-section">
        <h3>Why Invest in a Running Business?</h3>
        <p className="quote">"Buying an existing business means cash flow from day one."</p>
        <ul className="benefits-list">
          <li>✅ Immediate Revenue & Existing Customer Base</li>
          <li>✅ Trained Staff & Established Brand</li>
          <li>✅ Proven Business Model</li>
          <li>✅ Easier to Finance from Banks/Investors</li>
          <li>✅ Reduced Startup Risks</li>
        </ul>
      </div>

      {showModal && (
        <EnquiryModal onClose={() => setShowModal(false)} businessId={business.uuid} />
      )}
    </div>
  );
};

export default BusinessDetail;
