// src/components/YoutubeModal.jsx
import React from 'react';
import './design/YoutubeModal.css';
import { FaTimes } from 'react-icons/fa';

const YoutubeModal = ({ video, onClose }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>
        <iframe
          className="video-frame"
          src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
          title={video.title}
          frameBorder="0"
          allowFullScreen
        ></iframe>
        <h3>{video.title}</h3>
      </div>
    </div>
  );
};

export default YoutubeModal;
