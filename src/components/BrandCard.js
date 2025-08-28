import React from 'react';
import './design/BrandCard.css';

const BrandCard = ({ brand }) => {
  return (
    <div className="brand-card">
      <div className="brand-img-wrapper">
        <img src={brand.image} alt={brand.name} className="brand-img" />
      </div>
      <h3>{brand.name}</h3>
      <p><strong>Investment:</strong> {brand.investment}</p>
      <p><strong>Area Required:</strong> {brand.area}</p>
      <p><strong>Outlets:</strong> {brand.outlets}</p>
    </div>
  );
};

export default BrandCard;
