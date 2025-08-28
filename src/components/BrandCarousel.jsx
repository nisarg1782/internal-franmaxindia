// File: src/components/BrandCarousel.jsx
import React, { useEffect, useState, useRef } from 'react';
import './design/BrandCarousel.css';

const BrandCarousel = ({
  title = 'Top Brands',
  apiUrl,
  classPrefix = 'br',
  viewAllLink = '',
  minItemsForCarousel = 4,
  autoScrollInterval = 4000,
  cardWidth = 280,
  cardGap = 15,
}) => {
  const [brands, setBrands] = useState([]);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const intervalRef = useRef(null);
  const cardGridRef = useRef(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch(apiUrl);
        const data = await res.json();
        if (data.success && Array.isArray(data.brands)) {
          const unique = data.brands.filter((b, i, arr) => arr.findIndex(x => x.id === b.id) === i);
          setBrands(unique);
        } else {
          console.error('Invalid API data:', data);
          setBrands([]);
        }
      } catch (err) {
        console.error('Error fetching brands:', err);
        setBrands([]);
      }
    };
    if (apiUrl) fetchBrands();
  }, [apiUrl]);

  useEffect(() => {
    if (brands.length >= minItemsForCarousel) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setVisibleIndex(prev => (prev + 1) % brands.length);
      }, autoScrollInterval);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [brands, minItemsForCarousel, autoScrollInterval]);

  useEffect(() => {
    if (cardGridRef.current && brands.length > 0) {
      const offset = visibleIndex * (cardWidth + cardGap);
      cardGridRef.current.style.transform = `translateX(-${offset}px)`;
    }
  }, [visibleIndex, brands, cardWidth, cardGap]);

  const cls = name => `${classPrefix}-${name}`;

  return (
    <div className={`${cls('wrapper')}`}>
      <div className={`${cls('heading-row')}`}>
        <h2 className={`${cls('heading')}`}>{title}</h2>
        {brands.length >= minItemsForCarousel && viewAllLink && (
          <a href={viewAllLink} className={`${cls('view-all')}`}>
            View All
          </a>
        )}
      </div>
      <div
        className={`${cls('carousel-container')}`}
        style={{
          '--card-width': `${cardWidth}px`,
          '--card-gap': `${cardGap}px`,
        }}
      >
        <div
          ref={cardGridRef}
          className={`${cls('card-grid')}`}
          style={{ gap: `${cardGap}px` }}
        >
          {brands.length > 0 ? (
            brands.map((brand, i) => (
              <div
                className={`${cls('card')}`}
                key={brand.id || i}
                style={{ width: `${cardWidth}px`, minWidth: `${cardWidth}px` }}
              >
                <div className={`${cls('img-wrap')}`}>
                  <img
                    src={brand.logo_url}
                    alt={brand.name}
                    onError={e => {
                      e.target.onerror = null;
                      e.target.src = `https://placehold.co/150x100/E0E7FF/4F46E5?text=${brand.name.charAt(0)}`;
                    }}
                  />
                </div>
                <div className={`${cls('info')}`}>
                  <p className={`${cls('sector')}`}>{brand.sector || '—'}</p>
                  <h3>{brand.name}</h3>
                  <div className={`${cls('details')}`}>
                    <p><span>Investment:</span> ₹{brand.investment_required}</p>
                    <p><span>Area:</span> {brand.area_required} sq.ft</p>
                    <p><span>Outlets:</span> {brand.total_outlets}</p>
                  </div>
                  <button className={`${cls('btn')}`}>Know More</button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '30px', textAlign: 'center', width: '100%' }}>No brands available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandCarousel;
