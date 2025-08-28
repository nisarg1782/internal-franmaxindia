// src/components/RegisterModal/RegisterModal.jsx
import React from 'react';
import '../design/RegisterModal.css';

export default function RegisterModal({
  isOpen,
  onClose,
  openLogin,
  openInvestor,
  openBrand,
  openPartner,
  openLeasing
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="close-btn" onClick={onClose}>✖</button>
        <h3 className="modal-title">Welcome, Register Here</h3>

        <div className="modal-body">
          <button className="modal-option" onClick={() => { onClose(); openInvestor(); }}>
            Start Your Own Business Today<br />
            <span>(Investor Registration)</span>
          </button>

          <button className="modal-option" onClick={() => { onClose(); openBrand(); }}>
            Expand Your Brand<br />
            <span>(Franchisor Registration)</span>
          </button>

          <button className="modal-option" onClick={() => { onClose(); openPartner(); }}>
            Become Our Partner<br />
            <span>(IBP Registration)</span>
          </button>

          <button className="modal-option" onClick={() => { onClose(); openLeasing(); }}>
            Lease Your Property<br />
            <span>(Leasing Registration)</span>
          </button>

          <p className="login-link">
            Already registered?{' '}
            <a href="/" onClick={(e) => {
              e.preventDefault();
              onClose();
              openLogin();
            }}>
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
