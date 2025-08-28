import React, { useEffect, useState } from 'react';
import BusinessCard from './BusinessCard';
// import InquiryForm from './EnquiryForm'; // Uncomment if using
import './design/BusinessList.css';
import { getApiUrl } from '../utils/api';

const BusinessList = () => {
  const [businesses, setBusinesses] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    fetch(getApiUrl("get-lease-properties.php"))
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.cards)) {
          setBusinesses(data.cards);
        }
      })
      .catch((err) => {
        console.error("Error fetching businesses:", err);
      });
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  return (
    <div className="business-layout">
      {/* Left section - cards */}
      <div className="business-cards">
        <h2 className="listing-title">Exploring Leasing Opportunities</h2>

        <div className="grid">
          {businesses.slice(0, visibleCount).map((biz, i) => (
            <BusinessCard key={biz.uuid || i} business={biz} />
          ))}
        </div>

        {/* Load More */}
        {visibleCount < businesses.length && (
          <div className="load-more-wrapper">
            <button className="load-more-btn" onClick={handleLoadMore}>
              Load More
            </button>
          </div>
        )}
      </div>

      {/* Right section - Inquiry Form */}
      {/* <div className="business-form">
        <InquiryForm />
      </div> */}
    </div>
  );
};

export default BusinessList;
