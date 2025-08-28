// File: src/components/LeaseCard.jsx
import React from 'react';
import './design/LeaseList.css';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/api';

const LeaseCard = ({ property }) => {
  return (
    <div className="lease-card">
      <div className="card-img-box">
        <img
          src={getImageUrl(`${property.image_path}`)}
          alt="Lease Property"
          className="card-img"
        />
      </div>
      <div className="card-content">
        <h3 className="biz-title">{property.property_type}</h3>
        <div className="biz-detail">
          <div className="biz-field"><span className="label">Expected Rent:</span> <span className="value">₹{property.expected_rent}</span></div>
          <div className="biz-field"><span className="label">Area:</span> <span className="value">{property.sqft} sqft</span></div>
          <div className="biz-field"><span className="label">Floor:</span> <span className="value">{property.floor_type}</span></div>
          <div className="biz-field"><span className="label">City:</span> <span className="value">{property.city_name}</span></div>
        </div>
       <Link to={`/property/${property.property_key}`}>
          <button className="know-more-btn">Know More</button>
        </Link>
      </div>
    </div>
  );
};

export default LeaseCard;
