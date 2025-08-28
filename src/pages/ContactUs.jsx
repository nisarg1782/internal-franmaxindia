// File: src/pages/ContactUs.jsx
import React, { useState } from 'react';
import '../components/design/ContactUs.css';
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUser,
  FaPaperPlane
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getApiUrl } from '../utils/api';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const { name, email, contact, message } = formData;

    if (!name.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (!email.trim()) {
      toast.error("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Enter a valid email address");
      return false;
    }
    if (!contact.trim()) {
      toast.error("Phone number is required");
      return false;
    }
    if (!/^\d{10}$/.test(contact)) {
      toast.error("Phone must be a 10-digit number");
      return false;
    }
    if (!message.trim()) {
      toast.error("Message is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await fetch(getApiUrl('contact-submit.php'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message || "Message sent successfully");
        setFormData({ name: '', email: '', contact: '', message: '' });
      } else {
        toast.error(data.error || "Failed to send message");
      }
    } catch (error) {
      toast.error("Server error, try again later");
    }
  };

  return (
    <div className="contactus-wrapper">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="contactus-container">
        {/* Left Column: Contact Info */}
        <div className="contactus-info">
          <h2>Why Franmax India?</h2>
          <p className="desc">
            We are India’s fastest-growing franchise and brand consulting platform.
            Whether you're an investor or a business looking to expand, Franmax India is your one-stop solution for trusted connections, market insights, and expert guidance.
          </p>
          <div className="info-item address">
            <FaMapMarkerAlt />
            A-402, Titanium City Center,<br />
            100 Feet Anand Nagar Road,<br />
            Ahmedabad, Gujarat – 380015
          </div>
          <br />
          <iframe
            title="Franmax India Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3670.1880109050266!2d72.52257781538692!3d23.089107521238923!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e85d93eb2cde7%3A0xb1ac718f3f430761!2sTitanium%20City%20Centre%2C%20A-402%2C%20100%20Feet%20Anand%20Nagar%20Rd%2C%20Satellite%2C%20Ahmedabad%2C%20Gujarat%20380015!5e0!3m2!1sen!2sin!4v1721027830000!5m2!1sen!2sin"
            width="100%"
            height="300"
            style={{
              border: 0,
              borderRadius: '10px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
            }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Right Column: Contact Form */}
        <div className="contactus-form">
          <h3>Send Us a Message</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-field">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name *"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              </div>
               <div className="form-row">
              <div className="form-field">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address *"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <input
                  type="tel"
                  name="contact"
                  placeholder="Phone Number *"
                  value={formData.contact}
                  onChange={handleChange}
                />
              </div>
              </div>
               <div className="form-row">
              <div className="form-field">
                <textarea
                  name="message"
                  placeholder="Your Message *"
                  rows="1"
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
