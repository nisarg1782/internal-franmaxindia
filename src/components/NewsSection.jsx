// src/components/NewsSection.jsx
import React, { useEffect, useState, useRef } from 'react';
import './design/NewsSection.css';
import NewsModal from './NewsModal';
import { getApiUrl, getImageUrl } from '../utils/api';

const NewsSection = () => {
  const [news, setNews] = useState([]);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [selectedNews, setSelectedNews] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(getApiUrl('get-news.php'));
        const data = await res.json();
        if (data.success) {
          setNews(data.news);
        }
      } catch (err) {
        console.error('Failed to fetch news:', err);
      }
    };
    fetchNews();
  }, []);

  useEffect(() => {
    if (news.length > 3) {
      intervalRef.current = setInterval(() => {
        setVisibleIndex((prev) => (prev + 1) % news.length);
      }, 3000);
    }
    return () => clearInterval(intervalRef.current);
  }, [news]);

  const getVisibleNews = () => {
    if (news.length <= 3) return news;
    return [
      news[visibleIndex % news.length],
      news[(visibleIndex + 1) % news.length],
      news[(visibleIndex + 2) % news.length]
    ];
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <section className="news-section">
      {news.length > 0 && (
        <>
          <h2 className="news-heading">Latest News & Updates</h2>
          <p className="news-subheading">
            Stay informed with our recent activities and announcements
          </p>
        </>
      )}

      <div className="news-card-container">
        {getVisibleNews().map((item, index) => (
          <div className="news-card" key={index}>
            <div className="news-img">
              <div className="image-wrapper">
                <img src={getImageUrl(item.image)} alt={item.title || "Brand Image"} />
              </div>
            </div>
            <div className="news-content">
              <h3 className="news-title">{item.title}</h3>
              <p className="news-date">{formatDate(item.created_at)}</p>
              <button className="news-btn" onClick={() => setSelectedNews(item)}>
                Read More
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedNews && (
        <NewsModal
          news={selectedNews}
          onClose={() => setSelectedNews(null)}
        />
      )}
    </section>
  );
};

export default NewsSection;
