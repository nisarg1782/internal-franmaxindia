import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './design/EnquiryModal.css';
import { getApiUrl } from '../utils/api';

const EnquiryModal = ({ onClose, property_key }) => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [form, setForm] = useState({
    name: '',
    number: '',
    email: '',
    state_id: '',
    city_id: '',
    message: '',
    property_key: ''
  });

  // Ensure property_key is set when modal is opened
  useEffect(() => {
    if (property_key) {
      setForm(prev => ({ ...prev, property_key }));
    }
  }, [property_key]);

  // Load states
  useEffect(() => {
    fetch(getApiUrl('get-indian-states.php'))
      .then(res => res.json())
      .then(data => {
        const options = data.map(state => ({ value: state.id, label: state.name }));
        setStates(options);
      });
  }, []);

  // Load cities on state change
  useEffect(() => {
    if (form.state_id) {
      fetch(getApiUrl(`get-cities.php?state_id=${form.state_id}`))
        .then(res => res.json())
        .then(data => {
          const options = data.map(city => ({ value: city.id, label: city.name }));
          setCities(options);
        });
    } else {
      setCities([]);
    }
  }, [form.state_id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selectedOption, { name }) => {
    setForm(prev => ({ ...prev, [name]: selectedOption ? selectedOption.value : '' }));
  };

  const validateForm = () => {
    const { name, number, email, state_id, city_id } = form;
    const nameRegex = /^[a-zA-Z\s]+$/;
    const numberRegex = /^[6-9]\d{9}$/;

    if (!name.trim() || !nameRegex.test(name.trim())) {
      toast.error("Enter a valid name (letters only)");
      return false;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Enter a valid email");
      return false;
    }
    if (!numberRegex.test(number)) {
      toast.error("Phone must start with 6/7/8/9 and be 10 digits");
      return false;
    }
    if (!state_id) {
      toast.error("Select a state");
      return false;
    }
    if (!city_id) {
      toast.error("Select a city");
      return false;
    }
    return true;
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!validateForm()) return;

    fetch(getApiUrl('submit-leasing-enquiry.php'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          toast.success('Enquiry submitted ✅');
          setTimeout(() => onClose(), 2000);
        } else {
          toast.error(data.error || 'Submission failed ❌');
        }
      })
      .catch(err => {
        console.error('Submission error:', err);
        toast.error('Error submitting form');
      });
  };

  return (
    <div className="enquiry-modal-overlay">
      <div className="enquiry-modal">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>Send Enquiry</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="number"
            placeholder="Phone Number"
            value={form.number}
            onChange={handleChange}
            required
          />
          <Select
            name="state_id"
            placeholder="Select State"
            options={states}
            value={states.find(s => s.value === form.state_id) || null}
            onChange={handleSelectChange}
            className="react-select"
            classNamePrefix="select"
          />
          <Select
            name="city_id"
            placeholder="Select City"
            options={cities}
            value={cities.find(c => c.value === form.city_id) || null}
            onChange={handleSelectChange}
            className="react-select"
            classNamePrefix="select"
          />
          <textarea
            name="message"
            placeholder="Your message (optional)"
            value={form.message}
            onChange={handleChange}
          />
          <button type="submit" className="submit-btn">Submit</button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default EnquiryModal;
