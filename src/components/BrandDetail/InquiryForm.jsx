// src/components/BrandDetail/InquiryForm.jsx
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { FaUser, FaEnvelope, FaPhone, FaCommentDots } from 'react-icons/fa';
import '../design/brandDetail.css';
import { getApiUrl } from '../../utils/api';

const InquiryForm = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch master categories from API
  useEffect(() => {
    axios.get(getApiUrl('get-master-category.php'))
      .then(response => {
        const options = response.data.map(cat => ({
          value: cat.mas_cat_id,
          label: cat.mas_cat_name
        }));
        setCategories(options);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  return (
    <form className="inquiry-form">
      <h3>Insta Apply</h3>

      <div className="form-group">
        <FaUser className="input-icon" />
        <input type="text" placeholder="Your Name" required />
      </div>

      <div className="form-group">
        <FaEnvelope className="input-icon" />
        <input type="email" placeholder="Email" required />
      </div>

      <div className="form-group">
        <FaPhone className="input-icon" />
        <input type="tel" placeholder="Phone" required />
      </div>

      {/* Category Select */}
      <div className="form-group select-group">
        <Select
          options={categories}
          placeholder="Select Master Category"
          value={selectedCategory}
          onChange={setSelectedCategory}
          classNamePrefix="sector-select"
          isSearchable
        />
      </div>

      <div className="form-group">
        <FaCommentDots className="input-icon" />
        <textarea placeholder="Message" rows="3" />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default InquiryForm;
