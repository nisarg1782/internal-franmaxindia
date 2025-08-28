import React, { useEffect, useState, useRef } from 'react';
import './design/FreelistingBrands.css';
import { getApiUrl } from '../utils/api';

const FreeListingBrands = () => {
  const [brands, setBrands] = useState([]);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch(getApiUrl('get-freelisting-brands.php'));
        const data = await res.json();
        if (data.success && Array.isArray(data.brands)) {
          const validBrands = data.brands.filter(b => b && b.logo_url);
          const shuffled = validBrands.sort(() => Math.random() - 0.5);
          setBrands(shuffled);
        }
      } catch (err) {
        console.error("Failed to fetch free listing brands", err);
      }
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    if (brands.length > 3) {
      intervalRef.current = setInterval(() => {
        setVisibleIndex(prev => (prev + 1) % brands.length);
      }, 3000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [brands]);

  const getVisibleBrands = () => {
    if (brands.length <= 3) return brands;

    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (visibleIndex + i) % brands.length;
      visible.push(brands[index]);
    }
    return visible;
  };

 return (
  <div className="freelisting-wrapper">
    <div className="freelisting-heading-row">
      <h2 className="freelisting-heading">Explore Other Brands</h2>
      <a href="/freelisting-brands" className="freelisting-view-all">View All</a>
    </div>

    <div className="freelisting-card-grid">
      {getVisibleBrands().map((brand, i) => (
        <div className="freelisting-card" key={i}>
          <div className="freelisting-img-wrap">
            <img src={brand.logo_url} alt={brand.name || 'Brand'} />
          </div>
          <div className="freelisting-info">
            <p className="freelisting-sector">{brand.sector || '—'}</p>
            <h3>{brand.name || 'Unnamed Brand'}</h3>
            <div className="freelisting-details">
              <p><span>Investment:</span> ₹{brand.investment_required || 'N/A'}</p>
              <p><span>Area:</span> {brand.area_required || '—'} sq.ft</p>
              <p><span>Outlets:</span> {brand.total_outlets || '—'}</p>
            </div>
            <button className="freelisting-btn">Know More</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

};

export default FreeListingBrands;
