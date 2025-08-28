// File: src/components/LeaseList.jsx
import React, { useEffect, useState } from 'react';
import LeaseCard from './LeaseCard';
import './design/LeaseList.css';
import { getApiUrl } from '../utils/api';
const LeaseList = () => {
  const [properties, setProperties] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    fetch(getApiUrl("get-lease-properties.php"))
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success' && Array.isArray(data.data)) {
          setProperties(data.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching lease properties:", err);
      });
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  return (
    <div className="business-layout">
      <div className="business-cards">
        <h2 className="listing-title">Exploring Leasing Opportunities</h2>

        <div className="grid">
          {properties.slice(0, visibleCount).map((property, i) => (
            <LeaseCard key={i} property={property} />
          ))}
        </div>

        {visibleCount < properties.length && (
          <div className="load-more-wrapper">
            <button className="load-more-btn" onClick={handleLoadMore}>
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaseList;
