// src/components/BannerCarousel.jsx
import React, { useEffect, useState } from 'react';
import '../components/design/BannerCarousel.css';
import axios from 'axios';
import { getApiUrl } from '../utils/api';

const BannerCarousel = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch banner data from PHP API
  useEffect(() => {
    axios.get(getApiUrl('get-banner.php'))
      .then(response => {
        // Assuming the API response data is an array
        console.log(response);
        setBanners(response.data);
      })
      .catch(error => {
        console.error('Failed to load banners:', error);
      });
  }, []);

  // Auto-slide every 4 seconds
  useEffect(() => {
    if (banners.length > 1) { // Only set interval if there's more than one banner
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === banners.length - 1 ? 0 : prevIndex + 1
        );
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [banners]);

  if (banners.length === 0) {
    return <div className="carousel">Loading banners...</div>;
  }

  return (
    <div className="carousel">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
        >
          <a
            href="https://franxpo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="banner-link"
          >
            <img src={banner.image_url} alt={banner.title} />
          </a>
          <div className="carousel-caption">
            <h3>{banner.title}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BannerCarousel;