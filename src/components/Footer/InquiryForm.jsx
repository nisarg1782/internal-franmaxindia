import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import {
  FaUser, FaEnvelope, FaPhone, FaRegCommentDots
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getApiUrl } from '../../utils/api';

function InquiryForm() {
  const [formData, setFormData] = useState({
    inquiry_type: 'franchise',
    footer_name: '',
    footer_email: '',
    footer_contact: '',
    footer_state: '',
    footer_city: '',
    footer_message: ''
  });

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  useEffect(() => {
    setLoadingStates(true);
    fetch(getApiUrl('get-indian-states.php'))
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const formatted = data.map(s => ({ label: s.name, value: s.id }));
          setStates(formatted);
        }
      })
      .catch(err => {
        console.error('State fetch error:', err);
        toast.error('Failed to load states');
      })
      .finally(() => setLoadingStates(false));
  }, []);

  useEffect(() => {
    if (formData.footer_state) {
      setLoadingCities(true);
      fetch(getApiUrl(`get-cities.php?state_id=${formData.footer_state}`))
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const formatted = data.map(city => ({ label: city.name, value: city.id }));
            setCities(formatted);
          }
        })
        .catch(err => {
          console.error('City fetch error:', err);
          toast.error('Failed to load cities');
        })
        .finally(() => setLoadingCities(false));
    } else {
      setCities([]);
    }
  }, [formData.footer_state]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStateChange = selectedOption => {
    setFormData(prev => ({
      ...prev,
      footer_state: selectedOption?.value || '',
      footer_city: ''
    }));
  };

  const handleCityChange = selectedOption => {
    setFormData(prev => ({
      ...prev,
      footer_city: selectedOption?.value || ''
    }));
  };

  const validate = () => {
    const errors = [];

    if (!formData.footer_name.trim()) {
      errors.push('Name is required');
    } else if (!/^[a-zA-Z\s]+$/.test(formData.footer_name.trim())) {
      errors.push('Name must only contain letters and spaces');
    }

    if (!formData.footer_email || !/\S+@\S+\.\S+/.test(formData.footer_email)) {
      errors.push('Valid email is required');
    }

    if (!/^[6-9]\d{9}$/.test(formData.footer_contact)) {
      errors.push('Phone must start with 6/7/8/9 and be 10 digits');
    }

    if (!formData.footer_state) errors.push('State is required');
    if (!formData.footer_city) errors.push('City is required');

    return errors;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const validationErrors = validate();

    if (validationErrors.length > 0) {
      validationErrors.forEach(err => toast.error(err));
    } else {
      const payload = {
        inquiry_type: formData.inquiry_type,
        name: formData.footer_name.trim(),
        email: formData.footer_email.trim(),
        contact: formData.footer_contact.trim(),
        state_id: formData.footer_state,
        city_id: formData.footer_city,
        message: formData.footer_message.trim()
      };

      fetch(getApiUrl('submit-footer-inquiry.php'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(res => res.json())
        .then(data => {
          console.log("API Response:", data);
          if (data.success) {
            toast.success('✅ Inquiry submitted successfully!');
            setFormData({
              inquiry_type: 'franchise',
              footer_name: '',
              footer_email: '',
              footer_contact: '',
              footer_state: '',
              footer_city: '',
              footer_message: ''
            });
            setCities([]);
          } else {
            toast.error(data.error || '❌ Failed to submit inquiry');
          }
        })
        .catch(err => {
          console.error('Error submitting form:', err);
          toast.error('❌ Something went wrong!');
        });
    }
  };

  return (
    <div className="inquiry-form-container">
      <ToastContainer position="top-right" autoClose={2000} />
      <h4>Connect With Us</h4>

      <form className="inquiry-form" onSubmit={handleSubmit}>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="inquiry_type"
              value="franchise"
              checked={formData.inquiry_type === 'franchise'}
              onChange={handleInputChange}
            /> Franchise Inquiry
          </label>
          <label>
            <input
              type="radio"
              name="inquiry_type"
              value="expand"
              checked={formData.inquiry_type === 'expand'}
              onChange={handleInputChange}
            /> Expand Your Brand
          </label>
        </div>

        <div className="row">
          <div className="form-field">
            <FaUser className="form-icon" />
            <input
              type="text"
              name="footer_name"
              placeholder="Full Name *"
              value={formData.footer_name}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-field">
            <FaEnvelope className="form-icon" />
            <input
              type="email"
              name="footer_email"
              placeholder="Email *"
              value={formData.footer_email}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="row">
          <div className="form-field">
            <FaPhone className="form-icon" />
            <input
              type="tel"
              name="footer_contact"
              placeholder="Contact Number *"
              value={formData.footer_contact}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-field">
            <div className="custom-select-container">
              <Select
                options={states}
                value={states.find(s => s.value === formData.footer_state) || null}
                onChange={handleStateChange}
                placeholder={loadingStates ? 'Loading states...' : 'Select State *'}
                isSearchable
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="form-field">
            <div className="custom-select-container">
              <Select
                options={cities}
                value={cities.find(c => c.value === formData.footer_city) || null}
                onChange={handleCityChange}
                placeholder={loadingCities ? 'Loading cities...' : 'Select City *'}
                isSearchable
                isDisabled={!formData.footer_state}
              />
            </div>
          </div>

          <div className="form-field">
            <FaRegCommentDots className="form-icon" />
            <textarea
              name="footer_message"
              placeholder="Your Message"
              rows="3"
              value={formData.footer_message}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <button type="submit" className="submit-btn">Submit Request</button>
      </form>

      <style>{`
        .inquiry-form-container {
          max-width: 600px;
          margin: 20px auto;
          background: #ffffff;
          padding: 20px 25px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          font-family: 'Segoe UI', sans-serif;
        }

        h4 {
          text-align: center;
          margin-bottom: 20px;
          font-size: 20px;
          color: #222;
        }

        .radio-group {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-bottom: 20px;
        }

        .radio-group label {
          font-size: 14px;
          color: #555;
        }

        .row {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          margin-bottom: 15px;
        }

        .form-field {
          flex: 1;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .form-icon {
          position: absolute;
          top: 9px;
          left: 10px;
          color: #777;
          font-size: 14px;
          pointer-events: none;
        }

        .form-field input,
        .form-field textarea {
          padding: 8px 10px 8px 30px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
          width: 100%;
        }

        .form-field textarea {
          min-height: 60px;
          resize: vertical;
        }

        .submit-btn {
          width: 100%;
          padding: 10px;
          background: #060644;
          color: white;
          font-size: 15px;
          font-weight: bold;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .submit-btn:hover {
          background: #218838;
        }

        @media (max-width: 768px) {
          .row {
            flex-direction: column;
            gap: 10px;
          }

          .radio-group {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
      
    </div>
  );
}

export default InquiryForm;
