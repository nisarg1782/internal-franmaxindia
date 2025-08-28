import React from 'react';
import LeasePropertyForm from './LeasePropertyForm';
import './LeasePropertyPage.css';

const LeasePropertyPage = () => {
  return (
    <div className="lease-page-container">
      <header className="lease-page-header">
        <h1>Lease Your Property with Franmax India</h1>
        <p>Professional. Reliable. Transparent Property Leasing.</p>
      </header>

      <section className="lease-page-intro">
        <h2>Why Property Owners Trust Us</h2>
        <p>
          Franmax India is a dependable platform for property owners who want to lease out their commercial spaces such
          as warehouses, showrooms, or multi-purpose properties. We help you find genuine leads, manage leasing formalities,
          and deliver peace of mind through our professional service.
        </p>
      </section>

      <section className="lease-form-section">
        <div className="lease-form-card">
          <h3 className="lease-form-title">Submit Your Property Details</h3>
          <LeasePropertyForm />
        </div>
      </section>
    </div>
  );
};

export default LeasePropertyPage;