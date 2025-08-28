import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import {
  FaUser, FaPhone, FaEnvelope,
  FaMapMarkerAlt, FaCity
} from 'react-icons/fa';
import PasswordInput from '../PasswordInput';
import SuccessModal from './SuccessModal';
import validatePartnerForm from '../../utils/validatePartnerForm';
import '../design/InvestorForm.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getApiUrl } from '../../utils/api';

export default function PartnerFormModal({ isOpen, onClose, onBack }) {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [form, setForm] = useState({
    name: '', // Renamed from partner_name
    mobile: '', // Renamed from partner_mobile
    email: '', // Renamed from partner_email
    password: '', // Renamed from partner_password
    user_type: 'ibp'
  });

  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetch(getApiUrl('get-indian-states.php'))
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(state => ({ value: state.id, label: state.name }));
        setStates(formatted);
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
    const validationErrors = validatePartnerForm(form, selectedState, selectedCity, agreed);

    if (Object.keys(validationErrors).length > 0) {
      Object.values(validationErrors).forEach(msg => toast.error(msg));
      return;
    }

    const payload = {
      name: form.name,
      mobile: form.mobile,
      email: form.email,
      password: form.password,
      state_id: selectedState?.value,
      city_id: selectedCity?.value,
      user_type: form.user_type
    };
    console.log('Form submitted:', payload)

    try {
      const res = await fetch(getApiUrl('register-partner.php'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
        
      });

      const data = await res.json();
      if (data.success) {
        toast.success("✅ Partner registered successfully!");
        setShowSuccess(true);
        setForm({
          name: '',
          mobile: '',
          email: '',
          password: '',
          user_type: 'ibp'
        });
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
      {showSuccess && <SuccessModal message="Partner registered successfully!" />}
      <div className="investor-modal-overlay">
        <div className="investor-modal-box">
          <button className="investor-modal-close-btn" onClick={onClose}>✖</button>
          <h3 className="investor-modal-title">Become Our Partner</h3>

          <form className="modal-body" onSubmit={handleSubmit}>
            <div className="investor-form-input-with-icon">
              <FaUser className="investor-form-input-icon" />
              <input
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="investor-form-input-with-icon">
              <FaPhone className="investor-form-input-icon" />
              <input
                type="tel"
                placeholder="Contact Number"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              />
            </div>

            <div className="investor-form-input-with-icon">
              <FaEnvelope className="investor-form-input-icon" />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <PasswordInput
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

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
