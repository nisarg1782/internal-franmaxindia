// src/pages/BrandListing.jsx
import React, { useState } from 'react';
import '../components/design/BrandListing.css';
import EnquiryForm from '../components/EnquiryForm';

const allBrands = [
  {
    id: 1,
    name: 'Dominos Pizza',
    investment: '₹7000000.00',
    area: '100-200 sq.ft',
    outlets: 10,
    image: 'https://t4.ftcdn.net/jpg/03/23/39/93/360_F_323399324_Mwp1vUbt5u4h1I2cEj8HfRUsKybxoJf0.jpg',
  },
  {
    id: 2,
    name: 'KFC',
    investment: '₹10000000.00',
    area: '150-300 sq.ft',
    outlets: 50,
    image: 'https://png.pngtree.com/png-vector/20220812/ourmid/pngtree-png-download-subscribe-button-red-png-image_6106978.png',
  },
  {
    id: 3,
    name: 'Subway',
    investment: '₹5000000.00',
    area: '80-150 sq.ft',
    outlets: 75,
    image: 'https://media.istockphoto.com/id/1312418309/photo/visual-contents-concept-social-networking-service-streaming-video-communication-network-3d.jpg?s=612x612',
  },
  {
    id: 4,
    name: 'Pizza Hut',
    investment: '₹4000000.00',
    area: '90-180 sq.ft',
    outlets: 40,
    image: 'https://www.freeiconspng.com/uploads/pizza-icon-3.png',
  },
  {
    id: 5,
    name: 'Barista',
    investment: '₹3500000.00',
    area: '60-120 sq.ft',
    outlets: 30,
    image: 'https://cdn-icons-png.flaticon.com/512/3480/3480388.png',
  },
  {
    id: 6,
    name: 'Burger King',
    investment: '₹8000000.00',
    area: '110-220 sq.ft',
    outlets: 55,
    image: 'https://cdn-icons-png.flaticon.com/512/3480/3480393.png',
  },
];

const BrandListing = () => {
  const [visibleCount, setVisibleCount] = useState(3);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const visibleBrands = allBrands.slice(0, visibleCount);

  return (
    <div className="listing-page-wrapper">
      <div className="tfb-wrapper">
        <h2 className="tfb-heading">Leading Franchises Today</h2>
        <div className="tfb-grid">
          {visibleBrands.map((brand) => (
            <div key={brand.id} className="tfb-card">
              <div className="brand-image-wrapper">
                <img src={brand.image} alt={brand.name} />
              </div>
              <h3 className="brand-title">{brand.name}</h3>
              <div className="brand-info">
                <div className="info-row">
                  <span>Investment:</span>
                  <strong>{brand.investment}</strong>
                </div>
                <div className="info-row">
                  <span>Area:</span>
                  <strong>{brand.area}</strong>
                </div>
                <div className="info-row">
                  <span>Outlets:</span>
                  <strong>{brand.outlets}</strong>
                </div>
              </div>
              <button className="know-more">Know More</button>
            </div>
          ))}
        </div>

        {visibleCount < allBrands.length && (
          <div className="load-more-container">
            <button className="load-more-btn" onClick={handleLoadMore}>
              Load More
            </button>
          </div>
        )}
      </div>

      <div className="enquiry-form-wrapper">
        <EnquiryForm />
    </div>
    </div>
  );
};

export default BrandListing;
