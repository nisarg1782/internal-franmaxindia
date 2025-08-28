import React, { useEffect, useState, useRef } from 'react';
import './design/LeasePropertiesDisplay.css';
import { getImageUrl , getApiUrl } from '../utils/api';

const LeasePropertiesDisplay = () => {
  const [properties, setProperties] = useState([]);
  const [visibleCards, setVisibleCards] = useState([]);
  const currentIndexRef = useRef(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetch(getApiUrl('get-lease-properties.php'))
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && Array.isArray(data.data) && data.data.length > 0) {
          const uniqueProps = data.data.filter(
            (prop, index, self) =>
              prop &&
              prop.image_path &&
              index === self.findIndex(p => p.image_path === prop.image_path)
          );
          const shuffled = uniqueProps.sort(() => Math.random() - 0.5);
          setProperties(shuffled);

          // Set initial 3 cards
          setVisibleCards(shuffled.slice(0, 3));
          currentIndexRef.current = 3;
        }
      })
      .catch(err => console.error("Failed to load lease properties", err));
  }, []);

  useEffect(() => {
    if (properties.length > 3) {
      intervalRef.current = setInterval(() => {
        setVisibleCards(prev => {
          const nextIndex = currentIndexRef.current % properties.length;
          const nextCard = properties[nextIndex];
          currentIndexRef.current += 1;

          const updated = [...prev.slice(1), nextCard];
          return updated;
        });
      }, 4000);
    }

    return () => clearInterval(intervalRef.current);
  }, [properties]);

  // If no properties, render nothing
  if (properties.length === 0) return null;

  return (
    <div className="lease-wrapper">
      <div className="lease-header">
        <h2 className="lease-heading">Exploring Properties</h2>
        <a href="/all-lease-properties" className="view-all-link">View All</a>
      </div>

      <div className="lease-card-grid">
        {visibleCards.map((prop, i) => (
          <div className="lease-card" key={i}>
            <div className="lease-img-wrap">
              <img
                src={getImageUrl(prop.image_path)}
                alt="Property"
              />
            </div>

            <div className="lease-info">
              <h3 className="biz-title">{prop.property_type}</h3>
              <div className="lease-meta">
                <p><span className="label">Expected Rent:</span> <span>₹{prop.expected_rent}</span></p>
                <p><span className="label">Area:</span> <span>{prop.sqft}</span></p>
                <p><span className="label">Floor:</span> <span>{prop.floor_type}</span></p>
                <p><span className="label">City:</span> <span>{prop.city_name}</span></p>
              </div>
              <button className="lease-btn">Know More</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeasePropertiesDisplay;
