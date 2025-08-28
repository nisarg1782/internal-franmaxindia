import React, { useState } from 'react';
import './FreeAdviceButton.css';

const FreeAdviceButton = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Inline Button */}
      <button
        className="floating-advice-button-inline"
        onClick={() => setShowModal(true)}
      >
        Free Advice
      </button>

      {/* Modal */}
      {showModal && (
        <div
          className="advice-modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="advice-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="advice-close"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            <h3>Talk to Our Experts</h3>
            <p>We’ll guide you in your franchise journey.</p>
            <form className="advice-form">
              <input type="text" placeholder="Your Name" required />
              <input type="email" placeholder="Email Address" required />
              <input type="tel" placeholder="Phone Number" required />
              <textarea placeholder="Your Message" rows="3" />
              <button type="submit">Request Advice</button>
            </form>
          </div>
        </div>
      )}
     
    </>
  );
};

export default FreeAdviceButton;
