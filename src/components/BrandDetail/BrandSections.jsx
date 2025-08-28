// src/components/BrandDetail/BrandSections.jsx
import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import '../design/brandDetail.css';

const sectionsData = [
  {
    id: 'business',
    title: 'Business',
    content:
      'This brand operates in the retail sector with a strong focus on furniture delivery, customer service, and logistics.'
  },
  {
    id: 'investment',
    title: 'Investment',
    content:
      'Initial investment required is ₹5,00,000 which includes setup, branding, and training costs.'
  },
  {
    id: 'property',
    title: 'Property',
    content:
      'Recommended outlet space is 300–500 sq. ft. in a high-footfall commercial area.'
  },
  {
    id: 'training',
    title: 'Training',
    content:
      'Comprehensive onboarding program for franchisees including product knowledge, POS usage, and customer handling.'
  },
  {
    id: 'agreement',
    title: 'Agreement & Term Details',
    content:
      'Franchise agreement is valid for 3 years and is renewable based on performance.'
  }
];

const BrandSections = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (id) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <div className="accordion-wrapper">
      <h2 className="section-heading">Explore Sections</h2>
      {sectionsData.map((section) => (
        <div
          key={section.id}
          className={`accordion-section ${openSection === section.id ? 'active' : ''}`}
        >
          <div className="accordion-header" onClick={() => toggleSection(section.id)}>
            <span>{section.title}</span>
            {openSection === section.id ? <FaChevronUp /> : <FaChevronDown />}
          </div>

          {openSection === section.id && (
            <div className="accordion-content">
              <p>{section.content}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BrandSections;
