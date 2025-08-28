import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { toast } from 'react-toastify';
import {
  FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCity, FaCommentDots
} from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import { getApiUrl } from '../utils/api';
const EnquiryForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    message: '',
    state: null,
    city: null,
  });

  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    axios.get(getApiUrl('get-indian-states.php'))
      .then(res => {
        const options = res.data.map((state) => ({
          value: state.id,
          label: state.name
        }));
        setStates(options);
      })
      .catch(() => toast.error("Failed to load states"));
  }, []);

  useEffect(() => {
    if (formData.state) {
      axios.get(getApiUrl(`get-cities.php?state_id=${formData.state.value}`))
        .then(res => {
          const options = res.data.map((city) => ({
            value: city.id,
            label: city.name
          }));
          setCities(options);
        })
        .catch(() => toast.error("Failed to load cities"));
    } else {
      setCities([]);
    }
  }, [formData.state]);

  const validateForm = () => {
    const { fullName, phone, email, state, city } = formData;

    if (!fullName || !phone || !email || !state || !city) {
      toast.error('Please fill all required fields');
      return false;
    }

    // Full name: letters & spaces only
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(fullName)) {
      toast.error('Name must contain only letters and spaces');
      return false;
    }

    // Phone: start with 6/7/8/9 and exactly 10 digits
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      toast.error('Invalid phone number. It must start with 6, 7, 8, or 9 and be 10 digits long.');
      return false;
    }

    // Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Invalid email format');
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        full_name: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        message: formData.message,
        state_id: formData.state.value,
        city_id: formData.city.value,
      };

      const response = await axios.post(
        getApiUrl('enquiry-submit.php'),
        payload
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({
          fullName: '',
          phone: '',
          email: '',
          message: '',
          state: null,
          city: null,
        });
      } else {
        toast.error(response.data.message);
      }

    } catch (error) {
      toast.error('Server error occurred.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <h2>Insta Apply</h2>
      <form className="enquiry-form" onSubmit={handleSubmit}>
        <div className="input-icon">
          <FaUser />
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>

        <div className="input-icon">
          <FaPhone />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            maxLength={10}
          />
        </div>

        <div className="input-icon">
          <FaEnvelope />
          <input
            type="text"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="input-icon">
       
          <Select
            options={states}
            value={formData.state}
            onChange={(selected) => setFormData({ ...formData, state: selected, city: null })}
            placeholder="Select State"
            isSearchable
          />
        </div>

        <div className="input-icon">
      
          <Select
            options={cities}
            value={formData.city}
            onChange={(selected) => setFormData({ ...formData, city: selected })}
            placeholder="Select City"
            isSearchable
            isDisabled={!formData.state}
          />
        </div>

        <div className="input-icon">
          <FaCommentDots />
          <textarea
            name="message"
            placeholder="Your Message (Optional)"
            rows="3"
            value={formData.message}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default EnquiryForm;
