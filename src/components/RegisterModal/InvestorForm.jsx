import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import {
  FaUser, FaPhone, FaEnvelope,
  FaMapMarkerAlt, FaCity, FaIndustry
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import validateInvestorForm from '../../utils/validateInvestorForm';
import SuccessModal from './SuccessModal';
import '../design/InvestorForm.css';
import PasswordInput from '../PasswordInput';
import { getApiUrl } from '../../utils/api';

export default function InvestorFormModal({ isOpen, onClose, onBack }) {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [sectors, setSectors] = useState([]);

  const [form, setForm] = useState({
    investor_name: '',
    investor_mobile: '',
    investor_email: '',
    investor_password: '',
    user_type: 'investor' // Added the hidden field with a default value
  });

  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedSector, setSelectedSector] = useState(null);
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
        const formatted = data.map(sector => ({ value: sector.mas_cat_id, label: sector.mas_cat_name }));
        setSectors(formatted);
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

    const isValid = validateInvestorForm(form, selectedState, selectedCity, selectedSector, agreed);
    if (!isValid) return;

    const payload = {
      investor_name: form.investor_name,
      investor_mobile: form.investor_mobile,
      investor_email: form.investor_email,
      investor_password: form.investor_password,
      state_id: selectedState?.value,
      city_id: selectedCity?.value,
      sector_id: selectedSector?.value,
      user_type: form.user_type,
      user_name: form.user_name
    };
    console.log('Submitting payload:', payload);
    try {
      const res = await fetch(getApiUrl('register-investor.php'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
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
      {showSuccess && <SuccessModal message="Registered successfully!" />}
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="investor-modal-overlay">
        <div className="investor-modal-box">
          <button className="investor-modal-close-btn" onClick={onClose}>✖</button>
          <h3 className="investor-modal-title">Investor Registration</h3>
          <form className="modal-body" onSubmit={handleSubmit}>
            <div className="investor-form-input-with-icon">
              <FaUser className="investor-form-input-icon" />
              <input
                type="text"
                name="investor_name"
                placeholder="Full Name"
                value={form.investor_name}
                onChange={(e) => setForm({ ...form, investor_name: e.target.value })}
              />
            </div>
            <div className="investor-form-input-with-icon">
              <FaUser className="investor-form-input-icon" />
              <input
                type="text"
                name="user_name"
                placeholder="User Name"
                value={form.user_name}
                onChange={(e) => setForm({ ...form, user_name: e.target.value })}
              />
            </div>
            <div className="investor-form-input-with-icon">
              <FaPhone className="investor-form-input-icon" />
              <input
                type="tel"
                name="investor_mobile"
                placeholder="Mobile Number"
                value={form.investor_mobile}
                onChange={(e) => setForm({ ...form, investor_mobile: e.target.value })}
              />
            </div>

            <div className="investor-form-input-with-icon">
              <FaEnvelope className="investor-form-input-icon" />
              <input
                type="email"
                name="investor_email"
                placeholder="Email"
                value={form.investor_email}
                onChange={(e) => setForm({ ...form, investor_email: e.target.value })}
              />
            </div>

            <PasswordInput
              placeholder="Password"
              value={form.investor_password}
              onChange={(e) => setForm({ ...form, investor_password: e.target.value })}
            />
            {/* The hidden field is added here */}
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
                options={sectors}
                value={selectedSector}
                onChange={setSelectedSector}
                placeholder="Select Sector"
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
