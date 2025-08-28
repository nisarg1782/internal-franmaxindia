// src/components/ShareOptions.jsx
import React, { useState } from 'react';
import { FaShareAlt, FaFacebookF, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import '../design/brandDetail.css';

const ShareOptions = ({ url, brandIcon }) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="share-container">
      {/* Brand Icon (optional) */}
      {brandIcon && (
        <img src={brandIcon} alt="Brand Icon" className="brand-icon" />
      )}

      {/* Share Icon Button */}
      <button className="share-icon-btn" onClick={() => setShowOptions(!showOptions)}>
        <FaShareAlt />
      </button>

      {/* Share Options */}
      {showOptions && (
        <div className="share-options">
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${url}`} target="_blank" rel="noopener noreferrer">
            <FaFacebookF />
          </a>
          <a href={`https://twitter.com/intent/tweet?url=${url}`} target="_blank" rel="noopener noreferrer">
            <FaTwitter />
          </a>
          <a href={`https://wa.me/?text=${url}`} target="_blank" rel="noopener noreferrer">
            <FaWhatsapp />
          </a>
        </div>
      )}
    </div>
  );
};

export default ShareOptions;
