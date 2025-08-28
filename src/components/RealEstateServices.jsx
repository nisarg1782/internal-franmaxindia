// File: src/components/RealEstateServices.jsx
import React from 'react';
import './design/RealEstateServices.css'; // Ensure this path is correct
import { FaBuilding, FaHandshake } from 'react-icons/fa'; // Import your icons

const RealEstateServices = () => {
  return (
    <div className="snb-realestate-wrapper">
      <header className="snb-realestate-header">
        <h1>Real Estate Solutions</h1>
        <p>
          Securing the ideal space plays a big part in establishing a successful business. Our team is committed to finding
          prime commercial locations that suit your brand’s unique needs and budget. We simplify the leasing or purchase
          process, giving you the freedom to focus on running your business.
        </p>
      </header>

      <div className="snb-realestate-cards">
        {/* Commercial Leasing Card */}
        <a href="/lease-property" className="snb-realestate-card">
          <div className="snb-realestate-icon"><FaBuilding /></div>
          <h3>Commercial Leasing</h3>
          <p>
            We provide flexible leasing options, helping your business establish itself in locations that fit your growth plans.
          </p>
        </a>

        {/* Sales Card */}
        <a href="/sell-business" className="snb-realestate-card">
          <div className="snb-realestate-icon"><FaHandshake /></div>
          <h3>Sales</h3>
          <p>
            We help you find and secure valuable commercial real estate deals, offering stability and growth for the long term.
            Our real estate experts negotiate with your business objectives in mind, securing the best property options for your future.
          </p>
        </a>
      </div>
    </div>
  );
};

export default RealEstateServices;
