import React, { useEffect, useState, useRef } from 'react';
import './design/TrendingBrands.css';
import { getApiUrl } from '../utils/api';

const TopBrands = () => {
  const [brands, setBrands] = useState([]);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch(getApiUrl('get-top-brands.php'));
        const data = await res.json();
        if (data.success && Array.isArray(data.brands)) {
          const validBrands = data.brands
            .filter(b => b && b.logo_url)
            .filter((b, i, self) => self.findIndex(x => x.id === b.id) === i); // Remove duplicates by ID
          
          const shuffled = validBrands.sort(() => Math.random() - 0.5);
          setBrands(shuffled);
        }
      } catch (err) {
        console.error("Failed to fetch top brands", err);
      }
    };
    fetchBrands();
  }, []);

  useEffect(() => {
    if (brands.length > 3) {
      intervalRef.current = setInterval(() => {
        setVisibleStartIndex(prev => (prev + 1) % brands.length);
      }, 3000);
    }
    return () => clearInterval(intervalRef.current);
  }, [brands]);

  const getVisibleBrands = () => {
    const visible = [];
    let index = visibleStartIndex;
    let count = 0;

    while (visible.length < 3 && count < brands.length) {
      const brand = brands[index % brands.length];
      if (!visible.some(b => b.id === brand.id)) {
        visible.push(brand);
      }
      index++;
      count++;
    }

    return visible;
  };

  return (
    <div className="top-br-wrapper">
      <h2 className="top-br-heading">Trending Franchising Opportunities</h2>
      <div className="top-br-card-grid">
        {getVisibleBrands().map((brand, i) => (
          <div className="top-br-card" key={brand.id || i}>
            <div className="top-br-img-wrap">
              <img src={brand.logo_url} alt={brand.name || "Brand"} />
            </div>
            <div className="top-br-info">
              <p className="top-br-sector">{brand.sector || '—'}</p>
              <h3>{brand.name || 'Unnamed Brand'}</h3>
              <div className="top-br-details">
                <p><span>Investment</span><span>₹{brand.max_investment  || 'N/A'}</span></p>
                <p><span>Area</span><span>{brand.area_required || '—'} sq.ft</span></p>
                <p><span>Outlets</span><span>{brand.total_outlets || '—'}</span></p>
              </div>
              <button className="top-br-btn">Know More</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopBrands;
