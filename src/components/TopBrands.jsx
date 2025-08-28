import React, { useEffect, useState, useRef } from "react";
import "./design/TopBrands.css";
import { getImageUrl, getApiUrl } from "../utils/api";
import { useNavigate } from "react-router-dom";

const TopBrands = ({
  apiUrl = getApiUrl("get-premium-brands.php"),
  sectionTitle = "Top Franchising Opportunities",
  viewAllLink = "/franchises",
}) => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true); // NEW: loading state
  const intervalRef = useRef(null);
  const cardGridRef = useRef(null);
  const cardRef = useRef(null);
  const navigate = useNavigate();
  const [cardWidth, setCardWidth] = useState(0);

  // Fetch brands from API
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const res = await fetch(apiUrl);
        const data = await res.json();
        if (data.success && Array.isArray(data.brands)) {
          const unique = data.brands.filter(
            (b, i, arr) => arr.findIndex((x) => x.id === b.id) === i
          );
          setBrands(unique);
        } else {
          console.error("API response unexpected or no brands found:", data);
          setBrands([]);
        }
      } catch (err) {
        console.error("Failed to fetch brands from API:", apiUrl, err);
        setBrands([]);
      } finally {
        setLoading(false); // stop loader after fetch
      }
    };
    if (apiUrl) fetchBrands();

    return () => clearInterval(intervalRef.current);
  }, [apiUrl]);

  // Measure card width dynamically (only when brands exist)
  useEffect(() => {
    if (brands.length && cardRef.current) {
      const computeWidth = () => {
        const computedWidth = cardRef.current.offsetWidth;
        const computedStyle = getComputedStyle(cardRef.current);
        const marginRight = parseInt(computedStyle.marginRight, 10) || 0;
        setCardWidth(computedWidth + marginRight);
      };
      computeWidth();
      window.addEventListener("resize", computeWidth);
      return () => window.removeEventListener("resize", computeWidth);
    }
  }, [brands]);

  // Auto-slide only after brands are loaded
  useEffect(() => {
    if (brands.length > 3 && cardWidth > 0 && !loading) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        if (cardGridRef.current) {
          cardGridRef.current.style.transition = "transform 0.8s ease-in-out";
          cardGridRef.current.style.transform = `translateX(-${cardWidth}px)`;

          setTimeout(() => {
            setBrands((prev) => {
              const first = prev[0];
              return [...prev.slice(1), first];
            });
            if (cardGridRef.current) {
              cardGridRef.current.style.transition = "none";
              cardGridRef.current.style.transform = "translateX(0)";
            }
          }, 800);
        }
      }, 4000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [brands.length, cardWidth, loading]);

  const handleKnowMore = (register_id) => {
    navigate(`/brand/${register_id}`);
  };

  return (
    <div className="syb-wrapper">
      <div className="syb-heading-row">
        {brands.length >= 1 && <h2 className="syb-heading">{sectionTitle}</h2>}
        {brands.length >= 1 && (
          <a href={viewAllLink} className="syb-view-all">
            View All
          </a>
        )}
      </div>

      {/* Loader while fetching */}
      {loading ? (
        <div className="syb-loading">Loading opportunities...</div>
      ) : (
        <div className="syb-carousel-container">
          <div className="syb-grid" ref={cardGridRef}>
            {brands.map((brand, i) => (
              <div
                className="syb-card"
                key={brand.id || i}
                ref={i === 0 ? cardRef : null}
              >
                <div className="syb-img-wrap">
                  <img src={getImageUrl(brand.logo)} alt={brand.name} />
                </div>
                <div className="syb-content">
                  <h3>{brand.name}</h3>
                  <div className="syb-detail">
                    <div className="biz-field">
                      <span className="label">Sector:</span>
                      <span className="value">{brand.sector || "—"}</span>
                    </div>
                    <div className="biz-field">
                      <span className="label">Investment:</span>
                      <span className="value">
                        ₹{brand.min_investment} - {brand.max_investment}
                      </span>
                    </div>
                    <div className="biz-field">
                      <span className="label">Area:</span>
                      <span className="value">
                        {brand.min_area} - {brand.max_area} sq.ft
                      </span>
                    </div>
                    <div className="biz-field">
                      <span className="label">Outlets:</span>
                      <span className="value">{brand.total_outlets}</span>
                    </div>
                  </div>
                  <button
                    className="syb-btn"
                    onClick={() => handleKnowMore(brand.id)}
                  >
                    Know More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopBrands;
