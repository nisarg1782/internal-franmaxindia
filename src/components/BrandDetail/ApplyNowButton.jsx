import React, { useState } from 'react';
import { FaBullhorn } from 'react-icons/fa';
import ConnectNowModal from './ConnectNowModal';
import '../design/ApplyNowButton.css';

const ApplyNowButton = ({ brandName }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="apply-now-wrapper">
      <div className="apply-now-container" onClick={() => setShowModal(true)}>
        <div className="icon-circle">
          <FaBullhorn />
        </div>
        <div className="apply-btn">CONNECT</div>
        <div className="now-btn">NOW</div>
      </div>
      {showModal && <ConnectNowModal brandName={brandName} onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default ApplyNowButton;
