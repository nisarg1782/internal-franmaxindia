// src/pages/AboutPage.jsx
import React from 'react';
import './design/AboutPage.css';

// Using new placeholder images that are more illustrative and icon-like
// to match the style of the images provided in the PDF.
const journeyIcon = 'https://placehold.co/120x120/4A90E2/ffffff?text=JOURNEY';
const whatWeDoIcon = 'https://placehold.co/120x120/50E3C2/000000?text=SOLUTIONS';
const growthImage = 'https://placehold.co/240x120/F5A623/000000?text=GROWTH+PATH';
const missionIcon = 'https://placehold.co/120x120/BD10E0/ffffff?text=GLOBAL';
const indiaFranchiseLogo = 'https://placehold.co/240x120/FF69B4/ffffff?text=INDIA';

const AboutPage = () => {
  return (
    <div className="about-container">
      <div className="about-hero">
        <h1>About Us</h1>
        <h2>Franmax India</h2>
      </div>

      <div className="about-content">
        <section>
          <div className="section-header">
            <img src={journeyIcon} alt="Our Journey" className="section-icon" />
            <h3>Our Journey</h3>
          </div>
          <p>
            FRANMAX INDIA began its journey in 2020 under the guiding leadership of its Founder and Managing Director, <strong>Vipul Panchal</strong>.
            With a clear vision, we set out to give Indian businesses fresh identities and fuel their growth while helping Indian brands reach new markets worldwide.
            Alongside this, we are committed to supporting aspiring entrepreneurs who may hesitate to take business risks, guiding them in aligning their passion
            with the right brand and strategy. We understand that many Indians dream of owning a business and making a meaningful impact,
            and we’re here to help turn that dream into reality.
          </p>
        </section>

        <section>
          <div className="section-header">
            <img src={whatWeDoIcon} alt="What We Do" className="section-icon" />
            <h3>What We Do</h3>
          </div>
          <p>
            We don’t just offer services; we create powerful business solutions that take your brand to new heights! From driving growth through strategic
            franchising to securing the perfect commercial spaces, FRANMAX INDIA is your trusted partner in achieving big success.
            Our strength lies in finding the ideal match for every brand and connecting it with the right audience,
            ensuring that your brand’s value grows and brings impactful, lasting results.
            <br /><br />
            <em>Join the success journey!</em> Many startups and businesses have already grown with us — yours could be next!
          </p>
        </section>

        <section className="highlight-section">
          <div className="section-header">
            <img src={growthImage} alt="Your Growth" className="section-image" />
            <h3>Your Growth</h3>
          </div>
          <p>
            We’re passionate about being part of the entrepreneurial journey for as many individuals as possible in India.
            We believe that every entrepreneur deserves the chance to fulfill their dreams and achieve success.
            With vital tools, hands-on guidance, and years of experience, we help turn ambitions into successful businesses.
            <strong> Franchising offers incredible potential</strong>, and we’re dedicated to bringing that potential to life for every hopeful entrepreneur.
          </p>
        </section>

        <section>
          <div className="section-header">
            <img src={missionIcon} alt="Our Mission" className="section-icon" />
            <h3>Our Mission</h3>
          </div>
          <p>
            Our vision extends beyond individual accomplishments; we’re focused on taking Indian brands to a worldwide audience through franchising.
            FRANMAX INDIA aims to make a mark in the international franchising landscape, building a community of driven entrepreneurs.
            We’re not just fueling business growth; we’re reshaping the future of franchising, building a network of changemakers and leaders
            who can proudly represent India on a global scale.
          </p>
        </section>

        <section className="final-cta">
          <div className="section-header">
            <img src={indiaFranchiseLogo} alt="India Franchise Logo" className="final-logo" />
            <h3>Our Belief</h3>
          </div>
          <p>
            We believe in India’s boundless potential to become a center of successful Franchising
            which is why we say:
            <strong> INDIA! LET’S FRANCHISE MAXIMUM 🚀</strong>
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;