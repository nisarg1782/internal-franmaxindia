// File: src/components/LeasePropertyForm.jsx
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import {
  FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCity,
  FaHome, FaMoneyBillWave, FaLayerGroup
} from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './LeasePropertyPage.css';
import { validateLeaseForm } from '../../utils/validateLeaseForm';
import { getApiUrl } from '../../utils/api';


const LeasePropertyForm = () => {
  const [formData, setFormData] = useState({
    ownerName: '',
    contact: '',
    email: '',
    stateId: '',
    cityId: '',
    address: '',
    message: '',
    expectedRent: '',
    sqft: '',
    propertyType: '',
    floorType: '',
    image: null,
    imagePreview: null
  });

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const sqftOptions = [
    '500 sq.ft', '1000 sq.ft', '1500 sq.ft', '2000 sq.ft', '2500+ sq.ft'
  ];

  useEffect(() => {
    fetch(getApiUrl('get-indian-states.php'))
      .then(res => res.json())
      .then(data => Array.isArray(data) && setStates(data));
  }, []);

  useEffect(() => {
    if (formData.stateId) {
      fetch(getApiUrl(`get-cities.php?state_id=${formData.stateId}`))
        .then(res => res.json())
        .then(data => Array.isArray(data) && setCities(data));
    } else {
      setCities([]);
    }
  }, [formData.stateId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (selected, type) => {
    if (type === 'state') {
      setFormData(prev => ({
        ...prev,
        stateId: selected?.value || '',
        cityId: ''
      }));
    } else if (type === 'city') {
      setFormData(prev => ({
        ...prev,
        cityId: selected?.value || ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file, imagePreview: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateLeaseForm(formData, toast)) return;

    const formPayload = new FormData();
    for (const key in formData) {
      if (key !== 'imagePreview' && formData[key]) {
        formPayload.append(key, formData[key]);
      }
    }

    try {
      const response = await fetch(getApiUrl('submit-lease-property.php'), {
        method: 'POST',
        body: formPayload
      });

      const result = await response.json();
      if (result.status === 'success') {
        toast.success(result.message);
        setFormData({
          ownerName: '', contact: '', email: '', stateId: '', cityId: '', address: '', message: '', expectedRent: '', sqft: '', propertyType: '', floorType: '', image: null, imagePreview: null
        });
      } else if (result.status === 'exists') {
        toast.warning(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Submission failed.');
      console.error('Error:', error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="lease-form-grid">
        <div className="lease-form-group">
          <label><FaUser /> Owner Name</label>
          <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} />
        </div>

        <div className="lease-form-group">
          <label><FaPhone /> Contact</label>
          <input type="text" name="contact" value={formData.contact} onChange={handleChange} />
        </div>

        <div className="lease-form-group">
          <label><FaEnvelope /> Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>

        <div className="lease-form-group">
          <label><FaMapMarkerAlt /> State</label>
          <Select
            options={states.map(s => ({ value: s.id, label: s.name }))}
            onChange={(selected) => handleSelectChange(selected, 'state')}
            value={states.find(s => s.id === formData.stateId) ? { value: formData.stateId, label: states.find(s => s.id === formData.stateId).name } : null}
            placeholder="Select State"
            isClearable
          />
        </div>

        <div className="lease-form-group">
          <label><FaCity /> City</label>
          <Select
            options={cities.map(c => ({ value: c.id, label: c.name }))}
            onChange={(selected) => handleSelectChange(selected, 'city')}
            value={cities.find(c => c.id === formData.cityId) ? { value: formData.cityId, label: cities.find(c => c.id === formData.cityId).name } : null}
            placeholder="Select City"
            isClearable
            isDisabled={!formData.stateId}
          />
        </div>

        <div className="lease-form-group">
          <label><FaMapMarkerAlt /> Full Address</label>
          <textarea name="address" value={formData.address} onChange={handleChange} />
        </div>

        <div className="lease-form-group">
          <label><FaMoneyBillWave /> Expected Rent (₹)</label>
          <input type="number" name="expectedRent" value={formData.expectedRent} onChange={handleChange} />
        </div>

        <div className="lease-form-group">
          <label><FaLayerGroup /> Property Area</label>
          <select name="sqft" value={formData.sqft} onChange={handleChange}>
            <option value="">Select Area</option>
            {sqftOptions.map((size, i) => <option key={i}>{size}</option>)}
          </select>
        </div>

        <div className="lease-form-group">
          <label><FaHome /> Property Type</label>
          <div>
            <label><input type="radio" name="propertyType" value="Warehouse" checked={formData.propertyType === 'Warehouse'} onChange={handleChange} /> Warehouse</label><br />
            <label><input type="radio" name="propertyType" value="Showroom" checked={formData.propertyType === 'Showroom'} onChange={handleChange} /> Showroom</label><br />
            <label><input type="radio" name="propertyType" value="Multi Purpose" checked={formData.propertyType === 'Multi Purpose'} onChange={handleChange} /> Multi Purpose</label>
          </div>
        </div>

        <div className="lease-form-group">
          <label><FaLayerGroup /> Property Floor</label>
          <div>
            <label><input type="radio" name="floorType" value="Ground Floor" checked={formData.floorType === 'Ground Floor'} onChange={handleChange} /> Ground Floor</label><br />
            <label><input type="radio" name="floorType" value="Upper Floor" checked={formData.floorType === 'Upper Floor'} onChange={handleChange} /> Upper Floor</label>
          </div>
        </div>

        <div className="lease-form-group lease-form-full">
          <label><FaEnvelope /> Message</label>
          <textarea name="message" value={formData.message} onChange={handleChange} />
        </div>

        <div className="lease-form-group lease-form-full">
          <label>Upload Property Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {formData.imagePreview && (
            <div className="image-preview">
              <img src={formData.imagePreview} alt="Preview" />
            </div>
          )}
        </div>

        <button type="submit" className="lease-submit-button">Submit</button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default LeasePropertyForm;
