import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import {
  FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt,
  FaCity, FaInfoCircle, FaTimes, FaLock
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import './InvestorModal.css';
import { getApiUrl } from '../utils/api';

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'not active', label: 'Not Active' },
];

const findOption = (options, value) => options.find(opt => opt.value === value);

const validateForm = (form, selectedState, selectedCity, selectedStatus, isEditing) => {
  if (!form.name.trim()) return toast.error("Name is required.") && false;
  if (!form.user_name.trim()) return toast.error("User Name is required.") && false; // Added validation for user_name
  if (!/^\d{10}$/.test(form.number)) return toast.error("A valid 10-digit mobile number is required.") && false;
  if (!/\S+@\S+\.\S+/.test(form.email)) return toast.error("A valid email address is required.") && false;
  if (!isEditing && (!form.password || form.password.length < 8))
    return toast.error("Password must be at least 8 characters.") && false;
  if (!selectedState) return toast.error("Please select a state.") && false;
  if (!selectedCity) return toast.error("Please select a city.") && false;
  if (!selectedStatus) return toast.error("Please select a status.") && false;
  return true;
};

export default function InvestorModal({ show, onClose, onFormSubmissionSuccess, editingInvestor }) {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [form, setForm] = useState({ name: '', number: '', email: '', password: '', user_name: '' });
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!editingInvestor;

  // Load States once on mount
  useEffect(() => {
    if (!show) return;
    fetch(getApiUrl('get-indian-states.php'))
      .then(res => res.json())
      .then(data => setStates(data.map(s => ({ value: s.id, label: s.name }))))
      .catch(() => toast.error("Failed to load states."));
  }, [show]);

  // Load Cities when state is selected
  useEffect(() => {
    if (!selectedState) {
      setCities([]);
      setSelectedCity(null);
      return;
    }

    fetch(`${getApiUrl('get-cities.php')}?state_id=${selectedState.value}`)
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(city => ({ value: city.id, label: city.name }));
        setCities(formatted);
        // Restore city on edit
        if (editingInvestor?.city_id) {
          const found = findOption(formatted, editingInvestor.city_id);
          if (found) setSelectedCity(found);
        }
      })
      .catch(() => toast.error("Failed to load cities."));
  }, [selectedState, editingInvestor]);

  // Populate form on edit
  useEffect(() => {
    if (!show) return;

    if (editingInvestor) {
      setForm({
        name: editingInvestor.name || '',
        number: editingInvestor.mobile || '',
        email: editingInvestor.email || '',
        password: '', // Keep password blank on edit
        user_name: editingInvestor.user_name || ''
      });
      setSelectedState(findOption(states, editingInvestor.state_id));
      setSelectedStatus(findOption(statusOptions, editingInvestor.status));
    } else {
      setForm({ name: '', number: '', email: '', password: '', user_name: '' });
      setSelectedState(null);
      setSelectedCity(null);
      setSelectedStatus(null);
    }
  }, [editingInvestor, states, show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const isValid = validateForm(form, selectedState, selectedCity, selectedStatus, isEditing);
    if (!isValid) return;

    setIsSubmitting(true);

    const payload = {
      name: form.name,
      mobile: form.number,
      email: form.email,
      state_id: selectedState.value,
      city_id: selectedCity.value,
      status: selectedStatus.value,
      user_name: form.user_name,
    };
    if (!isEditing) {
      payload.password = form.password;
    } else {
      payload.id = editingInvestor.id;
    }

    const endpoint = isEditing
      ? getApiUrl('update-offline-investor.php')
      : getApiUrl('add-offline-investor.php');
    console.log("Submitting to:", endpoint, "with payload:", JSON.stringify(payload));
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        onFormSubmissionSuccess();
        onClose();
      } else {
        toast.error(data.message || "Something went wrong.");
      }
    } catch (error) {
      toast.error("🚫 Server error. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  const modalTitle = isEditing ? 'Update Investor' : 'Add New Investor';
  const buttonText = isEditing ? 'Update Investor' : 'Add Investor';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{modalTitle}</h2>
          <button className="modal-close-btn" onClick={onClose}><FaTimes /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <FaUser className="form-icon" />
              <input type="text" placeholder="Name" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <FaEnvelope className="form-icon" />
              <input type="email" placeholder="Email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <FaPhone className="form-icon" />
              <input type="tel" placeholder="Mobile Number" value={form.number}
                onChange={(e) => setForm({ ...form, number: e.target.value })} />
            </div>
            <div className="form-group">
              <FaLock className="form-icon" />
              <input type="password" placeholder="Password" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                disabled={isEditing} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group select-group">
              <FaMapMarkerAlt className="form-icon" />
              <Select
                options={states}
                value={selectedState}
                onChange={setSelectedState}
                placeholder="Select State"
              />
            </div>
            <div className="form-group select-group">
              <FaCity className="form-icon" />
              <Select
                options={cities}
                value={selectedCity}
                onChange={setSelectedCity}
                placeholder="Select City"
                isDisabled={!selectedState}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group select-group">
              <FaInfoCircle className="form-icon" />
              <Select
                options={statusOptions}
                value={selectedStatus}
                onChange={setSelectedStatus}
                placeholder="Select Status"
              />
            </div>
            <div className="form-group">
              <FaUser className="form-icon" />
              <input type="text" placeholder="User Name" value={form.user_name}
                onChange={(e) => setForm({ ...form, user_name: e.target.value })} />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}