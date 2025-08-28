import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCity, FaInfoCircle, FaMoneyBillWave } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './AddInvestorForm.css';
import './DashboardLayout.css';
import Sidebar from './Sidebar';

// Import the API helper function
import { getApiUrl } from '../utils/api';

// Options for the Status dropdown
const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'not_active', label: 'Not Active' },
];

const validateForm = (form, selectedState, selectedCity, paymentStatus, selectedStatus, paymentAmount) => {
  if (!form.name || form.name.trim() === '') {
    toast.error("Name is required.");
    return false;
  }
  if (!form.number || !/^\d{10}$/.test(form.number)) {
    toast.error("A valid 10-digit mobile number is required.");
    return false;
  }
  if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
    toast.error("A valid email address is required.");
    return false;
  }
  if (!selectedState) {
    toast.error("Please select a state.");
    return false;
  }
  if (!selectedCity) {
    toast.error("Please select a city.");
    return false;
  }
  if (!selectedStatus) {
    toast.error("Please select a status.");
    return false;
  }
  if (!paymentStatus) {
    toast.error("Please select payment status.");
    return false;
  }
  if (!paymentAmount || isNaN(paymentAmount) || paymentAmount <= 0) {
    toast.error("A valid payment amount is required.");
    return false;
  }
  return true;
};

export default function AddInvestorForm() {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [form, setForm] = useState({
    name: '',
    number: '',
    email: '',
    paymentAmount: ''
  });
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Use the getApiUrl helper for fetching states
    fetch(getApiUrl('get-indian-states.php'))
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(state => ({ value: state.id, label: state.name }));
        setStates(formatted);
      })
      .catch(err => toast.error("Failed to load states."));
  }, []);

  useEffect(() => {
    if (selectedState) {
      // Use the getApiUrl helper for fetching cities
      fetch(`${getApiUrl('get-cities.php')}?state_id=${selectedState.value}`)
        .then(res => res.json())
        .then(data => {
          const formatted = data.map(city => ({ value: city.id, label: city.name }));
          setCities(formatted);
        })
        .catch(err => toast.error("Failed to load cities."));
    } else {
      setCities([]);
      setSelectedCity(null);
    }
  }, [selectedState]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validateForm(form, selectedState, selectedCity, paymentStatus, selectedStatus, form.paymentAmount)) {
      return;
    }

    setIsSubmitting(true);

    const payload = {
      investor_name: form.name,
      investor_mobile: form.number,
      investor_email: form.email,
      state_id: selectedState.value,
      city_id: selectedCity.value,
      status: selectedStatus.value,
      payment_amount: form.paymentAmount,
      payment_received: paymentStatus === 'yes' ? 1 : 0
    };

    try {
      // Use the getApiUrl helper for adding an investor
      const res = await fetch(getApiUrl('add-offline-investor.php'), {
       method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Investor added successfully!");
        setForm({ name: '', number: '', email: '', paymentAmount: '' });
        setSelectedState(null);
        setSelectedCity(null);
        setSelectedStatus(null);
        setPaymentStatus(null);
      } else {
        toast.error(data.message || "Failed to add investor.");
      }
    } catch (err) {
      toast.error("🚫 Server error. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="add-investor-page">
          <div className="add-investor-container">
            <h2 className="form-title">Add New Investor</h2>
            <form onSubmit={handleSubmit}>
              
              {/* Row 1: Name and Email */}
              <div className="form-row">
                <div className="form-group">
                  <FaUser className="form-icon" />
                  <input
                    type="text"
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <FaEnvelope className="form-icon" />
                  <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Row 2: Mobile Number and State */}
              <div className="form-row">
                <div className="form-group">
                  <FaPhone className="form-icon" />
                  <input
                    type="tel"
                    placeholder="Mobile Number"
                    value={form.number}
                    onChange={(e) => setForm({ ...form, number: e.target.value })}
                  />
                </div>
                <div className="form-group select-group">
                  <FaMapMarkerAlt className="form-icon" />
                  <Select
                    options={states}
                    value={selectedState}
                    onChange={setSelectedState}
                    placeholder="Select State"
                    classNamePrefix="react-select"
                  />
                </div>
              </div>

              {/* Row 3: City and Status */}
              <div className="form-row">
                <div className="form-group select-group">
                  <FaCity className="form-icon" />
                  <Select
                    options={cities}
                    value={selectedCity}
                    onChange={setSelectedCity}
                    placeholder="Select City"
                    isDisabled={!selectedState}
                    classNamePrefix="react-select"
                  />
                </div>
                <div className="form-group select-group">
                  <FaInfoCircle className="form-icon" />
                  <Select
                    options={statusOptions}
                    value={selectedStatus}
                    onChange={setSelectedStatus}
                    placeholder="Select Status"
                    classNamePrefix="react-select"
                  />
                </div>
              </div>

              {/* Single fields on separate lines */}
              <div className="form-group">
                <FaMoneyBillWave className="form-icon" />
                <input
                  type="number"
                  placeholder="Payment Amount"
                  value={form.paymentAmount}
                  onChange={(e) => setForm({ ...form, paymentAmount: e.target.value })}
                />
              </div>

              <div className="form-group radio-group">
                <label className="radio-label">Payment Received:</label>
                <div className="radio-options">
                  <label>
                    <input
                      type="radio"
                      value="yes"
                      checked={paymentStatus === 'yes'}
                      onChange={(e) => setPaymentStatus(e.target.value)}
                    />
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="no"
                      checked={paymentStatus === 'no'}
                      onChange={(e) => setPaymentStatus(e.target.value)}
                    />
                    No
                  </label>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Investor'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}