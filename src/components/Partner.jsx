import React, { useState, useEffect } from 'react';
import './design/Partner.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import { validatePartnerForm } from '../utils/validatePartnerInquiryForm';
import { getApiUrl } from '../utils/api';

const Partner = () => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    contact: '',
    state_id: '',
    city_id: '',
    isFranchise: '', // New field for the franchise option
    message: ''
  });

  useEffect(() => {
    fetch(getApiUrl('get-indian-states.php'))
      .then(res => res.json())
      .then(data => {
        const options = data.map(state => ({ value: state.id, label: state.name }));
        setStates(options);
      });
  }, []);

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

  const handleSubmit = async e => {
    e.preventDefault();
    const errors = validatePartnerForm(form);
    if (errors.length) {
      errors.forEach(err => toast.error(err));
      return;
    }

    try {
      const res = await fetch(getApiUrl('submit-partner-form.php'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (data.status === 'success') {
        toast.success(data.message || "Submitted successfully.");
        setForm({
          name: '',
          email: '',
          contact: '',
          state_id: '',
          city_id: '',
          isFranchise: '', // Reset the new field
          message: ''
        });
      } else {
        toast.error(data.message || "Submission failed.");
      }
    } catch (err) {
      toast.error("Server error. Please try again later.");
    }
  };

  return (
    <div className="partner-wrapper">
      <ToastContainer position="top-right" autoClose={4000} />
      <section className="partner-hero">
        <h1>Partner with Us</h1>
        <p className="quote">“Alone we can do so little; together we can do so much.” – Helen Keller</p>
      </section>

      <section className="partner-benefits">
        <h2>Why Become Our Partner?</h2>
        <ul>
          <li>✔ Expand your reach and grow your business</li>
          <li>✔ Get access to premium tools and support</li>
          <li>✔ Work with a trusted brand and loyal community</li>
          <li>✔ Earn more through collaboration</li>
        </ul>
      </section>

      <section className="partner-form-section">
        <h2>Join Our Network</h2>
        <form className="partner-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <input type="text" name="name" placeholder="Your Name" value={form.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <input type="email" name="email" placeholder="Your Email" value={form.email} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <input type="text" name="contact" placeholder="Contact Number" value={form.contact} onChange={handleChange} />
            </div>
            <div className="form-group">
              <Select
                name="state_id"
                value={states.find(opt => opt.value === form.state_id) || null}
                onChange={opt => setForm(prev => ({ ...prev, state_id: opt ? opt.value : '' }))}
                options={states}
                placeholder="Select State"
                isClearable
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <Select
                name="city_id"
                value={cities.find(opt => opt.value === form.city_id) || null}
                onChange={opt => setForm(prev => ({ ...prev, city_id: opt ? opt.value : '' }))}
                options={cities}
                placeholder="Select City"
                isClearable
                isDisabled={!form.state_id}
              />
            </div>
            <div className="form-group">
            
              <select
              placeholder="interested in a Franmax India franchise"
                id="isFranchise"
                name="isFranchise"
                value={form.isFranchise}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Interested in a Franmax India franchise??</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group full-width">
              <textarea name="message" placeholder="Your Message" value={form.message} onChange={handleChange} />
            </div>
          </div>
          <button type="submit">Submit</button>
        </form>
      </section>
    </div>
  );
};

export default Partner;