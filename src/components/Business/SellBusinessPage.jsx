// src/components/SellBusinessPage.jsx
import React from 'react';
import SellBusinessForm from './SellBusinessForm';
import './SellBusinessPage.css';

const SellBusinessPage = () => {
  return (
    <div className="sell-page-container">
      <header className="sell-page-header">
        <h1>Sell Your Business with Franmax India</h1>
        <p>Confidential. Professional. Hassle-Free Exit Strategy.</p>
      </header>

      <section className="sell-page-intro">
        <h2>Why Business Owners Trust Us</h2>
        <p>
          Franmax India is a trusted partner for business owners across the country. Whether you’re retiring,
          switching industries, or exploring new opportunities, our experienced advisors help you find the
          right buyers, get the right price, and handle everything discreetly.
        </p>
      </section>

      <section className="sell-page-form-section">
        <div className="sell-form-card">
          <h3 className="sell-form-title">Submit Your Business Details</h3>
          <SellBusinessForm />
        </div>
      </section>
    </div>
  );
};

export default SellBusinessPage;
