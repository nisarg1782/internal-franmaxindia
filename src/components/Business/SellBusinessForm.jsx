import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import {
  FaBuilding, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaMoneyBillWave, FaStore, FaGlobeAsia, FaImage
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './SellBusinessPage.css';
import { validateSellBusinessForm } from '../../utils/validateSellBusinessForm';
import { getApiUrl } from '../../utils/api';

const SellBusinessForm = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    name: '',
    email: '',
    contact: '',
    state: '',
    stateId: '',
    city: '',
    cityId: '',
    expectedAmount: '',
    sector: '',
    sectorId: '',
    address: '',
    description: '',
    image: null
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [sectors, setSectors] = useState([]);

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

  useEffect(() => {
    fetch(getApiUrl('get-master-category.php'))
      .then(res => res.json())
      .then(data => Array.isArray(data) && setSectors(data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selected, type) => {
    if (type === 'state') {
      setFormData(prev => ({
        ...prev,
        state: selected?.label || '',
        stateId: selected?.value || '',
        city: '',
        cityId: ''
      }));
    } else if (type === 'city') {
      setFormData(prev => ({
        ...prev,
        city: selected?.label || '',
        cityId: selected?.value || ''
      }));
    } else if (type === 'sector') {
      setFormData(prev => ({
        ...prev,
        sector: selected?.label || '',
        sectorId: selected?.value || ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validateSellBusinessForm(formData, toast);
    if (!isValid) return;

    const form = new FormData();
    for (const key in formData) {
      form.append(key, formData[key]);
    }

    fetch(getApiUrl('submit-sell-business.php'), {
      method: 'POST',
      body: form
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          toast.success("Business information submitted successfully!");
          setFormData({
            businessName: '', name: '', email: '', contact: '',
            state: '', stateId: '', city: '', cityId: '',
            expectedAmount: '', sector: '', sectorId: '',
            address: '', description: '', image: null
          });
          setImagePreview(null);
        } else {
          toast.error(data.message || "Submission failed. Please try again.");
        }
      })
      .catch(() => toast.error("Server error. Please try again later."));
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="sell-form-grid" encType="multipart/form-data">
        <div className="sell-form-group">
          <label><FaBuilding /> Business Name</label>
          <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} />
        </div>

        <div className="sell-form-group">
          <label><FaUser /> Owner Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </div>

        <div className="sell-form-group">
          <label><FaEnvelope /> Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>

        <div className="sell-form-group">
          <label><FaPhone /> Contact</label>
          <input type="text" name="contact" value={formData.contact} onChange={handleChange} />
        </div>

        <div className="sell-form-group">
          <label><FaGlobeAsia /> State</label>
          <Select
            options={states.map(s => ({ value: s.id, label: s.name }))}
            onChange={(selected) => handleSelectChange(selected, 'state')}
            value={formData.stateId ? { value: formData.stateId, label: formData.state } : null}
            placeholder="Select State"
            isClearable
          />
        </div>

        <div className="sell-form-group">
          <label><FaMapMarkerAlt /> City</label>
          <Select
            options={cities.map(c => ({ value: c.id, label: c.name }))}
            onChange={(selected) => handleSelectChange(selected, 'city')}
            value={formData.cityId ? { value: formData.cityId, label: formData.city } : null}
            placeholder="Select City"
            isClearable
          />
        </div>

        <div className="sell-form-group">
          <label><FaMoneyBillWave /> Expected Amount (₹)</label>
          <input type="text" name="expectedAmount" value={formData.expectedAmount} onChange={handleChange} />
        </div>

        <div className="sell-form-group">
          <label><FaStore /> Sector</label>
          <Select
            options={sectors.map(s => ({ value: s.mas_cat_id, label: s.mas_cat_name }))}
            onChange={(selected) => handleSelectChange(selected, 'sector')}
            value={formData.sectorId ? { value: formData.sectorId, label: formData.sector } : null}
            placeholder="Select Sector"
            isClearable
          />
        </div>

        <div className="sell-form-group">
          <label><FaMapMarkerAlt /> Full Address</label>
          <textarea name="address" value={formData.address} onChange={handleChange} />
        </div>

        <div className="sell-form-group">
          <label><FaMapMarkerAlt /> Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} />
        </div>

        <div className="sell-form-group">
          <label><FaImage /> Upload Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {imagePreview && <img src={imagePreview} alt="Preview" style={{ marginTop: 10, maxWidth: '100%', height: 'auto', borderRadius: '8px' }} />}
        </div>

        <button type="submit" className="sell-submit-button">Submit</button>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default SellBusinessForm;
