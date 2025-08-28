import React from "react";
import "../design/WhatsAppIcon.css";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppIcon = () => {
  return (
    <a
      href="https://wa.me/918140038080"
      className="whatsapp-icon"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="whatsapp-icon-svg" />
      <span className="whatsapp-text">Chat with me</span>
    </a>
  );
};

export default WhatsAppIcon;
