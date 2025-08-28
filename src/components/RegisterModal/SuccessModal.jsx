import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';
import '../design/SuccessModal.css';

export default function SuccessModal({ message }) {
  return (
    <div className="success-modal-overlay">
      <motion.div
        className="success-modal"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <FaCheckCircle className="success-icon" />
        <h2 className="success-text">{message}</h2>
      </motion.div>
    </div>
  );
}
