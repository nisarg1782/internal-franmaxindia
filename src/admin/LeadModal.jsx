import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './LeadModal.css';
import { getApiUrl } from '../utils/api';

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'not active', label: 'Inactive' }
];

export default function LeadModal({ show, onClose, onFormSubmissionSuccess, editingLead }) {
  const [brands, setBrands] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [formData, setFormData] = useState({
    brand_id: '',
    state_id: '',
    city_id: '',
    contact: '',
    email: '',
    message: '',
    status: 'active'
  });

  useEffect(() => {
    if (editingLead) {
      setFormData({
        brand_id: editingLead.brand_id || '',
        state_id: editingLead.state_id || '',
        city_id: editingLead.city_id || '',
        contact: editingLead.contact || '',
        email: editingLead.email || '',
        message: editingLead.message || '',
        status: editingLead.status || 'active',
        id: editingLead.id || null
      });
    } else {
      setFormData({
        brand_id: '',
        state_id: '',
        city_id: '',
        contact: '',
        email: '',
        message: '',
        status: 'active'
      });
    }
  }, [editingLead, show]);

  useEffect(() => {
    if (show) {
      fetch(getApiUrl('get-brands-name.php'))
        .then(res => res.json())
        .then(data => setBrands(data.data || []))
        .catch(() => toast.error('Failed to load brands'));
    }
  }, [show]);

  useEffect(() => {
    if (show) {
      fetch(getApiUrl('get-indian-states.php'))
        .then(res => res.json())
        .then(data => setStates(data.data || []))
        .catch(() => toast.error('Failed to load states'));
    }
  }, [show]);

  useEffect(() => {
    if (formData.state_id) {
      fetch(getApiUrl(`get-cities.php?state_id=${formData.state_id}`))
        .then(res => res.json())
        .then(data => setCities(data.data || []))
        .catch(() => toast.error('Failed to load cities'));
    } else {
      setCities([]);
    }
  }, [formData.state_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { brand_id, state_id, city_id, contact, email, status } = formData;
    if (!brand_id || !state_id || !city_id || !contact || !email || !status) {
      toast.error('Please fill all required fields');
      return;
    }

    const url = editingLead ? 'update-inquiry.php' : 'add-inquiry.php';

    try {
      const response = await fetch(getApiUrl(url), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        toast.success(editingLead ? 'Lead updated successfully' : 'Lead added successfully');
        onFormSubmissionSuccess();
      } else {
        toast.error(result.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error('Server error. Please try again later.');
    }
  };

  if (!show) return null;

  return (
    <div className="lead-modal-overlay">
      <div className="lead-modal-content">
        <button className="lead-modal-close" onClick={onClose}><FaTimes /></button>
        <h2>{editingLead ? 'Edit Lead' : 'Add Lead'}</h2>
        <form className="lead-modal-form" onSubmit={handleSubmit}>
          <label>Brand Name</label>
          <select name="brand_id" value={formData.brand_id} onChange={handleChange} required>
            <option value="">Select Brand</option>
            {brands.map(brand => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>

          <label>State</label>
          <select name="state_id" value={formData.state_id} onChange={handleChange} required>
            <option value="">Select State</option>
            {states.map(state => (
              <option key={state.id} value={state.id}>{state.name}</option>
            ))}
          </select>

          <label>City</label>
          <select name="city_id" value={formData.city_id} onChange={handleChange} required>
            <option value="">Select City</option>
            {cities.map(city => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>

          <label>Mobile</label>
          <input type="text" name="contact" value={formData.contact} onChange={handleChange} required />

          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />

          <label>Message</label>
          <textarea name="message" value={formData.message} onChange={handleChange}></textarea>

          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange} required>
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <button type="submit" className="lead-submit-btn">
            {editingLead ? 'Update Lead' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}
