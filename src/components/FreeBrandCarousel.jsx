// src/components/FreeBrandCarousel.jsx
import React, { useEffect, useState } from 'react';
import './design/FreeBrandCarousel.css';
import { getApiUrl } from '../utils/api';

const FreeBrandCarousel = () => {
  const [brands, setBrands] = useState([]);
  const [startIndex, setStartIndex] = useState(0);

  // Fetch brands from API
  useEffect(() => {
    fetch(getApiUrl('brands.php')) // change if needed
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.brands) {
          const unique = Array.from(new Map(data.brands.map(b => [b.id, b])).values());
          setBrands(unique);
        }
      })
      .catch((err) => console.error('Error fetching brands:', err));
  }, []);

  // Show 3 brands at a time
  const visibleBrands = brands.slice(startIndex, startIndex + 3);

  // Auto-scroll every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setStartIndex((prev) => {
        if (brands.length <= 3) return 0;
        return (prev + 1) % (brands.length - 2); // loop through sliding window
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [brands]);

  if (brands.length === 0) return null;

  return (
    <div className="free-section">
      <h3 className="free-heading">Free Listing Brands</h3>
      <div className="free-carousel-wrapper">
        {visibleBrands.map((brand) => (
          <div className="free-card" key={brand.id}>
            <div className="free-img-wrapper">
              <img src={brand.logo_url} alt={brand.name} />
            </div>
            <h4 className="brand-name">{brand.name}</h4>
            <p><strong>Investment:</strong> ₹{brand.investment_required}</p>
            <p><strong>Area:</strong> {brand.area_required} sq.ft</p>
            <p><strong>Outlets:</strong> {brand.total_outlets}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FreeBrandCarousel;
