// src/brand/DetailModal.jsx
import React from 'react';
import './DetailModal.css';
import {
  FaUser, FaEnvelope, FaPhone, FaMapMarkedAlt,
  FaCity, FaCommentDots, FaClock
} from 'react-icons/fa';

const DetailModal = ({ inquiry, onClose }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <h3>Inquiry Details</h3>
        <div className="modal-info-grid">
          <p><FaUser /> <strong>Name:</strong> {inquiry.name}</p>
          <p><FaEnvelope /> <strong>Email:</strong> {inquiry.email}</p>
          <p><FaMapMarkedAlt /> <strong>State:</strong> {inquiry.state}</p>
          <p><FaCity /> <strong>City:</strong> {inquiry.city}</p>
          <p><FaCommentDots /> <strong>Message:</strong> {inquiry.message}</p>
          {inquiry.remark && (
            <p><strong>Remark:</strong> {inquiry.remark}</p>
          )}
          <p><strong>Status:</strong> {inquiry.status}</p>
          <p><strong>Inquiry Date:</strong> {inquiry.date}</p>
          {inquiry.updated_at && (
            <p><FaClock /> <strong>Last Updated:</strong> {inquiry.updated_at}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
