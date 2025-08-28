import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import {
  FaUser, FaPhone, FaEnvelope,
  FaMapMarkerAlt, FaCity
} from 'react-icons/fa';

import validateLeasingForm from '../../utils/validateLeasingForm';
import SuccessModal from './SuccessModal';
import '../design/InvestorForm.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getApiUrl } from '../../utils/api';

export default function LeasingFormModal({ isOpen, onClose, onBack }) {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [form, setForm] = useState({
    lease_name: '',
    lease_mobile: '',
    lease_email: ''
  });

  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    fetch(getApiUrl('get-indian-states.php'))
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(state => ({ value: state.id, label: state.name }));
        setStates(formatted);
      });
  }, [isOpen]);

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
    const validationErrors = validateLeasingForm(form, selectedState, selectedCity, agreed);

    if (Object.keys(validationErrors).length > 0) {
      Object.values(validationErrors).forEach(msg => toast.error(msg));
      return;
    }

    const payload = {
      name: form.lease_name,
      mobile: form.lease_mobile,
      email: form.lease_email,
      state: selectedState?.value,
      city: selectedCity?.value
    };

    try {
      const res = await fetch(getApiUrl('register-leasing.php'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        toast.success("✅ Leasing inquiry submitted successfully!");
        setShowSuccess(true);
        setForm({ lease_name: '', lease_mobile: '', lease_email: '' });
        setSelectedState(null);
        setSelectedCity(null);
        setAgreed(false);
      } else {
        toast.error(`❌ ${data.message}`);
      }
    } catch (err) {
      toast.error("🚫 Error submitting form. Please try again.");
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {showSuccess && <SuccessModal message="Leasing inquiry submitted successfully!" />}
      <div className="investor-modal-overlay">
        <div className="investor-modal-box investor-modal">
          <button className="investor-modal-close-btn" onClick={onClose}>✖</button>
          <h3 className="investor-modal-title">Lease Your Property</h3>

          <form className="modal-body" onSubmit={handleSubmit}>
            <div className="investor-form-input-with-icon">
              <FaUser className="investor-form-input-icon" />
              <input
                type="text"
                name="lease_name"
                placeholder="Full Name"
                value={form.lease_name}
                onChange={(e) => setForm({ ...form, lease_name: e.target.value })}
              />
            </div>

            <div className="investor-form-input-with-icon">
              <FaPhone className="investor-form-input-icon" />
              <input
                type="tel"
                name="lease_mobile"
                placeholder="Mobile Number"
                value={form.lease_mobile}
                onChange={(e) => setForm({ ...form, lease_mobile: e.target.value })}
              />
            </div>

            <div className="investor-form-input-with-icon">
              <FaEnvelope className="investor-form-input-icon" />
              <input
                type="email"
                name="lease_email"
                placeholder="Email"
                value={form.lease_email}
                onChange={(e) => setForm({ ...form, lease_email: e.target.value })}
              />
            </div>

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
                <button type="submit" className="investor-form-submit-btn">Submit</button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}