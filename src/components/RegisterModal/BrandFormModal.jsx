import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import {
  FaIndustry, FaPhone, FaEnvelope,
  FaMapMarkerAlt, FaCity
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import SuccessModal from './SuccessModal';
import PasswordInput from '../PasswordInput';
import validateBrandForm from '../../utils/validateBrandForm';
import '../design/InvestorForm.css'; // This is the correct CSS file to use
import { getApiUrl } from '../../utils/api';


export default function BrandFormModal({ isOpen, onClose, onBack }) {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    brand_name: '',
    brand_email: '',
    brand_mobile: '',
    brand_password: '',
    user_type: 'brand' // Added the hidden field with a default value
  });

  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetch(getApiUrl('get-indian-states.php'))
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(state => ({ value: state.id, label: state.name }));
        setStates(formatted);
      });

    fetch(getApiUrl('get-master-category.php'))
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(cat => ({ value: cat.mas_cat_id, label: cat.mas_cat_name }));
        setCategories(formatted);
      });
  }, []);

  useEffect(() => {
    if (selectedState) {
      fetch(getApiUrl(`get-cities.php?state_id=${selectedState.value}`))
        .then(res => res.json())
        .then(data => {
          const formatted = data.map(city => ({ value: city.id, label: city.name }));
          setCities(formatted);
        });
    } else {
      setCities([]);
      setSelectedCity(null);
    }
  }, [selectedState]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateBrandForm(form, selectedState, selectedCity, selectedCategory, agreed);

    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach(msg => toast.error(msg));
      return;
    }

    const payload = {
      brand_name: form.brand_name,
      user_name: form.user_name,
      brand_email: form.brand_email,
      brand_mobile: form.brand_mobile,
      brand_password: form.brand_password,
      state_id: selectedState?.value,
      city_id: selectedCity?.value,
      category_id: selectedCategory?.value,
      user_type: form.user_type // Added to the payload
    };

    try {
      // ✅ Fix: Updated the endpoint to match the PHP file name
      const res = await fetch(getApiUrl('register-brand.php'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        // setShowSuccess(true);
         toast.success("🚀 Registration successful!");
      } else {
        toast.error(data.message || "Registration failed.");
      }
    } catch (err) {
      toast.error("🚫 Server error. Please try again.");
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {showSuccess && <SuccessModal message="User registered successfully!" />}
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="investor-modal-overlay">
        <div className="investor-modal-box brand-modal">
          <button className="investor-modal-close-btn" onClick={onClose}>✖</button>
          <h3 className="investor-modal-title">Brand Registration</h3>

          <form className="modal-body" onSubmit={handleSubmit}>
            <div className="investor-form-input-with-icon">
              <FaIndustry className="investor-form-input-icon" />
              <input
                type="text"
                placeholder="Brand Name"
                value={form.brand_name}
                onChange={(e) => setForm({ ...form, brand_name: e.target.value })}
              />
            </div>
             <div className="investor-form-input-with-icon">
              <FaIndustry className="investor-form-input-icon" />
              <input
                type="text"
                placeholder="User Name"
                value={form.user_name}
                onChange={(e) => setForm({ ...form, user_name: e.target.value })}
              />
            </div>

            <div className="investor-form-input-with-icon">
              <FaPhone className="investor-form-input-icon" />
              <input
                type="tel"
                placeholder="Mobile Number"
                value={form.brand_mobile}
                onChange={(e) => setForm({ ...form, brand_mobile: e.target.value })}
              />
            </div>

            <div className="investor-form-input-with-icon">
              <FaEnvelope className="investor-form-input-icon" />
              <input
                type="email"
                placeholder="Email"
                value={form.brand_email}
                onChange={(e) => setForm({ ...form, brand_email: e.target.value })}
              />
            </div>

            <PasswordInput
              placeholder="Password"
              value={form.brand_password}
              onChange={(e) => setForm({ ...form, brand_password: e.target.value })}
            />

            {/* This is the new hidden field you requested */}
            <input
              type="hidden"
              name="user_type"
              value={form.user_type}
            />

            <div className="investor-form-select-with-icon">
              <FaMapMarkerAlt className="investor-form-input-icon" />
              <Select
                options={states}
                value={selectedState}
                onChange={setSelectedState}
                placeholder="Select State"
                classNamePrefix="react-select"
              />
            </div>

            <div className="investor-form-select-with-icon">
              <FaCity className="investor-form-input-icon" />
              <Select
                options={cities}
                value={selectedCity}
                onChange={setSelectedCity}
                placeholder="Select City"
                isDisabled={!selectedState}
                classNamePrefix="react-select"
              />
            </div>

            <div className="investor-form-select-with-icon">
              <FaIndustry className="investor-form-input-icon" />
              <Select
                options={categories}
                value={selectedCategory}
                onChange={setSelectedCategory}
                placeholder="Select Category"
                classNamePrefix="react-select"
              />
            </div>

            <label className="investor-form-terms-check">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <span>I agree to the Terms & Conditions</span>
            </label>

            <div className="investor-form-btn-group">
              <button type="button" className="investor-form-back-btn" onClick={onBack}>Back</button>
              {agreed && (
                <button type="submit" className="investor-form-submit-btn">Register</button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
