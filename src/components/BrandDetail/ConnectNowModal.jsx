import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import '../design/ConnectNowModal.css';
import {
  FaUser, FaPhone, FaEnvelope, FaMapMarkedAlt,
  FaCity, FaCommentDots, FaTimes
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import brandData from '../../data/brands';
import { validateConnectForm } from '../../utils/validateConnectNowForm';

import { getApiUrl } from '../../utils/api';

const ConnectNowModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    brand_connect_name: '',
    brand_connect_mobile: '',
    brand_connect_email: '',
    brand_connect_state: null,
    brand_connect_city: null,
    brand_connect_message: ''
  });

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [brandName, setBrandName] = useState('...');

  // Load brand name
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const brandId = parseInt(params.get('brand_id'));
    const match = brandData.find((b) => b.id === brandId);
    setBrandName(match ? match.name : 'Unknown Brand');
  }, []);

  // Load states
  useEffect(() => {
    fetch(getApiUrl('get-indian-states.php'))
      .then(res => res.json())
      .then(data => {
        const options = data.map(s => ({ label: s.name, value: s.id }));
        setStates(options);
      });
  }, []);

  // Load cities when state changes
  useEffect(() => {
    if (formData.brand_connect_state) {
      fetch(getApiUrl(`get-cities.php?state_id=${formData.brand_connect_state.value}`))
        .then(res => res.json())
        .then(data => {
          const options = data.map(c => ({ label: c.name, value: c.id }));
          setCities(options);
        });
    }
  }, [formData.brand_connect_state]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validateConnectForm(formData);
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach(msg => toast.error(msg));
    } else {
      toast.success("✅ Form submitted successfully!");
      onClose();
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="modal-backdrop">
        <div className="modal-content">
          <button className="close-btn" onClick={onClose}><FaTimes /></button>
          <h2>Connect with {brandName}</h2>

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="form-group">

                <input
                  type="text"
                  name="brand_connect_name"
                  placeholder="Full Name"
                  value={formData.brand_connect_name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">

                <input
                  type="text"
                  name="brand_connect_mobile"
                  placeholder="Phone Number"
                  value={formData.brand_connect_mobile}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row">
              <div className="form-group">
                <FaEnvelope />
                <input
                  type="email"
                  name="brand_connect_email"
                  placeholder="Email Address"
                  value={formData.brand_connect_email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <Select
                  placeholder="Select State"
                  options={states}
                  value={formData.brand_connect_state}
                  onChange={(selected) =>
                    setFormData({ ...formData, brand_connect_state: selected, brand_connect_city: null })
                  }
                />
              </div>
            </div>

            <div className="row">
              <div className="form-group">
                <Select
                  placeholder="Select City"
                  options={cities}
                  value={formData.brand_connect_city}
                  onChange={(selected) =>
                    setFormData({ ...formData, brand_connect_city: selected })
                  }
                  isDisabled={!formData.brand_connect_state}
                />
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <FaCommentDots />
                <textarea
                  name="brand_connect_message"
                  placeholder="Message"
                  value={formData.brand_connect_message}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

            <button type="submit" className="submit-btn">Submit</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ConnectNowModal;
