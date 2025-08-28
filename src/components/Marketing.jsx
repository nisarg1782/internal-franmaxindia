import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { FaBullhorn, FaChartLine, FaHandshake, FaLightbulb, FaRocket, FaMagnifyingGlass } from 'react-icons/fa6';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { validateMarketingForm } from '../utils/validateMarketingForm';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { getApiUrl } from '../utils/api';

import './design/Marketing.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Marketing = () => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    state_id: '',
    city_id: '',
    brand_name: '',
    contact: '',
    services: []
  });

  const servicesList = [
    "Logo", "Social Media Posts", "IG Reels", "Hashtag Research",
    "Branding", "Page Optimization", "Brochure Designing", "Personal branding",
    "Linkedln management", "Google my business", "AD (duration 50 sec- 1 min)"
  ];

  const chartData = {
    labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'],
    datasets: [
      {
        label: 'Growth with Franmax Marketing',
        data: [1000, 1500, 2200, 3500, 5000, 7500],
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Typical Growth (No Marketing)',
        data: [1000, 1100, 1200, 1350, 1400, 1450],
        borderColor: '#ced4da',
        backgroundColor: 'rgba(206, 212, 218, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

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

  const handleServiceChange = e => {
    const { value, checked } = e.target;
    setForm(prev => ({
      ...prev,
      services: checked
        ? [...prev.services, value]
        : prev.services.filter(s => s !== value)
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errors = validateMarketingForm(form);
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return;
    }

    fetch(getApiUrl('submit-marketing-form.php'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          toast.success(data.message);
          setForm({
            name: '',
            email: '',
            state_id: '',
            city_id: '',
            brand_name: '',
            contact: '',
            services: []
          });
        } else if (data.errors) {
          data.errors.forEach(err => toast.error(err));
        } else {
          toast.error(data.message || 'Something went wrong.');
        }
      })
      .catch(() => toast.error("Server error. Please try again later."));
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={4000} />
      <div className="marketing-page">
        {/* NEW: Hero Section with background image */}
        <header className="marketing-hero-section">
          <div className="hero-content">
            <h1>Elevate Your Brand's Story</h1>
            <p>
              Marketing is the heartbeat of growth. It connects you to customers,
              builds your reputation, and fuels your business.
            </p>
            <a href="#marketing-form-section" className="cta-button">Get a Free Consultation</a>
          </div>
        </header>

        {/* Existing "Why Marketing is Crucial" section */}
        <section className="marketing-sections">
          {[{
            icon: <FaBullhorn />, title: 'Brand Awareness', text: 'Marketing ensures that people know your brand and recognize your value.'
          }, {
            icon: <FaChartLine />, title: 'Business Growth', text: 'It drives traffic, boosts leads, and ultimately increases your revenue.'
          }, {
            icon: <FaHandshake />, title: 'Customer Trust', text: 'Effective marketing builds long-term customer relationships and loyalty.'
          }].map(({ icon, title, text }) => (
            <div className="marketing-card" key={title}>
              {icon}
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </section>

        {/* NEW: Our Approach Section */}
        <section className="our-approach-section">
          <h2 className="section-title">Our Proven Marketing Approach</h2>
          <div className="approach-grid">
            <div className="approach-card">
              <FaLightbulb className="approach-icon" />
              <h3>Strategy & Planning</h3>
              <p>We work with you to define your goals and create a custom marketing roadmap.</p>
            </div>
            <div className="approach-card">
              <FaRocket className="approach-icon" />
              <h3>Execution & Launch</h3>
              <p>Our team brings your brand to life with engaging content and targeted campaigns.</p>
            </div>
            <div className="approach-card">
              <FaMagnifyingGlass className="approach-icon" />
              <h3>Analysis & Optimization</h3>
              <p>We analyze data to refine your strategy, ensuring continuous growth and success.</p>
            </div>
          </div>
        </section>

        {/* NEW: Chart Section */}
        <section className="growth-chart-section">
          <div className="chart-container">
            <div className="chart-text">
              <h2 className="section-title">See Your Potential Growth</h2>
              <p>
                A strategic marketing plan can significantly accelerate your business's growth. 
                Our data-driven approach ensures your investment delivers measurable results.
              </p>
            </div>
            <div className="chart-box">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </section>

        {/* Existing "Marketing Services" section */}
        <section className="marketing-services-info">
          <h2>Our Marketing Services</h2>
          <p>
            In today’s crowded market, visibility takes more than just a quality product – it requires smart, targeted marketing.
            Franmax India equips you with tools and strategies needed to connect with customers and expand your reach.
            From social media presence to engaging with audiences directly, we’ll help your brand make a memorable impact.
          </p>
          <h3>B2C Marketing Services</h3>
          <p>
            Through compelling campaigns, PR initiatives, and customer engagement strategies, we help you build and grow your customer base.
            Our team creates targeted marketing solutions that capture attention, build loyalty, and foster lasting connections with your audience.
          </p>
        </section>

        {/* Existing Form Section */}
        <section className="marketing-cta" id="marketing-form-section">
          <h2>Let's Elevate Your Brand</h2>
          <p>
            Fill out the form below and our team will help you craft a marketing strategy that gets real results.
          </p>
          <form className="marketing-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <input type="text" name="name" placeholder="Your Name" value={form.name} onChange={handleChange} />
              <input type="email" name="email" placeholder="Your Email" value={form.email} onChange={handleChange} />
            </div>
            <div className="form-row">
              <div className="select-wrapper">
                <Select
                  name="state_id"
                  value={states.find(opt => opt.value === form.state_id) || null}
                  onChange={opt => setForm(prev => ({ ...prev, state_id: opt ? opt.value : '', city_id: '' }))}
                  options={states}
                  placeholder="Select State"
                  isClearable
                  isSearchable
                  classNamePrefix="react-select"
                />
              </div>
              <div className="select-wrapper">
                <Select
                  name="city_id"
                  value={cities.find(opt => opt.value === form.city_id) || null}
                  onChange={opt => setForm(prev => ({ ...prev, city_id: opt ? opt.value : '' }))}
                  options={cities}
                  placeholder="Select City"
                  isClearable
                  isSearchable
                  isDisabled={!form.state_id}
                  classNamePrefix="react-select"
                />
              </div>
            </div>
            <div className="form-row">
              <input type="text" name="brand_name" placeholder="Brand Name" value={form.brand_name} onChange={handleChange} />
              <input type="text" name="contact" placeholder="Contact Number" value={form.contact} onChange={handleChange} />
            </div>
            <div className="checkbox-grid">
              {servicesList.map(service => (
                <label key={service} className="checkbox-item">
                  <input type="checkbox" value={service} checked={form.services.includes(service)} onChange={handleServiceChange} />
                  <span>{service}</span>
                </label>
              ))}
            </div>
            <button type="submit">Submit</button>
          </form>
        </section>
      </div>
    </>
  );
};

export default Marketing;