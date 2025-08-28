// src/components/NewsModal.jsx
import React from 'react';
import DOMPurify from 'dompurify';
import './design/NewsModal.css';
import { FaTimes } from 'react-icons/fa';
import { getImageUrl } from '../utils/api';

const NewsModal = ({ news, onClose }) => {
  // Sanitize the HTML content
  const sanitizedDescription = DOMPurify.sanitize(news.description || '');

  return (
    <div className="news-modal-backdrop">
      <div className="news-modal">
        <button className="modal-close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        {news.image && <img className="modal-image" src={getImageUrl(news.image)} alt={news.title} />}
        <h2 className="modal-title">{news.title}</h2>
        <p className="modal-date">{new Date(news.created_at).toLocaleDateString()}</p>

        {/* Render sanitized HTML safely */}
        <div
          className="modal-content"
          dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
        ></div>
      </div>
    </div>
  );
};

export default NewsModal;
