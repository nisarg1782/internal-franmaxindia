import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const BenefitCard = ({ text }) => {
  return (
    <div className="benefit-card">
      <FaCheckCircle className="benefit-icon" />
      <span>{text}</span>
    </div>
  );
};

export default BenefitCard;
