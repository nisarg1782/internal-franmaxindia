// src/components/FranchiseDevelopment.jsx
import React, { useState, useEffect } from 'react';
import './design/FranchiseModule.css';
import Select from 'react-select';
import {
  SearchCheck, FileText, BarChart3, Megaphone, ClipboardList,
  Store, PenTool, Building2, Users, LayoutTemplate, Handshake, X
} from 'lucide-react';
import { getApiUrl } from '../utils/api';


const franchiseSteps = [
  { title: 'Feasibility & Market Study', desc: 'We begin by thoroughly analyzing market demand...', icon: <SearchCheck size={40} strokeWidth={1.8} /> },
  { title: 'Business Model Creation', desc: 'We craft a model that includes revenue streams...', icon: <FileText size={40} strokeWidth={1.8} /> },
  { title: 'Strategic Planning & Financial Consultation', desc: 'We align your vision with financial projections...', icon: <BarChart3 size={40} strokeWidth={1.8} /> },
  { title: 'Marketing & Market Positioning', desc: 'We design branding strategies to attract the right audience.', icon: <Megaphone size={40} strokeWidth={1.8} /> },
  { title: 'Operational Planning: SOPs & Staff Training', desc: 'We standardize operations and train staff.', icon: <ClipboardList size={40} strokeWidth={1.8} /> },
  { title: 'Outlet & Uniform Design', desc: 'From store layouts to uniforms, we build your identity.', icon: <Store size={40} strokeWidth={1.8} /> },
  { title: 'Branding & Logo Design', desc: 'We create your brand identity.', icon: <PenTool size={40} strokeWidth={1.8} /> },
  { title: 'Legal, Site & Vendor Selection', desc: 'We assist with franchise agreements and site selection.', icon: <Building2 size={40} strokeWidth={1.8} /> },
  { title: 'Franchisee/Investor Selection', desc: 'We identify compatible investors for your brand.', icon: <Users size={40} strokeWidth={1.8} /> },
  { title: 'Planning & Prototype Design', desc: 'We deliver replicable prototype outlet design.', icon: <LayoutTemplate size={40} strokeWidth={1.8} /> },
];

const salesSteps = [
  { title: 'Business Expansion Planning', desc: 'We create a detailed roadmap for new locations.', icon: <BarChart3 size={40} strokeWidth={1.8} /> },
  { title: 'Marketing and Lead Generation', desc: 'We run digital campaigns and trade shows.', icon: <Megaphone size={40} strokeWidth={1.8} /> },
  { title: 'Investor Registration and Franchise Selection Process', desc: 'We guide investors through onboarding.', icon: <Users size={40} strokeWidth={1.8} /> },
  { title: 'Business Comparison & Property Selection', desc: 'We help compare brands and pick locations.', icon: <Building2 size={40} strokeWidth={1.8} /> },
  { title: 'Personal Meetings & Site Approvals', desc: 'We help with in-person visits and approvals.', icon: <ClipboardList size={40} strokeWidth={1.8} /> },
  { title: 'Finalizing Agreements & Onboarding', desc: 'We assist with legal documentation and launch.', icon: <FileText size={40} strokeWidth={1.8} /> },
];

const FranchiseDevelopment = () => {
  const [activeTab, setActiveTab] = useState('Franchise Process');
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal(!showModal);

  const [formData, setFormData] = useState({
    name: '',
    number: '',
    email: '',
    state: null,
    city: null,
    brand: '',
    message: ''
  });

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    fetch(getApiUrl('get-indian-states.php'))
      .then(res => res.json())
      .then(data => {
        const options = data.map(state => ({ label: state.name, value: state.id }));
        setStates(options);
      });
  }, []);

  useEffect(() => {
    if (formData.state) {
      fetch(getApiUrl(`get-cities.php?state_id=${formData.state.value}`))
        .then(res => res.json())
        .then(data => {
          const options = data.map(city => ({ label: city.name, value: city.id }));
          setCities(options);
        });
    } else {
      setCities([]);
    }
  }, [formData.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      number: formData.number,
      email: formData.email,
      brand: formData.brand,
      message: formData.message,
      state_id: formData.state?.value || '',
      city_id: formData.city?.value || ''
    };

    try {
      const res = await fetch(getApiUrl('saveModalMakinginquiry.php'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (result.success) {
        alert('Inquiry submitted successfully!');
        toggleModal();
        setFormData({
          name: '',
          number: '',
          email: '',
          state: null,
          city: null,
          brand: '',
          message: ''
        });
      } else {
        alert(result.message || 'Submission failed');
      }
    } catch (error) {
      alert('Something went wrong. Try again later.');
    }
  };

  return (
    <div className="fd-wrapper">
      <h2 className="fd-heading">Franchise Consulting Service</h2>

      <div className="fd-tabs">
        {['Franchise Process', 'Franchise Sales Service'].map((tab) => (
          <button key={tab} className={`fd-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab}
          </button>
        ))}
      </div>

      <div className="fd-content">
        {activeTab === 'Franchise Process' && (
          <>
            <div className="fd-grid">
              {franchiseSteps.map((step, index) => (
                <div className="fd-card" key={index}>
                  <div className="fd-icon">{step.icon}</div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              ))}
            </div>
            <div className="fd-interest-btn-wrapper">
              <button className="fd-interest-btn" onClick={toggleModal}>
                <span className="btn-icon"><Handshake size={20} /></span>
                I’m Interested
              </button>
            </div>
          </>
        )}

        {activeTab === 'Franchise Sales Service' && (
          <div className="fd-grid">
            {salesSteps.map((step, index) => (
              <div className="fd-card" key={index}>
                <div className="fd-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fd-modal-overlay" onClick={toggleModal}>
          <div className="fd-modal" onClick={e => e.stopPropagation()}>
            <div className="fd-modal-header">
              <h3>Franchise Inquiry</h3>
              <button onClick={toggleModal} className="fd-close-btn"><X size={20} /></button>
            </div>
            <form className="fd-modal-form" onSubmit={handleSubmit}>
              <div className="fd-row">
                <input type="text" name="name" placeholder="Full Name" required value={formData.name} onChange={handleInputChange} />
                <input type="tel" name="number" placeholder="Phone Number" required value={formData.number} onChange={handleInputChange} />
              </div>
              <div className="fd-row">
                <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleInputChange} />
                <input type="text" name="brand" placeholder="Brand Name" required value={formData.brand} onChange={handleInputChange} />
              </div>
              <div className="fd-row">
                <Select
                  options={states}
                  placeholder="Select State"
                  value={formData.state}
                  onChange={(selected) => setFormData(prev => ({ ...prev, state: selected, city: null }))}
                />
                <Select
                  options={cities}
                  placeholder="Select City"
                  value={formData.city}
                  onChange={(selected) => setFormData(prev => ({ ...prev, city: selected }))}
                  isDisabled={!formData.state}
                />
              </div>
              <textarea name="message" placeholder="Message" rows="4" required value={formData.message} onChange={handleInputChange}></textarea>
              <button type="submit" className="fd-submit-btn">Submit Inquiry</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FranchiseDevelopment;
