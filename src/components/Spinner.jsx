// Spinner.jsx
import React from 'react';
import './design/Spinner.css'; // You'll create this CSS file next

const Spinner = () => {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p>Loading Page...</p>
    </div>
  );
};

export default Spinner;