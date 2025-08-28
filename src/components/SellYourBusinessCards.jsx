import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './design/SellYourBusinessCards.css';
import { getApiUrl , getImageUrl } from '../utils/api';

const SellBusinessCards = () => {
  const [cards, setCards] = useState([]);
  const [visibleCards, setVisibleCards] = useState([]);
  const currentIndex = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(getApiUrl("get-sell-business.php"))
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.cards) && data.cards.length > 0) {
          const unique = [];
          const seen = new Set();
          for (const card of data.cards) {
            const key = card.full_name + card.email;
            if (!seen.has(key)) {
              seen.add(key);
              unique.push(card);
            }
          }
          setCards(unique);
          setVisibleCards(unique.slice(0, 3));
          currentIndex.current = 3;
        }
      });
  }, []);

  useEffect(() => {
    if (cards.length === 0) return;

    const interval = setInterval(() => {
      setVisibleCards((prev) => {
        if (cards.length === 0) return [];

        if (currentIndex.current >= cards.length) {
          currentIndex.current = 0;
        }

        const next = [...prev.slice(1), cards[currentIndex.current]];
        currentIndex.current += 1;
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [cards]);

  const handleKnowMore = (uuid) => {
    navigate(`/business/${uuid}`);
  };

  // Only render title and grid if there are cards
  if (cards.length === 0) return null;

  return (
    <div className="syb-wrapper">
      <div className="syb-heading-row">
        <h2 className="syb-heading">Exploring Business Opportunities</h2>
        <a href="/BusinessList" className="syb-view-all">View All</a>
      </div>

      <div className="syb-grid">
        {visibleCards.map((card, index) => (
          <div className="syb-card" key={index}>
            <div className="syb-img-wrap">
              <img
                src={getImageUrl(`${card.image}`)}
                alt={card.full_name}
              />
            </div>
            <div className="syb-content">
              <div className="syb-detail">
                <div className="biz-field">
                  <span className="label">Expected Amount:</span>
                  <span className="value">₹{parseFloat(card.expected_amount || 0).toLocaleString()}</span>
                </div>
                <div className="biz-field">
                  <span className="label">Location:</span>
                  <span className="value">{card.city_name}, {card.state_name}</span>
                </div>
                <div className="biz-field">
                  <span className="label">Description:</span>
                  <span className="value">{card.description || 'N/A'}</span>
                </div>
              </div>

              <button className="syb-btn" onClick={() => handleKnowMore(card.uuid)}>
                Know More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellBusinessCards;
